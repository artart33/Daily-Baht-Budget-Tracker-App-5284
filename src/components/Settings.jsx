import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { 
  loadAppSettings,
  saveAppSettings,
  getDefaultSettings,
  saveHomeCurrency,
  saveExchangeRate,
  saveDefaultBudget,
  getStorageInfo,
  initializeStorage
} from '../utils/storageUtils';

const { FiSettings, FiMoon, FiSun, FiDollarSign, FiGlobe, FiInfo, FiHardDrive, FiDatabase } = FiIcons;

const Settings = ({ darkMode, setDarkMode }) => {
  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(0.029);
  const [defaultBudget, setDefaultBudget] = useState(1000);
  const [storageInfo, setStorageInfo] = useState({
    totalExpenses: 0,
    totalDays: 0,
    totalAmount: 0,
    averagePerDay: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    try {
      setIsLoading(true);
      
      // Initialize storage first
      initializeStorage();
      
      // Load settings
      const settings = loadAppSettings();
      setHomeCurrency(settings.homeCurrency);
      setExchangeRate(settings.exchangeRate);
      setDefaultBudget(settings.defaultBudget);
      
      // Load storage info
      const info = getStorageInfo();
      setStorageInfo(info);
      
      console.log('Settings loaded:', settings);
      console.log('Storage info:', info);
      
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAllSettings = async () => {
    try {
      setIsSaving(true);
      
      const settings = {
        homeCurrency,
        exchangeRate,
        defaultBudget,
        darkMode
      };
      
      // Save individual settings
      saveHomeCurrency(homeCurrency);
      saveExchangeRate(exchangeRate);
      saveDefaultBudget(defaultBudget);
      
      // Save combined settings
      const success = saveAppSettings(settings);
      
      if (success) {
        // Update storage info
        const info = getStorageInfo();
        setStorageInfo(info);
        
        alert('Settings saved successfully!');
        console.log('Settings saved:', settings);
      } else {
        alert('Failed to save settings. Please try again.');
      }
      
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      const defaults = getDefaultSettings();
      setHomeCurrency(defaults.homeCurrency);
      setExchangeRate(defaults.exchangeRate);
      setDefaultBudget(defaults.defaultBudget);
      console.log('Settings reset to defaults');
    }
  };

  const exchangeRateHints = {
    USD: 0.029,
    EUR: 0.026,
    GBP: 0.022,
    JPY: 4.2,
    AUD: 0.044,
    CAD: 0.039
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

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

      {/* Storage Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-6 mb-6 shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <SafeIcon icon={FiDatabase} className={`text-2xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Storage Overview
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {storageInfo.totalExpenses}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Expenses
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {storageInfo.totalDays}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Days Tracked
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              ฿{storageInfo.totalAmount.toLocaleString()}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Spent
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              ฿{storageInfo.averagePerDay.toFixed(0)}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Avg Per Day
            </div>
          </div>
        </div>
      </motion.div>

      {/* Theme Settings */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
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
        transition={{ delay: 0.3 }}
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
        transition={{ delay: 0.4 }}
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

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={saveAllSettings}
          disabled={isSaving}
          className={`w-full py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            isSaving
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <SafeIcon icon={FiSettings} />
              Save Settings
            </>
          )}
        </motion.button>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={resetToDefaults}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            darkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Reset to Defaults
        </motion.button>
      </div>

      {/* App Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
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
            All your data is stored locally on your device and never leaves your browser.
          </p>
          <p className="mb-2">
            Set a daily budget, track your spending, and stay within your limits with this simple yet powerful tool.
          </p>
          <p className="text-xs">
            Version 1.0.0 • Built with React & Tailwind CSS • Data stored locally
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;