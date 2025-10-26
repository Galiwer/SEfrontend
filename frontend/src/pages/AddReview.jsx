import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/reviews.css';

export default function AddReview() {
  const { user, isCustomer } = useAuth();
  const [name, setName] = useState(user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Inline recent reviews management (view / edit / delete)
  const [myReviews, setMyReviews] = useState([]);
  const [loadingMy, setLoadingMy] = useState(false);
  const [loadErr, setLoadErr] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isCustomer()) { setError('You must be logged in as a customer.'); return; }
    if (!name || !message) { setError('Name and message are required.'); return; }
    setError(''); setSuccess(''); setSaving(true);
    try {
      await api.createReview({ name, email, message });
      setSuccess('Thank you for your review!');
      setMessage('');
      await loadMyReviews();
    } catch (e) {
      setError('Failed to submit review.');
    } finally { setSaving(false); }
  };
  const loadMyReviews = async () => {
    if (!isCustomer()) return;
    setLoadingMy(true); setLoadErr('');
    try {
      const { data } = await api.getMyReviews();
      setMyReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      setLoadErr('Failed to load your reviews.');
    } finally { setLoadingMy(false); }
  };

  const startEdit = (r) => { setEditId(r.id); setEditText(r.message || ''); };
  const cancelEdit = () => { setEditId(null); setEditText(''); };
  const saveEdit = async (id) => {
    const text = editText.trim();
    if (!text) return;
    try {
      await api.updateReview(id, text);
      cancelEdit();
      await loadMyReviews();
    } catch (e) { setError('Failed to update review.'); }
  };
  const removeReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.deleteReview(id);
      if (editId === id) cancelEdit();
      await loadMyReviews();
    } catch (e) { setError('Failed to delete review.'); }
  };

  useEffect(() => { loadMyReviews(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="reviews-page">
      <h2 className="reviews-title">Write a Review</h2>
      <form onSubmit={onSubmit} className="review-form" aria-label="Write a review form">
        <div className="review-form-grid">
          <input className="rv-input" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="rv-input" type="email" placeholder="Your Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <textarea className="rv-textarea" placeholder="Share your experience" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} required />
          <button className="rv-btn" type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit Review'}</button>
          {error && <div className="rv-error" role="alert">{error}</div>}
          {success && <div className="rv-success" role="status">{success}</div>}
        </div>
      </form>
      {/* Recent reviews with inline edit/delete */}
      <div className="reviews-container" style={{ marginTop: 24 }}>
        <h3 className="reviews-title" style={{ fontSize: 'clamp(20px,2.2vw,28px)', marginBottom: 16 }}>Your Recent Reviews</h3>
        {loadingMy ? <div className="rv-state">Loading your reviews...</div>
        : loadErr ? <div className="rv-state">{loadErr}</div>
        : myReviews.length === 0 ? <div className="rv-state">You haven't posted any reviews yet.</div>
        : (
          <div className="reviews-grid">
            {myReviews.map(r => (
              <article key={r.id} className="review-card" aria-label={`Your review from ${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}`}>
                <header className="review-header">
                  <div className="review-avatar" aria-hidden="true" />
                  <div className="review-name">{r.customerName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'You')}</div>
                  {r.createdAt && (
                    <time className="review-date">{new Date(r.createdAt).toLocaleDateString()}</time>
                  )}
                </header>
                {editId === r.id ? (
                  <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                    <textarea className="rv-textarea" rows={5} value={editText} onChange={(e) => setEditText(e.target.value)} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="rv-btn" type="button" onClick={() => saveEdit(r.id)}>Save</button>
                      <button className="rv-btn" type="button" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="review-message">{r.message}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button className="rv-btn" type="button" onClick={() => startEdit(r)}>Edit</button>
                      <button className="rv-btn" type="button" onClick={() => removeReview(r.id)}>Delete</button>
                    </div>
                  </>
                )}
                {r.adminReply && (
                  <section className="review-reply" aria-label="Host reply">
                    <div className="review-reply-title">Reply from host</div>
                    <div className="review-message">{r.adminReply}</div>
                  </section>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
