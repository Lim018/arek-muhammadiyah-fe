import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="layout">
      <Navbar onToggleSidebar={toggleSidebar} />
      
      <div className="layout-body">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;