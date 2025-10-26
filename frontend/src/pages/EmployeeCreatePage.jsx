import React from 'react';
import EmployeeForm from '../components/EmployeeForm';
import { createEmployee } from '../api/employees';
import { useNavigate } from 'react-router-dom';

export default function EmployeeCreatePage() {
  const navigate = useNavigate();

  const handleCreate = async (values) => {
    try {
      await createEmployee(values);
      // on success navigate to the employees home page
      navigate('/admin/employees');
    } catch (err) {
      // Basic error handling - adapt to your backend error shape
      alert(err?.response?.data?.message ?? err?.message ?? 'Failed to create employee');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Employee</h1>
          <p className="page-description">
            Fill in the details below to add a new team member to your organization.
          </p>
        </div>
      </div>
      
      <EmployeeForm onSubmit={handleCreate} submitLabel="Create Employee" />
    </div>
  );
}
