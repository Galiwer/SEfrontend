import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Check URL parameters to open popups
  useEffect(() => {
    const registerParam = searchParams.get('register');
    const loginParam = searchParams.get('login');
    
    if (registerParam === 'true') {
      setIsRegisterOpen(true);
      // Clean up URL
      setSearchParams({});
    } else if (loginParam === 'true') {
      setIsLoginOpen(true);
      // Clean up URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

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
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#homeGradientLoading)"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="homeGradientLoading" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#228B22"/>
                    <stop offset="1" stopColor="#DAA425"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-title">Galle My Bungalow</span>
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
        <Link to="/" className="logo" onClick={handleHomeClick}>
          <div className="logo-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <h1>Galle My Bungalow</h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link" onClick={handleHomeClick}>Home</Link>
          <a href="#history" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('history'); }}>History</a>
          <a href="#gallery" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}>Gallery</a>
          <a href="#reviews" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }}>Reviews</a>
          <a href="#faq" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a>
          <a href="#attractions" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('attractions'); }}>Attractions</a>
          <a href="#contacts" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contacts'); }}>Contact</a>
          
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
            <Link to="/" className="mobile-nav-link" onClick={(e) => { 
              setIsMenuOpen(false);
              if (location.pathname === '/' || location.pathname === '/home') {
                e.preventDefault();
                scrollToTop();
              }
            }}>Home</Link>
            <a href="#history" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('history'); }}>History</a>
            <a href="#gallery" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}>Gallery</a>
            <a href="#reviews" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }}>Reviews</a>
            <a href="#faq" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a>
            <a href="#attractions" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('attractions'); }}>Attractions</a>
            <a href="#contacts" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contacts'); }}>Contact</a>
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
      <LoginPopup 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      
      {/* Register Popup */}
      <RegisterPopup 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </header>
  );
}
