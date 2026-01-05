import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Moon, Sun, Palette, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { state, updateSettings } = useApp();

  const colors = [
    { name: 'orange', class: 'bg-orange-500' },
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'green', class: 'bg-green-500' },
    { name: 'pink', class: 'bg-pink-500' },
  ];

  return (
    <div className="p-6 pb-24 max-w-lg mx-auto space-y-8">
      <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full glass-panel"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Ayarlar</h1>
      </div>

      {/* Theme */}
      <section className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="flex items-center gap-2 font-bold text-lg text-gray-700 dark:text-gray-200">
            <Palette size={20} /> Görünüm
        </h2>
        
        <div className="flex items-center justify-between">
            <span>Karanlık Mod</span>
            <button 
                onClick={() => updateSettings({ darkMode: !state.settings.darkMode })}
                className={`p-2 rounded-xl transition-colors ${state.settings.darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
            >
                {state.settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
        </div>

        <div>
            <span className="block mb-3 text-sm">Tema Rengi</span>
            <div className="flex gap-4">
                {colors.map(c => (
                    <button
                        key={c.name}
                        onClick={() => updateSettings({ themeColor: c.name as any })}
                        className={`w-10 h-10 rounded-full ${c.class} ring-2 ring-offset-2 ring-offset-transparent ${state.settings.themeColor === c.name ? 'ring-gray-400 scale-110' : 'ring-transparent'}`}
                    />
                ))}
            </div>
        </div>
      </section>

      <section className="text-center text-xs text-gray-400 pt-8">
        <p>Rutin Kırıcı v1.0.0</p>
        <p>Break your habits, explore the city.</p>
      </section>
    </div>
  );
};

export default SettingsPage;