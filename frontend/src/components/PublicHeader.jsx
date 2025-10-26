import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginPopup from './LoginPopup';
import RegisterPopup from './RegisterPopup';
import './PublicHeader.css';

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { user, logout, isAdmin, isCustomer, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Show loading state while auth is being checked
  if (loading) {
    return (
      <header className="public-header">
        <div className="header-container">
          <div className="logo">
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
          </div>
          <div className="loading-spinner">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="public-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="url(#gradient)"/>
              <path d="M10 15h20v15H10V15z" fill="white" opacity="0.9"/>
              <path d="M12 17h16v2H12v-2z" fill="url(#gradient)"/>
              <path d="M12 21h16v2H12v-2z" fill="url(#gradient)"/>
              <path d="M12 25h10v2H12v-2z" fill="url(#gradient)"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#228B22"/>
                  <stop offset="1" stopColor="#DAA425"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="logo-text">
            <h1>Galle My Bungalow</h1>
            <p>Luxury Beachfront Experience</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/history" className="nav-link">History</Link>
          <Link to="/gallery" className="nav-link">Gallery</Link>
          <Link to="/reviews" className="nav-link">Reviews</Link>
          <Link to="/faq" className="nav-link">FAQ</Link>
          <Link to="/attractions" className="nav-link">Attractions</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          
          {isCustomer() && (
            <>
              <Link to="/reservations" className="nav-link">My Reservations</Link>
              <Link to="/dashboard/add-review" className="nav-link">Add Review</Link>
            </>
          )}
          {isAdmin() && <Link to="/admin/employees" className="nav-link admin-link">Admin</Link>}
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">
                Welcome, {isCustomer() ? 
                  `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 
                  user.username || user.email
                }
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <button onClick={() => setIsLoginOpen(true)} className="login-btn">Login</button>
              <button onClick={() => setIsRegisterOpen(true)} className="register-btn">Register</button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
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
            <Link to="/reviews" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Reviews</Link>
            {isCustomer() && (
              <>
                <Link to="/reservations" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>My Reservations</Link>
                <Link to="/dashboard/add-review" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Add Review</Link>
              </>
            )}
            {isAdmin() && <Link to="/admin/employees" className="mobile-nav-link admin-link" onClick={() => setIsMenuOpen(false)}>Admin</Link>}
          </nav>
          
          {user ? (
            <div className="mobile-user-menu">
              <span className="mobile-user-greeting">
                Welcome, {isCustomer() ? `${user.firstName} ${user.lastName}` : user.username}
              </span>
              <button onClick={handleLogout} className="mobile-logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="mobile-auth-links">
              <button onClick={() => {setIsLoginOpen(true); setIsMenuOpen(false);}} className="mobile-login-btn">Login</button>
              <button className="mobile-register-btn" onClick={() => { setIsRegisterOpen(true); setIsMenuOpen(false); }}>Register</button>
            </div>
          )}
        </div>
      )}
      
      {/* Login Popup */}
      <LoginPopup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      
      {/* Register Popup */}
      <RegisterPopup isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </header>
  );
}
