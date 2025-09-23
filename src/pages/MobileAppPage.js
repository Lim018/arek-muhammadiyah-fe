import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, Filter, MoreVertical, Smartphone, Download, Eye } from 'lucide-react';
import '../styles/CommonPages.css';

const MobileAppPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('semua');

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'Ahmad Ridwan', phone: '081234567890', location: 'Jakarta', registeredDate: '2024-01-15', status: 'active', lastActive: '2 jam lalu' },
        { id: 2, name: 'Siti Aisyah', phone: '081234567891', location: 'Bandung', registeredDate: '2024-01-20', status: 'active', lastActive: '1 hari lalu' },
        { id: 3, name: 'Muhammad Fauzi', phone: '081234567892', location: 'Surabaya', registeredDate: '2024-02-01', status: 'inactive', lastActive: '1 minggu lalu' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'semua') return matchesSearch;
    return matchesSearch && user.status === selectedFilter;
  });

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">
              <Smartphone className="page-icon" />
              Pengguna Mobile App
            </h1>
            <p className="page-subtitle">Kelola pengguna aplikasi mobile</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{users.length}</div>
              <div className="stat-description">Total Pengguna</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{users.filter(u => u.status === 'active').length}</div>
              <div className="stat-description">Pengguna Aktif</div>
            </div>
          </div>
          <div className="stat-card red">
            <div className="stat-icon">⭕</div>
            <div className="stat-content">
              <div className="stat-number">{users.filter(u => u.status === 'inactive').length}</div>
              <div className="stat-description">Pengguna Tidak Aktif</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="content-card">
          <div className="card-header">
            <div className="search-filter-section">
              <div className="search-box">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, telepon, atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-section">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="semua">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
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
                  <th>Lokasi</th>
                  <th>Tanggal Daftar</th>
                  <th>Status</th>
                  <th>Terakhir Aktif</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="loading-cell">Memuat data...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-cell">Tidak ada data yang ditemukan</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="user-name">{user.name}</td>
                      <td>{user.phone}</td>
                      <td>{user.location}</td>
                      <td>{new Date(user.registeredDate).toLocaleDateString('id-ID')}</td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td>{user.lastActive}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view">
                            <Eye size={16} />
                          </button>
                          <button className="action-btn menu">
                            <MoreVertical size={16} />
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
      </div>
    </Layout>
  );
};

export default MobileAppPage;