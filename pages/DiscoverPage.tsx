import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Place } from '../types';
import { MOCK_PLACES } from '../constants';
import { Search, Map as MapIcon, Grid, List, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSmartRecommendations } from '../services/geminiService';
import { Link } from 'react-router-dom';

const DiscoverPage: React.FC = () => {
  const { state, toggleFavorite } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(MOCK_PLACES);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Basic category filter
  const categories = ['All', ...Array.from(new Set(MOCK_PLACES.map(p => p.category)))];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredPlaces(MOCK_PLACES);
      return;
    }

    // Check if it looks like a semantic query or simple search
    if (searchQuery.split(' ').length > 2) {
      // AI Search
      setIsAiSearching(true);
      try {
        const ids = await getSmartRecommendations(searchQuery);
        const results = MOCK_PLACES.filter(p => ids.includes(p.id));
        setFilteredPlaces(results.length > 0 ? results : []);
      } catch (err) {
        console.error(err);
        // Fallback to text search
        filterLocally(searchQuery);
      } finally {
        setIsAiSearching(false);
      }
    } else {
      // Local text search
      filterLocally(searchQuery);
    }
  };

  const filterLocally = (query: string) => {
    const lower = query.toLowerCase();
    const res = MOCK_PLACES.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      p.tags.some(t => t.toLowerCase().includes(lower)) ||
      p.category.toLowerCase().includes(lower)
    );
    setFilteredPlaces(res);
  };

  const handleCategoryFilter = (cat: string) => {
    setActiveFilter(cat);
    if (cat === 'All') {
      setFilteredPlaces(MOCK_PLACES);
    } else {
      setFilteredPlaces(MOCK_PLACES.filter(p => p.category === cat));
    }
  };

  return (
    <div className="p-6 pb-24 max-w-lg mx-auto min-h-full">
      <div className="mb-6 space-y-4">
        <h1 className="text-3xl font-bold">Keşfet</h1>
        
        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="AI'a sor: 'Sessiz çalışmalık kahveci'..."
            className="w-full glass-panel pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400 dark:text-white placeholder-gray-500"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
             {isAiSearching ? <Sparkles className="animate-spin text-orange-500" size={20} /> : <Search size={20} />}
          </div>
        </form>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === cat 
                  ? 'bg-gray-800 text-white dark:bg-white dark:text-black' 
                  : 'glass-panel text-gray-600 dark:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{filteredPlaces.length} Mekan Bulundu</span>
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
        <AnimatePresence>
          {filteredPlaces.map((place) => (
            <motion.div
              key={place.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`glass-panel rounded-2xl overflow-hidden group relative ${viewMode === 'grid' ? 'flex flex-col' : 'flex gap-4'}`}
            >
               {/* Image */}
               <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-32 w-full' : 'w-24 h-24 flex-shrink-0'}`}>
                 <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                 <div className="absolute top-2 right-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(place.id); }}
                      className={`p-1.5 rounded-full backdrop-blur-md ${state.favorites.includes(place.id) ? 'bg-red-500 text-white' : 'bg-black/30 text-white'}`}
                    >
                      <Sparkles size={12} fill={state.favorites.includes(place.id) ? "currentColor" : "none"} />
                    </button>
                 </div>
               </div>

               {/* Content */}
               <div className="p-3 flex-1 flex flex-col justify-center">
                 <div className="flex justify-between items-start">
                   <div>
                     <span className="text-[10px] uppercase font-bold text-orange-500 tracking-wider">{place.category}</span>
                     <h3 className="font-bold text-gray-800 dark:text-white leading-tight">{place.name}</h3>
                   </div>
                   {viewMode === 'list' && (
                      <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold dark:bg-green-900/30 dark:text-green-400">
                        {place.rating}
                      </div>
                   )}
                 </div>
                 
                 {viewMode === 'list' && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1 dark:text-gray-400">{place.description}</p>
                 )}
                 
                 <div className="mt-2 flex gap-1 flex-wrap">
                   {place.tags.slice(0, 2).map(tag => (
                     <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                       {tag}
                     </span>
                   ))}
                 </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredPlaces.length === 0 && (
           <div className="text-center py-12 text-gray-400">
              <p>Mekan bulunamadı.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;