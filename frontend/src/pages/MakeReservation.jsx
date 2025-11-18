import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useAuth } from '../contexts/AuthContext';

export default function MakeReservation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [form, setForm] = useState({
    bungalowName: '',
    checkInDate: '',
    checkOutDate: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!user?.id) {
      navigate('/login');
      return;
    }
    if (!form.bungalowName || !form.checkInDate || !form.checkOutDate) {
      setError('All fields are required.');
      return;
    }
    if (new Date(form.checkOutDate) <= new Date(form.checkInDate)) {
      setError('Check-out must be after check-in.');
      return;
    }
    setSubmitting(true);
    try {
      await api.createReservation({
        bungalowName: form.bungalowName,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        customerId: user.id,
        customerEmail: user.email
      });
      setSuccess('Reservation created successfully.');
      setTimeout(() => navigate('/dashboard/reservations'), 800);
    } catch (err) {
      console.error('Failed to create reservation', err);
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to create reservation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FEF9E7 0%, #F4D03F 100%)', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '720px', padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <h1 style={{ marginTop: 0, color: '#B8860B' }}>Make a Reservation</h1>
        <p style={{ color: '#666' }}>Fill the form below to book your stay.</p>

      {error && <div style={{ background: '#fee', color: '#b33', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>{error}</div>}
      {success && <div style={{ background: '#efe', color: '#262', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>{success}</div>}

        <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: 6, color: '#555' }}>Bungalow name</label>
          <input name="bungalowName" value={form.bungalowName} onChange={onChange} placeholder="e.g. Ocean View Suite" style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: '#555' }}>Check-in date</label>
            <input type="date" name="checkInDate" min={today} value={form.checkInDate} onChange={onChange} style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: '#555' }}>Check-out date</label>
            <input type="date" name="checkOutDate" min={form.checkInDate || today} value={form.checkOutDate} onChange={onChange} style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8 }} />
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button type="submit" disabled={submitting} style={{ padding: '12px 18px', background: submitting ? '#ccc' : 'linear-gradient(135deg, #B8860B, #F4D03F)', color: '#fff', border: 0, borderRadius: 8, cursor: submitting ? 'not-allowed' : 'pointer' }}>
            {submitting ? 'Submitting...' : 'Reserve Now'}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}


