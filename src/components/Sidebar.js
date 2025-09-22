import React, { useState } from 'react';
import { Home, Users, Smartphone, UserCheck, Building, Ticket, Tags, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    { 
      key: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      active: true 
    },
    {
      key: 'pengguna',
      label: 'Pengguna',
      icon: Users,
      expandable: true,
      subItems: [
        { key: 'mobile-app', label: 'Mobile App', icon: Smartphone },
        { key: 'anggota-mu', label: 'Anggota MU', icon: UserCheck }
      ]
    },
    { 
      key: 'bidang', 
      label: 'Bidang', 
      icon: Building 
    },
    {
      key: 'tiket',
      label: 'Tiket',
      icon: Ticket,
      expandable: true,
      subItems: [
        { key: 'kategori', label: 'Kategori', icon: Tags },
        { key: 'tiket-list', label: 'Tiket', icon: Ticket }
      ]
    },
    { 
      key: 'artikel', 
      label: 'Artikel', 
      icon: FileText 
    }
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-nav">
            {menuItems.map((item) => (
              <div key={item.key} className="menu-group">
                <div
                  className={`menu-item ${item.active ? 'active' : ''}`}
                  onClick={() => item.expandable && toggleMenu(item.key)}
                >
                  <div className="menu-item-content">
                    <item.icon size={18} className="menu-icon" />
                    <span className="menu-label">{item.label}</span>
                  </div>
                  {item.expandable && (
                    <div className="expand-icon">
                      {expandedMenus[item.key] ? 
                        <ChevronDown size={16} /> : 
                        <ChevronRight size={16} />
                      }
                    </div>
                  )}
                </div>
                
                {item.expandable && expandedMenus[item.key] && (
                  <div className="submenu">
                    {item.subItems.map((subItem) => (
                      <div
                        key={subItem.key}
                        className="submenu-item"
                      >
                        <subItem.icon size={16} className="submenu-icon" />
                        <span className="submenu-label">{subItem.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;