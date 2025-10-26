import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEmployees } from '../api/employees';
import '../index.css';

export default function EmployeesHomePage() {
  const navigate = useNavigate();
  const [nic, setNic] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
      setError('');
    } catch (err) {
      setError('Failed to load employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToEdit = (e) => {
    e.preventDefault();
    if (!nic.trim()) return;
    navigate(`/admin/employees/edit/${encodeURIComponent(nic.trim())}`);
  };


  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Management</h1>
          <p className="page-description">
            Manage your team members efficiently. Create new employees or update existing ones.
          </p>
        </div>
      </div>

      <div className="action-buttons">
        <Link to="/admin/employees/create" className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add New Employee
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card">
          <div className="card-body">
            <div className="loading-state">Loading employees...</div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Employees ({employees.length})</h2>
          </div>
          <div className="card-body">
            {employees.length === 0 ? (
              <div className="empty-state">
                <p>No employees found. Create your first employee to get started.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>NIC</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td>{employee.firstName} {employee.lastName}</td>
                        <td>{employee.nic}</td>
                        <td>{employee.department}</td>
                        <td>{employee.position}</td>
                        <td>
                          <span className={`status status-${employee.status?.toLowerCase()}`}>
                            {employee.status}
                          </span>
                        </td>
                        <td>
                          <Link 
                            to={`/admin/employees/edit/${employee.nic}`}
                            className="btn btn-sm btn-outline"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Find Employee to Edit</h2>
          <p className="card-subtitle">Search for an employee by their NIC number to edit their details</p>
        </div>
        
        <form onSubmit={goToEdit} className="form-inline">
          <div className="form-group" style={{ flex: 1 }}>
            <input
              id="nic"
              className="input"
              placeholder="Enter Employee NIC (e.g., 123456789V)"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Find & Edit
          </button>
        </form>
        
        <div className="help-text">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Enter the employee's National Identity Card (NIC) number to locate and edit their information.
        </div>
      </div>
    </div>
  );
}
