import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSettings, FiMoon, FiSun, FiDollarSign, FiGlobe, FiInfo } = FiIcons;

const Settings = ({ darkMode, setDarkMode }) => {
  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(0.029);
  const [defaultBudget, setDefaultBudget] = useState(1000);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedCurrency = localStorage.getItem('homeCurrency');
    const savedRate = localStorage.getItem('exchangeRate');
    const savedBudget = localStorage.getItem('defaultBudget');
    
    if (savedCurrency) setHomeCurrency(savedCurrency);
    if (savedRate) setExchangeRate(parseFloat(savedRate));
    if (savedBudget) setDefaultBudget(parseFloat(savedBudget));
  };

  const saveSettings = () => {
    localStorage.setItem('homeCurrency', homeCurrency);
    localStorage.setItem('exchangeRate', exchangeRate.toString());
    localStorage.setItem('defaultBudget', defaultBudget.toString());
    alert('Settings saved successfully!');
  };

  const exchangeRateHints = {
    USD: 0.029,
    EUR: 0.026,
    GBP: 0.022,
    JPY: 4.2,
    AUD: 0.044,
    CAD: 0.039
  };

  return (
    <div className="flex-1 p-4 pb-20">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Settings
        </h1>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Customize your budget tracker
        </p>
      </motion.div>

      {/* Theme Settings */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-6 mb-6 shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <SafeIcon icon={darkMode ? FiMoon : FiSun} className={`text-2xl ${darkMode ? 'text-blue-400' : 'text-yellow-500'}`} />
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Appearance
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Dark Mode
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Switch between light and dark themes
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              darkMode ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <motion.div
              animate={{ x: darkMode ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
            />
          </button>
        </div>
      </motion.div>

      {/* Currency Settings */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl p-6 mb-6 shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <SafeIcon icon={FiGlobe} className={`text-2xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Currency Settings
          </h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Home Currency
            </label>
            <select
              value={homeCurrency}
              onChange={(e) => {
                setHomeCurrency(e.target.value);
                setExchangeRate(exchangeRateHints[e.target.value] || 0.029);
              }}
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="USD">🇺🇸 US Dollar (USD)</option>
              <option value="EUR">🇪🇺 Euro (EUR)</option>
              <option value="GBP">🇬🇧 British Pound (GBP)</option>
              <option value="JPY">🇯🇵 Japanese Yen (JPY)</option>
              <option value="AUD">🇦🇺 Australian Dollar (AUD)</option>
              <option value="CAD">🇨🇦 Canadian Dollar (CAD)</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Exchange Rate (1 THB = ? {homeCurrency})
            </label>
            <input
              type="number"
              step="0.001"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(parseFloat(e.target.value))}
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Suggested rate: {exchangeRateHints[homeCurrency] || 'N/A'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Budget Settings */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl p-6 mb-6 shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <SafeIcon icon={FiDollarSign} className={`text-2xl ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Budget Settings
          </h2>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Default Daily Budget (THB)
          </label>
          <input
            type="number"
            value={defaultBudget}
            onChange={(e) => setDefaultBudget(parseFloat(e.target.value))}
            className={`w-full px-4 py-3 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
          <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            This will be used as the default budget for new days
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={saveSettings}
        className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
      >
        <SafeIcon icon={FiSettings} />
        Save Settings
      </motion.button>

      {/* App Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`rounded-2xl p-6 mt-6 shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <SafeIcon icon={FiInfo} className={`text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            About
          </h2>
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="mb-2">
            Daily Baht Budget Tracker helps you manage your expenses while traveling in Thailand.
          </p>
          <p className="mb-2">
            Set a daily budget, track your spending, and stay within your limits with this simple yet powerful tool.
          </p>
          <p className="text-xs">
            Version 1.0.0 • Built with React & Tailwind CSS
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;