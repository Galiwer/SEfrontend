import React, { useEffect, useState } from "react";
import { roomApi } from "../api/api";
import axios from "axios";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    capacity: "",
    status: "AVAILABLE",
  });

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
      setForm({ id: null, name: "", description: "", price: "", capacity: "", status: "AVAILABLE" });
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
          <div className="modal">
            <h2>{form.id ? "Edit Room" : "Add New Room"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} required min="1" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="BOOKED">BOOKED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-success">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center; z-index: 999;
        }
        .modal { background: white; padding: 20px; border-radius: 10px; width: 400px; }
        .form-group { margin-bottom: 10px; display: flex; flex-direction: column; }
        .form-group label { font-weight: bold; margin-bottom: 5px; }
        .modal-actions { display: flex; justify-content: space-between; margin-top: 15px; }
      `}</style>
    </div>
  );
}
