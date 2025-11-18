import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../api/api'
import './CustomerRequest.css'

const formatDateTime = (value) =>
  new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

export default function CustomerRequest() {
  const { user } = useAuth()
  const initialForm = useMemo(() => ({
    customerName: user?.username || '',
    email: user?.email || '',
    subject: '',
    message: ''
  }), [user?.username, user?.email])

  const [form, setForm] = useState(initialForm)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setForm(initialForm)
  }, [initialForm])

  const fetchMessages = async () => {
    if (!user?.email) return
    setLoading(true)
    setError('')
    try {
      const data = await api.getMessages({ email: user.email })
      setMessages(data || [])
    } catch (e) {
      setError('Failed to load messages. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.email) {
      fetchMessages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await api.createMessage({
        subject: form.subject,
        content: form.message,
        customerEmail: form.email,
        customerName: form.customerName
      })

      setSuccess('Message sent successfully.')
      setForm(prev => ({ ...prev, subject: '', message: '' }))
      fetchMessages()
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="customer-request-page">
        <div className="container">
          <div className="card empty-state-card">
            <h3>Sign in to send a request</h3>
            <p>You need to be logged in to view or send customer requests.</p>
            <a href="/login" className="btn btn-primary">Go to Login</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="customer-request-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Customer Requests</h1>
            <p className="page-description">
              Send us a quick message and keep track of every response.
            </p>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="request-grid">
          <div className="card request-form-card">
            <div className="card-header">
              <h2 className="card-title">Send a new request</h2>
              <p className="card-subtitle">We typically respond within one business day.</p>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label" htmlFor="subject">Subject *</label>
                <input
                  className="input"
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  placeholder="Reservation update, question about stay..."
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="label" htmlFor="message">Message *</label>
                <textarea
                  className="input"
                  id="message"
                  name="message"
                  value={form.message}
                  placeholder="Provide as much detail as possible"
                  rows="4"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions" style={{ paddingTop: 0, borderTop: 'none' }}>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>

          <div className="card request-messages-card">
            <div className="card-header">
              <div className="card-title">Your recent requests</div>
              <p className="card-subtitle">Status updates for everything you have sent us.</p>
            </div>

            {loading ? (
              <div className="loading">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="empty-request-list">
                You haven't sent any requests yet. Reach out using the form.
              </div>
            ) : (
              <div className="message-list">
                {messages.map((m) => (
                  <div className="message-item" key={m.id}>
                    <div className="message-meta">
                      <span>{m.createdAt ? formatDateTime(m.createdAt) : 'Pending timestamp'}</span>
                      <span className={`status-pill ${m.done ? 'done' : 'pending'}`}>
                        {m.done ? 'Resolved' : 'Pending'}
                      </span>
                    </div>
                    <h3>{m.subject}</h3>
                    <p className="message-body">{m.content || m.body || 'No additional details provided.'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
