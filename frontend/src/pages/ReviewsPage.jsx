import { useEffect, useState } from 'react';
import { api } from '../services/api';
import '../styles/reviews.css';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      setLoading(true); setError('');
      try {
        const { data } = await api.getPublicReviews();
        setReviews(data || []);
      } catch (e) {
        setError('Failed to load reviews.');
      } finally { setLoading(false); }
    };
    run();
  }, []);

  return (
    <div className="reviews-page">
      <h2 className="reviews-title">Guest Reviews</h2>
      {loading ? <div className="rv-state">Loading reviews...</div>
      : error ? <div className="rv-state">{error}</div>
      : reviews.length === 0 ? <div className="rv-state">No reviews yet.</div>
      : (
        <div className="reviews-container">
          <div className="reviews-grid">
            {reviews.map((r) => (
              <article key={r.id} className="review-card" aria-label={`Review by ${r.customerName || 'Guest'}`}>
                <header className="review-header">
                  <div className="review-avatar" aria-hidden="true" />
                  <div className="review-name">{r.customerName || 'Guest'}</div>
                  {r.createdAt && (
                    <time className="review-date">{new Date(r.createdAt).toLocaleDateString()}</time>
                  )}
                </header>
                <p className="review-message">{r.message}</p>
                {r.adminReply && (
                  <section className="review-reply" aria-label="Host reply">
                    <div className="review-reply-title">Reply from host</div>
                    <div className="review-message">{r.adminReply}</div>
                  </section>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
