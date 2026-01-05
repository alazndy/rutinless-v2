import React from 'react';
import { useApp } from '../AppContext';
import { MOCK_PLACES } from '../constants';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, History, Star } from 'lucide-react';
import { Category } from '../types';

const ProfilePage: React.FC = () => {
  const { state, getPlaceById } = useApp();
  const { userStats, visited, favorites } = state;

  // Prepare Data for Chart
  const categoryCounts: Record<string, number> = {};
  visited.forEach(id => {
    const p = getPlaceById(id);
    if (p) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }
  });

  const chartData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    visits: categoryCounts[cat]
  }));

  // If empty, add dummy data for visual check
  if (chartData.length === 0) {
      Object.values(Category).slice(0, 3).forEach(cat => {
          chartData.push({ name: cat, visits: 0 });
      });
  }

  const COLORS = ['#F97316', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'];

  return (
    <div className="p-6 pb-24 max-w-lg mx-auto space-y-8">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full border-4 border-orange-500 p-1 mb-4">
            <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userStats.characterTitle}`} 
                alt="Avatar"
                className="w-full h-full bg-gray-100 rounded-full"
            />
        </div>
        <h1 className="text-2xl font-bold">{userStats.characterTitle}</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1 px-4 italic">
          "{userStats.characterQuote}"
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
           <Trophy className="text-yellow-500 mb-2" size={24} />
           <span className="text-2xl font-bold">{userStats.totalVisits}</span>
           <span className="text-xs text-gray-500">Ziyaret</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
           <Star className="text-red-500 mb-2" size={24} />
           <span className="text-2xl font-bold">{favorites.length}</span>
           <span className="text-xs text-gray-500">Favori</span>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-panel p-4 rounded-2xl">
        <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-500">Ziyaret Analizi</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={10} tick={{fill: '#888'}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                cursor={{fill: 'transparent'}}
              />
              <Bar dataKey="visits" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent History */}
      <div className="space-y-4">
        <h3 className="font-bold flex items-center gap-2"><History size={18} /> Son Ziyaretler</h3>
        {visited.slice(-5).reverse().map(id => {
            const place = getPlaceById(id);
            if (!place) return null;
            return (
                <div key={id} className="flex items-center gap-4 glass-panel p-3 rounded-xl">
                    <img src={place.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                    <div>
                        <h4 className="font-bold text-sm">{place.name}</h4>
                        <span className="text-xs text-orange-500">{place.category}</span>
                    </div>
                </div>
            )
        })}
        {visited.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-4">Henüz bir yeri ziyaret etmedin.</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
