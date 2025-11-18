import { useEffect, useState } from 'react'
import { getAllAttractionsAdmin, createAttraction, updateAttraction, deleteAttraction } from '../api/api'
import './AdminCustomerPage.css'

const initialFormState = {
  name: '',
  description: '',
  category: '',
  location: '',
  distance: '',
  isActive: true,
  displayOrder: 0
}

export default function AdminAttractionsPage() {
  const [attractions, setAttractions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(initialFormState)

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
    setForm(initialFormState)
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
          <div className="modal" style={{ maxWidth: '720px' }}>
            <form onSubmit={submit} className="card" style={{ boxShadow: 'none', margin: 0 }}>
              <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <div>
                  <h2 className="card-title">{editing ? 'Edit Attraction' : 'Add New Attraction'}</h2>
                  <p className="card-subtitle">
                    Provide the attraction details to keep the public listing up to date.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>

              <div className="form-grid" style={{ marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label className="label" htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="input"
                    placeholder="Enter attraction name"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label" htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    required
                    rows="3"
                    className="input"
                    placeholder="Describe the attraction"
                  />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={onChange}
                    className="input"
                    placeholder="e.g., Beach, Historical, Nature"
                  />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={onChange}
                    className="input"
                    placeholder="e.g., Galle Fort, Unawatuna"
                  />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="distance">Distance</label>
                  <input
                    type="text"
                    id="distance"
                    name="distance"
                    value={form.distance}
                    onChange={onChange}
                    className="input"
                    placeholder="e.g., 5 km, 15 minutes"
                  />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="displayOrder">Display Order</label>
                  <input
                    type="number"
                    id="displayOrder"
                    name="displayOrder"
                    value={form.displayOrder}
                    onChange={onChange}
                    min="0"
                    className="input"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Visibility</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={form.isActive}
                      onChange={onChange}
                    />
                    <label htmlFor="isActive">Active (visible to customers)</label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
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

