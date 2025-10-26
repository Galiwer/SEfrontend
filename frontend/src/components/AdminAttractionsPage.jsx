import { useEffect, useState } from 'react'
import { getAllAttractionsAdmin, createAttraction, updateAttraction, deleteAttraction } from '../api/api'
import './AdminCustomerPage.css'

export default function AdminAttractionsPage() {
  const [attractions, setAttractions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    distance: '',
    isActive: true,
    displayOrder: 0
  })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getAllAttractionsAdmin()
      setAttractions(data || [])
    } catch (e) {
      setError('Failed to load attractions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ 
      name: '', 
      description: '', 
      category: '', 
      location: '', 
      distance: '', 
      isActive: true, 
      displayOrder: 0 
    })
    setFormOpen(true)
  }

  const openEdit = (attraction) => {
    setEditing(attraction)
    setForm({
      name: attraction.name,
      description: attraction.description,
      category: attraction.category || '',
      location: attraction.location || '',
      distance: attraction.distance || '',
      isActive: attraction.isActive,
      displayOrder: attraction.displayOrder ?? 0
    })
    setFormOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (editing) await updateAttraction(editing.id, form)
      else await createAttraction(form)
      setFormOpen(false)
      setEditing(null)
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed.')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this attraction?')) return
    try {
      await deleteAttraction(id)
      await load()
    } catch (e) {
      setError('Delete failed.')
    }
  }

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  return (
    <div className="admin-customer-page">
      <div className="page-header">
        <h1>Attractions Management</h1>
        <p>Create and maintain customer-facing attractions</p>
        <button className="search-button" onClick={openNew} style={{ marginTop: '1rem' }}>Add Attraction</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="customers-section">
        <div className="customers-header">
          <h2>All Attractions</h2>
          <span className="customers-count">{attractions.length}</span>
        </div>

        {loading ? (
          <div className="loading">Loading attractions...</div>
        ) : attractions.length === 0 ? (
          <div className="no-customers">No attractions yet.</div>
        ) : (
          <div className="customers-grid">
            {attractions.map(attraction => (
              <div className="customer-card" key={attraction.id}>
                <div className="customer-info">
                  <h3>{attraction.name}</h3>
                  <div className="customer-email">Category: {attraction.category || 'General'}</div>
                  <div className="customer-phone">Location: {attraction.location || 'Not specified'}</div>
                  <div className="customer-location">Distance: {attraction.distance || 'Not specified'}</div>
                  <div className="customer-joined">Active: {attraction.isActive ? 'Yes' : 'No'}</div>
                  <div className="customer-joined">Order: {attraction.displayOrder}</div>
                  <div className="customer-joined" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                    {attraction.description}
                  </div>
                </div>
                <div className="customer-actions">
                  <button className="view-button" onClick={() => openEdit(attraction)}>Edit</button>
                  <button className="delete-button" onClick={() => remove(attraction.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {formOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editing ? 'Edit Attraction' : 'Add New Attraction'}</h2>
              <button className="close-button" onClick={() => setFormOpen(false)}>×</button>
            </div>
            
            <form onSubmit={submit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  placeholder="Enter attraction name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  required
                  rows="3"
                  placeholder="Enter attraction description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={onChange}
                    placeholder="e.g., Beach, Historical, Nature"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={onChange}
                    placeholder="e.g., Galle Fort, Unawatuna"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="distance">Distance</label>
                  <input
                    type="text"
                    id="distance"
                    name="distance"
                    value={form.distance}
                    onChange={onChange}
                    placeholder="e.g., 5 km, 15 minutes"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="displayOrder">Display Order</label>
                  <input
                    type="number"
                    id="displayOrder"
                    name="displayOrder"
                    value={form.displayOrder}
                    onChange={onChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={onChange}
                  />
                  Active (visible to customers)
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setFormOpen(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {editing ? 'Update' : 'Create'} Attraction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

