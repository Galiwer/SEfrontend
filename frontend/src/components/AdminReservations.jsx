import React, { useEffect, useState } from 'react';
import { api } from '../api/api';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getAllReservationsAdmin();
        setReservations(data || []);
      } catch (e) {
        setError('Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="admin-customer-page">
      <div className="page-header">
        <h1>Reservations</h1>
        <p>All client reservations</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : reservations.length === 0 ? (
        <div className="no-customers">No reservations found.</div>
      ) : (
        <div className="customers-grid">
          {reservations.map(r => (
            <div className="customer-card" key={r.id}>
              <div className="customer-info">
                <h3>{r.bungalowName}</h3>
                <div className="customer-email">Customer: {r.customerName || r.customerEmail || r.customerId}</div>
                <div className="customer-phone">Check-in: {new Date(r.checkInDate).toLocaleDateString()}</div>
                <div className="customer-joined">Check-out: {new Date(r.checkOutDate).toLocaleDateString()}</div>
                <div className="customer-joined">Status: {r.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


