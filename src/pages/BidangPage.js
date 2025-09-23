import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Building, Search, Plus, Edit, Trash2, Users, FileText } from 'lucide-react';
import '../styles/CommonPages.css';

const BidangPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bidangs, setBidangs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBidang, setEditingBidang] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coordinator: ''
  });

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setBidangs([
        { 
          id: 1, 
          name: 'Pendidikan', 
          description: 'Mengelola kegiatan pendidikan dan pembelajaran', 
          coordinator: 'Prof. Siti Maryam',
          memberCount: 156,
          articleCount: 45,
          createdDate: '2024-01-01'
        },
        { 
          id: 2, 
          name: 'Kesehatan', 
          description: 'Mengelola kegiatan kesehatan masyarakat', 
          coordinator: 'Dr. Ahmad Syafi\'i',
          memberCount: 89,
          articleCount: 32,
          createdDate: '2024-01-01'
        },
        { 
          id: 3, 
          name: 'Ekonomi', 
          description: 'Mengelola kegiatan ekonomi dan kewirausahaan', 
          coordinator: 'Ir. Fatimah Zahra',
          memberCount: 134,
          articleCount: 28,
          createdDate: '2024-01-01'
        },
        { 
          id: 4, 
          name: 'Keagamaan', 
          description: 'Mengelola kegiatan dakwah dan keagamaan', 
          coordinator: 'Ustadz Muhammad Ali',
          memberCount: 201,
          articleCount: 67,
          createdDate: '2024-01-01'
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBidangs = bidangs.filter(bidang =>
    bidang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bidang.coordinator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBidang) {
      setBidangs(bidangs.map(b => 
        b.id === editingBidang.id 
          ? { ...b, ...formData }
          : b
      ));
    } else {
      setBidangs([...bidangs, {
        id: Date.now(),
        ...formData,
        memberCount: 0,
        articleCount: 0,
        createdDate: new Date().toISOString().split('T')[0]
      }]);
    }
    setShowModal(false);
    setEditingBidang(null);
    setFormData({ name: '', description: '', coordinator: '' });
  };

  const handleEdit = (bidang) => {
    setEditingBidang(bidang);
    setFormData({
      name: bidang.name,
      description: bidang.description,
      coordinator: bidang.coordinator
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus bidang ini?')) {
      setBidangs(bidangs.filter(b => b.id !== id));
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">
              <Building className="page-icon" />
              Bidang Organisasi
            </h1>
            <p className="page-subtitle">Kelola bidang-bidang dalam organisasi</p>
          </div>
          <div className="page-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} />
              Tambah Bidang
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <div className="stat-number">{bidangs.length}</div>
              <div className="stat-description">Total Bidang</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{bidangs.reduce((sum, b) => sum + b.memberCount, 0)}</div>
              <div className="stat-description">Total Anggota</div>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">📄</div>
            <div className="stat-content">
              <div className="stat-number">{bidangs.reduce((sum, b) => sum + b.articleCount, 0)}</div>
              <div className="stat-description">Total Artikel</div>
            </div>
          </div>
        </div>

        {/* Search and Content */}
        <div className="content-card">
          <div className="card-header">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama bidang atau koordinator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="bidang-grid">
            {loading ? (
              <div className="loading-cell">Memuat data...</div>
            ) : filteredBidangs.length === 0 ? (
              <div className="empty-cell">Tidak ada data yang ditemukan</div>
            ) : (
              filteredBidangs.map((bidang) => (
                <div key={bidang.id} className="bidang-card">
                  <div className="bidang-header">
                    <h3 className="bidang-name">{bidang.name}</h3>
                    <div className="bidang-actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEdit(bidang)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(bidang.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="bidang-description">{bidang.description}</p>
                  <div className="bidang-coordinator">
                    <strong>Koordinator:</strong> {bidang.coordinator}
                  </div>
                  <div className="bidang-stats">
                    <div className="stat-item">
                      <Users size={16} />
                      <span>{bidang.memberCount} Anggota</span>
                    </div>
                    <div className="stat-item">
                      <FileText size={16} />
                      <span>{bidang.articleCount} Artikel</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingBidang ? 'Edit Bidang' : 'Tambah Bidang Baru'}</h2>
                <button 
                  className="modal-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBidang(null);
                    setFormData({ name: '', description: '', coordinator: '' });
                  }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Nama Bidang</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Koordinator</label>
                  <input
                    type="text"
                    value={formData.coordinator}
                    onChange={(e) => setFormData({...formData, coordinator: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingBidang ? 'Update' : 'Tambah'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BidangPage;