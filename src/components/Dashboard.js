// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import GeoJSONMap from "./GeoJSONMap";
import InfoWindow from "./InfoWindow";
import LoadingSkeleton from "./LoadingSkeleton";
import { getDashboardStats, legendData } from "../data/mockData";

const Dashboard = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [hoverInfo, setHoverInfo] = useState({
    visible: false,
    province: "",
    data: {},
    position: { x: 0, y: 0 },
  });

  // Get dashboard statistics
  const stats = getDashboardStats();

  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        setLoading(true);

        // Load dari file lokal
        const response = await fetch("/data/indonesia.geojson");
        if (!response.ok) {
          throw new Error('Local file not found');
        }
        const data = await response.json();

        setGeoJsonData(data);
      } catch (error) {
        console.error("Error loading local GeoJSON:", error);

        // Fallback ke data online jika file lokal gagal
        try {
          const response = await fetch(
            "https://raw.githubusercontent.com/ardian28/GeoJson-Indonesia-38-Provinsi/main/indonesia.geojson"
          );
          if (!response.ok) {
            throw new Error('Online file not found');
          }
          const data = await response.json();
          setGeoJsonData(data);
        } catch (onlineError) {
          console.error("Error loading online GeoJSON:", onlineError);
          
          // Sebagai fallback terakhir, gunakan sample data
          const sampleData = {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {
                  "PROVINSI": "JAWA TIMUR"
                },
                "geometry": {
                  "type": "Polygon",
                  "coordinates": [[[112.0, -8.5], [114.5, -8.5], [114.5, -6.5], [112.0, -6.5], [112.0, -8.5]]]
                }
              }
            ]
          };
          setGeoJsonData(sampleData);
        }
      } finally {
        setLoading(false);
      }
    };

    loadGeoJSON();
  }, []);

  const handleProvinceClick = (province, data) => {
    setSelectedProvince({ name: province, data });
    console.log('Province clicked:', province, data);
  };

  const handleProvinceHover = (province, data, event) => {
    const containerPoint = event.containerPoint;
    setHoverInfo({
      visible: true,
      province,
      data,
      position: { x: containerPoint.x + 10, y: containerPoint.y - 10 },
    });
  };

  const handleMouseLeave = () => {
    setHoverInfo((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="dashboard">
      <style>{`
        .dashboard {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background-color: #f5f7fa;
          min-height: 100vh;
          padding: 20px;
        }

        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 30px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }

        .header p {
          margin: 5px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border: 1px solid #e1e8ed;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .stat-icon.red { background: #fee2e2; color: #dc2626; }
        .stat-icon.yellow { background: #fef3c7; color: #d97706; }
        .stat-icon.green { background: #dcfce7; color: #16a34a; }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .stat-label {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        .main-content {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
        }

        .map-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border: 1px solid #e1e8ed;
          overflow: hidden;
        }

        .map-header {
          padding: 20px 25px;
          border-bottom: 1px solid #e1e8ed;
          background: #fafbfc;
        }

        .map-header h2 {
          margin: 0;
          font-size: 20px;
          color: #1f2937;
        }

        .map-container {
          height: 500px;
          width: 100%;
          position: relative;
        }

        .loading-skeleton {
          height: 500px;
          padding: 20px;
          background: #f8fafc;
        }

        .skeleton-header {
          height: 20px;
          background: #e2e8f0;
          border-radius: 4px;
          margin-bottom: 15px;
          animation: skeleton-loading 1.5s infinite;
        }

        .skeleton-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skeleton-line {
          height: 16px;
          background: #e2e8f0;
          border-radius: 4px;
          animation: skeleton-loading 1.5s infinite;
        }

        .skeleton-line.short {
          width: 60%;
        }

        @keyframes skeleton-loading {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .legend-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border: 1px solid #e1e8ed;
        }

        .legend-card h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #1f2937;
        }

        .legend-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
        }

        .legend-color {
          width: 20px;
          height: 16px;
          border-radius: 3px;
          border: 1px solid #e1e8ed;
        }

        .selected-province {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border: 1px solid #e1e8ed;
        }

        .selected-province h3 {
          margin: 0 0 15px 0;
          color: #1f2937;
          font-size: 16px;
        }

        .province-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .province-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .province-stat:last-child {
          border-bottom: none;
        }

        .info-window {
          background: white;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border: 1px solid #e1e8ed;
          min-width: 180px;
          pointer-events: none;
        }

        .info-content h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .info-stats {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }

        .stat-label {
          color: #6b7280;
        }

        .stat-value {
          font-weight: 600;
          color: #1f2937;
        }

        .province-tooltip {
          background: rgba(0,0,0,0.8) !important;
          color: white !important;
          border: none !important;
          border-radius: 4px !important;
          font-size: 12px !important;
          padding: 4px 8px !important;
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 15px;
          border-radius: 8px;
          margin: 20px;
          border: 1px solid #fecaca;
        }

        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard {
            padding: 10px;
          }
          
          .map-container {
            height: 300px;
          }
        }
      `}</style>

      <div className="header">
        <h1>Portal Arek Muhammadiyah</h1>
        <p>Dashboard Monitoring & Analytics - {stats.totalProvinces} Provinsi</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon red">📋</div>
            <div>
              <div className="stat-number">
                {stats.totalTickets.toLocaleString()}
              </div>
              <div className="stat-label">Total Tiket</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon yellow">✉️</div>
            <div>
              <div className="stat-number">
                {stats.pendingTickets.toLocaleString()}
              </div>
              <div className="stat-label">Tiket Belum Selesai</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon green">✅</div>
            <div>
              <div className="stat-number">
                {stats.completedTickets.toLocaleString()}
              </div>
              <div className="stat-label">Tiket Selesai</div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="map-section" onMouseLeave={handleMouseLeave}>
          <div className="map-header">
            <h2>Peta Sebaran Anggota Muhammadiyah</h2>
          </div>
          {loading ? (
            <LoadingSkeleton />
          ) : geoJsonData ? (
            <div style={{ position: "relative" }}>
              <GeoJSONMap
                geoJsonData={geoJsonData}
                onProvinceClick={handleProvinceClick}
                onProvinceHover={handleProvinceHover}
              />
              <InfoWindow
                province={hoverInfo.province}
                data={hoverInfo.data}
                position={hoverInfo.position}
                visible={hoverInfo.visible}
              />
            </div>
          ) : (
            <div className="error-message">
              <strong>Error:</strong> Gagal memuat data GeoJSON. 
              Pastikan file indonesia.geojson tersedia di folder public/data/
            </div>
          )}
        </div>

        <div className="sidebar">
          <div className="legend-card">
            <h3>Legend - Jumlah Anggota</h3>
            <div className="legend-items">
              {legendData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.range}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedProvince && (
            <div className="selected-province">
              <h3>{selectedProvince.name}</h3>
              <div className="province-stats">
                <div className="province-stat">
                  <span>Anggota</span>
                  <strong>
                    {selectedProvince.data.members?.toLocaleString()}
                  </strong>
                </div>
                <div className="province-stat">
                  <span>Tiket</span>
                  <strong>{selectedProvince.data.tickets}</strong>
                </div>
                <div className="province-stat">
                  <span>Artikel</span>
                  <strong>{selectedProvince.data.articles}</strong>
                </div>
              </div>
            </div>
          )}
          
          <div className="legend-card">
            <h3>Total Statistik</h3>
            <div className="province-stats">
              <div className="province-stat">
                <span>Total Anggota</span>
                <strong>{stats.totalMembers.toLocaleString()}</strong>
              </div>
              <div className="province-stat">
                <span>Total Artikel</span>
                <strong>{stats.totalArticles.toLocaleString()}</strong>
              </div>
              <div className="province-stat">
                <span>Rata-rata per Provinsi</span>
                <strong>{Math.floor(stats.totalMembers / stats.totalProvinces).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;