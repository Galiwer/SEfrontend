import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import './AdminCalendar.css';

export default function AdminCalendar() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [highlightedReservation, setHighlightedReservation] = useState(null);
  const navigate = useNavigate();

  // Get calendar data for current month
  const getCalendarData = async (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of month
    
    setLoading(true);
    setError('');
    try {
      const data = await api.getCalendarBookings(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setBookings(data || []);
    } catch (e) {
      setError('Failed to load calendar data');
      console.error('Calendar error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCalendarData(currentDate);
  }, [currentDate]);

  // Calendar navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkInDate).toISOString().split('T')[0];
      const checkOut = new Date(booking.checkOutDate).toISOString().split('T')[0];
      return dateStr >= checkIn && dateStr <= checkOut;
    });
  };

  // Get status-based color class for calendar day
  const getStatusColorClass = (dayBookings) => {
    if (dayBookings.length === 0) return '';
    
    // Check if all bookings have the same status
    const statuses = dayBookings.map(booking => booking.status);
    const uniqueStatuses = [...new Set(statuses)];
    
    if (uniqueStatuses.length === 1) {
      const status = uniqueStatuses[0].toLowerCase();
      switch (status) {
        case 'confirmed':
          return 'status-confirmed';
        case 'cancelled':
          return 'status-cancelled';
        case 'pending':
          return 'status-pending';
        default:
          return 'status-pending';
      }
    }
    
    // Mixed statuses - prioritize by importance
    if (statuses.includes('CONFIRMED')) return 'status-confirmed';
    if (statuses.includes('CANCELLED')) return 'status-cancelled';
    return 'status-pending';
  };

  // Navigate to booking management
  const handleBookingClick = (booking) => {
    setHighlightedReservation(booking.id);
    // Pass the reservation ID via state to the booking management page
    setTimeout(() => {
      navigate('/admin/booking-management', { 
        state: { highlightedReservationId: booking.id } 
      });
    }, 300);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const dayBookings = getBookingsForDate(currentDay);
      const isCurrentMonth = currentDay.getMonth() === month;
      const isToday = currentDay.toDateString() === new Date().toDateString();
      
      days.push({
        date: new Date(currentDay),
        bookings: dayBookings,
        isCurrentMonth,
        isToday
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="admin-calendar-page">
      <div className="page-header">
        <h1>Booking Calendar</h1>
        <p>View all reservations at a glance</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="calendar-container">
        {/* Calendar Header */}
        <div className="calendar-header">
          <button 
            className="nav-button" 
            onClick={() => navigateMonth(-1)}
            disabled={loading}
          >
            ← Previous
          </button>
          <h2 className="month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button 
            className="nav-button" 
            onClick={() => navigateMonth(1)}
            disabled={loading}
          >
            Next →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Day headers */}
          <div className="calendar-day-header">Sun</div>
          <div className="calendar-day-header">Mon</div>
          <div className="calendar-day-header">Tue</div>
          <div className="calendar-day-header">Wed</div>
          <div className="calendar-day-header">Thu</div>
          <div className="calendar-day-header">Fri</div>
          <div className="calendar-day-header">Sat</div>

          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const statusColorClass = getStatusColorClass(day.bookings);
            return (
              <div
                key={index}
                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${day.bookings.length > 0 ? 'has-bookings' : ''} ${statusColorClass}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="day-number">{day.date.getDate()}</div>
                {day.bookings.length > 0 && (
                  <div className="booking-indicator">
                    <span className="booking-count">{day.bookings.length}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color today"></div>
            <span>Today</span>
          </div>
          <div className="legend-item">
            <div className="legend-color status-confirmed"></div>
            <span>Confirmed</span>
          </div>
          <div className="legend-item">
            <div className="legend-color status-pending"></div>
            <span>Pending</span>
          </div>
          <div className="legend-item">
            <div className="legend-color status-cancelled"></div>
            <span>Cancelled</span>
          </div>
          <div className="legend-item">
            <div className="legend-color other-month"></div>
            <span>Other Month</span>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedDate && (
        <div className="modal-overlay" onClick={() => {
          setSelectedDate(null);
          setHighlightedReservation(null);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bookings for {selectedDate.date.toLocaleDateString()}</h3>
              <button 
                className="close-button"
                onClick={() => {
                  setSelectedDate(null);
                  setHighlightedReservation(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {selectedDate.bookings.length === 0 ? (
                <p>No bookings for this date.</p>
              ) : (
                <div className="bookings-list">
                  {selectedDate.bookings.map(booking => (
                    <div 
                      key={booking.id} 
                      className={`booking-item clickable-booking ${highlightedReservation === booking.id ? 'highlighted' : ''}`}
                      onClick={() => handleBookingClick(booking)}
                      title="Click to go to Booking Management"
                    >
                      <div className="booking-header">
                        <h4>{booking.bungalowName}</h4>
                        <span className={`status ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="booking-details">
                        <p><strong>Customer:</strong> {booking.customerName}</p>
                        <p><strong>Email:</strong> {booking.customerEmail}</p>
                        <p><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                        <p><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                      </div>
                      <div className="booking-action-hint">
                        <small>Click to manage this reservation</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading">Loading calendar...</div>
        </div>
      )}
    </div>
  );
}
