import './BungalowHistory.css'

export default function ContactPage() {
  return (
    <div className="bungalow-history-page">
      {/* Hero */}
      <div className="history-hero" style={{ height: '45vh' }}>
        <div className="hero-content">
          <h1 className="hero-title">Contact Us</h1>
          <p className="hero-subtitle">We'd love to hear from you</p>
          <p className="hero-description">Reach out for reservations, special requests, or any questions about our bungalow.</p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="timeline-section" style={{ maxWidth: 1100 }}>
        <h2 className="timeline-title">Get In Touch</h2>

        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">📍</div>
            <h3 className="contact-title">Address</h3>
            <p className="contact-text">123 Beachfront Lane, Palm Bay, Southern Province, Sri Lanka</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <h3 className="contact-title">Phone</h3>
            <p className="contact-text">+94 11 234 5678</p>
            <p className="contact-text">+94 77 123 4567 (WhatsApp)</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">✉️</div>
            <h3 className="contact-title">Email</h3>
            <p className="contact-text">stay@mybungalow.com</p>
            <p className="contact-text">reservations@mybungalow.com</p>
          </div>
        </div>

        <div className="contact-grid" style={{ marginTop: '1.5rem' }}>
          <div className="contact-card" style={{ gridColumn: '1 / -1' }}>
            <div className="contact-icon">🕒</div>
            <h3 className="contact-title">Hours</h3>
            <p className="contact-text">Reservations: Daily 8:00 AM – 8:00 PM</p>
            <p className="contact-text">Check-in: 2:00 PM • Check-out: 11:00 AM</p>
          </div>
        </div>

        {/* Social Media */}
        <div className="contact-grid" style={{ marginTop: '1.5rem' }}>
          <div className="contact-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <div className="contact-icon">🌐</div>
            <h3 className="contact-title">Follow Us</h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" alt="YouTube" />
              </a>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="map-wrap">
  <iframe
    title="Galle My Bungalow Location"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6338.965670617913!2d80.2280892!3d6.0397816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae173b447b6ddeb%3A0xb0e05bad4fea6121!2sGalle%20My%20Bungalow!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
    width="100%"
    height="380"
    style={{ border: 0, borderRadius: '16px' }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>


      </div>

    </div>
  )
}