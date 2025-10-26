import { useEffect, useState } from 'react'
import { api } from '../api/api'
import './BungalowHistory.css'

export default function BungalowHistory() {
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const categories = [
    { value: '', label: 'All History' },
    { value: 'CONSTRUCTION', label: 'Construction' },
    { value: 'RENOVATION', label: 'Renovation' },
    { value: 'EVENT', label: 'Events' },
    { value: 'MILESTONE', label: 'Milestones' }
  ]

  const fetchHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.getBungalowHistory({ category: category || undefined })
      setHistory(data || [])
    } catch (e) {
      setError('Failed to load bungalow history. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDefaultImage = (category) => {
    const images = {
      'CONSTRUCTION': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'RENOVATION': 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f6f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'EVENT': 'https://images.unsplash.com/photo-1519167758481-83f1426e0b3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'MILESTONE': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    }
    return images[category] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  }

  return (
    <div className="bungalow-history-page">
      {/* Hero Section */}
      <div className="history-hero">
        <div className="hero-content">
          <h1 className="hero-title">Our Heritage</h1>
          <p className="hero-subtitle">A Journey Through Time</p>
          <p className="hero-description">
            Discover the rich history and timeless elegance of our bungalow, 
            where every corner tells a story of tradition, luxury, and unforgettable memories.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-container">
          <span className="filter-label">Filter by Category:</span>
          <select
            className="filter-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="timeline-section">
        <h2 className="timeline-title">Historical Timeline</h2>
        
        {loading ? (
          <div className="loading-state">
            <p>Loading our rich history...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <h3>No History Found</h3>
            <p>We're working on adding more historical content. Please check back soon!</p>
          </div>
        ) : (
          <div className="timeline-container">
            {history.map(entry => (
              <div className="timeline-item" key={entry.id}>
                <div className="timeline-card">
                  <img 
                    src={entry.imageUrl || getDefaultImage(entry.category)}
                    alt={entry.title}
                    className="timeline-image"
                    onError={(e) => {
                      e.target.src = getDefaultImage(entry.category)
                    }}
                  />
                  <div className="timeline-content">
                    <div className="timeline-year">{entry.year}</div>
                    <span className="timeline-category">{entry.category}</span>
                    <h3 className="timeline-title-text">{entry.title}</h3>
                    <p className="timeline-description">{entry.content}</p>
                    <div className="timeline-date">
                      Added to our records: {formatDate(entry.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
