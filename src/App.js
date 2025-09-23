import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DashboardPage from './pages/DashboardPage';
import MobileAppPage from './pages/MobileAppPage';
import AnggotaMUPage from './pages/AnggotaMUPage';
import BidangPage from './pages/BidangPage';
import KategoriTiketPage from './pages/KategoriTiketPage';
import TiketPage from './pages/TiketPage';
import ArtikelPage from './pages/ArtikelPage';
import 'leaflet/dist/leaflet.css';

// Fix untuk marker icons Leaflet
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
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pengguna/mobile-app" element={<MobileAppPage />} />
          <Route path="/pengguna/anggota-mu" element={<AnggotaMUPage />} />
          <Route path="/bidang" element={<BidangPage />} />
          <Route path="/tiket/kategori" element={<KategoriTiketPage />} />
          <Route path="/tiket/list" element={<TiketPage />} />
          <Route path="/artikel" element={<ArtikelPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;