import { apiClient } from '../services/api';

// Income API
export const createIncome = async (incomeData) => {
  const response = await apiClient.post('/incomes', incomeData);
  return response.data;
};

export const updateIncome = async (id, incomeData) => {
  const response = await apiClient.put(`/incomes/${id}`, incomeData);
  return response.data;
};

export const getIncomeById = async (id) => {
  const response = await apiClient.get(`/incomes/${id}`);
  return response.data;
};

export const getAllIncomes = async () => {
  const response = await apiClient.get('/incomes');
  return response.data;
};

export const getIncomesByMonth = async (year, month) => {
  const response = await apiClient.get(`/incomes/monthly?year=${year}&month=${month}`);
  return response.data;
};

export const deleteIncome = async (id) => {
  const response = await apiClient.delete(`/incomes/${id}`);
  return response.data;
};

// Expense API
export const createExpense = async (expenseData) => {
  const response = await apiClient.post('/expenses', expenseData);
  return response.data;
};

export const updateExpense = async (id, expenseData) => {
  const response = await apiClient.put(`/expenses/${id}`, expenseData);
  return response.data;
};

export const getExpenseById = async (id) => {
  const response = await apiClient.get(`/expenses/${id}`);
  return response.data;
};

export const getAllExpenses = async () => {
  const response = await apiClient.get('/expenses');
  return response.data;
};

export const getExpensesByMonth = async (year, month) => {
  const response = await apiClient.get(`/expenses/monthly?year=${year}&month=${month}`);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await apiClient.delete(`/expenses/${id}`);
  return response.data;
};

// Finance Summary API
export const getMonthlySummary = async (year, month) => {
  const response = await apiClient.get(`/finance/monthly-summary?year=${year}&month=${month}`);
  return response.data;
};

export const getYearlySummary = async (year) => {
  const response = await apiClient.get(`/finance/yearly-summary?year=${year}`);
  return response.data;
};

export const getSummaryByDateRange = async (startDate, endDate) => {
  const response = await apiClient.get(`/finance/range-summary?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

// Invoices API
export const createInvoice = async (payload) => {
  const response = await apiClient.post('/invoices', payload);
  return response.data;
};

export const getInvoiceById = async (id) => {
  const response = await apiClient.get(`/invoices/${id}`);
  return response.data;
};

export const listInvoicesForCustomer = async (customerId) => {
  const response = await apiClient.get(`/invoices/customer/${customerId}`);
  return response.data;
};

export const downloadInvoicePdf = async (id) => {
  const response = await apiClient.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
  return response.data;
};

// Admin Invoice Management API
export const getAllInvoices = async (page = 0, size = 10, sortBy = 'issuedAt', sortDir = 'desc', filters = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir
  });
  
  if (filters.customerName) params.append('customerName', filters.customerName);
  if (filters.customerEmail) params.append('customerEmail', filters.customerEmail);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  
  const response = await apiClient.get(`/admin/invoices?${params}`);
  return response.data;
};

export const getInvoiceStats = async () => {
  const response = await apiClient.get('/admin/invoices/stats');
  return response.data;
};

export const downloadAdminInvoicePdf = async (id) => {
  const response = await apiClient.get(`/admin/invoices/${id}/pdf`, { responseType: 'blob' });
  return response.data;
};