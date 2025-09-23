import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, Filter, UserCheck, Upload, Download, Eye, Edit, Trash2, Plus } from 'lucide-react';
import '../styles/CommonPages.css';

const AnggotaMUPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBidang, setSelectedBidang] = useState('semua');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setMembers([
        { id: 1, name: 'Dr. Ahmad Syafi\'i', memberNumber: 'MU001', bidang: 'Kesehatan', location: 'Jakarta Selatan', phone: '081234567890', registeredDate: '2024-01-15', hasCard: true },
        { id: 2, name: 'Prof. Siti Maryam', memberNumber: 'MU002', bidang: 'Pendidikan', location: 'Bandung', phone: '081234567891', registeredDate: '2024-01-20', hasCard: true },
        { id: 3, name: 'Ustadz Muhammad Ali', memberNumber: 'MU003', bidang: 'Keagamaan', location: 'Yogyakarta', phone: '081234567892', registeredDate: '2024-02-01', hasCard: false },
        { id: 4, name: 'Ir. Fatimah Zahra', memberNumber: 'MU004', bidang: 'Ekonomi', location: 'Surabaya', phone: '081234567893', registeredDate: '2024-02-10', hasCard: false },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.memberNumber.includes(searchTerm) ||
                         member.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedBidang === 'semua') return matchesSearch;
    return matchesSearch && member.bidang === selectedBidang;
  });

  const bidangOptions = ['Pendidikan', 'Kesehatan', 'Ekonomi', 'Keagamaan'];

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">
              <UserCheck className="page-icon" />
              Anggota Muhammadiyah
            </h1>
            <p className="page-subtitle">Kelola data anggota organisasi</p>
          </div>
          <div className="page-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload size={16} />
              Upload Data Sensus
            </button>
            <button className="btn btn-primary">
              <Plus size={16} />
              Tambah Anggota
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{members.length}</div>
              <div className="stat-description">Total Anggota</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">🎫</div>
            <div className="stat-content">
              <div className="stat-number">{members.filter(m => m.hasCard).length}</div>
              <div className="stat-description">Memiliki Kartu</div>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon">❓</div>
            <div className="stat-content">
              <div className="stat-number">{members.filter(m => !m.hasCard).length}</div>
              <div className="stat-description">Belum Memiliki Kartu</div>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <div className="stat-number">{bidangOptions.length}</div>
              <div className="stat-description">Bidang Kegiatan</div>
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
                  placeholder="Cari berdasarkan nama, nomor anggota, atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-section">
                <select
                  value={selectedBidang}
                  onChange={(e) => setSelectedBidang(e.target.value)}
                  className="filter-select"
                >
                  <option value="semua">Semua Bidang</option>
                  {bidangOptions.map(bidang => (
                    <option key={bidang} value={bidang}>{bidang}</option>
                  ))}
                </select>
                <button className="btn btn-outline">
                  <Download size={16} />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No. Anggota</th>
                  <th>Nama</th>
                  <th>Bidang</th>
                  <th>Lokasi</th>
                  <th>No. Telepon</th>
                  <th>Status Kartu</th>
                  <th>Tanggal Daftar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="loading-cell">Memuat data...</td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-cell">Tidak ada data yang ditemukan</td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="member-number">{member.memberNumber}</td>
                      <td className="member-name">{member.name}</td>
                      <td>
                        <span className={`bidang-badge ${member.bidang.toLowerCase()}`}>
                          {member.bidang}
                        </span>
                      </td>
                      <td>{member.location}</td>
                      <td>{member.phone}</td>
                      <td>
                        <span className={`status-badge ${member.hasCard ? 'active' : 'inactive'}`}>
                          {member.hasCard ? 'Ada Kartu' : 'Belum Ada'}
                        </span>
                      </td>
                      <td>{new Date(member.registeredDate).toLocaleDateString('id-ID')}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view">
                            <Eye size={16} />
                          </button>
                          <button className="action-btn edit">
                            <Edit size={16} />
                          </button>
                          <button className="action-btn delete">
                            <Trash2 size={16} />
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

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Upload Data Sensus</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowUploadModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="upload-area">
                  <Upload size={48} className="upload-icon" />
                  <p>Drag & drop file Excel/CSV atau klik untuk browse</p>
                  <input type="file" accept=".xlsx,.csv" className="file-input" />
                  <button className="btn btn-primary">Pilih File</button>
                </div>
                <div className="upload-instructions">
                  <h4>Petunjuk Upload:</h4>
                  <ul>
                    <li>File harus berformat .xlsx atau .csv</li>
                    <li>Kolom wajib: Nama, No. Telepon, Alamat, Bidang</li>
                    <li>Maksimal 1000 data per upload</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AnggotaMUPage;