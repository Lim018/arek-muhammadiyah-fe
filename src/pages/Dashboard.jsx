import React, { useState, useEffect } from 'react';
import GeoJSONMap from '../components/GeoJSONMap';
import LoadingSkeleton from '../components/LoadingSkeleton';
import InfoWindow from '../components/InfoWindow';

function Dashboard({ token }) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [cityStatsData, setCityStatsData] = useState({});
  const [wilayahData, setWilayahData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [useDummyData, setUseDummyData] = useState(false);
  const [loadingCities, setLoadingCities] = useState({});
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
  const [hoverInfo, setHoverInfo] = useState({
    visible: false,
    cityName: "",
    cityId: "",
    data: {},
    position: { x: 0, y: 0 },
  });

  // Daftar city_id Jawa Timur
  const jawaTimurCityIds = [
    "3501", "3502", "3503", "3504", "3505", "3506", "3507", "3508", "3509", "3510",
    "3511", "3512", "3513", "3514", "3515", "3516", "3517", "3518", "3519", "3520",
    "3521", "3522", "3523", "3524", "3525", "3526", "3527", "3528", "3529",
    "3571", "3572", "3573", "3574", "3575", "3576", "3577", "3578", "3579"
  ];

  useEffect(() => {
    if (token === 'DEMO_MODE_TOKEN') {
      setUseDummyData(true);
      console.log('Demo mode detected - using dummy data');
    }
    
    if (token) {
      console.log('Dashboard mounted with token');
      fetchDashboardStats();
      loadWilayahData();
      loadGeoJSON();
      fetchAllCityStats();
    } else {
      console.error('Dashboard mounted without token');
    }
  }, [token]);

  // Fetch stats untuk satu kota
  const fetchCityStats = async (cityId) => {
    if (useDummyData) {
      return generateDummyCityStats(cityId);
    }

    if (!token || token === 'DEMO_MODE_TOKEN') {
      return null;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/stats/${cityId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        console.error(`Unauthorized for city ${cityId}`);
        return null;
      }

      if (!response.ok) {
        console.error(`Failed to fetch stats for city ${cityId}: ${response.status}`);
        return null;
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching stats for city ${cityId}:`, error);
      return null;
    }
  };

  // Fetch stats untuk semua kota
  const fetchAllCityStats = async () => {
    if (useDummyData) {
      const dummyData = {};
      jawaTimurCityIds.forEach(cityId => {
        dummyData[cityId] = generateDummyCityStats(cityId);
      });
      setCityStatsData(dummyData);
      return;
    }

    console.log('Fetching stats for all Jawa Timur cities...');
    const statsPromises = jawaTimurCityIds.map(cityId => fetchCityStats(cityId));
    
    try {
      const results = await Promise.all(statsPromises);
      const statsMap = {};
      
      results.forEach((data, index) => {
        if (data) {
          statsMap[jawaTimurCityIds[index]] = data;
        }
      });
      
      setCityStatsData(statsMap);
      console.log('City stats loaded:', Object.keys(statsMap).length, 'cities');
    } catch (error) {
      console.error('Error fetching all city stats:', error);
    }
  };

  // Generate dummy data untuk testing
  const generateDummyCityStats = (cityId) => {
    const baseUsers = parseInt(cityId.slice(-2)) * 10 + 100;
    const baseTickets = Math.floor(baseUsers / 20);
    
    return {
      city_id: cityId,
      total_users: baseUsers,
      ticket_stats: {
        unread: Math.floor(baseTickets * 0.2),
        read: Math.floor(baseTickets * 0.15),
        in_progress: Math.floor(baseTickets * 0.3),
        resolved: Math.floor(baseTickets * 0.3),
        closed: Math.floor(baseTickets * 0.05),
        total: baseTickets
      }
    };
  };

  const fetchDashboardStats = async () => {
    if (useDummyData) {
      setStatsLoading(true);
      setTimeout(() => {
        setDashboardStats({
          total_users: 3250,
          total_articles: 125,
          total_tickets: 245,
          total_villages: 38,
          ticket_stats: {
            unread: 28,
            read: 15,
            in_progress: 42,
            resolved: 145,
            closed: 15,
            total: 245
          }
        });
        setStatsLoading(false);
      }, 500);
      return;
    }

    if (!token || token === 'DEMO_MODE_TOKEN') {
      console.error('No valid token available');
      setStatsLoading(false);
      return;
    }

    try {
      setStatsLoading(true);
      console.log('Fetching dashboard stats...');
      
      const response = await fetch('http://localhost:8080/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Dashboard stats response status:', response.status);
      
      if (response.status === 401) {
        console.error('Unauthorized - Token may be invalid');
        setStatsLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Dashboard stats data:', data);
      
      if (data.success) {
        setDashboardStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadWilayahData = async () => {
    try {
      const response = await fetch("/data/wilayah.json");
      if (response.ok) {
        const data = await response.json();
        setWilayahData(data);
        console.log('Wilayah data loaded:', data.length, 'cities');
      } else {
        console.warn('wilayah.json not found');
      }
    } catch (error) {
      console.warn('Error loading wilayah.json:', error);
    }
  };

  const loadGeoJSON = async () => {
    try {
      setLoading(true);
      
      setTimeout(async () => {
        try {
          const response = await fetch("/data/Kabupaten.json");
          if (!response.ok) {
            throw new Error('File GeoJSON tidak ditemukan');
          }
          const data = await response.json();
          setGeoJsonData(data);
          console.log('GeoJSON loaded successfully');
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

  const handleCityClick = async (cityName, cityId) => {
    console.log('City clicked:', cityName, cityId);
    
    // Jika data sudah ada di cityStatsData, gunakan itu
    if (cityStatsData[cityId]) {
      setSelectedCity({ 
        name: cityName,
        id: cityId,
        data: cityStatsData[cityId]
      });
      return;
    }

    // Jika belum ada, fetch on-demand
    setLoadingCities(prev => ({ ...prev, [cityId]: true }));
    const data = await fetchCityStats(cityId);
    setLoadingCities(prev => ({ ...prev, [cityId]: false }));
    
    if (data) {
      // Simpan ke cityStatsData
      setCityStatsData(prev => ({ ...prev, [cityId]: data }));
      
      setSelectedCity({ 
        name: cityName,
        id: cityId,
        data: data
      });
    } else {
      setSelectedCity({ 
        name: cityName,
        id: cityId,
        data: {
          total_users: 0,
          ticket_stats: {
            unread: 0,
            read: 0,
            in_progress: 0,
            resolved: 0,
            closed: 0,
            total: 0
          }
        }
      });
    }
  };

  const handleCityHover = (cityName, cityId, cityData, event) => {
    const containerPoint = event.containerPoint;
    
    setHoverInfo({
      visible: true,
      cityName: cityName,
      cityId: cityId,
      data: cityData || {
        total_users: 0,
        ticket_stats: { total: 0 }
      },
      position: { x: containerPoint.x + 10, y: containerPoint.y - 10 },
    });
  };

  const handleMouseLeave = () => {
    setHoverInfo((prev) => ({ ...prev, visible: false }));
  };

  const toggleDataMode = () => {
    const newMode = !useDummyData;
    setUseDummyData(newMode);
    
    // Reset data dan fetch ulang
    setCityStatsData({});
    setSelectedCity(null);
    
    if (newMode) {
      // Switch ke dummy mode
      setTimeout(() => {
        fetchDashboardStats();
        fetchAllCityStats();
      }, 100);
    } else {
      // Switch ke real API mode
      if (token && token !== 'DEMO_MODE_TOKEN') {
        setTimeout(() => {
          fetchDashboardStats();
          fetchAllCityStats();
        }, 100);
      } else {
        alert('Tidak ada token valid. Silakan login terlebih dahulu atau tetap gunakan Mode Demo.');
        setUseDummyData(true);
      }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Dashboard Jawa Timur</h1>
            <p style={{ color: '#6b7280', fontSize: '0.95em', marginTop: '8px' }}>
              Sistem Informasi Anggota Muhammadiyah - Provinsi Jawa Timur
            </p>
          </div>
          <button 
            onClick={toggleDataMode}
            style={{
              padding: '10px 20px',
              background: useDummyData ? '#10b981' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {useDummyData ? '🟢 Mode Demo' : '🔵 Mode Real API'}
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="stats-grid" style={{ marginTop: '24px' }}>
        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <h3>Total Anggota</h3>
          <div className="stat-value">
            {statsLoading ? 'Memuat...' : dashboardStats.total_users.toLocaleString()}
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
            Anggota Terdaftar
          </p>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#dc2626' }}>
          <h3>Tiket Belum Dibaca</h3>
          <div className="stat-value" style={{ color: '#dc2626' }}>
            {statsLoading ? 'Memuat...' : dashboardStats.ticket_stats.unread}
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
            Perlu Perhatian
          </p>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <h3>Tiket Sudah Dibaca</h3>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {statsLoading ? 'Memuat...' : dashboardStats.ticket_stats.read}
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
            Menunggu Tindakan
          </p>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <h3>Tiket Diproses</h3>
          <div className="stat-value" style={{ color: '#3b82f6' }}>
            {statsLoading ? 'Memuat...' : dashboardStats.ticket_stats.in_progress}
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
            Sedang Ditangani
          </p>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <h3>Tiket Selesai</h3>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {statsLoading ? 'Memuat...' : dashboardStats.ticket_stats.resolved}
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
            Terselesaikan
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section" onMouseLeave={handleMouseLeave}>
        <h3>Peta Sebaran Anggota Jawa Timur</h3>
        <div className="map-container">
          {loading ? (
            <LoadingSkeleton />
          ) : geoJsonData ? (
            <GeoJSONMap
              geoJsonData={geoJsonData}
              cityStatsData={cityStatsData}
              wilayahData={wilayahData}
              onCityClick={handleCityClick}
              onCityHover={handleCityHover}
            />
          ) : (
            <div className="loading">Gagal memuat data peta.</div>
          )}
          
          {/* InfoWindow untuk hover */}
          <InfoWindow 
            visible={hoverInfo.visible}
            title={hoverInfo.cityName}
            data={{
              members: hoverInfo.data.total_users || 0,
              tickets: hoverInfo.data.ticket_stats?.total || 0
            }}
            position={hoverInfo.position}
          />
        </div>

        {/* City Stats Detail */}
        {selectedCity && (
          <div className="city-stats-detail">
            <h4>{selectedCity.name}</h4>
            <p style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '12px' }}>
              ID: {selectedCity.id}
            </p>
            {loadingCities[selectedCity.id] ? (
              <p style={{ color: '#6b7280' }}>Memuat data...</p>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <p>
                    <strong>Total Anggota:</strong> {selectedCity.data.total_users?.toLocaleString() || '0'}
                  </p>
                  <p>
                    <strong>Total Tiket:</strong> {selectedCity.data.ticket_stats?.total || '0'}
                  </p>
                </div>
                <div className="ticket-breakdown">
                  <span style={{ color: '#dc2626' }}>
                    Belum Dibaca: {selectedCity.data.ticket_stats?.unread || '0'}
                  </span>
                  <span style={{ color: '#f59e0b' }}>
                    Sudah Dibaca: {selectedCity.data.ticket_stats?.read || '0'}
                  </span>
                  <span style={{ color: '#3b82f6' }}>
                    Diproses: {selectedCity.data.ticket_stats?.in_progress || '0'}
                  </span>
                  <span style={{ color: '#10b981' }}>
                    Selesai: {selectedCity.data.ticket_stats?.resolved || '0'}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;