import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiClock, FiSettings } = FiIcons;

const Navigation = ({ darkMode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Budget' },
    { path: '/history', icon: FiClock, label: 'History' },
    { path: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-t backdrop-blur-lg`}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors relative ${
                isActive
                  ? darkMode
                    ? 'text-orange-400'
                    : 'text-orange-600'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-orange-50'
                  }`}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <SafeIcon icon={item.icon} className="text-xl mb-1 relative z-10" />
              <span className="text-xs font-medium relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default Navigation;