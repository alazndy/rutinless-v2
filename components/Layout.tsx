import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Compass, Layers, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { state } = useApp();

  const getThemeColor = () => {
    switch (state.settings.themeColor) {
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      case 'pink': return 'text-pink-500';
      default: return 'text-orange-500';
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Ana Sayfa' },
    { path: '/discover', icon: Compass, label: 'Keşfet' },
    { path: '/swipe', icon: Layers, label: 'Kaydır' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className={`h-screen flex flex-col overflow-hidden text-gray-800 dark:text-gray-100`}>
      {/* Mesh Background is fixed in body, this container holds content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative z-10">
        {children}
      </main>

      {/* Floating Island Navigation */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <nav className="pointer-events-auto glass-panel rounded-2xl px-6 py-3 shadow-2xl flex items-center space-x-6 sm:space-x-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className="relative flex flex-col items-center group">
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className={`absolute -top-1 w-1 h-1 rounded-full ${getThemeColor().replace('text-', 'bg-')}`}
                  />
                )}
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${isActive ? getThemeColor() : 'text-gray-400 dark:text-gray-500'}`}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
              </Link>
            );
          })}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />
          <Link to="/settings" className="relative flex flex-col items-center">
             <Settings size={20} className={`${location.pathname === '/settings' ? getThemeColor() : 'text-gray-400'}`} />
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
