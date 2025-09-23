import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import GeoJSONMap from '../components/GeoJSONMap';
import InfoWindow from '../components/InfoWindow';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getDashboardStats, legendData } from '../data/mockData';
import './DashboardPage.css';

const DashboardPage = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);
  const [simulatedStats, setSimulatedStats] = useState({
    tickets: {
      unread: 0,
      pending: 0,
      completed: 0
    },
    users: {
      appUsers: 0,
      members: 0
    },
    articles: {
      total: 0,
      average: 0
    }
  });
  const [hoverInfo, setHoverInfo] = useState({
    visible: false,
    kabupaten: "",
    data: {},
    position: { x: 0, y: 0 },
  });

  // Simulasi loading data statistics
  useEffect(() => {
    const loadStats = () => {
      setStatsLoading(true);
      
      // Simulasi delay loading seperti pada AnggotaMUPage
      setTimeout(() => {
        setSimulatedStats({
          tickets: {
            unread: 23,
            pending: 45,
            completed: 187
          },
          users: {
            appUsers: 1247,
            members: 8934
          },
          articles: {
            total: 156,
            average: 12
          }
        });
        setStatsLoading(false);
      }, 1000);
    };

    loadStats();
  }, []);

  // Mengambil statistik total dari mockData
  const stats = getDashboardStats();

  useEffect(() => {
    // Fungsi untuk memuat data GeoJSON kabupaten dari file lokal
    const loadGeoJSON = async () => {
      try {
        setLoading(true);
        
        // Simulasi loading delay untuk konsistensi dengan AnggotaMUPage
        setTimeout(async () => {
          try {
            // Pastikan path file ini benar sesuai struktur proyek Anda
            const response = await fetch("/data/38 Provinsi Indonesia - Kabupaten.json");
            if (!response.ok) {
              throw new Error('File GeoJSON lokal tidak ditemukan');
            }
            const data = await response.json();
            setGeoJsonData(data);
          } catch (error) {
            console.error("Gagal memuat GeoJSON lokal:", error);
            // Fallback data untuk demo jika file tidak ditemukan
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

    loadGeoJSON();
  }, []);

  // Handler saat sebuah kabupaten di-klik pada peta
  const handleKabupatenClick = (kabupaten, data) => {
    setSelectedKabupaten({ name: kabupaten, data });
  };

  // Handler saat cursor mouse berada di atas sebuah kabupaten
  const handleKabupatenHover = (kabupaten, data, event) => {
    const containerPoint = event.containerPoint;
    setHoverInfo({
      visible: true,
      kabupaten,
      data,
      position: { x: containerPoint.x + 10, y: containerPoint.y - 10 },
    });
  };

  // Handler saat cursor mouse meninggalkan area peta
  const handleMouseLeave = () => {
    setHoverInfo((prev) => ({ ...prev, visible: false }));
  };

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1 className="page-title">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stats-row">
            <div className="stat-card red">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Jumlah Tiket Yang Belum Dibalas</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{simulatedStats.tickets.unread} Tiket</div>
                    <div className="stat-description">Jumlah Tiket Yang Belum Dibalas</div>
                  </>
                )}
              </div>
            </div>
            <div className="stat-card yellow">
              <div className="stat-icon">🔧</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Jumlah Tiket Belum Selesai</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{simulatedStats.tickets.pending} Tiket</div>
                    <div className="stat-description">Jumlah Tiket Belum Selesai</div>
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
                    <div className="stat-description">Jumlah Tiket Selesai</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{simulatedStats.tickets.completed} Tiket</div>
                    <div className="stat-description">Jumlah Tiket Selesai</div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="stats-row">
            <div className="stat-card-small blue">
              <div className="stat-icon">💻</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Jumlah Pengguna Aplikasi</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{simulatedStats.users.appUsers.toLocaleString()} Pengguna</div>
                    <div className="stat-description">Jumlah Pengguna Aplikasi</div>
                  </>
                )}
              </div>
            </div>
            <div className="stat-card-small green">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Jumlah Anggota Muhammadiyah</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{simulatedStats.users.members.toLocaleString()} Anggota</div>
                    <div className="stat-description">Jumlah Anggota Muhammadiyah</div>
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
                    <div className="stat-description">Jumlah Artikel Dipost</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{simulatedStats.articles.total} Artikel</div>
                    <div className="stat-description">Jumlah Artikel Dipost</div>
                  </>
                )}
              </div>
            </div>
            <div className="stat-card-small brown">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                {statsLoading ? (
                  <>
                    <div className="stat-number">Memuat...</div>
                    <div className="stat-description">Jumlah Rata-Rata Artikel</div>
                  </>
                ) : (
                  <>
                    <div className="stat-number">{simulatedStats.articles.average} Artikel</div>
                    <div className="stat-description">Jumlah Rata-Rata Artikel Per Bulan</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="map-section" onMouseLeave={handleMouseLeave}>
            <div className="map-card">
              <h2 className="map-title">Peta Indonesia</h2>
              <div className="map-container-wrapper">
                {loading ? (
                  <LoadingSkeleton />
                ) : geoJsonData ? (
                  <GeoJSONMap
                    geoJsonData={geoJsonData}
                    onKabupatenClick={handleKabupatenClick}
                    onKabupatenHover={handleKabupatenHover}
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
                <InfoWindow
                  province={hoverInfo.kabupaten}
                  data={hoverInfo.data}
                  position={hoverInfo.position}
                  visible={hoverInfo.visible}
                />
              </div>
            </div>
          </div>
          
          <div className="info-panel">
            {/* Menampilkan detail statistik kabupaten yang dipilih */}
            <div className="info-card">
              {selectedKabupaten ? (
                <div>
                  <h3 className="info-card-title">{selectedKabupaten.name}</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Anggota</span>
                      <span className="stat-value">
                        {selectedKabupaten.data.members?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Tiket</span>
                      <span className="stat-value">{selectedKabupaten.data.tickets || '0'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Artikel</span>
                      <span className="stat-value">{selectedKabupaten.data.articles || '0'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Pengguna App</span>
                      <span className="stat-value">{selectedKabupaten.data.appUsers || '0'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="placeholder-content">
                  <h3 className="info-card-title">Pilih Kabupaten</h3>
                  <p className="placeholder-text">
                    Klik pada salah satu kabupaten di peta untuk melihat detail statistiknya.
                  </p>
                </div>
              )}
            </div>
            
            {/* Menampilkan statistik total */}
            <div className="info-card">
              <h3 className="info-card-title">Total Statistik Nasional</h3>
              {statsLoading ? (
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total Anggota</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Artikel</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Tiket</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Provinsi</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                </div>
              ) : (
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total Anggota</span>
                    <span className="stat-value">{simulatedStats.users.members.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Artikel</span>
                    <span className="stat-value">{simulatedStats.articles.total.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Tiket</span>
                    <span className="stat-value">{(simulatedStats.tickets.unread + simulatedStats.tickets.pending + simulatedStats.tickets.completed).toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Provinsi</span>
                    <span className="stat-value">34</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card tambahan untuk ringkasan tiket */}
            <div className="info-card">
              <h3 className="info-card-title">Status Tiket</h3>
              {statsLoading ? (
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Belum Dibaca</span>
                    <span className="stat-value">Memuat...</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Dalam Proses</span>
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
                    <span className="stat-value" style={{color: '#ef4444'}}>{simulatedStats.tickets.unread}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Dalam Proses</span>
                    <span className="stat-value" style={{color: '#f59e0b'}}>{simulatedStats.tickets.pending}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Selesai</span>
                    <span className="stat-value" style={{color: '#10b981'}}>{simulatedStats.tickets.completed}</span>
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