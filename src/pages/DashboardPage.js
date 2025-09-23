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
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);
  const [hoverInfo, setHoverInfo] = useState({
    visible: false,
    kabupaten: "",
    data: {},
    position: { x: 0, y: 0 },
  });

  // Mengambil statistik total dari mockData
  const stats = getDashboardStats();

  useEffect(() => {
    // Fungsi untuk memuat data GeoJSON kabupaten dari file lokal
    const loadGeoJSON = async () => {
      try {
        setLoading(true);
        // Pastikan path file ini benar sesuai struktur proyek Anda
        const response = await fetch("/data/38 Provinsi Indonesia - Kabupaten.json");
        if (!response.ok) {
          throw new Error('File GeoJSON lokal tidak ditemukan');
        }
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error("Gagal memuat GeoJSON lokal:", error);
        // Anda bisa menambahkan fallback untuk memuat dari URL online di sini jika perlu
      } finally {
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
                <div className="stat-number">0 Tiket</div>
                <div className="stat-description">Jumlah Tiket Yang Belum Dibalas</div>
              </div>
            </div>
            <div className="stat-card yellow">
              <div className="stat-icon">📧</div>
              <div className="stat-content">
                <div className="stat-number">0 Tiket</div>
                <div className="stat-description">Jumlah Tiket Belum Selesai</div>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">0 Tiket</div>
                <div className="stat-description">Jumlah Tiket Selesai</div>
              </div>
            </div>
          </div>
          
          <div className="stats-row">
            <div className="stat-card-small blue">
              <div className="stat-icon">💻</div>
              <div className="stat-content">
                <div className="stat-number">0 Pengguna</div>
                <div className="stat-description">Jumlah Pengguna Aplikasi</div>
              </div>
            </div>
            <div className="stat-card-small green">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-number">0 Pengguna</div>
                <div className="stat-description">Jumlah Anggota Muhammadiyah</div>
              </div>
            </div>
            <div className="stat-card-small gray">
              <div className="stat-icon">📄</div>
              <div className="stat-content">
                <div className="stat-number">0 Artikel</div>
                <div className="stat-description">Jumlah Artikel Dipost</div>
              </div>
            </div>
            <div className="stat-card-small brown">
              <div className="stat-icon">📄</div>
              <div className="stat-content">
                <div className="stat-number">0 Artikel</div>
                <div className="stat-description">Jumlah Rata-Rata Artikel</div>
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
                        {selectedKabupaten.data.members?.toLocaleString()}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Tiket</span>
                      <span className="stat-value">{selectedKabupaten.data.tickets}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Artikel</span>
                      <span className="stat-value">{selectedKabupaten.data.articles}</span>
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
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total Anggota</span>
                  <span className="stat-value">{stats.totalMembers.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Artikel</span>
                  <span className="stat-value">{stats.totalArticles.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Provinsi</span>
                  <span className="stat-value">{stats.totalProvinces}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;