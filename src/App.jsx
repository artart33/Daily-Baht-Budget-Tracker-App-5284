import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import BudgetTracker from './components/BudgetTracker';
import ExpenseHistory from './components/ExpenseHistory';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import { initializeStorage, loadDarkMode, saveDarkMode } from './utils/storageUtils';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing app...');
      
      // Initialize storage system
      const storageInfo = initializeStorage();
      
      // Load dark mode preference
      const savedDarkMode = loadDarkMode();
      setDarkMode(savedDarkMode);
      
      console.log('App initialized successfully:', {
        darkMode: savedDarkMode,
        storageInfo
      });
      
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsInitialized(true);
    }
  };

  const handleDarkModeChange = (newDarkMode) => {
    setDarkMode(newDarkMode);
    saveDarkMode(newDarkMode);
    console.log('Dark mode changed:', newDarkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (!isInitialized) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 to-red-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Loading Daily Baht Tracker...
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Initializing your expense data
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 to-red-50'
      }`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto min-h-screen flex flex-col"
        >
          <Routes>
            <Route path="/" element={<BudgetTracker darkMode={darkMode} />} />
            <Route path="/history" element={<ExpenseHistory darkMode={darkMode} />} />
            <Route 
              path="/settings" 
              element={
                <Settings 
                  darkMode={darkMode} 
                  setDarkMode={handleDarkModeChange} 
                />
              } 
            />
          </Routes>
          <Navigation darkMode={darkMode} />
        </motion.div>
      </div>
    </Router>
  );
}

export default App;