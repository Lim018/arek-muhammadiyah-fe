import React, { useState, useEffect } from 'react'; // Impor useEffect
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Smartphone, UserCheck, Building, Ticket, Tags, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();

  // TAMBAHKAN BLOK KODE INI
  // Efek ini akan berjalan setiap kali URL (lokasi) berubah.
  useEffect(() => {
    // Cari menu induk yang salah satu submenu-nya aktif berdasarkan URL saat ini.
    const activeParent = menuItems.find(item =>
      item.expandable && item.subItems.some(sub => sub.path === location.pathname)
    );

    // Jika menu induk yang aktif ditemukan, pastikan menu tersebut terbuka.
    if (activeParent) {
      // Gunakan callback di setExpandedMenus untuk memastikan kita tidak menimpa state lain
      // yang mungkin sudah diatur oleh interaksi pengguna (misalnya, membuka menu lain secara manual).
      setExpandedMenus(prev => ({
        ...prev,
        [activeParent.key]: true
      }));
    }
  }, [location]); // Dependensi: useEffect akan berjalan lagi jika 'location' berubah.

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (paths) => {
    return paths.some(path => location.pathname === path);
  };

  const menuItems = [
    { 
      key: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      path: '/dashboard'
    },
    {
      key: 'pengguna',
      label: 'Pengguna',
      icon: Users,
      expandable: true,
      subItems: [
        { key: 'mobile-app', label: 'Mobile App', icon: Smartphone, path: '/pengguna/mobile-app' },
        { key: 'anggota-mu', label: 'Anggota MU', icon: UserCheck, path: '/pengguna/anggota-mu' }
      ]
    },
    { 
      key: 'bidang', 
      label: 'Bidang', 
      icon: Building,
      path: '/bidang'
    },
    {
      key: 'tiket',
      label: 'Tiket',
      icon: Ticket,
      expandable: true,
      subItems: [
        { key: 'kategori', label: 'Kategori', icon: Tags, path: '/tiket/kategori' },
        { key: 'tiket-list', label: 'Tiket', icon: Ticket, path: '/tiket/list' }
      ]
    },
    { 
      key: 'artikel', 
      label: 'Artikel', 
      icon: FileText,
      path: '/artikel'
    }
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-nav">
            {menuItems.map((item) => (
              <div key={item.key} className="menu-group">
                {item.expandable ? (
                  <div
                    className={`menu-item ${isParentActive(item.subItems.map(sub => sub.path)) ? 'active' : ''}`}
                    onClick={() => toggleMenu(item.key)}
                  >
                    <div className="menu-item-content">
                      <item.icon size={18} className="menu-icon" />
                      <span className="menu-label">{item.label}</span>
                    </div>
                    <div className="expand-icon">
                      {expandedMenus[item.key] ? 
                        <ChevronDown size={16} /> : 
                        <ChevronRight size={16} />
                      }
                    </div>
                  </div>
                ) : (
                  <Link 
                    to={item.path} 
                    className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <div className="menu-item-content">
                      <item.icon size={18} className="menu-icon" />
                      <span className="menu-label">{item.label}</span>
                    </div>
                  </Link>
                )}
                
                {item.expandable && expandedMenus[item.key] && (
                  <div className="submenu">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.key}
                        to={subItem.path}
                        className={`submenu-item ${isActive(subItem.path) ? 'active' : ''}`}
                        onClick={onClose}
                      >
                        <subItem.icon size={16} className="submenu-icon" />
                        <span className="submenu-label">{subItem.label}</span>
                      </Link>
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