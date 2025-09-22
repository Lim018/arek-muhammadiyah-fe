import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <span className="sun-icon">☀</span>
        </div>
        <span className="brand-text">Arek Muhammadiyah</span>
      </div>
      
      <div className="navbar-actions">
        <button className="notification-btn">
          <span className="bell-icon">🔔</span>
        </button>
        <button className="refresh-btn">
          <span className="refresh-icon">🔄</span>
        </button>
        <div className="user-profile">
          <span className="user-icon">👤</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;