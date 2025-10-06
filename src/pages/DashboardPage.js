import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import GeoJSONMap from '../components/GeoJSONMap';
import InfoWindow from '../components/InfoWindow';
import LoadingSkeleton from '../components/LoadingSkeleton';
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
    card_status_stats: {
      pending: 0,
      approved: 0,
      printed: 0,
      delivered: 0
    }
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
      
      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token');
      // const response = await fetch('http://localhost:3000/api/dashboard/stats', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();
      // setDashboardStats(data.data);
      
      // Dummy data sesuai struktur database
      setTimeout(() => {
        setDashboardStats({
          total_users: 15,
          total_articles: 7,
          total_tickets: 10,
          total_villages: 8,
          ticket_stats: {
            unread: 3,
            read: 2,
            in_progress: 3,
            resolved: 2,
            closed: 0,
            total: 10
          },
          card_status_stats: {
            pending: 4,
            approved: 3,
            printed: 3,
            delivered: 5
          }
        });
        setStatsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStatsLoading(false);
    }
  };

  const fetchVillagesWithStats = async () => {
    try {
      // TODO: Replace with actual API call
      // Endpoint baru yang mengembalikan villages dengan stats lengkap
      // const response = await fetch('http://localhost:3000/api/villages/stats');
      // const data = await response.json();
      // setVillagesData(data.data);
      
      // Dummy data villages dengan stats anggota, tiket, artikel per village
      setTimeout(() => {
        setVillagesData([
          { 
            id: 1, 
            name: 'Surabaya', 
            code: 'SBY-GBG-001', 
            color: '#3B82F6',
            members: 3,
            tickets: 2,
            articles: 2,
            appUsers: 2
          },
          { 
            id: 2, 
            name: 'Gresik', 
            code: 'SBY-ARL-002', 
            color: '#8B5CF6',
            members: 2,
            tickets: 1,
            articles: 2,
            appUsers: 1
          },
          { 
            id: 3, 
            name: 'Wonokromo', 
            code: 'SBY-WNK-003', 
            color: '#10B981',
            members: 2,
            tickets: 2,
            articles: 1,
            appUsers: 1
          },
          { 
            id: 4, 
            name: 'Sawahan', 
            code: 'SBY-SWH-004', 
            color: '#F59E0B',
            members: 2,
            tickets: 2,
            articles: 0,
            appUsers: 1
          },
          { 
            id: 5, 
            name: 'Genteng', 
            code: 'SBY-GTG-005', 
            color: '#EF4444',
            members: 2,
            tickets: 1,
            articles: 1,
            appUsers: 1
          },
          { 
            id: 6, 
            name: 'Tambaksari', 
            code: 'SBY-TBS-006', 
            color: '#06B6D4',
            members: 2,
            tickets: 1,
            articles: 0,
            appUsers: 1
          },
          { 
            id: 7, 
            name: 'Semampir', 
            code: 'SBY-SMP-007', 
            color: '#EC4899',
            members: 1,
            tickets: 1,
            articles: 0,
            appUsers: 1
          },
          { 
            id: 8, 
            name: 'Pabean Cantian', 
            code: 'SBY-PBC-008', 
            color: '#84CC16',
            members: 1,
            tickets: 0,
            articles: 1,
            appUsers: 0
          },
        ]);
      }, 800);
    } catch (error) {
      console.error('Error fetching villages:', error);
    }
  };

  const loadGeoJSON = async () => {
    try {
      setLoading(true);
      
      setTimeout(async () => {
        try {
          // Load GeoJSON untuk peta Indonesia atau Surabaya
          const response = await fetch("/data/38 Provinsi Indonesia - Kabupaten.json");
          if (!response.ok) {
            throw new Error('File GeoJSON tidak ditemukan');
          }
          const data = await response.json();
          setGeoJsonData(data);
        } catch (error) {
          console.error("Gagal memuat GeoJSON:", error);
          // Fallback data
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
    // Cari data village yang sesuai dari villagesData
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
    
    // Cari data village yang sesuai
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

        {/* Main Stats Cards - Ticket Status */}
        <div className="stats-section">
          <div className="stats-row">
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
          
          {/* Secondary Stats - General Information */}
          <div className="stats-row">
            <div className="stat-card-small blue">
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
            <div className="stat-card-small green">
              <div className="stat-icon">📱</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Pengguna Mobile</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{dashboardStats.card_status_stats.delivered}</div>
                    <div className="stat-description">Kartu Terkirim</div>
                  </>
                )}
              </div>
            </div>
            <div className="stat-card-small gray">
              <div className="stat-icon">📄</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Total Artikel</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{dashboardStats.total_articles}</div>
                    <div className="stat-description">Artikel Terpublikasi</div>
                  </>
                )}
              </div>
            </div>
            <div className="stat-card-small brown">
              <div className="stat-icon">🏘️</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Total Kelurahan</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{dashboardStats.total_villages}</div>
                    <div className="stat-description">Kelurahan Aktif</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Map Section */}
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
                    <p>Gagal memuat data peta. Periksa file GeoJSON di folder public/data/</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.location.reload()}
                      style={{ marginTop: '10px', padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Coba Lagi
                    </button>
                  </div>
                )}
                
                {/* Info Window with Village Stats */}
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
                    <h4 style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '1em',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      {hoverInfo.village}
                    </h4>
                    <div style={{ fontSize: '0.9em' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '4px 0',
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        <span style={{ color: '#6b7280' }}>Anggota:</span>
                        <strong>{hoverInfo.data.members || 0}</strong>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '4px 0',
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        <span style={{ color: '#6b7280' }}>Tiket:</span>
                        <strong>{hoverInfo.data.tickets || 0}</strong>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '4px 0',
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        <span style={{ color: '#6b7280' }}>Artikel:</span>
                        <strong>{hoverInfo.data.articles || 0}</strong>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '4px 0'
                      }}>
                        <span style={{ color: '#6b7280' }}>Pengguna App:</span>
                        <strong>{hoverInfo.data.appUsers || 0}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Info Panel */}
          <div className="info-panel">
            {/* Selected Village Details */}
            <div className="info-card">
              {selectedVillage ? (
                <div>
                  <h3 className="info-card-title">{selectedVillage.name}</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Anggota</span>
                      <span className="stat-value">
                        {selectedVillage.data.members?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Tiket</span>
                      <span className="stat-value">
                        {selectedVillage.data.tickets || '0'}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Artikel</span>
                      <span className="stat-value">
                        {selectedVillage.data.articles || '0'}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Pengguna App</span>
                      <span className="stat-value">
                        {selectedVillage.data.appUsers || '0'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="placeholder-content">
                  <h3 className="info-card-title">Pilih Daerah</h3>
                  <p className="placeholder-text">
                    Klik pada salah satu daerah di peta untuk melihat detail statistik anggota, tiket, dan artikel.
                  </p>
                </div>
              )}
            </div>
            
            {/* Overall Statistics */}
            <div className="info-card">
              <h3 className="info-card-title">Statistik Keseluruhan</h3>
              {statsLoading ? (
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total Anggota</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Tiket</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Artikel</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Kelurahan</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                </div>
              ) : (
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total Anggota</span>
                    <span className="stat-value">{dashboardStats.total_users.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Tiket</span>
                    <span className="stat-value">{dashboardStats.total_tickets.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Artikel</span>
                    <span className="stat-value">{dashboardStats.total_articles.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Kelurahan</span>
                    <span className="stat-value">{dashboardStats.total_villages}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card Status Statistics */}
            <div className="info-card">
              <h3 className="info-card-title">Status Kartu Anggota</h3>
              {statsLoading ? (
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Pending</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Approved</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Printed</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Delivered</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                </div>
              ) : (
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Pending</span>
                    <span className="stat-value" style={{color: '#f59e0b'}}>
                      {dashboardStats.card_status_stats.pending}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Approved</span>
                    <span className="stat-value" style={{color: '#3b82f6'}}>
                      {dashboardStats.card_status_stats.approved}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Printed</span>
                    <span className="stat-value" style={{color: '#8b5cf6'}}>
                      {dashboardStats.card_status_stats.printed}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Delivered</span>
                    <span className="stat-value" style={{color: '#10b981'}}>
                      {dashboardStats.card_status_stats.delivered}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Ticket Status Summary */}
            <div className="info-card">
              <h3 className="info-card-title">Ringkasan Tiket</h3>
              {statsLoading ? (
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Belum Dibaca</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Diproses</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Selesai</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                </div>
              ) : (
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Belum Dibaca</span>
                    <span className="stat-value" style={{color: '#ef4444'}}>
                      {dashboardStats.ticket_stats.unread}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Diproses</span>
                    <span className="stat-value" style={{color: '#3b82f6'}}>
                      {dashboardStats.ticket_stats.in_progress}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Selesai</span>
                    <span className="stat-value" style={{color: '#10b981'}}>
                      {dashboardStats.ticket_stats.resolved}
                    </span>
                  </div>
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