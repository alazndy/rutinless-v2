export interface Location {
  lat: number;
  lng: number;
}

export enum Category {
  CAFE = 'Kafe',
  MUSEUM = 'Müze',
  PARK = 'Park',
  RESTAURANT = 'Restoran',
  ACTIVITY = 'Aktivite',
  NIGHTLIFE = 'Gece Hayatı'
}

export interface Place {
  id: string;
  name: string;
  category: Category;
  description: string;
  location: Location;
  rating: number;
  tags: string[];
  imageUrl: string;
  priceLevel: 1 | 2 | 3 | 4; // $ to $$$$
}

export interface UserStats {
  totalVisits: number;
  favoriteCategory: Category | null;
  characterTitle: string;
  characterQuote: string;
}

export interface UserSettings {
  darkMode: boolean;
  themeColor: 'blue' | 'orange' | 'green' | 'pink';
}

export interface AppState {
  userStats: UserStats;
  settings: UserSettings;
  favorites: string[]; // Place IDs
  visited: string[]; // Place IDs
}