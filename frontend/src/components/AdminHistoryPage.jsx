import { useEffect, useState } from 'react'
import { getAllHistory, deleteHistory } from '../api/api'
import HistoryForm from './HistoryForm'
import './AdminCustomerPage.css'

export default function AdminHistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)

  const fetchHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getAllHistory()
      setHistory(data || [])
    } catch (e) {
      setError('Failed to load history entries. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this history entry?')) {
      return
    }

    try {
      await deleteHistory(id)
      setHistory(history.filter(entry => entry.id !== id))
    } catch (e) {
      setError('Failed to delete history entry.')
    }
  }

  const handleEdit = (entry) => {
    setEditingEntry(entry)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingEntry(null)
    fetchHistory() // Refresh the list
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="admin-customer-page">
      <div className="page-header">
        <h1>Bungalow History Management</h1>
        <p>Manage historical entries and stories about the bungalow</p>
        <button 
          className="search-button"
          onClick={() => setShowForm(true)}
          style={{ marginTop: '1rem' }}
        >
          Add New History Entry
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="customers-section">
        <div className="customers-header">
          <h2>History Entries</h2>
          <span className="customers-count">{history.length} entries</span>
        </div>

        {loading ? (
          <div className="loading">Loading history entries...</div>
        ) : history.length === 0 ? (
          <div className="no-customers">No history entries found. Add your first entry!</div>
        ) : (
          <div className="customers-grid">
            {history.map(entry => (
              <div className="customer-card" key={entry.id}>
                <div className="customer-info">
                  <h3>{entry.title}</h3>
                  <div className="customer-email">Year: {entry.year}</div>
                  <div className="customer-phone">Category: {entry.category}</div>
                  <div className="customer-location">
                    {entry.content.length > 100 
                      ? `${entry.content.substring(0, 100)}...` 
                      : entry.content
                    }
                  </div>
                  {entry.imageUrl && (
                    <div className="customer-joined">
                      <img 
                        src={entry.imageUrl} 
                        alt={entry.title}
                        style={{ width: '100%', borderRadius: '8px', marginTop: '10px', maxHeight: '150px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className="customer-joined">
                    Created: {formatDate(entry.createdAt)}
                  </div>
                </div>
                <div className="customer-actions">
                  <button 
                    className="view-button"
                    onClick={() => handleEdit(entry)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <HistoryForm 
          entry={editingEntry}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}
