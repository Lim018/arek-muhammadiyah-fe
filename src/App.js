// src/App.js
import React from 'react';
import './App.css';
import DashboardPage from './pages/DashboardPage';
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
    <div className="App">
      <DashboardPage />
    </div>
  );
}

export default App;