import React, { useState, useEffect } from 'react';
import { getAllInvoices, getInvoiceStats, downloadAdminInvoicePdf } from '../api/finance';

export default function AdminInvoiceManagementPage() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('issuedAt');
  const [sortDir, setSortDir] = useState('desc');
  
  // Filter states
  const [filters, setFilters] = useState({
    customerName: '',
    customerEmail: '',
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filterParams = {};
      if (filters.customerName.trim()) filterParams.customerName = filters.customerName.trim();
      if (filters.customerEmail.trim()) filterParams.customerEmail = filters.customerEmail.trim();
      if (filters.startDate) filterParams.startDate = filters.startDate;
      if (filters.endDate) filterParams.endDate = filters.endDate;
      
      const response = await getAllInvoices(currentPage, pageSize, sortBy, sortDir, filterParams);
      
      setInvoices(response.invoices || []);
      setTotalPages(response.totalPages || 0);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      console.error('Failed to load invoices:', err);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getInvoiceStats();
      setStats(response);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  useEffect(() => {
    loadInvoices();
    loadStats();
  }, [currentPage, pageSize, sortBy, sortDir]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
    setCurrentPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(0);
    loadInvoices();
  };

  const clearFilters = () => {
    setFilters({
      customerName: '',
      customerEmail: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(0);
  };

  const handleDownloadPdf = async (invoiceId) => {
    try {
      const blob = await downloadAdminInvoicePdf(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-LK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invoice Management</h1>
          <p className="page-description">View and manage all issued invoices</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-value">{stats.totalInvoices || 0}</div>
          <div className="stat-label">Total Invoices</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(stats.totalRevenue || 0)}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(stats.averageInvoiceValue || 0)}</div>
          <div className="stat-label">Average Invoice</div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3>Filter Invoices</h3>
          <div className="grid">
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                value={filters.customerName}
                onChange={(e) => handleFilterChange('customerName', e.target.value)}
                placeholder="Search by customer name..."
              />
            </div>
            <div className="form-group">
              <label>Customer Email</label>
              <input
                type="email"
                value={filters.customerEmail}
                onChange={(e) => handleFilterChange('customerEmail', e.target.value)}
                placeholder="Search by customer email..."
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="datetime-local"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="datetime-local"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={applyFilters}>
              Apply Filters
            </button>
            <button className="btn btn-secondary" onClick={clearFilters} style={{ marginLeft: '8px' }}>
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div className="card">
        <div className="table-header">
          <h3>Invoices ({totalItems})</h3>
          <div className="table-controls">
            <select 
              value={pageSize} 
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="form-control"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading invoices...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : invoices.length === 0 ? (
          <div className="empty-state">
            <p>No invoices found.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th 
                      className="sortable" 
                      onClick={() => handleSort('id')}
                    >
                      Invoice # {sortBy === 'id' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="sortable" 
                      onClick={() => handleSort('customerName')}
                    >
                      Customer {sortBy === 'customerName' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Email</th>
                    <th 
                      className="sortable" 
                      onClick={() => handleSort('issuedAt')}
                    >
                      Date {sortBy === 'issuedAt' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="sortable" 
                      onClick={() => handleSort('total')}
                    >
                      Amount {sortBy === 'total' && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>
                        <strong>#{invoice.id}</strong>
                      </td>
                      <td>{invoice.customerName}</td>
                      <td>{invoice.customerEmail}</td>
                      <td>{formatDate(invoice.issuedAt)}</td>
                      <td>
                        <strong>{formatCurrency(invoice.total)}</strong>
                      </td>
                      <td>{invoice.items?.length || 0} items</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleDownloadPdf(invoice.id)}
                            title="Download PDF"
                          >
                            📄 PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
                
                <span className="pagination-info">
                  Page {currentPage + 1} of {totalPages} ({totalItems} total)
                </span>
                
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


