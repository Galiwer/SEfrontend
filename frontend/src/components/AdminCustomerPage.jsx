import React, { useState, useEffect } from 'react';
import { getAllCustomers, searchCustomers as searchCustomersApi, deleteCustomer as deleteCustomerApi } from '../api/api';
import './AdminCustomerPage.css';

const AdminCustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getAllCustomers();
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async () => {
    try {
      setLoading(true);
      const response = await searchCustomersApi(searchTerm);
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to search customers');
      console.error('Error searching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchCustomers();
    } else {
      fetchCustomers();
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomerApi(customerId);
        setCustomers(customers.filter(customer => customer.id !== customerId));
        setError(null);
      } catch (err) {
        setError('Failed to delete customer');
        console.error('Error deleting customer:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-customer-page">
        <div className="loading">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="admin-customer-page">
      <div className="page-header">
        <h1>Customer Management</h1>
        <p>Manage and view all customer information</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
          <button 
            type="button" 
            onClick={() => {
              setSearchTerm('');
              fetchCustomers();
            }}
            className="clear-button"
          >
            Clear
          </button>
        </form>
      </div>

      <div className="customers-section">
        <div className="customers-header">
          <h2>Customers</h2>
          <div className="customers-count">{customers.length}</div>
        </div>

        {customers.length === 0 ? (
          <div className="no-customers">
            <p>No customers found</p>
          </div>
        ) : (
          <div className="customers-grid">
            {customers.map((customer) => (
              <div key={customer.id} className="customer-card">
                <div className="customer-info">
                  <h3>{customer.firstName} {customer.lastName}</h3>
                  <p className="customer-email">{customer.email}</p>
                  <p className="customer-phone">{customer.phone}</p>
                  <p className="customer-location">
                    {customer.city}, {customer.state} {customer.zipCode}
                  </p>
                  <p className="customer-joined">
                    Joined: {formatDate(customer.createdAt)}
                  </p>
                </div>
                <div className="customer-actions">
                  <button
                    onClick={() => handleViewCustomer(customer)}
                    className="view-button"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Customer Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="customer-details">
                <div className="detail-row">
                  <label>Name:</label>
                  <span>{selectedCustomer.firstName} {selectedCustomer.lastName}</span>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="detail-row">
                  <label>Phone:</label>
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="detail-row">
                  <label>Address:</label>
                  <span>{selectedCustomer.address}</span>
                </div>
                <div className="detail-row">
                  <label>City:</label>
                  <span>{selectedCustomer.city}</span>
                </div>
                <div className="detail-row">
                  <label>State:</label>
                  <span>{selectedCustomer.state}</span>
                </div>
                <div className="detail-row">
                  <label>ZIP Code:</label>
                  <span>{selectedCustomer.zipCode}</span>
                </div>
                <div className="detail-row">
                  <label>Country:</label>
                  <span>{selectedCustomer.country}</span>
                </div>
                <div className="detail-row">
                  <label>Created:</label>
                  <span>{formatDate(selectedCustomer.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <label>Last Updated:</label>
                  <span>{formatDate(selectedCustomer.updatedAt)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowModal(false)}
                className="close-modal-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomerPage;
