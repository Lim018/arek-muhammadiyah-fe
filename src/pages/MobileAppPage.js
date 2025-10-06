import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, Smartphone, Eye, MapPin, Phone, CreditCard } from 'lucide-react';
import '../styles/CommonPages.css';

const MobileAppPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState('semua');
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    fetchVillages();
    fetchMobileUsers();
  }, []);

  const fetchVillages = async () => {
    try {
      // TODO: Ganti dengan API asli
      setVillages([
        { id: 1, name: 'Gubeng' },
        { id: 2, name: 'Airlangga' },
        { id: 3, name: 'Wonokromo' },
        { id: 4, name: 'Sawahan' },
        { id: 5, name: 'Genteng' },
      ]);
    } catch (error) {
      console.error('Error fetching villages:', error);
    }
  };

  const fetchMobileUsers = async () => {
    try {
      // TODO: Ganti dengan API call asli (filter is_mobile = true)
      setTimeout(() => {
        setUsers([
          { 
            id: '081234567894',
            name: 'Joko Widodo',
            telp: '081234567894',
            village_id: 1,
            village: { name: 'Gubeng' },
            nik: '3578015234567894',
            address: 'Jl. Gubeng Kertajaya No. 10, Surabaya',
            is_mobile: true,
            created_at: '2024-01-15'
          },
          { 
            id: '081234567895',
            name: 'Sri Mulyani',
            telp: '081234567895',
            village_id: 2,
            village: { name: 'Airlangga' },
            nik: '3578016234567895',
            address: 'Jl. Airlangga Dalam No. 5, Surabaya',
            is_mobile: true,
            created_at: '2024-01-20'
          },
          { 
            id: '081234567896',
            name: 'Bambang Sutopo',
            telp: '081234567896',
            village_id: 3,
            village: { name: 'Wonokromo' },
            nik: '3578017234567896',
            address: 'Jl. Wonokromo Indah No. 12, Surabaya',
            is_mobile: true,
            created_at: '2024-02-01'
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.telp?.includes(searchTerm) ||
                         user.nik?.includes(searchTerm) ||
                         user.village?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVillage = selectedVillage === 'semua' || user.village_id === parseInt(selectedVillage);
    
    return matchesSearch && matchesVillage;
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
            <p className="page-subtitle">Anggota yang menggunakan aplikasi mobile</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">📱</div>
            <div className="stat-content">
              <div className="stat-number">{users.length}</div>
              <div className="stat-description">Total Pengguna Mobile</div>
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

        {/* Filters and Search */}
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

          {/* Table Data */}
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
                    <td colSpan="6" className="empty-cell">Tidak ada data yang ditemukan</td>
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
                          <button className="action-btn view" title="Lihat Detail">
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
      </div>
    </Layout>
  );
};

export default MobileAppPage;