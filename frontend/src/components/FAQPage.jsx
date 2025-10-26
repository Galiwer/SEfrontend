import { useState, useEffect } from 'react'
import { getPublicFaqs } from '../api/api'
import './BungalowHistory.css'

export default function FaqPage() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchFaqs = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getPublicFaqs()
      setFaqs(data || [])
    } catch (e) {
      setError('Failed to load FAQs. Please try again.')
      console.error('Error fetching FAQs:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  const toggle = (index) => {
    setActiveIndex(prev => (prev === index ? null : index))
  }

  return (
    <div className="bungalow-history-page">
      <div className="history-hero" style={{ height: '40vh' }}>
        <div className="hero-content">
          <h1 className="hero-title">Frequently Asked Questions</h1>
          <p className="hero-subtitle">Find quick answers to common questions</p>
        </div>
      </div>

      <div className="timeline-section" style={{ maxWidth: 900 }}>
        <h2 className="timeline-title">Your Questions, Answered</h2>

        {loading ? (
          <div className="loading-state">
            <p>Loading FAQs...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={fetchFaqs} className="retry-button">Try Again</button>
          </div>
        ) : faqs.length === 0 ? (
          <div className="empty-state">
            <h3>No FAQs Available</h3>
            <p>We're working on adding helpful information. Please check back soon!</p>
          </div>
        ) : (
          <div className="faq-accordion">
            {faqs.map((f, idx) => (
              <div key={f.id} className={`faq-item ${activeIndex === idx ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => toggle(idx)}>
                  <span>{f.question}</span>
                  <span className="faq-icon">{activeIndex === idx ? '−' : '+'}</span>
                </button>
                <div className="faq-answer" style={{ display: activeIndex === idx ? 'block' : 'none' }}>
                  <p>{f.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .faq-accordion { display: grid; gap: 1rem; }
        .faq-item { background: #fff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); border: 1px solid rgba(184,134,11,0.12); }
        .faq-question { width: 100%; text-align: left; padding: 1.25rem 1.5rem; background: linear-gradient(90deg, var(--primary-50), #fff); border: 0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-weight: 600; color: var(--primary-dark); border-radius: 12px 12px 0 0; }
        .faq-icon { font-size: 1.5rem; color: var(--primary); }
        .faq-answer { padding: 1rem 1.5rem; color: #555; line-height: 1.7; }
        .faq-item.open .faq-question { background: linear-gradient(90deg, var(--primary), var(--accent)); color: #fff; }
        .faq-item.open .faq-icon { color: #fff; }
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
