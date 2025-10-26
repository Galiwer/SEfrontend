import React, { useEffect, useState } from 'react';
import { roomApi, seasonalRateApi } from '../api/api';

export default function AdminSeasonalRates() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newRate, setNewRate] = useState({ startDate: '', endDate: '', discountPercentage: '' });

  const [editRate, setEditRate] = useState(null);

  // Load all rooms
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await roomApi.getAllRooms();
        const roomsList = data.content || [];
        setRooms(roomsList);
        if (roomsList.length > 0) setSelectedRoom(roomsList[0].id);
      } catch (err) {
        console.error(err);
        setError('Failed to load rooms');
      }
    };
    loadRooms();
  }, []);

  // Helper: attach roomName to a single rate
  const attachRoomName = (rate) => {
    const room = rooms.find(r => r.id === rate.room?.id || rate.roomId);
    return { ...rate, roomName: room?.name || 'Unknown Room' };
  };

  // Load rates for selected room
  useEffect(() => {
    const loadRates = async () => {
      if (!selectedRoom || rooms.length === 0) return;
      setLoading(true);
      setError('');
      try {
        const data = await seasonalRateApi.getRatesByRoom(selectedRoom);
        const ratesWithNames = data.map(rate => attachRoomName(rate));
        setRates(ratesWithNames);
      } catch (err) {
        console.error(err);
        setError('Failed to load seasonal rates');
      } finally {
        setLoading(false);
      }
    };
    loadRates();
  }, [selectedRoom, rooms]);

  // Add new rate
  const handleCreate = async () => {
    if (!newRate.startDate || !newRate.endDate || !newRate.discountPercentage) {
      return alert('Start Date, End Date, and Discount are required');
    }
    try {
      const payload = {
        roomId: parseInt(selectedRoom, 10),
        startDate: newRate.startDate,
        endDate: newRate.endDate,
        discountPercentage: parseFloat(newRate.discountPercentage),
      };
      const created = await seasonalRateApi.createRate(payload);
      setRates(prev => [...prev, attachRoomName({ ...created, roomId: selectedRoom })]);
      setNewRate({ startDate: '', endDate: '', discountPercentage: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to create rate');
    }
  };

  // Delete rate
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rate?')) return;
    try {
      await seasonalRateApi.deleteRate(id);
      setRates(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete rate');
    }
  };

  // Edit modal
  const openEditModal = (rate) => setEditRate({ ...rate });
  const closeEditModal = () => setEditRate(null);
  const handleEditSave = async () => {
    if (!editRate.startDate || !editRate.endDate || !editRate.discountPercentage) {
      return alert('All fields are required');
    }
    try {
      const payload = {
        roomId: editRate.roomId,
        startDate: editRate.startDate,
        endDate: editRate.endDate,
        discountPercentage: parseFloat(editRate.discountPercentage),
      };
      const updated = await seasonalRateApi.updateRate(editRate.id, payload);
      setRates(prev => prev.map(r => r.id === updated.id ? attachRoomName({ ...updated, roomId: editRate.roomId }) : r));
      closeEditModal();
    } catch (err) {
      console.error(err);
      alert('Failed to update rate');
    }
  };

  return (
    <div className="admin-page container">
      <div className="page-header">
        <h1>Seasonal Rates</h1>
        <p>Manage rates and discounts for each room</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Room Selector */}
      <div className="card mb-4">
        <div className="card-body">
          <label>Select Room:</label>
          <select
            className="input"
            value={selectedRoom}
            onChange={e => setSelectedRoom(e.target.value)}
          >
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Rate */}
      <div className="card mb-4">
        <div className="card-header">
          <h3>Add New Rate</h3>
        </div>
        <div className="card-body form-grid">
          <input
            type="date"
            className="input"
            value={newRate.startDate}
            onChange={e => setNewRate({ ...newRate, startDate: e.target.value })}
          />
          <input
            type="date"
            className="input"
            value={newRate.endDate}
            onChange={e => setNewRate({ ...newRate, endDate: e.target.value })}
          />
          <input
            type="number"
            className="input"
            placeholder="Discount %"
            value={newRate.discountPercentage}
            onChange={e => setNewRate({ ...newRate, discountPercentage: e.target.value })}
          />
          <button className="btn btn-primary" onClick={handleCreate}>
            Add Rate
          </button>
        </div>
      </div>

      {/* Display Rates */}
      {loading ? (
        <div className="loading">Loading rates...</div>
      ) : rates.length === 0 ? (
        <div className="text-center text-muted mt-2">No seasonal rates for this room.</div>
      ) : (
        <div className="rates-grid">
          {rates.map(rate => (
            <div className="rate-card card" key={rate.id}>
              <div className="rate-info">
                <div>Room: {rate.roomName}</div>
                <div>Start Date: {rate.startDate}</div>
                <div>End Date: {rate.endDate}</div>
                <div>Discount: {rate.discountPercentage}%</div>
                <div>Price after Discount: ${rate.newPrice?.toFixed(2) || 0}</div>
              </div>
              <div className="rate-actions mt-2">
                <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(rate)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(rate.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editRate && (
        <div className="modal-overlay">
          <div className="modal card p-4">
            <h3>Edit Rate for Room: {editRate.roomName}</h3>
            <input
              type="date"
              className="input mb-2"
              value={editRate.startDate}
              onChange={e => setEditRate({ ...editRate, startDate: e.target.value })}
            />
            <input
              type="date"
              className="input mb-2"
              value={editRate.endDate}
              onChange={e => setEditRate({ ...editRate, endDate: e.target.value })}
            />
            <input
              type="number"
              className="input mb-2"
              value={editRate.discountPercentage}
              onChange={e => setEditRate({ ...editRate, discountPercentage: e.target.value })}
            />
            <div className="d-flex justify-content-end mt-2">
              <button className="btn btn-secondary me-2" onClick={() => setEditRate(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEditSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
