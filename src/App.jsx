import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import BudgetTracker from './components/BudgetTracker';
import ExpenseHistory from './components/ExpenseHistory';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
            <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
          </Routes>
          <Navigation darkMode={darkMode} />
        </motion.div>
      </div>
    </Router>
  );
}

export default App;