import { useState, useEffect } from 'react'
import { getPublicAttractions } from '../api/api'
import './BungalowHistory.css'

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAttractions = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getPublicAttractions()
      setAttractions(data || [])
    } catch (e) {
      setError('Failed to load attractions. Please try again.')
      console.error('Error fetching attractions:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttractions()
  }, [])

  return (
    <div className="bungalow-history-page">
      <div className="history-hero" style={{ height: '40vh' }}>
        <div className="hero-content">
          <h1 className="hero-title">Nearby Attractions</h1>
          <p className="hero-subtitle">Discover the beauty around our bungalow</p>
          <p className="hero-description">Explore the amazing places and experiences waiting for you in the Galle area.</p>
        </div>
      </div>

      <div className="timeline-section" style={{ maxWidth: 1000 }}>
        <h2 className="timeline-title">Explore the Area</h2>

        {loading ? (
          <div className="loading-state">
            <p>Loading attractions...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={fetchAttractions} className="retry-button">Try Again</button>
          </div>
        ) : attractions.length === 0 ? (
          <div className="empty-state">
            <h3>No Attractions Available</h3>
            <p>We're working on adding information about nearby attractions. Please check back soon!</p>
          </div>
        ) : (
          <div className="attractions-grid">
            {attractions.map((attraction) => (
              <div key={attraction.id} className="attraction-card">
                <div className="attraction-header">
                  <h3 className="attraction-name">{attraction.name}</h3>
                  {attraction.category && (
                    <span className="attraction-category">{attraction.category}</span>
                  )}
                </div>
                
                <div className="attraction-content">
                  <p className="attraction-description">{attraction.description}</p>
                  
                  <div className="attraction-details">
                    {attraction.location && (
                      <div className="attraction-detail">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">{attraction.location}</span>
                      </div>
                    )}
                    {attraction.distance && (
                      <div className="attraction-detail">
                        <span className="detail-icon">🚗</span>
                        <span className="detail-text">{attraction.distance}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .attractions-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        
        .attraction-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          border: 1px solid rgba(184,134,11,0.12);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .attraction-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
        }
        
        .attraction-header {
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          color: white;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }
        
        .attraction-name {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          flex: 1;
        }
        
        .attraction-category {
          background: rgba(255,255,255,0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .attraction-content {
          padding: 1.5rem;
        }
        
        .attraction-description {
          color: #555;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .attraction-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .attraction-detail {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }
        
        .detail-icon {
          font-size: 1rem;
        }
        
        .detail-text {
          font-weight: 500;
        }
        
        .retry-button { 
          background: linear-gradient(135deg, #B8860B 0%, #F4D03F 100%); 
          color: white; 
          border: none; 
          padding: 0.75rem 1.5rem; 
          border-radius: 8px; 
          font-weight: 600; 
          cursor: pointer; 
          margin-top: 1rem;
          transition: all 0.3s ease;
        }
        .retry-button:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 4px 15px rgba(184, 134, 11, 0.3); 
        }
        .error-message { 
          color: #721c24; 
          background: #f8d7da; 
          padding: 1rem; 
          border-radius: 8px; 
          border: 1px solid #f5c6cb; 
          margin-bottom: 1rem; 
        }
      `}</style>
    </div>
  )
}

