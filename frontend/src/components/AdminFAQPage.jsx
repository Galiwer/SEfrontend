import { useEffect, useState } from 'react'
import { getAllFaqsAdmin, createFaq, updateFaq, deleteFaq } from '../api/api'
import './AdminCustomerPage.css'

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: '',
    isActive: true,
    displayOrder: 0
  })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getAllFaqsAdmin()
      setFaqs(data || [])
    } catch (e) {
      setError('Failed to load FAQs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ question: '', answer: '', category: '', isActive: true, displayOrder: 0 })
    setFormOpen(true)
  }

  const openEdit = (f) => {
    setEditing(f)
    setForm({
      question: f.question,
      answer: f.answer,
      category: f.category || '',
      isActive: f.isActive,
      displayOrder: f.displayOrder ?? 0
    })
    setFormOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (editing) await updateFaq(editing.id, form)
      else await createFaq(form)
      setFormOpen(false)
      setEditing(null)
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed.')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this FAQ?')) return
    try {
      await deleteFaq(id)
      await load()
    } catch (e) {
      setError('Delete failed.')
    }
  }

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  return (
    <div className="admin-customer-page">
      <div className="page-header">
        <h1>FAQ Management</h1>
        <p>Create and maintain customer-facing FAQs</p>
        <button className="search-button" onClick={openNew} style={{ marginTop: '1rem' }}>Add FAQ</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="customers-section">
        <div className="customers-header">
          <h2>All FAQs</h2>
          <span className="customers-count">{faqs.length}</span>
        </div>

        {loading ? (
          <div className="loading">Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <div className="no-customers">No FAQs yet.</div>
        ) : (
          <div className="customers-grid">
            {faqs.map(f => (
              <div className="customer-card" key={f.id}>
                <div className="customer-info">
                  <h3>{f.question}</h3>
                  <div className="customer-email">Category: {f.category || 'General'}</div>
                  <div className="customer-phone">Active: {f.isActive ? 'Yes' : 'No'}</div>
                  <div className="customer-location">Order: {f.displayOrder}</div>
                  <div className="customer-joined">Answer: {f.answer}</div>
                </div>
                <div className="customer-actions">
                  <button className="view-button" onClick={() => openEdit(f)}>Edit</button>
                  <button className="delete-button" onClick={() => remove(f.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {formOpen && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '720px' }}>
            <form onSubmit={submit} className="card" style={{ boxShadow: 'none', margin: 0 }}>
              <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <div>
                  <h2 className="card-title">{editing ? 'Edit FAQ' : 'Add New FAQ'}</h2>
                  <p className="card-subtitle">
                    Provide clear answers to help customers find information quickly.
                  </p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>
                  Close
                </button>
              </div>

              <div className="form-grid" style={{ marginTop: '1.5rem' }}>
                {error && <div className="error" style={{ gridColumn: '1 / -1' }}>{error}</div>}

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label" htmlFor="question">Question *</label>
                  <input
                    type="text"
                    id="question"
                    name="question"
                    value={form.question}
                    onChange={onChange}
                    className="input"
                    required
                    placeholder="Enter the frequently asked question"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label" htmlFor="answer">Answer *</label>
                  <textarea
                    id="answer"
                    name="answer"
                    value={form.answer}
                    onChange={onChange}
                    className="input"
                    rows="4"
                    required
                    placeholder="Provide a clear and helpful answer"
                  />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={onChange}
                    className="input"
                    placeholder="e.g. Booking, Policies, General"
                  />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="displayOrder">Display Order</label>
                  <input
                    type="number"
                    id="displayOrder"
                    name="displayOrder"
                    value={form.displayOrder}
                    onChange={onChange}
                    className="input"
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={onChange}
                      style={{ width: 'auto' }}
                    />
                    <span>Active (visible to customers)</span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
