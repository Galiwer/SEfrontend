import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import './PublicLayout.css';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <PublicHeader />
      <main className="public-main">
        <Outlet />
      </main>
      <footer className="public-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Galle My Bungalow</h3>
              <p>Experience luxury beachfront living in the heart of Galle, Sri Lanka.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/history">History</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <p>📍 Galle Fort, Sri Lanka</p>
              <p>📞 +94 91 223 4567</p>
              <p>✉️ info@gallemybungalow.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Galle My Bungalow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
