import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './PublicHeader.css';

export default function PublicHeaderSimple() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Scroll to top of page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle logo/home click
  const handleHomeClick = (e) => {
    if (location.pathname === '/' || location.pathname === '/home') {
      e.preventDefault();
      scrollToTop();
    }
  };

  // Scroll to section on HomePage
  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    
    // If we're already on the home page, just scroll
    if (location.pathname === '/' || location.pathname === '/home') {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80; // Adjust based on your header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // Navigate to home page with hash, then scroll
      navigate(`/#${sectionId}`);
      // Scroll will be handled by HomePage useEffect after navigation
    }
  };

  return (
    <header className="public-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={handleHomeClick}>
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#homeGradient)"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="homeGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#228B22"/>
                  <stop offset="1" stopColor="#DAA425"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-title">Galle My Bungalow</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link" onClick={handleHomeClick}>Home</Link>
          <a href="#history" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('history'); }}>History</a>
          <a href="#faq" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a>
          <a href="#attractions" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('attractions'); }}>Attractions</a>
          <a href="#contacts" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contacts'); }}>Contact</a>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <div className="auth-links">
            <button className="login-btn">Login</button>
            <button className="register-btn">Register</button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <Link to="/" className="mobile-nav-link" onClick={(e) => { 
              setIsMenuOpen(false);
              if (location.pathname === '/' || location.pathname === '/home') {
                e.preventDefault();
                scrollToTop();
              }
            }}>Home</Link>
            <a href="#history" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('history'); }}>History</a>
            <a href="#faq" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a>
            <a href="#attractions" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('attractions'); }}>Attractions</a>
            <a href="#contacts" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contacts'); }}>Contact</a>
          </nav>
          
          <div className="mobile-auth-links">
            <button className="mobile-login-btn">Login</button>
            <button className="mobile-register-btn">Register</button>
          </div>
        </div>
      )}
    </header>
  );
}

