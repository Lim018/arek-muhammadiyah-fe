import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AnggotaTerdaftar from './pages/AnggotaTerdaftar';
import PenggunaMobile from './pages/PenggunaMobile';
import Kategori from './pages/Kategori';
import Tiket from './pages/Tiket';
import Artikel from './pages/Artikel';

// Fix Leaflet icon issue
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      console.log('Token loaded:', savedToken);
    }
  }, []);

  const handleLogin = (authToken) => {
    console.log('Login - Token received:', authToken);
    
    if (authToken === 'dummy-token') {
      console.error('Received dummy token - backend tidak mengembalikan token valid');
      alert('Login gagal: Backend tidak mengembalikan token yang valid. Gunakan Mode Demo untuk testing.');
      return;
    }
    
    setToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', authToken);
  };

  const handleLogout = () => {
    setToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    setCurrentPage('dashboard');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Navbar 
        token={token} 
        onLogout={handleLogout} 
        toggleSidebar={toggleSidebar}
      />
      <div className="main-layout">
        <Sidebar 
          isOpen={sidebarOpen} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
        />
        <div className={`content-area ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          {currentPage === 'dashboard' && <Dashboard token={token} />}
          {currentPage === 'anggota-terdaftar' && <AnggotaTerdaftar token={token} />}
          {currentPage === 'pengguna-mobile' && <PenggunaMobile token={token} />}
          {currentPage === 'kategori' && <Kategori token={token} />}
          {currentPage === 'tiket' && <Tiket token={token} />}
          {currentPage === 'artikel' && <Artikel token={token} />}
        </div>
      </div>
    </div>
  );
}

export default App;