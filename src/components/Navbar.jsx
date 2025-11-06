import React, { useState, useEffect } from 'react';

function Navbar({ token, onLogout, toggleSidebar }) {
  const [userData, setUserData] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNavbarData();
  }, []);

  const fetchNavbarData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/navbar', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUserData(data.data.user);
      }
    } catch (err) {
      console.error('Error fetching navbar data:', err);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <img src="/img/logo.png" alt="Logo" className="navbar-logo" />
      </div>
      <div className="navbar-right">
        <button className="notification-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
          </svg>
        </button>
        <div className="profile-menu">
          <button 
            className="profile-btn" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">
              {userData?.name?.charAt(0) || 'U'}
            </div>
            <div className="profile-info">
              <span className="profile-name">{userData?.name || 'User'}</span>
              <span className="profile-role">{userData?.role || 'Role'}</span>
            </div>
          </button>
          {showProfileMenu && (
            <div className="profile-dropdown">
              <button onClick={handleLogout} disabled={loading}>
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;