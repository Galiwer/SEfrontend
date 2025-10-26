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
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button className="close-button" onClick={() => setFormOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={submit} className="register-grid">
                <div className="register-field">
                  <span>Question *</span>
                  <input className="register-input" name="question" value={form.question} onChange={onChange} required />
                </div>
                <div className="register-field">
                  <span>Answer *</span>
                  <textarea className="register-input" name="answer" value={form.answer} onChange={onChange} rows="4" required />
                </div>
                <div className="register-field">
                  <span>Category</span>
                  <input className="register-input" name="category" value={form.category} onChange={onChange} placeholder="e.g. Booking, Policies" />
                </div>
                <div className="register-field">
                  <span>Active</span>
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
                </div>
                <div className="register-field">
                  <span>Display Order</span>
                  <input type="number" className="register-input" name="displayOrder" value={form.displayOrder} onChange={onChange} min="0" />
                </div>
                <button className="register-button" type="submit">{editing ? 'Update' : 'Create'}</button>
              </form>
            </div>
            <div className="modal-footer">
              <button className="close-modal-button" onClick={() => setFormOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
