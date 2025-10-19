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
  const [selectedVillage, setSelectedVillage] = useState('semua');
  const [villages, setVillages] = useState([]);
  const [error, setError] = useState(null);
  
  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchVillages();
    fetchMobileUsers();
  }, []);

  const fetchVillages = async () => {
    try {
      const response = await api.getVillages();
      const villageData = response.data || response;
      setVillages(Array.isArray(villageData) ? villageData : []);
    } catch (error) {
      console.error('Error fetching villages:', error);
      setError('Gagal memuat data kelurahan');
    }
  };

  const fetchMobileUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getMobileUsers();
      
      if (response.success && response.data) {
        setUsers(response.data);
      } else if (Array.isArray(response)) {
        setUsers(response);
      } else {
        console.warn('Unexpected response format:', response);
        setUsers([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mobile users:', error);
      setError(error.message || 'Gagal memuat data pengguna mobile');
      setUsers([]);
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
      if (response.success && response.data) {
        setSelectedUser(response.data);
      } else if (response.id) { // Fallback untuk format respons yang berbeda
        setSelectedUser(response);
      }
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

  // Filter pengguna berdasarkan pencarian dan kelurahan
  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = user.name.toLowerCase().includes(searchTermLower) ||
                         user.telp?.includes(searchTerm) ||
                         user.nik?.includes(searchTerm) ||
                         user.village?.name.toLowerCase().includes(searchTermLower);
    
    const matchesVillage = selectedVillage === 'semua' || user.village_id === parseInt(selectedVillage);
    
    return matchesSearch && matchesVillage;
  });

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
              <div className="stat-number">{villages.length}</div>
              <div className="stat-description">Kelurahan</div>
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
                  placeholder="Cari berdasarkan nama, NIK, telepon, atau kelurahan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-section">
                <select
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  className="filter-select"
                >
                  <option value="semua">Semua Kelurahan</option>
                  {villages.map(village => (
                    <option key={village.id} value={village.id}>{village.name}</option>
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
                  <th>Kelurahan</th>
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
                      {error ? 'Terjadi kesalahan saat memuat data' : 'Tidak ada data yang ditemukan'}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} style={{ color: '#6b7280' }} />
                          {user.village?.name || '-'}
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