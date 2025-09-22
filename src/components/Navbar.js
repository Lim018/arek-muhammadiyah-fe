import React from 'react';
import { Bell, User, Settings, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onToggleSidebar }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button 
          onClick={onToggleSidebar}
          className="menu-toggle"
        >
          <Menu size={20} />
        </button>
        <div className="navbar-brand">
          <div className="brand-icon">
            <span className="star-icon">★</span>
          </div>
          <span className="brand-text">Arek Muhammadiyah</span>
        </div>
      </div>
      
      <div className="navbar-actions">
        <button className="nav-btn">
          <Bell size={18} />
        </button>
        <button className="nav-btn">
          <User size={18} />
        </button>
        <button className="nav-btn">
          <Settings size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;