import { useEffect, useState } from 'react';
import { api } from '../services/api';
import './AdminCustomerPage.css';

export default function AdminReviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [replyMap, setReplyMap] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyEditingId, setReplyEditingId] = useState(null);
  const [replyEditText, setReplyEditText] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.getAdminReviews();
      setItems(data || []);
    } catch (e) {
      setError('Failed to load reviews');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const sendReply = async (id) => {
    const reply = replyMap[id];
    if (!reply || !reply.trim()) return;
    try {
      await api.replyToReview(id, reply.trim());
      setReplyMap({ ...replyMap, [id]: '' });
      await load();
    } catch (e) {
      setError('Failed to send reply');
    }
  };

  const startEdit = (r) => { setEditingId(r.id); setEditText(r.message || ''); };
  const cancelEdit = () => { setEditingId(null); setEditText(''); };
  const saveEdit = async (id) => {
    const text = (editText || '').trim();
    if (!text) return;
    try {
      await api.updateReview(id, text);
      cancelEdit();
      await load();
    } catch (e) { setError('Failed to update review'); }
  };

  const removeReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.deleteReview(id);
      if (editingId === id) cancelEdit();
      await load();
    } catch (e) { setError('Failed to delete review'); }
  };

  // Reply edit handlers
  const startReplyEdit = (r) => { setReplyEditingId(r.id); setReplyEditText(r.adminReply || ''); };
  const cancelReplyEdit = () => { setReplyEditingId(null); setReplyEditText(''); };
  const saveReplyEdit = async (id, original) => {
    const text = (replyEditText || '').trim();
    const unchanged = text === (original || '').trim();
    if (!text || unchanged) return;
    try {
      await api.replyToReview(id, text);
      cancelReplyEdit();
      await load();
    } catch (e) { setError('Failed to update reply'); }
  };
  const deleteReply = async (id) => {
    if (!confirm('Remove this reply?')) return;
    try {
      await api.deleteAdminReply(id);
      cancelReplyEdit();
      await load();
    } catch (e) { setError('Failed to remove reply'); }
  };

  return (
    <div className="admin-customer-page">
      <div className="page-header">
        <h1>Customer Reviews</h1>
        <p>Read and reply to customer feedback</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading reviews...</div>
      ) : items.length === 0 ? (
        <div className="no-customers">No reviews yet.</div>
      ) : (
        <div className="customers-grid">
          {items.map((r) => {
            const isEditing = editingId === r.id;
            const unchanged = (editText || '').trim() === (r.message || '').trim();
            const saveDisabled = !isEditing || !editText.trim() || unchanged;
            return (
              <div className="customer-card" key={r.id}>
                <div className="customer-info">
                  <h3>{r.customerName || 'Guest'}</h3>
                  {r.customerEmail && <div className="customer-email">{r.customerEmail}</div>}
                  {!isEditing ? (
                    <>
                      <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{r.message}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button className="view-button" onClick={() => startEdit(r)}>Edit</button>
                        <button className="delete-button" onClick={() => removeReview(r.id)}>Delete</button>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                      <textarea
                        rows={4}
                        placeholder="Edit review message"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="view-button" disabled={saveDisabled} onClick={() => saveEdit(r.id)}>Save</button>
                        <button className="view-button" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {r.adminReply && (
                    <div className="customer-joined" style={{ marginTop: 10 }}>
                      <strong>Reply:</strong>{' '}
                      {replyEditingId === r.id ? (
                        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                          <textarea
                            rows={3}
                            placeholder="Edit reply"
                            value={replyEditText}
                            onChange={(e) => setReplyEditText(e.target.value)}
                          />
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              className="view-button"
                              disabled={!(replyEditText || '').trim() || (replyEditText || '').trim() === (r.adminReply || '').trim()}
                              onClick={() => saveReplyEdit(r.id, r.adminReply)}
                            >Save</button>
                            <button className="view-button" onClick={cancelReplyEdit}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span style={{ whiteSpace: 'pre-wrap' }}>{r.adminReply}</span>
                          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                            <button className="view-button" onClick={() => startReplyEdit(r)}>Edit Reply</button>
                            <button className="delete-button" onClick={() => deleteReply(r.id)}>Delete Reply</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {!r.adminReply && (
                  <div className="customer-actions" style={{ display: 'grid', gap: 8 }}>
                    <textarea
                      rows={3}
                      placeholder="Write a reply"
                      value={replyMap[r.id] || ''}
                      onChange={(e) => setReplyMap({ ...replyMap, [r.id]: e.target.value })}
                    />
                    <button
                      className="view-button"
                      disabled={!((replyMap[r.id] || '').trim())}
                      onClick={() => sendReply(r.id)}
                    >Send Reply</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
