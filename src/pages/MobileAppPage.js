import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import UserDetailModal from '../components/UserDetailModal'; // Impor komponen modal
import { Search, Smartphone, Eye, MapPin, Phone, CreditCard } from 'lucide-react';
import { api } from '../services/api';
import '../styles/CommonPages.css';

const MobileAppPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk filter wilayah (TIGA TINGKAT)
  const [selectedCity, setSelectedCity] = useState('semua');
  const [selectedDistrict, setSelectedDistrict] = useState('semua');
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]); // Districts yang ditampilkan di dropdown
  
  const [error, setError] = useState(null);
  
  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchWilayahData();
    fetchMobileUsers();
  }, []);
  
  // Efek untuk memfilter districts berdasarkan city yang dipilih
  useEffect(() => {
    filterDistrictsByCity(selectedCity);
  }, [selectedCity, districts]);

  // Fetch wilayah data dari backend (disalin dari AnggotaMUPage.js)
  const fetchWilayahData = async () => {
    try {
      const response = await api.getCities();
      const citiesData = response.data || response;
      
      if (Array.isArray(citiesData)) {
        setCities(citiesData);
        
        const allDistricts = [];
        // Kita tidak butuh Villages di sini untuk filter Mobile App, tapi kita ambil districts
        
        citiesData.forEach(city => {
          if (city.districts && Array.isArray(city.districts)) {
            city.districts.forEach(district => {
              allDistricts.push({
                ...district,
                city_id: city.id,
                city_name: city.name
              });
            });
          }
        });
        
        setDistricts(allDistricts);
      }
    } catch (error) {
      console.error('Error fetching wilayah data:', error);
      setError('Gagal memuat data wilayah');
    }
  };
  
  const filterDistrictsByCity = (cityId) => {
    if (cityId === 'semua') {
      setFilteredDistricts([]);
      setSelectedDistrict('semua');
      return;
    }
    const filtered = districts.filter(d => d.city_id === cityId);
    setFilteredDistricts(filtered);
  };

  const fetchMobileUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mengambil data pengguna mobile
      const response = await api.getMobileUsers();
      
      let usersData = [];
      if (response.data && Array.isArray(response.data)) {
        usersData = response.data;
      } else if (Array.isArray(response)) {
        usersData = response;
      } else {
        throw new Error('Format response tidak sesuai');
      }

      setUsers(usersData);
      
    } catch (error) {
      console.error('Error fetching mobile users:', error);
      setError(error.message || 'Gagal memuat data pengguna mobile');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk membuka modal dan memuat detail user
  const handleViewDetail = async (userId) => {
    setShowModal(true);
    setLoadingDetail(true);
    setSelectedUser(null);
    
    try {
      const response = await api.getUser(userId);
      // Menggunakan logika yang sudah ada di AnggotaMUPage.js
      const userData = response.data || response;
      setSelectedUser(userData);
    } catch (error) {
      console.error('Error fetching user detail:', error);
      alert('Gagal memuat detail pengguna');
      setShowModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Filter pengguna berdasarkan pencarian dan wilayah (DISESUAIKAN)
  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = user.name?.toLowerCase().includes(searchTermLower) ||
                         user.telp?.includes(searchTerm) ||
                         user.nik?.includes(searchTerm) ||
                         user.village_name?.toLowerCase().includes(searchTermLower) ||
                         user.city_name?.toLowerCase().includes(searchTermLower);
    
    // Asumsi: data user mobile juga memiliki city_id dan district_id
    const matchesCity = selectedCity === 'semua' || 
                       user.city_id === selectedCity;
    
    const matchesDistrict = selectedDistrict === 'semua' || 
                           user.district_id === selectedDistrict;
    
    return matchesSearch && matchesCity && matchesDistrict;
  });

  // Hitung total kelurahan unik yang memiliki pengguna mobile
  const uniqueVillagesCount = new Set(users.map(u => u.village_id)).size;

  return (
    <Layout>
      <div className="page-container">
        {/* Header Halaman */}
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">
              <Smartphone className="page-icon" />
              Pengguna Mobile App
            </h1>
            <p className="page-subtitle">Anggota yang menggunakan aplikasi mobile</p>
          </div>
        </div>

        {/* Notifikasi Error */}
        {error && (
          <div className="error-notification">
            {error}
          </div>
        )}

        {/* Kartu Statistik */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">📱</div>
            <div className="stat-content">
              <div className="stat-number">{users.length}</div>
              <div className="stat-description">Total Pengguna</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{users.filter(u => u.is_mobile).length}</div>
              <div className="stat-description">Akun Aktif</div>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">🏘️</div>
            <div className="stat-content">
              <div className="stat-number">{uniqueVillagesCount}</div>
              <div className="stat-description">Kelurahan Terdaftar</div>
            </div>
          </div>
        </div>

        {/* Konten Utama (Tabel) */}
        <div className="content-card">
          <div className="card-header">
            <div className="search-filter-section">
              <div className="search-box">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, NIK, telepon, atau wilayah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              {/* Filter Wilayah (DISESUAIKAN) */}
              <div className="filter-section">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="filter-select"
                >
                  <option value="semua">Semua Kabupaten/Kota</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="filter-select"
                  disabled={selectedCity === 'semua'}
                >
                  <option value="semua">Semua Kecamatan</option>
                  {filteredDistricts.map(district => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
              
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>No. Telepon</th>
                  <th>Wilayah Domisili</th>
                  <th>NIK</th>
                  <th>Alamat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="loading-cell">Memuat data...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      {error ? 'Terjadi kesalahan saat memuat data' : 'Tidak ada pengguna mobile yang ditemukan'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="user-name">
                        <strong>{user.name}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={14} style={{ color: '#6b7280' }} />
                          {user.telp || '-'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                            {user.village_name || '-'}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                            {user.district_name || '-'}, {user.city_name || '-'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <code style={{ 
                          fontSize: '0.85em', 
                          background: '#f3f4f6', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          width: 'fit-content'
                        }}>
                          <CreditCard size={12} />
                          {user.nik || '-'}
                        </code>
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <div style={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }} title={user.address}>
                          {user.address || '-'}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view" 
                            title="Lihat Detail"
                            onClick={() => handleViewDetail(user.id)}
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gunakan Komponen UserDetailModal */}
        <UserDetailModal
          isOpen={showModal}
          onClose={closeModal}
          user={selectedUser}
          loading={loadingDetail}
        />
      </div>
    </Layout>
  );
};

export default MobileAppPage;