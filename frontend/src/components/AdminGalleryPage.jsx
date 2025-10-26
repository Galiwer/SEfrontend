import { useEffect, useState } from 'react'
import { api } from '../services/api'
import './AdminCustomerPage.css'

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [url, setUrl] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchPhotos = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.getAdminGallery()
      setPhotos(data || [])
    } catch (e) {
      setError('Failed to load gallery. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
  if (!url || !/^https?:\/\//i.test(url)) { setError('Enter a valid URL starting with http or https.'); return; }
    setSaving(true)
    setError('')
    try {
      await api.addGalleryUrl(url.trim())
      setUrl('')
      await fetchPhotos()
    } catch (e) {
      setError('Failed to save image URL.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this photo?')) return
    try {
      await api.deleteGalleryItem(item.id)
      setPhotos(photos.filter(p => p.id !== item.id))
    } catch (e) {
      setError('Failed to delete image.')
    }
  }

  return (
    <div className="admin-customer-page">
      <div className="page-header">
        <h1>Gallery Management</h1>
        <p>Upload and manage photos shown on the public gallery</p>
      </div>

      <form onSubmit={handleUpload} style={{ marginBottom: '1rem', display: 'flex', gap: 8 }}>
        <input
          type="url"
          placeholder="https://example.com/media"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: 8 }}
          required
        />
        <button className="search-button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Image URL'}</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading gallery...</div>
      ) : photos.length === 0 ? (
        <div className="no-customers">No photos yet. Upload the first one!</div>
      ) : (
        <div className="customers-grid">
          {photos.map((item, idx) => (
            <div className="customer-card" key={idx}>
              <div className="customer-info">
                <img src={item.imageUrl} alt={`Photo ${idx}`} style={{ width: '100%', borderRadius: 8, maxHeight: 220, objectFit: 'cover' }} />
              </div>
              <div className="customer-actions">
                <button className="delete-button" onClick={() => handleDelete(item)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
