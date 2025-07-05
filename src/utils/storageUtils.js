// Storage utility functions for managing local data persistence

const STORAGE_KEYS = {
  EXPENSES: 'expenses_',
  BUDGET: 'budget_',
  SETTINGS: 'app_settings',
  DARK_MODE: 'darkMode',
  HOME_CURRENCY: 'homeCurrency',
  EXCHANGE_RATE: 'exchangeRate',
  DEFAULT_BUDGET: 'defaultBudget'
};

// Date utility functions
export const getDateKey = (date = new Date()) => {
  return date.toDateString();
};

export const formatDateForStorage = (dateString) => {
  return new Date(dateString).toDateString();
};

// Expense management
export const saveExpensesToDate = (expenses, date = new Date()) => {
  const dateKey = getDateKey(date);
  const storageKey = `${STORAGE_KEYS.EXPENSES}${dateKey}`;
  
  try {
    localStorage.setItem(storageKey, JSON.stringify(expenses));
    console.log(`Expenses saved for ${dateKey}:`, expenses.length, 'items');
    return true;
  } catch (error) {
    console.error('Error saving expenses:', error);
    return false;
  }
};

export const loadExpensesFromDate = (date = new Date()) => {
  const dateKey = getDateKey(date);
  const storageKey = `${STORAGE_KEYS.EXPENSES}${dateKey}`;
  
  try {
    const saved = localStorage.getItem(storageKey);
    const expenses = saved ? JSON.parse(saved) : [];
    console.log(`Expenses loaded for ${dateKey}:`, expenses.length, 'items');
    return expenses;
  } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
  }
};

export const addExpenseToDate = (expense, date = new Date()) => {
  const existingExpenses = loadExpensesFromDate(date);
  const updatedExpenses = [...existingExpenses, expense];
  return saveExpensesToDate(updatedExpenses, date);
};

export const updateExpenseInDate = (expenseId, updatedExpense, date = new Date()) => {
  const existingExpenses = loadExpensesFromDate(date);
  const updatedExpenses = existingExpenses.map(expense => 
    expense.id === expenseId ? { ...expense, ...updatedExpense } : expense
  );
  return saveExpensesToDate(updatedExpenses, date);
};

export const deleteExpenseFromDate = (expenseId, date = new Date()) => {
  const existingExpenses = loadExpensesFromDate(date);
  const updatedExpenses = existingExpenses.filter(expense => expense.id !== expenseId);
  return saveExpensesToDate(updatedExpenses, date);
};

// Budget management
export const saveBudgetToDate = (budget, date = new Date()) => {
  const dateKey = getDateKey(date);
  const storageKey = `${STORAGE_KEYS.BUDGET}${dateKey}`;
  
  try {
    localStorage.setItem(storageKey, budget.toString());
    console.log(`Budget saved for ${dateKey}:`, budget);
    return true;
  } catch (error) {
    console.error('Error saving budget:', error);
    return false;
  }
};

export const loadBudgetFromDate = (date = new Date()) => {
  const dateKey = getDateKey(date);
  const storageKey = `${STORAGE_KEYS.BUDGET}${dateKey}`;
  
  try {
    const saved = localStorage.getItem(storageKey);
    const budget = saved ? parseFloat(saved) : getDefaultBudget();
    console.log(`Budget loaded for ${dateKey}:`, budget);
    return budget;
  } catch (error) {
    console.error('Error loading budget:', error);
    return getDefaultBudget();
  }
};

// Settings management
export const saveAppSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    console.log('App settings saved:', settings);
    return true;
  } catch (error) {
    console.error('Error saving app settings:', error);
    return false;
  }
};

export const loadAppSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const settings = saved ? JSON.parse(saved) : getDefaultSettings();
    console.log('App settings loaded:', settings);
    return settings;
  } catch (error) {
    console.error('Error loading app settings:', error);
    return getDefaultSettings();
  }
};

export const getDefaultSettings = () => ({
  darkMode: false,
  homeCurrency: 'USD',
  exchangeRate: 0.029,
  defaultBudget: 1000
});

// Individual setting functions
export const saveDarkMode = (darkMode) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
    return true;
  } catch (error) {
    console.error('Error saving dark mode:', error);
    return false;
  }
};

export const loadDarkMode = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved ? JSON.parse(saved) : false;
  } catch (error) {
    console.error('Error loading dark mode:', error);
    return false;
  }
};

export const saveHomeCurrency = (currency) => {
  try {
    localStorage.setItem(STORAGE_KEYS.HOME_CURRENCY, currency);
    return true;
  } catch (error) {
    console.error('Error saving home currency:', error);
    return false;
  }
};

