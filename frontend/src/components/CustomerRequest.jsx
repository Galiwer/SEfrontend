import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../api/api'
import './CustomerReservations.css' // reuse same CSS base styles

export default function CustomerRequest() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    customerName: user?.username || '',
    email: user?.email || '',
    subject: '',
    body: ''
  })
  const [Messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchMessages = async () => {
    if (!user?.email) return
    setLoading(true)
    setError('')
    try {
      const data = await api.getMessages({ email: user.email })
      setMessages(data || [])
    } catch (e) {
      setError('Failed to load Messages. Please try again.')
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
    // map form to backend expected fields
    await api.createMessage({
    subject: form.subject,  
    content: form.content,
    customerEmail: form.email,
    createdAt: new Date(),
    done: false
})

    setSuccess('Message sent successfully.')
    setForm(prev => ({ ...prev, subject: '', body: '' }))
    fetchMessages()
  } catch (err) {
    setError('Failed to send message. Please try again.')
  } finally {
    setLoading(false)
  }
}


  if (!user) {
    return (
      <div className="admin-customer-page">
        <div className="page-header">
          <h1>Your Messages</h1>
          <p>Please log in to view or send Messages</p>
        </div>
        <div className="login-prompt">
          <p>You need to be logged in to send and view your Messages.</p>
          <a href="/login" className="login-link">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-customer-page">
      <div className="page-header">
        <h1>Your Messages</h1>
        <p>Send new Messages and track their status</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="search-section">
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            name="subject"
            value={form.subject}
            placeholder="Subject"
            onChange={handleChange}
            required
          />
          <textarea
            className="search-input"
            name="content"
            value={form.content}
            placeholder="Your message"
            rows="3"
            onChange={handleChange}
            required
          />
          <button className="search-button" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>

      <div className="customers-section">
        <div className="customers-header">
          <h2>Your Messages</h2>
          <span className="customers-count">{Messages.length}</span>
        </div>

        {loading ? (
          <div className="loading">Loading Messages...</div>
        ) : Messages.length === 0 ? (
          <div className="no-customers">No Messages found.</div>
        ) : (
          <div className="customers-grid">
            {Messages.map(m => (
              <div className="customer-card" key={m.id}>
                <div className="customer-info">
                  <h3>{m.subject}</h3>
                  <h4>{m.content}</h4>
                  <div className="customer-email">
                    Sent: {new Date(m.createdAt).toLocaleString()}
                  </div>
                  <div className="customer-joined">
                    Status: {m.done ? 'Done ✅' : 'Pending ⏳'}
                  </div>
                  <p>{m.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
