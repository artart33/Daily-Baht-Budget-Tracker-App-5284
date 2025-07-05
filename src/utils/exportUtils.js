import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getAllExpenseData } from './storageUtils';

// CSV Export Functions
export const exportToCSV = (data, filename = 'expenses') => {
  const csvContent = convertToCSV(data);
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

export const exportAllDataToCSV = () => {
  const allData = getAllExpenseData();
  const csvContent = convertAllDataToCSV(allData);
  downloadFile(csvContent, 'all_expenses.csv', 'text/csv');
};

export const exportDateRangeToCSV = (startDate, endDate) => {
  const dateRangeData = getDateRangeData(startDate, endDate);
  const csvContent = convertAllDataToCSV(dateRangeData);
  const filename = `expenses_${startDate}_to_${endDate}.csv`;
  downloadFile(csvContent, filename, 'text/csv');
};

// PDF Export Functions
export const exportToPDF = (data, filename = 'expenses') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Daily Baht Budget Tracker', 20, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Prepare table data
  const tableData = data.map(expense => [
    formatDate(expense.date),
    expense.description,
    `฿${expense.amount.toLocaleString()}`,
    formatDateTime(expense.timestamp)
  ]);
  
  // Add table
  doc.autoTable({
    head: [['Date', 'Description', 'Amount', 'Time']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [249, 115, 22], // Orange color
      textColor: 255
    }
  });
  
  // Add summary
  const total = data.reduce((sum, expense) => sum + expense.amount, 0);
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.text(`Total Expenses: ฿${total.toLocaleString()}`, 20, finalY);
  doc.text(`Number of Expenses: ${data.length}`, 20, finalY + 10);
  
  doc.save(`${filename}.pdf`);
};

export const exportAllDataToPDF = () => {
  const allData = getAllExpenseData();
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Complete Expense History', 20, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  
  let yPosition = 50;
  let grandTotal = 0;
  let totalExpenses = 0;
  
  // Group by date
  const groupedData = {};
  allData.forEach(dayData => {
    const dateKey = dayData.date;
    groupedData[dateKey] = dayData;
  });
  
  // Sort dates
  const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));
  
  sortedDates.forEach((date, index) => {
    const dayData = groupedData[date];
    const dayTotal = dayData.totalSpent;
    grandTotal += dayTotal;
    totalExpenses += dayData.expenses.length;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Add date header
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${formatDate(date)} - Budget: ฿${dayData.budget.toLocaleString()}`, 20, yPosition);
    yPosition += 10;
    
    // Add day summary
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Spent: ฿${dayTotal.toLocaleString()} | Remaining: ฿${(dayData.budget - dayTotal).toLocaleString()}`, 20, yPosition);
    yPosition += 15;
    
    // Add expenses table for this day
    const tableData = dayData.expenses.map(expense => [
      expense.description,
      `฿${expense.amount.toLocaleString()}`,
      formatDateTime(expense.timestamp)
    ]);
    
    doc.autoTable({
      head: [['Description', 'Amount', 'Time']],
      body: tableData,
      startY: yPosition,
      styles: {
        fontSize: 9,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [249, 115, 22],
        textColor: 255,
        fontSize: 9
      },
      margin: { left: 20, right: 20 }
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
  });
  
  // Add final summary
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Summary', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Total Expenses: ฿${grandTotal.toLocaleString()}`, 20, yPosition);
  doc.text(`Number of Days: ${sortedDates.length}`, 20, yPosition + 10);
  doc.text(`Total Transactions: ${totalExpenses}`, 20, yPosition + 20);
  if (sortedDates.length > 0) {
    doc.text(`Average Daily Spending: ฿${(grandTotal / sortedDates.length).toFixed(2)}`, 20, yPosition + 30);
  }
  
  doc.save('complete_expense_history.pdf');
};

export const exportDateRangeToPDF = (startDate, endDate) => {
  const dateRangeData = getDateRangeData(startDate, endDate);
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Expense Report', 20, 20);
  
  // Add date range
  doc.setFontSize(12);
  doc.text(`Period: ${formatDate(startDate)} to ${formatDate(endDate)}`, 20, 30);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
  
  let yPosition = 60;
  let grandTotal = 0;
  let totalExpenses = 0;
  
  dateRangeData.forEach((dayData, index) => {
    const dayTotal = dayData.totalSpent;
    grandTotal += dayTotal;
    totalExpenses += dayData.expenses.length;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Add date header
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${formatDate(dayData.date)} - Budget: ฿${dayData.budget.toLocaleString()}`, 20, yPosition);
    yPosition += 10;
    
    // Add day summary
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Spent: ฿${dayTotal.toLocaleString()} | Remaining: ฿${(dayData.budget - dayTotal).toLocaleString()}`, 20, yPosition);
    yPosition += 15;
    
    // Add expenses table for this day
    const tableData = dayData.expenses.map(expense => [
      expense.description,
      `฿${expense.amount.toLocaleString()}`,
      formatDateTime(expense.timestamp)
    ]);
    
    doc.autoTable({
      head: [['Description', 'Amount', 'Time']],
      body: tableData,
      startY: yPosition,
      styles: {
        fontSize: 9,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [249, 115, 22],
        textColor: 255,
        fontSize: 9
      },
      margin: { left: 20, right: 20 }
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
  });
  
  // Add summary
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Period Summary', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Total Expenses: ฿${grandTotal.toLocaleString()}`, 20, yPosition);
  doc.text(`Number of Days: ${dateRangeData.length}`, 20, yPosition + 10);
  doc.text(`Total Transactions: ${totalExpenses}`, 20, yPosition + 20);
  if (dateRangeData.length > 0) {
    doc.text(`Average Daily Spending: ฿${(grandTotal / dateRangeData.length).toFixed(2)}`, 20, yPosition + 30);
  }
  
  const filename = `expense_report_${startDate}_to_${endDate}.pdf`;
  doc.save(filename);
};

// Helper Functions
const convertToCSV = (data) => {
  const headers = ['Date', 'Description', 'Amount (THB)', 'Time'];
  const csvRows = [headers.join(',')];
  
  data.forEach(expense => {
    const row = [
      formatDate(expense.date),
      `"${expense.description}"`,
      expense.amount,
      formatDateTime(expense.timestamp)
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
};

const convertAllDataToCSV = (allData) => {
  const headers = ['Date', 'Description', 'Amount (THB)', 'Time', 'Daily Budget', 'Daily Total', 'Remaining'];
  const csvRows = [headers.join(',')];
  
  allData.forEach(dayData => {
    dayData.expenses.forEach(expense => {
      const row = [
        formatDate(dayData.date),
        `"${expense.description}"`,
        expense.amount,
        formatDateTime(expense.timestamp),
        dayData.budget,
        dayData.totalSpent,
        dayData.remaining
      ];
      csvRows.push(row.join(','));
    });
  });
  
  return csvRows.join('\n');
};

const getDateRangeData = (startDate, endDate) => {
  const allData = getAllExpenseData();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return allData.filter(dayData => {
    const date = new Date(dayData.date);
    return date >= start && date <= end;
  });
};

const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};