export const loadHomeCurrency = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.HOME_CURRENCY) || 'USD';
  } catch (error) {
    console.error('Error loading home currency:', error);
    return 'USD';
  }
};

export const saveExchangeRate = (rate) => {
  try {
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATE, rate.toString());
    return true;
  } catch (error) {
    console.error('Error saving exchange rate:', error);
    return false;
  }
};

export const loadExchangeRate = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATE);
    return saved ? parseFloat(saved) : 0.029;
  } catch (error) {
    console.error('Error loading exchange rate:', error);
    return 0.029;
  }
};

export const saveDefaultBudget = (budget) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DEFAULT_BUDGET, budget.toString());
    return true;
  } catch (error) {
    console.error('Error saving default budget:', error);
    return false;
  }
};

export const getDefaultBudget = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DEFAULT_BUDGET);
    return saved ? parseFloat(saved) : 1000;
  } catch (error) {
    console.error('Error loading default budget:', error);
    return 1000;
  }
};

// Data management and cleanup
export const getAllExpenseData = () => {
  const history = [];
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith(STORAGE_KEYS.EXPENSES)) {
      try {
        const date = key.replace(STORAGE_KEYS.EXPENSES, '');
        const expenses = JSON.parse(localStorage.getItem(key) || '[]');
        const budget = loadBudgetFromDate(new Date(date));
        
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
      } catch (error) {
        console.error('Error processing expense data for key:', key, error);
      }
    }
  });
  
  return history.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const clearAllData = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEYS.EXPENSES) || key.startsWith(STORAGE_KEYS.BUDGET)) {
        localStorage.removeItem(key);
      }
    });
    console.log('All expense and budget data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

export const getStorageInfo = () => {
  try {
    const keys = Object.keys(localStorage);
    const expenseKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.EXPENSES));
    const budgetKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.BUDGET));
    
    let totalExpenses = 0;
    let totalDays = 0;
    let totalAmount = 0;
    
    expenseKeys.forEach(key => {
      try {
        const expenses = JSON.parse(localStorage.getItem(key) || '[]');
        totalExpenses += expenses.length;
        if (expenses.length > 0) {
          totalDays++;
          totalAmount += expenses.reduce((sum, expense) => sum + expense.amount, 0);
        }
      } catch (error) {
        console.error('Error processing storage info for key:', key, error);
      }
    });
    
    return {
      totalExpenses,
      totalDays,
      totalAmount,
      averagePerDay: totalDays > 0 ? totalAmount / totalDays : 0,
      storageKeys: {
        expenses: expenseKeys.length,
        budgets: budgetKeys.length
      }
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {
      totalExpenses: 0,
      totalDays: 0,
      totalAmount: 0,
      averagePerDay: 0,
      storageKeys: { expenses: 0, budgets: 0 }
    };
  }
};

// Data validation and migration
export const validateAndMigrateData = () => {
  try {
    const keys = Object.keys(localStorage);
    let migratedCount = 0;
    
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEYS.EXPENSES)) {
        try {
          const data = localStorage.getItem(key);
          const expenses = JSON.parse(data || '[]');
          
          // Validate expense structure
          const validatedExpenses = expenses.filter(expense => {
            return expense && 
                   typeof expense.id !== 'undefined' && 
                   typeof expense.amount === 'number' && 
                   typeof expense.description === 'string' &&
                   expense.timestamp;
          });
          
          // Add missing fields
          const updatedExpenses = validatedExpenses.map(expense => ({
            ...expense,
            date: expense.date || new Date().toISOString().split('T')[0],
            timestamp: expense.timestamp || new Date().toISOString()
          }));
          
          if (updatedExpenses.length !== expenses.length) {
            localStorage.setItem(key, JSON.stringify(updatedExpenses));
            migratedCount++;
          }
        } catch (error) {
          console.error('Error validating data for key:', key, error);
        }
      }
    });
    
    console.log(`Data validation complete. Migrated ${migratedCount} records.`);
    return true;
  } catch (error) {
    console.error('Error during data validation:', error);
    return false;
  }
};

// Initialize storage
export const initializeStorage = () => {
  console.log('Initializing storage...');
  
  // Validate and migrate existing data
  validateAndMigrateData();
  
  // Load default settings if none exist
  const settings = loadAppSettings();
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    saveAppSettings(settings);
  }
  
  // Ensure today's budget exists
  const today = new Date();
  const todaysBudget = loadBudgetFromDate(today);
  if (!localStorage.getItem(`${STORAGE_KEYS.BUDGET}${getDateKey(today)}`)) {
    saveBudgetToDate(todaysBudget, today);
  }
  
  const storageInfo = getStorageInfo();
  console.log('Storage initialized:', storageInfo);
  
  return storageInfo;
};