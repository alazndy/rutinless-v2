import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../AppContext';
import { MapPin, Zap, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { state } = useApp();
  const { userStats } = state;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const getGradient = () => {
    switch(state.settings.themeColor) {
      case 'blue': return 'from-blue-500 to-indigo-600';
      case 'green': return 'from-green-500 to-teal-600';
      case 'pink': return 'from-pink-500 to-rose-600';
      default: return 'from-orange-500 to-red-600';
    }
  };

  return (
    <motion.div 
      className="p-6 pt-12 space-y-8 max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-500 dark:text-gray-400 font-medium">Hoş geldin,</h2>
          <h1 className="text-3xl font-bold tracking-tight">Gezgin</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center overflow-hidden">
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userStats.characterTitle}`} alt="avatar" />
        </div>
      </motion.div>

      {/* Hero Widget */}
      <motion.div 
        variants={itemVariants}
        className={`relative p-6 rounded-3xl text-white shadow-xl bg-gradient-to-br ${getGradient()} overflow-hidden`}
      >
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Zap size={120} />
        </div>
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80 border border-white/30 rounded-full px-2 py-1">
            Mevcut Ruh Hali
          </span>
          <h2 className="text-3xl font-bold mt-2 mb-1">{userStats.characterTitle}</h2>
          <p className="text-white/90 text-sm italic">"{userStats.characterQuote}"</p>
          
          <div className="mt-6 flex items-center space-x-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{userStats.totalVisits}</span>
              <span className="text-xs opacity-70">Ziyaret</span>
            </div>
            <div className="w-px h-8 bg-white/30"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{state.favorites.length}</span>
              <span className="text-xs opacity-70">Favori</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <Link to="/swipe" className="group">
          <div className="glass-panel p-5 rounded-2xl h-full flex flex-col items-start justify-between transition-transform group-active:scale-95">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white mb-3`}>
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Hızlı Seçim</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tinder tarzı keşif</p>
            </div>
          </div>
        </Link>
        <Link to="/discover" className="group">
          <div className="glass-panel p-5 rounded-2xl h-full flex flex-col items-start justify-between transition-transform group-active:scale-95">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white mb-3`}>
              <Compass size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Akıllı Ara</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI ile mekan bul</p>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Recent Activity/Map Teaser */}
      <motion.div variants={itemVariants}>
         <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl">Yakınındaki Popülerler</h3>
            <Link to="/discover" className="text-xs font-medium opacity-60 flex items-center hover:opacity-100">
               Tümünü gör <ArrowRight size={14} className="ml-1" />
            </Link>
         </div>
         <div className="glass-panel p-4 rounded-2xl flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
               <img src="https://picsum.photos/200/200?random=map" className="w-full h-full object-cover" alt="Map" />
               <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <MapPin size={20} className="text-white" />
               </div>
            </div>
            <div>
               <h4 className="font-bold">Keşfedilecek 10+ Yer</h4>
               <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">Konum servisleri ile etrafındaki en iyi mekanları listeledik.</p>
            </div>
         </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
