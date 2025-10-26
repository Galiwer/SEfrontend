import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import './BookingManagement.css';

export default function BookingManagement() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getAllReservationsAdmin();
      setReservations(data || []);
    } catch (e) {
      setError('Failed to load reservations');
      console.error('Error loading reservations:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, reservationId) => {
    setError('');
    setSuccess('');
    try {
      let result;
      switch (action) {
        case 'approve':
          result = await api.approveReservation(reservationId);
          setSuccess('Reservation approved successfully');
          break;
        case 'cancel':
          result = await api.cancelReservation(reservationId);
          setSuccess('Reservation cancelled successfully');
          break;
        case 'mark-paid':
          result = await api.markReservationAsPaid(reservationId);
          setSuccess('Reservation marked as paid');
          break;
        case 'mark-unpaid':
          result = await api.markReservationAsUnpaid(reservationId);
          setSuccess('Reservation marked as unpaid');
          break;
        default:
          throw new Error('Unknown action');
      }
      
      // Update the reservation in the list
      setReservations(prev => 
        prev.map(r => r.id === reservationId ? result : r)
      );
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || `Failed to ${action} reservation`);
      console.error(`Error ${action}ing reservation:`, e);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'CONFIRMED': return '#28a745';
      case 'CANCELLED': return '#dc3545';
      case 'COMPLETED': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'PENDING': return '#ffc107';
      case 'PAID': return '#28a745';
      case 'UNPAID': return '#dc3545';
      case 'REFUNDED': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="booking-management-page">
      <div className="page-header">
        <h1>Booking Management</h1>
        <p>Manage reservations - approve, cancel, or update payment status</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All ({reservations.length})
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            Pending ({reservations.filter(r => r.status === 'PENDING').length})
          </button>
          <button 
            className={filter === 'confirmed' ? 'active' : ''} 
            onClick={() => setFilter('confirmed')}
          >
            Confirmed ({reservations.filter(r => r.status === 'CONFIRMED').length})
          </button>
          <button 
            className={filter === 'cancelled' ? 'active' : ''} 
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({reservations.filter(r => r.status === 'CANCELLED').length})
          </button>
        </div>
        <button className="refresh-button" onClick={loadReservations} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading reservations...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="no-reservations">
          {filter === 'all' ? 'No reservations found.' : `No ${filter} reservations found.`}
        </div>
      ) : (
        <div className="reservations-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Bungalow</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>#{reservation.id}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">{reservation.customerName}</div>
                      <div className="customer-email">{reservation.customerEmail}</div>
                    </div>
                  </td>
                  <td>{reservation.bungalowName}</td>
                  <td>{new Date(reservation.checkInDate).toLocaleDateString()}</td>
                  <td>{new Date(reservation.checkOutDate).toLocaleDateString()}</td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(reservation.status) }}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td>
                    <span 
                      className="payment-badge" 
                      style={{ backgroundColor: getPaymentStatusColor(reservation.paymentStatus) }}
                    >
                      {reservation.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {reservation.status === 'PENDING' && (
                        <>
                          <button 
                            className="btn-approve"
                            onClick={() => handleAction('approve', reservation.id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn-cancel"
                            onClick={() => handleAction('cancel', reservation.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      
                      {reservation.status === 'CONFIRMED' && (
                        <button 
                          className="btn-cancel"
                          onClick={() => handleAction('cancel', reservation.id)}
                        >
                          Cancel
                        </button>
                      )}

                      {reservation.paymentStatus === 'PENDING' || reservation.paymentStatus === 'UNPAID' ? (
                        <button 
                          className="btn-paid"
                          onClick={() => handleAction('mark-paid', reservation.id)}
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <button 
                          className="btn-unpaid"
                          onClick={() => handleAction('mark-unpaid', reservation.id)}
                        >
                          Mark Unpaid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="legend">
        <h3>Status Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ffc107' }}></span>
            <span>Pending</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#28a745' }}></span>
            <span>Confirmed/Paid</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#dc3545' }}></span>
            <span>Cancelled/Unpaid</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#17a2b8' }}></span>
            <span>Completed/Refunded</span>
          </div>
        </div>
      </div>
    </div>
  );
}
