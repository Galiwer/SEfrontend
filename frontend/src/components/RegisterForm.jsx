import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/api.js'
import '../styles/register-form.css'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
}

export default function RegisterForm() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!form.firstName.trim()) return 'First name is required'
    if (!form.lastName.trim()) return 'Last name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email is required'
    if (!/^\+?[0-9\-\s]{7,15}$/.test(form.phone)) return 'Valid phone number is required'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    const error = validate()
    if (error) {
      setMessage({ type: 'error', text: error })
      return
    }
    setSubmitting(true)
    try {
      await api.registerCustomer({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password
      })
      setMessage({ type: 'success', text: 'Registration successful!' })
      setForm(initialForm)
    } catch (err) {
      const text = err?.response?.data?.message || 'Registration failed'
      setMessage({ type: 'error', text })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    navigate('/')
  }

  return (
    <div className="register-page">
      <button className="close-button" onClick={handleClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
     <div className="register-text">
        
          <span>Join our Family</span>
         
      </div>
    <form className="register-card" onSubmit={handleSubmit} noValidate>
      <div className="register-grid">
        <label className="register-field">
          <span>First Name</span>
          <input className="register-input" name="firstName" value={form.firstName} onChange={handleChange} required />
        </label>
      </div>
      <div className="register-grid">
        <label className="register-field">
          <span>Last Name</span>
          <input className="register-input" name="lastName" value={form.lastName} onChange={handleChange} required />
        </label>
      </div>
      <div className="register-grid">
      <label className="register-field">
        <span>Email</span>
        <input className="register-input" name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      </div>
      <div className="register-grid">
      <label className="register-field">
        <span>Phone</span>
        <input className="register-input" name="phone" value={form.phone} onChange={handleChange} required />
      </label>
      </div>
      <div className="register-grid">
        <label className="register-field">
          <span>Password</span>
          <input className="register-input" name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
      </div>
      <div className="register-text2">
      <span>*contains 6 characters</span>
      </div>
      <div className="register-grid">
        <label className="register-field">
          <span>Confirm Password</span>
          <input className="register-input" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
        </label>
      </div>
      <button className="register-button" type="submit" disabled={submitting}>
        {submitting ? 'Registering...' : 'Register'}
      </button>
      {message && (
        <p className={message.type === 'error' ? 'register-error' : 'register-success'}>{message.text}</p>
      )}
    </form>
    </div>
  )
}


