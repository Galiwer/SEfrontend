import React, { useEffect, useState } from "react";
import { roomApi } from "../api/api";
import axios from "axios";

const initialRoomState = {
  id: null,
  name: "",
  description: "",
  price: "",
  capacity: "",
  status: "AVAILABLE",
};

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialRoomState);

  const loadRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await roomApi.getAllRooms();
      setRooms(response.content || response.data?.content || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        // Edit
        await axios.put(`http://localhost:8080/api/rooms/${form.id}`, {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          capacity: parseInt(form.capacity),
          status: form.status,
        });
        alert("Room updated successfully!");
      } else {
        // Add
        await axios.post("http://localhost:8080/api/rooms", {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          capacity: parseInt(form.capacity),
          status: form.status,
        });
        alert("Room added successfully!");
      }
      setShowForm(false);
      setForm(initialRoomState);
      await loadRooms();
    } catch (err) {
      console.error(err);
      alert("Failed to save room. Check console.");
    }
  };

  const handleEdit = (room) => {
    setForm({ ...room });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/rooms/${id}`);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      alert("Room deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete room");
    }
  };

  return (
    <div className="admin-customer-page container">
      <div className="page-header">
        <div>
          <h1>Rooms</h1>
          <p>All rooms currently available in the system</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Room
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <div className="text-center text-muted mt-4">No rooms found.</div>
      ) : (
        <div className="customers-grid">
          {rooms.map((room) => (
            <div className="customer-card card" key={room.id}>
              <div className="customer-info">
                <h3>{room.name || `Room #${room.id}`}</h3>
                <div>Type: {room.type || "N/A"}</div>
                <div>Capacity: {room.capacity || "—"}</div>
                <div>Rate per night: <strong>${room.price || "—"}</strong></div>
                <div className="text-muted">{room.description || "No description available."}</div>
              </div>
              <div className="page-actions mt-2">
                <button className="btn btn-secondary me-2" onClick={() => handleEdit(room)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(room.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "640px" }}>
            <form onSubmit={handleSubmit} className="card" style={{ boxShadow: "none", margin: 0 }}>
              <div className="card-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
                <div>
                  <h2 className="card-title">{form.id ? "Edit Room" : "Add New Room"}</h2>
                  <p className="card-subtitle">
                    Provide room details so guests see accurate pricing and capacity.
                  </p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Close
                </button>
              </div>

              <div className="form-grid" style={{ marginTop: "1.5rem" }}>
                <div className="form-group">
                  <label className="label" htmlFor="room-name">Name *</label>
                  <input
                    id="room-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="input"
                    required
                    placeholder="e.g., Deluxe Suite"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="label" htmlFor="room-description">Description</label>
                  <textarea
                    id="room-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="input"
                    rows="3"
                    placeholder="Highlight unique features or amenities"
                  />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="room-price">Nightly Price (LKR) *</label>
                  <input
                    id="room-price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className="input"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                  <div className="help-text">Enter the base nightly rate.</div>
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="room-capacity">Capacity *</label>
                  <input
                    id="room-capacity"
                    name="capacity"
                    type="number"
                    value={form.capacity}
                    onChange={handleChange}
                    className="input"
                    required
                    min="1"
                    placeholder="Number of guests"
                  />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="room-status">Status</label>
                  <select
                    id="room-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="BOOKED">Booked</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {form.id ? "Update Room" : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
