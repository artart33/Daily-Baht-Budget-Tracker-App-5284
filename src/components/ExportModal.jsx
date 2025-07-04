import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { 
  exportToCSV, 
  exportToPDF, 
  exportAllDataToCSV, 
  exportAllDataToPDF,
  exportDateRangeToCSV,
  exportDateRangeToPDF 
} from '../utils/exportUtils';

const { FiDownload, FiX, FiFileText, FiFile, FiCalendar, FiDatabase } = FiIcons;

const ExportModal = ({ isOpen, onClose, darkMode, currentDayExpenses = [] }) => {
  const [exportType, setExportType] = useState('current'); // current, all, range
  const [fileFormat, setFileFormat] = useState('pdf'); // pdf, csv
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      const today = new Date();
      const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const defaultEnd = today.toISOString().split('T')[0];
      
      if (!startDate) setStartDate(defaultStart);
      if (!endDate) setEndDate(defaultEnd);
    }

    setIsExporting(true);
    
    try {
      switch (exportType) {
        case 'current':
          if (currentDayExpenses.length === 0) {
            alert('No expenses to export for today');
            return;
          }
          
          if (fileFormat === 'pdf') {
            exportToPDF(currentDayExpenses, 'today_expenses');
          } else {
            exportToCSV(currentDayExpenses, 'today_expenses');
          }
          break;
          
        case 'all':
          if (fileFormat === 'pdf') {
            exportAllDataToPDF();
          } else {
            exportAllDataToCSV();
          }
          break;
          
        case 'range':
          if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
          }
          
          if (new Date(startDate) > new Date(endDate)) {
            alert('Start date must be before end date');
            return;
          }
          
          if (fileFormat === 'pdf') {
            exportDateRangeToPDF(startDate, endDate);
          } else {
            exportDateRangeToCSV(startDate, endDate);
          }
          break;
      }
      
      // Success feedback
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <SafeIcon 
                icon={FiDownload} 
                className={`text-2xl ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} 
              />
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Export Data
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </button>
          </div>

          {/* Export Type Selection */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              What to Export
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="current"
                  checked={exportType === 'current'}
                  onChange={(e) => setExportType(e.target.value)}
                  className="text-orange-500"
                />
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiCalendar} className="text-sm" />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Today's Expenses ({currentDayExpenses.length} items)
                  </span>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="all"
                  checked={exportType === 'all'}
                  onChange={(e) => setExportType(e.target.value)}
                  className="text-orange-500"
                />
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiDatabase} className="text-sm" />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    All Expense History
                  </span>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="range"
                  checked={exportType === 'range'}
                  onChange={(e) => setExportType(e.target.value)}
                  className="text-orange-500"
                />
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiCalendar} className="text-sm" />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date Range
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Date Range Selection */}
          {exportType === 'range' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* File Format Selection */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFileFormat('pdf')}
                className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                  fileFormat === 'pdf'
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : darkMode
                    ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={FiFileText} className="text-lg" />
                <div className="text-left">
                  <div className="font-medium">PDF</div>
                  <div className="text-xs opacity-75">Formatted report</div>
                </div>
              </button>
              
              <button
                onClick={() => setFileFormat('csv')}
                className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                  fileFormat === 'csv'
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : darkMode
                    ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={FiFile} className="text-lg" />
                <div className="text-left">
                  <div className="font-medium">CSV</div>
                  <div className="text-xs opacity-75">Spreadsheet data</div>
                </div>
              </button>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                isExporting
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <SafeIcon icon={FiDownload} />
                  Export {fileFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExportModal;