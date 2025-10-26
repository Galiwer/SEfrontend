import { useState, useEffect } from 'react'
import { createHistory, updateHistory } from '../api/api'
import './AdminCustomerPage.css'

export default function HistoryForm({ entry, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'MILESTONE',
    year: new Date().getFullYear(),
    imageUrl: ''
  })
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
      <div className="modal-content">
        <div className="modal-header">
          <h2>{entry ? 'Edit History Entry' : 'Add New History Entry'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="register-error">{error}</div>}
          {success && <div className="register-success">{success}</div>}

          <form onSubmit={handleSubmit} className="register-grid">
            <div className="register-field">
              <span>Title *</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="register-input"
                required
                placeholder="Enter history entry title"
              />
            </div>

            <div className="register-field">
              <span>Content *</span>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="register-input"
                required
                rows="4"
                placeholder="Enter the historical content"
              />
            </div>

            <div className="register-field">
              <span>Category *</span>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="register-input"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="register-field">
              <span>Year *</span>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="register-input"
                required
                min="1800"
                max={new Date().getFullYear() + 10}
                placeholder="Enter the year"
              />
            </div>

            <div className="register-field">
              <span>Image URL</span>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="register-input"
                placeholder="Enter image URL (optional)"
              />
            </div>

            {formData.imageUrl && (
              <div className="register-field">
                <span>Preview</span>
                <img 
                  src={formData.imageUrl} 
                  alt="Preview"
                  style={{ 
                    width: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}

            <button 
              type="submit" 
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : (entry ? 'Update Entry' : 'Create Entry')}
            </button>
          </form>
        </div>

        <div className="modal-footer">
          <button className="close-modal-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
