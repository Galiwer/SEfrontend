import { useState, useEffect } from 'react'
import { createHistory, updateHistory } from '../api/api'
import './AdminCustomerPage.css'

const defaultForm = {
  title: '',
  content: '',
  category: 'MILESTONE',
  year: new Date().getFullYear(),
  imageUrl: ''
}

export default function HistoryForm({ entry, onClose }) {
  const [formData, setFormData] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const categories = [
    { value: 'CONSTRUCTION', label: 'Construction' },
    { value: 'RENOVATION', label: 'Renovation' },
    { value: 'EVENT', label: 'Event' },
    { value: 'MILESTONE', label: 'Milestone' }
  ]

  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title || '',
        content: entry.content || '',
        category: entry.category || 'MILESTONE',
        year: entry.year || new Date().getFullYear(),
        imageUrl: entry.imageUrl || ''
      })
    }
  }, [entry])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (entry) {
        await updateHistory(entry.id, formData)
        setSuccess('History entry updated successfully!')
      } else {
        await createHistory(formData)
        setSuccess('History entry created successfully!')
      }
      
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save history entry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '720px' }}>
        <form onSubmit={handleSubmit} className="card" style={{ boxShadow: 'none', margin: 0 }}>
          <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div>
              <h2 className="card-title">{entry ? 'Edit History Entry' : 'Add New History Entry'}</h2>
              <p className="card-subtitle">
                Keep the bungalow timeline accurate by adding detailed history milestones.
              </p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
            {success && <div className="success" style={{ marginBottom: '1rem' }}>{success}</div>}

            <div className="form-grid">
              <div className="form-group">
                <label className="label" htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  required
                  placeholder="Enter history entry title"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="label" htmlFor="content">Content *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="input"
                  required
                  rows="4"
                  placeholder="Describe the event or milestone"
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="year">Year *</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="input"
                  required
                  min="1800"
                  max={new Date().getFullYear() + 10}
                  placeholder="Enter the year"
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="imageUrl">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter image URL (optional)"
                />
                <div className="help-text">Provide a direct URL to an image hosted online.</div>
              </div>

              {formData.imageUrl && (
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Preview</label>
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    style={{
                      width: '100%',
                      maxHeight: '220px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (entry ? 'Update Entry' : 'Create Entry')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
