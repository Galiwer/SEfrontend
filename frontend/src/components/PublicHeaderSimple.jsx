import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PublicHeader.css';

export default function PublicHeaderSimple() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="public-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-title">Galle My Bungalow</span>
            <span className="logo-subtitle">Luxury Beachfront Living</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/history" className="nav-link">History</Link>
          <Link to="/faq" className="nav-link">FAQ</Link>
          <Link to="/attractions" className="nav-link">Attractions</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
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
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/history" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>History</Link>
            <Link to="/faq" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
            <Link to="/attractions" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Attractions</Link>
            <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
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

