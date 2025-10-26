import { useEffect, useState } from 'react'
import '../styles/gallery.css';
import { api } from '../services/api';


export default function Gallery() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const fetchGallery = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.getGallery()
      // backend returns array of relative urls like '/gallery/123_file.jpg'
      setPhotos(data || [])
    } catch (e) {
      setError('Failed to load gallery. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGallery()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="gallery-page">
      <h2 className="gallery-title">Our Gallery</h2>

      {loading ? (
        <div className="loading-state">
          <p>Loading photos...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p className="error-message">{error}</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="empty-state">
          <h3>No Photos Found</h3>
          <p>Please check back soon!</p>
        </div>
      ) : (
        <div className="imagebox" role="list" aria-label="Gallery">
          {photos.map((url, idx) => (
            <button
              key={idx}
              className="image-card"
              onClick={() => setLightboxIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <img
                loading="lazy"
                src={url}
                alt={`Gallery image ${idx + 1}`}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
          >×</button>
          <button
            className="lightbox-prev"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + photos.length - 1) % photos.length) }}
            aria-label="Previous image"
          >‹</button>
          <img className="lightbox-image" src={photos[lightboxIndex]} alt={`Gallery image ${lightboxIndex + 1}`} onClick={(e) => e.stopPropagation()} />
          <button
            className="lightbox-next"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % photos.length) }}
            aria-label="Next image"
          >›</button>
        </div>
      )}
    </div>
  )
}
