import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCalendar, FiDollarSign, FiTrendingUp, FiRefreshCw, FiTrash2, FiEdit2, FiCheck, FiX, FiChevronDown, FiChevronUp } = FiIcons;

const ExpenseHistory = ({ darkMode }) => {
  const [historyData, setHistoryData] = useState([]);
  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(0.029);
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [editingExpense, setEditingExpense] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadHistoryData();
    loadCurrencySettings();
  }, []);

  const loadHistoryData = () => {
    const history = [];
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith('expenses_')) {
        const date = key.replace('expenses_', '');
        const expenses = JSON.parse(localStorage.getItem(key) || '[]');
        const budget = parseFloat(localStorage.getItem(`budget_${date}`) || '1000');
        
        if (expenses.length > 0) {
          const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
          history.push({
            date,
            expenses,
            budget,
            totalSpent,
            remaining: budget - totalSpent
          });
        }
      }
    });
    
    history.sort((a, b) => new Date(b.date) - new Date(a.date));
    setHistoryData(history);
  };

  const loadCurrencySettings = () => {
    const savedCurrency = localStorage.getItem('homeCurrency');
    const savedRate = localStorage.getItem('exchangeRate');
    
    if (savedCurrency) setHomeCurrency(savedCurrency);
    if (savedRate) setExchangeRate(parseFloat(savedRate));
  };

  const toggleDayExpansion = (date) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDays(newExpanded);
  };

  const startEditExpense = (expense, date) => {
    setEditingExpense({ id: expense.id, date });
    setEditAmount(expense.amount.toString());
    setEditDescription(expense.description);
  };

  const saveEditExpense = (expenseId, date) => {
    if (!editAmount || !editDescription) return;

    const updatedHistoryData = historyData.map(day => {
      if (day.date === date) {
        const updatedExpenses = day.expenses.map(expense => 
          expense.id === expenseId 
            ? { ...expense, amount: parseFloat(editAmount), description: editDescription.trim() }
            : expense
        );
        
        // Update localStorage
        localStorage.setItem(`expenses_${date}`, JSON.stringify(updatedExpenses));
        
        const totalSpent = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        return {
          ...day,
          expenses: updatedExpenses,
          totalSpent,
          remaining: day.budget - totalSpent
        };
      }
      return day;
    });
    
    setHistoryData(updatedHistoryData);
    setEditingExpense(null);
    setEditAmount('');
    setEditDescription('');
  };

  const cancelEditExpense = () => {
    setEditingExpense(null);
    setEditAmount('');
    setEditDescription('');
  };

  const deleteExpenseFromHistory = (expenseId, date) => {
    const updatedHistoryData = historyData.map(day => {
      if (day.date === date) {
        const updatedExpenses = day.expenses.filter(expense => expense.id !== expenseId);
        
        // Update localStorage
        localStorage.setItem(`expenses_${date}`, JSON.stringify(updatedExpenses));
        
        const totalSpent = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        return {
          ...day,
          expenses: updatedExpenses,
          totalSpent,
          remaining: day.budget - totalSpent
        };
      }
      return day;
    }).filter(day => day.expenses.length > 0); // Remove days with no expenses
    
    setHistoryData(updatedHistoryData);
  };

  const startNewDay = () => {
    if (confirm('Are you sure you want to start a new day? This will reset your current expenses.')) {
      const today = new Date().toDateString();
      localStorage.removeItem(`expenses_${today}`);
      localStorage.removeItem(`budget_${today}`);
      window.location.reload();
    }
  };

  const clearAllHistory = () => {
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('expenses_') || key.startsWith('budget_')) {
          localStorage.removeItem(key);
        }
      });
      setHistoryData([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const convertToHomeCurrency = (amount) => {
    return (amount * exchangeRate).toFixed(2);
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
          Expense History
        </h1>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Track your spending over time
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        <button
          onClick={startNewDay}
          className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <SafeIcon icon={FiRefreshCw} />
          New Day
        </button>
        <button
          onClick={clearAllHistory}
          className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <SafeIcon icon={FiTrash2} />
          Clear All
        </button>
      </motion.div>

      {/* Currency Converter */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl p-6 mb-6 shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Currency Converter
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Home Currency
            </label>
            <select
              value={homeCurrency}
              onChange={(e) => {
                setHomeCurrency(e.target.value);
                localStorage.setItem('homeCurrency', e.target.value);
              }}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Exchange Rate (THB to {homeCurrency})
            </label>
            <input
              type="number"
              step="0.001"
              value={exchangeRate}
              onChange={(e) => {
                setExchangeRate(parseFloat(e.target.value));
                localStorage.setItem('exchangeRate', e.target.value);
              }}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
          </div>
        </div>
      </motion.div>

      {/* History List */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {historyData.length === 0 ? (
          <div className={`text-center py-8 rounded-2xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          } shadow-lg`}>
            <SafeIcon icon={FiCalendar} className={`text-4xl mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No expense history yet
            </p>
          </div>
        ) : (
          historyData.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-6 shadow-lg ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}
            >
              <div 
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => toggleDayExpansion(day.date)}
              >
                <div className="flex items-center gap-3">
                  <SafeIcon icon={FiCalendar} className={`text-xl ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {formatDate(day.date)}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {day.expenses.length} expense{day.expenses.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ฿{day.totalSpent.toLocaleString()}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {homeCurrency} {convertToHomeCurrency(day.totalSpent)}
                    </div>
                  </div>
                  <SafeIcon 
                    icon={expandedDays.has(day.date) ? FiChevronUp : FiChevronDown} 
                    className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} 
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiDollarSign} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Budget: ฿{day.budget.toLocaleString()}
                  </span>
                </div>
                <div className={`text-sm font-medium ${
                  day.remaining >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {day.remaining >= 0 ? 'Under' : 'Over'} by ฿{Math.abs(day.remaining).toLocaleString()}
                </div>
              </div>

              <div className={`w-full h-2 rounded-full mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-full rounded-full ${
                    day.totalSpent > day.budget ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((day.totalSpent / day.budget) * 100, 100)}%` }}
                />
              </div>

              <AnimatePresence>
                {expandedDays.has(day.date) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2"
                  >
                    {day.expenses.map((expense, expenseIndex) => (
                      <div
                        key={expense.id}
                        className={`p-3 rounded-lg ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        {editingExpense?.id === expense.id && editingExpense?.date === day.date ? (
                          // Edit Mode
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                                  darkMode 
                                    ? 'bg-gray-600 border-gray-500 text-white' 
                                    : 'bg-white border-gray-300 text-gray-800'
                                }`}
                                placeholder="Amount"
                              />
                              <div className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                ฿
                              </div>
                            </div>
                            <input
                              type="text"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border text-sm ${
                                darkMode 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'bg-white border-gray-300 text-gray-800'
                              }`}
                              placeholder="Description"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveEditExpense(expense.id, day.date)}
                                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                              >
                                <SafeIcon icon={FiCheck} className="text-sm" />
                                Save
                              </button>
                              <button
                                onClick={cancelEditExpense}
                                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                              >
                                <SafeIcon icon={FiX} className="text-sm" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {expense.description}
                              </span>
                              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                {new Date(expense.timestamp).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                ฿{expense.amount.toLocaleString()}
                              </span>
                              <button
                                onClick={() => startEditExpense(expense, day.date)}
                                className={`p-1 rounded-lg transition-colors ${
                                  darkMode 
                                    ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-600' 
                                    : 'text-gray-500 hover:text-blue-500 hover:bg-gray-200'
                                }`}
                              >
                                <SafeIcon icon={FiEdit2} className="text-sm" />
                              </button>
                              <button
                                onClick={() => deleteExpenseFromHistory(expense.id, day.date)}
                                className={`p-1 rounded-lg transition-colors ${
                                  darkMode 
                                    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-600' 
                                    : 'text-gray-500 hover:text-red-500 hover:bg-gray-200'
                                }`}
                              >
                                <SafeIcon icon={FiTrash2} className="text-sm" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default ExpenseHistory;