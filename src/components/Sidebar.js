import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [ticketSubmenuOpen, setTicketSubmenuOpen] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    },
    {
      name: 'Pengguna',
      icon: '👥',
      path: '/pengguna',
      hasSubmenu: true,
      submenu: [
        { name: 'Kategori', icon: '📱', path: '/pengguna/mobile-app' },
        { name: 'Tiket', icon: '👤', path: '/pengguna/anggota-mu' }
      ]
    },
    // {
    //   name: 'Pengguna',
    //   icon: '👥',
    //   path: '/pengguna',
    //   hasSubmenu: true,
    //   submenu: []
    // },
    // {
    //   name: 'Mobile App',
    //   icon: '📱',
    //   path: '/mobile-app'
    // },
    // {
    //   name: 'Anggota MU',
    //   icon: '👤',
    //   path: '/anggota-mu'
    // },
    {
      name: 'Bidang',
      icon: '🏢',
      path: '/bidang'
    },
    {
      name: 'Tiket',
      icon: '🎫',
      path: '/tiket',
      hasSubmenu: true,
      submenu: [
        { name: 'Kategori', icon: '📝', path: '/tiket/kategori' },
        { name: 'Tiket', icon: '🎫', path: '/tiket/list' }
      ]
    },
    {
      name: 'Artikel',
      icon: '📄',
      path: '/artikel'
    }
  ];

  const handleItemClick = (item) => {
    setActiveItem(item.name);
    if (item.name === 'Tiket') {
      setTicketSubmenuOpen(!ticketSubmenuOpen);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item-wrapper">
            <div 
              className={`menu-item ${activeItem === item.name ? 'active' : ''}`}
              onClick={() => handleItemClick(item)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
              {item.hasSubmenu && (
                <span className={`submenu-arrow ${item.name === 'Tiket' && ticketSubmenuOpen ? 'open' : ''}`}>
                  ▼
                </span>
              )}
            </div>
            
            {item.name === 'Tiket' && ticketSubmenuOpen && (
              <div className="submenu">
                {item.submenu.map((subItem, subIndex) => (
                  <div 
                    key={subIndex}
                    className={`submenu-item ${activeItem === subItem.name ? 'active' : ''}`}
                    onClick={() => setActiveItem(subItem.name)}
                  >
                    <span className="submenu-icon">{subItem.icon}</span>
                    <span className="submenu-text">{subItem.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;