import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../api/api'
import './AdminCustomerPage.css'

export default function CustomerReservations() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('upcoming')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reservations, setReservations] = useState([])

  const fetchReservations = async () => {
    if (!user?.email) return
    setLoading(true)
    setError('')
    try {
      const data = await api.getReservations({ email: user.email, filter })
      setReservations(data || [])
    } catch (e) {
      setError('Failed to load reservations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-load reservations when filter changes if user is logged in
    if (user?.email) {
      fetchReservations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, user?.email])

  if (!user) {
    return (
      <div className="admin-customer-page">
        <div className="page-header">
          <h1>Your Reservations</h1>
          <p>Please log in to view your reservations</p>
        </div>
        <div className="login-prompt">
          <p>You need to be logged in to view your reservations.</p>
          <a href="/login" className="login-link">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-customer-page">
      <div className="page-header">
        <h1>Your Reservations</h1>
        <p>View your upcoming and past bookings</p>
        <div style={{ marginTop: '12px' }}>
          <Link to="/reserve" className="search-button">Make a Reservation</Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-section">
        <div className="search-form">
          <select
            className="search-input"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="all">All</option>
          </select>

          <button className="search-button" disabled={loading} onClick={fetchReservations}>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="customers-section">
        <div className="customers-header">
          <h2>{filter.charAt(0).toUpperCase() + filter.slice(1)} Reservations</h2>
          <span className="customers-count">{reservations.length}</span>
        </div>

        {loading ? (
          <div className="loading">Loading reservations...</div>
        ) : reservations.length === 0 ? (
          <div className="no-customers">No reservations found.</div>
        ) : (
          <div className="customers-grid">
            {reservations.map(r => (
              <div className="customer-card" key={r.id}>
                <div className="customer-info">
                  <h3>{r.bungalowName}</h3>
                  <div className="customer-email">Check-in: {new Date(r.checkInDate).toLocaleDateString()}</div>
                  <div className="customer-phone">Check-out: {new Date(r.checkOutDate).toLocaleDateString()}</div>
                  <div className="customer-joined">Status: {r.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

 