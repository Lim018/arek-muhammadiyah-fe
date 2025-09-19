import React, { useState, useEffect } from "react";
import GeoJSONMap from "./GeoJSONMap";
import InfoWindow from "./InfoWindow";
import LoadingSkeleton from "./LoadingSkeleton";
import { getDashboardStats, legendData } from "../data/mockData";

const Dashboard = () => {
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
    <div className="dashboard">
      <div className="main-content">
        <div className="map-wrapper" onMouseLeave={handleMouseLeave}>
          <div className="map-container">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <GeoJSONMap
                geoJsonData={geoJsonData}
                onKabupatenClick={handleKabupatenClick}
                onKabupatenHover={handleKabupatenHover}
              />
            )}
            <InfoWindow
              province={hoverInfo.kabupaten} // Prop 'province' digunakan kembali untuk nama kabupaten
              data={hoverInfo.data}
              position={hoverInfo.position}
              visible={hoverInfo.visible}
            />
          </div>
        </div>
        <div className="sidebar">
          {/* Menampilkan detail statistik kabupaten yang dipilih */}
          {selectedKabupaten ? (
            <div className="province-card">
              <h3>{selectedKabupaten.name}</h3>
              <div className="province-stats">
                <div className="province-stat">
                  <span>Anggota</span>
                  <strong>
                    {selectedKabupaten.data.members?.toLocaleString()}
                  </strong>
                </div>
                <div className="province-stat">
                  <span>Tiket</span>
                  <strong>{selectedKabupaten.data.tickets}</strong>
                </div>
                <div className="province-stat">
                  <span>Artikel</span>
                  <strong>{selectedKabupaten.data.articles}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="province-card placeholder">
                <h3>Pilih Kabupaten</h3>
                <p>Klik pada salah satu kabupaten di peta untuk melihat detail statistiknya.</p>
            </div>
          )}
          
          {/* Menampilkan statistik total */}
          <div className="legend-card">
            <h3>Total Statistik Nasional</h3>
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
                <span>Total Provinsi</span>
                <strong>{stats.totalProvinces}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;