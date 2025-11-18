import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BungalowHistory from '../components/BungalowHistory';
import Gallery from '../pages/gallery';
import ReviewsPage from '../pages/ReviewsPage';
import FAQPage from '../components/FAQPage';
import AttractionsPage from '../components/AttractionsPage';
import ContactPage from '../components/ContactPage';
import './HomePage.css';

export default function HomePage() {
  const [visibleSections, setVisibleSections] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Smooth scroll behavior with intersection observer
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          setVisibleSections((prev) => [...new Set([...prev, entry.target.id])]);
        }
      });
    }, observerOptions);

    // Observe sections
    const observeSections = () => {
      const sections = document.querySelectorAll('#features, #history, #gallery, #reviews, #faq, #attractions, #contacts, #cta');
      sections.forEach((section) => {
        observer.observe(section);
      });
    };

    // Wait for DOM to be ready
    const timer = setTimeout(observeSections, 50);

    return () => {
      clearTimeout(timer);
      const sections = document.querySelectorAll('.scroll-section');
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Handle hash-based scrolling when navigating from other pages
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      // Wait for DOM to be ready, then scroll
      const timer = setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300); // Increased delay to ensure components are rendered

      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section scroll-section" id="hero">
        <div className="hero-content">
          <h1>Welcome to Galle My Bungalow</h1>
          <p>Experience luxury beachfront living in the heart of historic Galle, Sri Lanka</p>
          <div className="hero-buttons">
            <Link to="/reserve" className="cta-button primary">Book Your Stay</Link>
            <a href="#history" className="cta-button secondary" onClick={(e) => { 
              e.preventDefault(); 
              const element = document.getElementById('history');
              if (element) {
                const headerOffset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}>Learn Our History</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">
            <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="300" rx="12" fill="url(#beachGradient)"/>
              <path d="M0 200L400 200L400 300L0 300Z" fill="url(#sandGradient)"/>
              <path d="M50 180L100 160L150 170L200 150L250 160L300 140L350 150L400 140L400 200L0 200Z" fill="url(#waterGradient)"/>
              <circle cx="80" cy="120" r="20" fill="#FFD700" opacity="0.8"/>
              <defs>
                <linearGradient id="beachGradient" x1="0" y1="0" x2="400" y2="300" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#87CEEB"/>
                  <stop offset="1" stopColor="#E0F6FF"/>
                </linearGradient>
                <linearGradient id="sandGradient" x1="0" y1="200" x2="400" y2="300" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F4A460"/>
                  <stop offset="1" stopColor="#D2B48C"/>
                </linearGradient>
                <linearGradient id="waterGradient" x1="0" y1="140" x2="400" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4682B4"/>
                  <stop offset="1" stopColor="#5F9EA0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section scroll-section" id="features">
        <div className="features-container">
          <h2>Why Choose Galle My Bungalow?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Rich History</h3>
              <p>Immerse yourself in the colonial charm and historical significance of Galle Fort</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12l9-9 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Prime Location</h3>
              <p>Located in the heart of Galle Fort with easy access to beaches and attractions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Luxury Experience</h3>
              <p>Premium amenities and personalized service for an unforgettable stay</p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="content-section scroll-section" id="history">
        <BungalowHistory />
      </section>

      {/* Gallery Section */}
      <section className="content-section scroll-section" id="gallery">
        <Gallery />
      </section>

      {/* Reviews Section */}
      <section className="content-section scroll-section" id="reviews">
        <ReviewsPage />
      </section>

      {/* FAQ Section */}
      <section className="content-section scroll-section" id="faq">
        <FAQPage />
      </section>

      {/* Attractions Section */}
      <section className="content-section scroll-section" id="attractions">
        <AttractionsPage />
      </section>

      {/* Contact Section */}
      <section className="content-section scroll-section" id="contacts">
        <ContactPage />
      </section>

      {/* CTA Section */}
      <section className="cta-section scroll-section" id="cta">
        <div className="cta-container">
          <h2>Ready for Your Galle Adventure?</h2>
          <p>Book your stay today and experience the magic of Galle My Bungalow</p>
          <div className="cta-buttons">
            <Link to="/reserve" className="cta-button primary">Make a Reservation</Link>
            <Link to="/contact" className="cta-button secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
