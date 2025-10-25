import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import GeoJSONMap from '../components/GeoJSONMap';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { api } from '../services/api';
import './DashboardPage.css';

const DashboardPage = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    total_users: 0,
    total_articles: 0,
    total_tickets: 0,
    total_villages: 0,
    ticket_stats: {
      unread: 0,
      read: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      total: 0
    },
  });
  const [villagesData, setVillagesData] = useState([]);
  const [hoverInfo, setHoverInfo] = useState({
    visible: false,
    village: "",
    data: {},
    position: { x: 0, y: 0 },
  });

  useEffect(() => {
    fetchDashboardStats();
    fetchVillagesWithStats();
    loadGeoJSON();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.getDashboardStats();
      
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchVillagesWithStats = async () => {
    try {
      const response = await api.getVillagesWithStats();
      
      if (response.success) {
        setVillagesData(response.data);
      }
    } catch (error) {
      console.error('Error fetching villages:', error);
    }
  };

  const loadGeoJSON = async () => {
    try {
      setLoading(true);
      
      setTimeout(async () => {
        try {
          const response = await fetch("/data/38 Provinsi Indonesia - Kabupaten.json");
          if (!response.ok) {
            throw new Error('File GeoJSON tidak ditemukan');
          }
          const data = await response.json();
          setGeoJsonData(data);
        } catch (error) {
          console.error("Gagal memuat GeoJSON:", error);
          setGeoJsonData({
            type: "FeatureCollection",
            features: []
          });
        } finally {
          setLoading(false);
        }
      }, 800);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleVillageClick = (villageName, data) => {
    const village = villagesData.find(v => 
      villageName.toLowerCase().includes(v.name.toLowerCase()) ||
      v.name.toLowerCase().includes(villageName.toLowerCase())
    );
    
    setSelectedVillage({ 
      name: villageName, 
      data: village || { members: 0, tickets: 0, articles: 0, appUsers: 0 }
    });
  };

  const handleVillageHover = (villageName, data, event) => {
    const containerPoint = event.containerPoint;
    
    const village = villagesData.find(v => 
      villageName.toLowerCase().includes(v.name.toLowerCase()) ||
      v.name.toLowerCase().includes(villageName.toLowerCase())
    );
    
    setHoverInfo({
      visible: true,
      village: villageName,
      data: village || { members: 0, tickets: 0, articles: 0, appUsers: 0 },
      position: { x: containerPoint.x + 10, y: containerPoint.y - 10 },
    });
  };

  const handleMouseLeave = () => {
    setHoverInfo((prev) => ({ ...prev, visible: false }));
  };

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1 className="page-title">Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '0.95em' }}>
            Sistem Informasi Anggota Muhammadiyah
          </p>
        </div>

        {/* Main Stats Cards - Combined */}
        <div className="stats-section">
          <div className="stats-row">
            <div className="stat-card blue">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Total Anggota</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{dashboardStats.total_users.toLocaleString()}</div>
                    <div className="stat-description">Total Anggota Terdaftar</div>
                  </>
                )}
              </div>
            </div>
            <div className="stat-card red">
              <div className="stat-icon">🔴</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Tiket Belum Dibaca</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{dashboardStats.ticket_stats.unread} Tiket</div>
                    <div className="stat-description">Tiket Belum Dibaca</div>
                  </>
                )}
              </div>
            </div>
            <div className="stat-card yellow">
              <div className="stat-icon">👁️</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Tiket Sudah Dibaca</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{dashboardStats.ticket_stats.read} Tiket</div>
                    <div className="stat-description">Tiket Sudah Dibaca</div>
                  </>
                )}
              </div>
            </div>
            <div className="stat-card blue">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Tiket Diproses</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{dashboardStats.ticket_stats.in_progress} Tiket</div>
                    <div className="stat-description">Tiket Diproses</div>
                  </>
                )}
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Tiket Selesai</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{dashboardStats.ticket_stats.resolved} Tiket</div>
                    <div className="stat-description">Tiket Selesai</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map and Info Panel */}
        <div className="dashboard-content">
          <div className="map-section" onMouseLeave={handleMouseLeave}>
            <div className="map-card">
              <h2 className="map-title">Peta Sebaran Anggota</h2>
              <div className="map-container-wrapper">
                {loading ? (
                  <LoadingSkeleton />
                ) : geoJsonData ? (
                  <GeoJSONMap
                    geoJsonData={geoJsonData}
                    onKabupatenClick={handleVillageClick}
                    onKabupatenHover={handleVillageHover}
                  />
                ) : (
                  <div className="map-error">
                    <p>Gagal memuat data peta.</p>
                  </div>
                )}
                
                {hoverInfo.visible && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${hoverInfo.position.x}px`,
                      top: `${hoverInfo.position.y}px`,
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      minWidth: '200px',
                      zIndex: 1000,
                      pointerEvents: 'none'
                    }}
                  >
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1em', fontWeight: '600' }}>
                      {hoverInfo.village}
                    </h4>
                    <div style={{ fontSize: '0.9em' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                        <span style={{ color: '#6b7280' }}>Anggota:</span>
                        <strong>{hoverInfo.data.members || 0}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                        <span style={{ color: '#6b7280' }}>Tiket:</span>
                        <strong>{hoverInfo.data.tickets || 0}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                        <span style={{ color: '#6b7280' }}>Artikel:</span>
                        <strong>{hoverInfo.data.articles || 0}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span style={{ color: '#6b7280' }}>Pengguna App:</span>
                        <strong>{hoverInfo.data.appUsers || 0}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="info-panel">
            <div className="info-card">
              {selectedVillage ? (
                <div>
                  <h3 className="info-card-title">{selectedVillage.name}</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Anggota</span>
                      <span className="stat-value">{selectedVillage.data.members?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Tiket</span>
                      <span className="stat-value">{selectedVillage.data.tickets || '0'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Artikel</span>
                      <span className="stat-value">{selectedVillage.data.articles || '0'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Pengguna App</span>
                      <span className="stat-value">{selectedVillage.data.appUsers || '0'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="placeholder-content">
                  <h3 className="info-card-title">Pilih Daerah</h3>
                  <p className="placeholder-text">
                    Klik pada salah satu daerah di peta untuk melihat detail statistik.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;