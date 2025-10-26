import React from 'react';
import IncomeForm from '../components/IncomeForm';
import { createIncome } from '../api/finance';
import { useNavigate } from 'react-router-dom';

export default function IncomeCreatePage() {
  const navigate = useNavigate();

  const handleCreate = async (values) => {
    try {
      await createIncome(values);
      navigate('/admin/finance');
    } catch (err) {
      alert(err?.message ?? 'Failed to create income');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Income</h1>
          <p className="page-description">
            Record a new income entry for your bungalow business.
          </p>
        </div>
      </div>
      
      <IncomeForm onSubmit={handleCreate} submitLabel="Create Income" />
    </div>
  );
}
