import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMonthlySummary } from '../api/finance';

export default function FinanceHomePage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const loadSummary = async () => {
    setLoading(true);
    try {
      const data = await getMonthlySummary(selectedYear, selectedMonth);
      setSummary(data);
    } catch (err) {
      alert(err?.message ?? 'Failed to load financial summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [selectedYear, selectedMonth]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const getProfitColor = (profit) => {
    if (profit > 0) return 'text-green-600';
    if (profit < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Management</h1>
          <p className="page-description">
            Track your bungalow's income, expenses, and profitability.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <Link to="/admin/finance/income/create" className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add Income
        </Link>
        <Link to="/admin/finance/expense/create" className="btn btn-accent">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add Expense
        </Link>
        <Link to="/admin/finance/invoice/create" className="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3h6a2 2 0 0 1 2 2v14l-5-3-5 3V5a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Create Invoice
        </Link>
      </div>

      {/* Month/Year Selector */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Financial Summary</h2>
          <p className="card-subtitle">Select month and year to view financial data</p>
        </div>
        
        <div className="form-inline">
          <div className="form-group">
            <label className="label">Year</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="input"
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="label">Month</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="input"
            >
              {months.map((month, index) => (
                <option key={index + 1} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>
          
          <button 
            type="button" 
            onClick={loadSummary}
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Total Income</h3>
            </div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(summary.totalIncome)}
            </div>
            <div className="text-sm text-muted">
              {summary.incomes?.length || 0} transactions
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Total Expenses</h3>
            </div>
            <div className="text-lg font-bold text-red-600">
              {formatCurrency(summary.totalExpense)}
            </div>
            <div className="text-sm text-muted">
              {summary.expenses?.length || 0} transactions
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Net Profit</h3>
            </div>
            <div className={`text-lg font-bold ${getProfitColor(summary.profit)}`}>
              {formatCurrency(summary.profit)}
            </div>
            <div className="text-sm text-muted">
              {summary.profitPercentage?.toFixed(2) || 0}% margin
            </div>
          </div>
        </div>
      )}

      {/* Detailed Lists */}
      {summary && (
        <div className="form-grid">
          {/* Income List */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Income Details</h3>
              <p className="card-subtitle">{summary.monthName} {summary.year}</p>
            </div>
            
            {summary.incomes && summary.incomes.length > 0 ? (
              <div className="space-y-2">
                {summary.incomes.map((income) => (
                  <div key={income.id} className="flex justify-between items-center p-3 bg-green-50 rounded border">
                    <div>
                      <div className="font-medium">{income.reason}</div>
                      <div className="text-sm text-muted">
                        {income.category && `${income.category} • `}
                        {new Date(income.incomeDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-bold text-green-600">
                      {formatCurrency(income.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted py-8">
                No income recorded for this month
              </div>
            )}
          </div>

          {/* Expense List */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Expense Details</h3>
              <p className="card-subtitle">{summary.monthName} {summary.year}</p>
            </div>
            
            {summary.expenses && summary.expenses.length > 0 ? (
              <div className="space-y-2">
                {summary.expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-red-50 rounded border">
                    <div>
                      <div className="font-medium">{expense.reason}</div>
                      <div className="text-sm text-muted">
                        {expense.category && `${expense.category} • `}
                        {new Date(expense.expenseDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-bold text-red-600">
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted py-8">
                No expenses recorded for this month
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
