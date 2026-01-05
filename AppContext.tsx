import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, UserSettings, UserStats, Place } from './types';
import { INITIAL_USER_STATS, MOCK_PLACES } from './constants';
import { getCharacterTag } from './services/geminiService';

interface AppContextType {
  state: AppState;
  updateSettings: (settings: Partial<UserSettings>) => void;
  toggleFavorite: (placeId: string) => void;
  markVisited: (placeId: string) => void;
  refreshCharacter: () => Promise<void>;
  getPlaceById: (id: string) => Place | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial State helper
const getInitialState = (): AppState => {
  const saved = localStorage.getItem('rutinKiriciState');
  if (saved) {
    const parsed = JSON.parse(saved);
    // Cleanup old api key if exists
    if (parsed.settings?.apiKey) {
      delete parsed.settings.apiKey;
    }
    return parsed;
  }
  return {
    userStats: INITIAL_USER_STATS,
    settings: {
      darkMode: false,
      themeColor: 'orange'
    },
    favorites: [],
    visited: []
  };
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(getInitialState);

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('rutinKiriciState', JSON.stringify(state));
    // Apply Dark Mode
    if (state.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const updateSettings = (settings: Partial<UserSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  };

  const toggleFavorite = (placeId: string) => {
    setState(prev => {
      const isFav = prev.favorites.includes(placeId);
      return {
        ...prev,
        favorites: isFav 
          ? prev.favorites.filter(id => id !== placeId)
          : [...prev.favorites, placeId]
      };
    });
  };

  const markVisited = (placeId: string) => {
    setState(prev => {
      if (prev.visited.includes(placeId)) return prev;
      const newVisited = [...prev.visited, placeId];
      return {
        ...prev,
        visited: newVisited,
        userStats: {
          ...prev.userStats,
          totalVisits: newVisited.length
        }
      };
    });
    // Trigger AI char update in background
    setTimeout(() => refreshCharacter(), 500);
  };

  const refreshCharacter = async () => {
    if (state.visited.length === 0) return;
    try {
      const newTraits = await getCharacterTag(state.visited);
      if (newTraits.characterTitle) {
        setState(prev => ({
          ...prev,
          userStats: {
            ...prev.userStats,
            ...newTraits
          }
        }));
      }
    } catch (e) {
      console.error("Failed to refresh character", e);
    }
  };

  const getPlaceById = (id: string) => MOCK_PLACES.find(p => p.id === id);

  return (
    <AppContext.Provider value={{ 
      state, 
      updateSettings, 
      toggleFavorite, 
      markVisited,
      refreshCharacter,
      getPlaceById
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};