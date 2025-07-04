import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiDollarSign, FiTrendingUp, FiTrendingDown, FiTrash2, FiEdit2, FiCheck, FiX } = FiIcons;

const BudgetTracker = ({ darkMode }) => {
  const [dailyBudget, setDailyBudget] = useState(1000);
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadTodaysData();
  }, []);

  const loadTodaysData = () => {
    const today = new Date().toDateString();
    const savedBudget = localStorage.getItem(`budget_${today}`);
    const savedExpenses = localStorage.getItem(`expenses_${today}`);
    
    if (savedBudget) {
      setDailyBudget(parseFloat(savedBudget));
    }
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  };

  const saveTodaysData = (newExpenses, budget = dailyBudget) => {
    const today = new Date().toDateString();
    localStorage.setItem(`budget_${today}`, budget.toString());
    localStorage.setItem(`expenses_${today}`, JSON.stringify(newExpenses));
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      description: description.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveTodaysData(updatedExpenses);
    
    setAmount('');
    setDescription('');
  };

  const deleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    saveTodaysData(updatedExpenses);
  };

  const startEditExpense = (expense) => {
    setEditingExpense(expense.id);
    setEditAmount(expense.amount.toString());
    setEditDescription(expense.description);
  };

  const saveEditExpense = (id) => {
    if (!editAmount || !editDescription) return;

    const updatedExpenses = expenses.map(expense => 
      expense.id === id 
        ? { ...expense, amount: parseFloat(editAmount), description: editDescription.trim() }
        : expense
    );
    
    setExpenses(updatedExpenses);
    saveTodaysData(updatedExpenses);
    
    setEditingExpense(null);
    setEditAmount('');
    setEditDescription('');
  };

  const cancelEditExpense = () => {
    setEditingExpense(null);
    setEditAmount('');
    setEditDescription('');
  };

  const updateBudget = () => {
    if (newBudget && parseFloat(newBudget) > 0) {
      const budget = parseFloat(newBudget);
      setDailyBudget(budget);
      saveTodaysData(expenses, budget);
      setNewBudget('');
      setShowBudgetInput(false);
    }
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = dailyBudget - totalSpent;
  const progressPercentage = Math.min((totalSpent / dailyBudget) * 100, 100);

  return (
    <div className="flex-1 p-4 pb-20">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Daily Baht Tracker
        </h1>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </motion.div>

      {/* Budget Overview */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-6 mb-6 shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiDollarSign} className={`text-2xl ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Daily Budget
            </span>
          </div>
          <button
            onClick={() => setShowBudgetInput(!showBudgetInput)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Edit
          </button>
        </div>

        <AnimatePresence>
          {showBudgetInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4"
            >
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="Enter new budget"
                  className={`flex-1 px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                <button
                  onClick={updateBudget}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Set
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mb-4">
          <div className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ฿{dailyBudget.toLocaleString()}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Budget
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-3 rounded-full mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`h-full rounded-full ${
              progressPercentage > 90 ? 'bg-red-500' : 
              progressPercentage > 70 ? 'bg-yellow-500' : 
              'bg-green-500'
            }`}
          />
        </div>

        {/* Spent vs Remaining */}
        <div className="flex justify-between">
          <div className="text-center">
            <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              ฿{totalSpent.toLocaleString()}
            </div>
            <div className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <SafeIcon icon={FiTrendingUp} className="text-red-500" />
              Spent
            </div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${
              remaining >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              ฿{remaining.toLocaleString()}
            </div>
            <div className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <SafeIcon icon={remaining >= 0 ? FiTrendingDown : FiTrendingUp} className={remaining >= 0 ? 'text-green-500' : 'text-red-500'} />
              {remaining >= 0 ? 'Remaining' : 'Over Budget'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add Expense Form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl p-6 mb-6 shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Add Expense
        </h2>
        <form onSubmit={addExpense} className="space-y-4">
          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (฿)"
              className={`w-full px-4 py-3 rounded-lg border text-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you buy?"
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            <SafeIcon icon={FiPlus} />
            Add Expense
          </motion.button>
        </form>
      </motion.div>

      {/* Recent Expenses */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl p-6 shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Today's Expenses
        </h2>
        <AnimatePresence>
          {expenses.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              No expenses yet today
            </motion.p>
          ) : (
            <div className="space-y-3">
              {expenses.slice(-10).reverse().map((expense) => (
                <motion.div
                  key={expense.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className={`p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  {editingExpense === expense.id ? (
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
                          onClick={() => saveEditExpense(expense.id)}
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
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {expense.description}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(expense.timestamp).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          ฿{expense.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => startEditExpense(expense)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-600' 
                              : 'text-gray-500 hover:text-blue-500 hover:bg-gray-200'
                          }`}
                        >
                          <SafeIcon icon={FiEdit2} className="text-sm" />
                        </button>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className={`p-2 rounded-lg transition-colors ${
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
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BudgetTracker;