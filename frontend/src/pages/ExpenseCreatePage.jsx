import React from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { createExpense } from '../api/finance';
import { useNavigate } from 'react-router-dom';

export default function ExpenseCreatePage() {
  const navigate = useNavigate();

  const handleCreate = async (values) => {
    try {
      await createExpense(values);
      navigate('/admin/finance');
    } catch (err) {
      alert(err?.message ?? 'Failed to create expense');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Expense</h1>
          <p className="page-description">
            Record a new expense entry for your bungalow business.
          </p>
        </div>
      </div>
      
      <ExpenseForm onSubmit={handleCreate} submitLabel="Create Expense" />
    </div>
  );
}
