import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { MOCK_PLACES } from '../constants';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Heart, MapPin, DollarSign, Info } from 'lucide-react';

const SwipePage: React.FC = () => {
  const { toggleFavorite, markVisited } = useApp();
  // Filter out places already visited or favorited to keep deck fresh? 
  // For demo, let's just show all randomized.
  const [cards, setCards] = useState([...MOCK_PLACES].sort(() => Math.random() - 0.5));
  
  const removeCard = (id: string) => {
    setCards((current) => current.filter((card) => card.id !== id));
  };

  const handleSwipe = (direction: 'left' | 'right', id: string) => {
    if (direction === 'right') {
      toggleFavorite(id);
      markVisited(id); // Assume interest counts as interaction/potential visit for logic simplicity
    }
    removeCard(id);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-8 text-center z-10">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Rutin Kırıcı</h1>
        <p className="text-sm text-gray-500">Sağa kaydır, keşfet!</p>
      </div>

      <div className="relative w-full max-w-sm aspect-[3/4] mt-8">
        <AnimatePresence>
          {cards.map((place, index) => {
            // Only render top 2 cards for performance
            if (index > cards.length - 2) {
               return (
                 <Card 
                   key={place.id} 
                   place={place} 
                   isFront={index === cards.length - 1} 
                   onSwipe={handleSwipe} 
                 />
               );
            }
            return null;
          })}
        </AnimatePresence>
        
        {cards.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 glass-panel rounded-3xl">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold">Hepsi Bu Kadar!</h3>
            <p className="text-gray-500 mt-2">Şimdilik tüm mekanları inceledin. Daha sonra tekrar gel.</p>
            <button 
              onClick={() => setCards([...MOCK_PLACES].sort(() => Math.random() - 0.5))}
              className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-full font-bold shadow-lg active:scale-95 transition-transform"
            >
              Yeniden Başla
            </button>
          </div>
        )}
      </div>
      
      {/* Bottom controls */}
      {cards.length > 0 && (
        <div className="flex gap-8 mt-8">
            <button 
                onClick={() => handleSwipe('left', cards[cards.length - 1].id)}
                className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
            >
                <X size={32} />
            </button>
            <button 
                onClick={() => handleSwipe('right', cards[cards.length - 1].id)}
                className="w-16 h-16 rounded-full bg-orange-500 shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
            >
                <Heart size={32} fill="currentColor" />
            </button>
        </div>
      )}
    </div>
  );
};

interface CardProps {
  place: any;
  isFront: boolean;
  onSwipe: (dir: 'left' | 'right', id: string) => void;
}

const Card: React.FC<CardProps> = ({ place, isFront, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Color overlays
  const likeOpacity = useTransform(x, [20, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right', place.id);
    } else if (info.offset.x < -100) {
      onSwipe('left', place.id);
    }
  };

  return (
    <motion.div
      style={{ 
        x: isFront ? x : 0, 
        rotate: isFront ? rotate : 0, 
        opacity: isFront ? opacity : 1,
        scale: isFront ? 1 : 0.95,
        zIndex: isFront ? 10 : 0
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={!isFront ? { scale: 0.95, y: 10 } : { scale: 1, y: 0 }}
      className="absolute inset-0 w-full h-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 select-none cursor-grab active:cursor-grabbing"
    >
        {/* Overlay indicators */}
        {isFront && (
            <>
                <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 z-20 border-4 border-green-500 rounded-lg p-2 transform -rotate-12">
                    <span className="text-4xl font-bold text-green-500 uppercase">EVET</span>
                </motion.div>
                <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 z-20 border-4 border-red-500 rounded-lg p-2 transform rotate-12">
                    <span className="text-4xl font-bold text-red-500 uppercase">HAYIR</span>
                </motion.div>
            </>
        )}

        <img src={place.imageUrl} alt={place.name} className="w-full h-3/5 object-cover pointer-events-none" />
        
        <div className="h-2/5 p-6 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-gray-900/50 dark:to-gray-900 flex flex-col justify-end absolute bottom-0 w-full backdrop-blur-sm">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{place.name}</h2>
                    <span className="text-orange-600 font-semibold text-sm">{place.category}</span>
                </div>
                <div className="flex items-center bg-yellow-400 text-black px-2 py-1 rounded-lg font-bold">
                    {place.rating}
                </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                {place.description}
            </p>

            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
                <div className="flex items-center gap-1">
                    <MapPin size={14} /> 2.5 km
                </div>
                <div className="flex items-center gap-1">
                    <DollarSign size={14} /> 
                    {Array(place.priceLevel).fill('$').join('')}
                </div>
                <div className="flex gap-1">
                    {place.tags.slice(0, 2).map((t: string) => (
                        <span key={t} className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
  );
};

export default SwipePage;
