import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Tags, Search, Plus, Edit, Trash2, Ticket } from 'lucide-react';
import '../styles/CommonPages.css';

const KategoriTiketPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setCategories([
        { id: 1, name: 'Bantuan Kesehatan', description: 'Permintaan bantuan terkait kesehatan', color: '#ef4444', ticketCount: 23 },
        { id: 2, name: 'Bantuan Pendidikan', description: 'Permintaan bantuan terkait pendidikan', color: '#3b82f6', ticketCount: 15 },
        { id: 3, name: 'Bantuan Ekonomi', description: 'Permintaan bantuan terkait ekonomi', color: '#10b981', ticketCount: 31 },
        { id: 4, name: 'Bantuan Keagamaan', description: 'Permintaan bantuan terkait keagamaan', color: '#f59e0b', ticketCount: 8 },
        { id: 5, name: 'Masalah Teknis', description: 'Laporan masalah teknis aplikasi', color: '#8b5cf6', ticketCount: 12 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, ...formData }
          : c
      ));
    } else {
      setCategories([...categories, {
        id: Date.now(),
        ...formData,
        ticketCount: 0
      }]);
    }
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: '#3b82f6' });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">
              <Tags className="page-icon" />
              Kategori Tiket
            </h1>
            <p className="page-subtitle">Kelola kategori untuk sistem tiket</p>
          </div>
          <div className="page-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} />
              Tambah Kategori
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">🏷️</div>
            <div className="stat-content">
              <div className="stat-number">{categories.length}</div>
              <div className="stat-description">Total Kategori</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">🎫</div>
            <div className="stat-content">
              <div className="stat-number">{categories.reduce((sum, c) => sum + c.ticketCount, 0)}</div>
              <div className="stat-description">Total Tiket</div>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{categories.length > 0 ? Math.round(categories.reduce((sum, c) => sum + c.ticketCount, 0) / categories.length) : 0}</div>
              <div className="stat-description">Rata-rata per Kategori</div>
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
                placeholder="Cari kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Warna</th>
                  <th>Nama Kategori</th>
                  <th>Deskripsi</th>
                  <th>Jumlah Tiket</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="loading-cell">Memuat data...</td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">Tidak ada data yang ditemukan</td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <div 
                          className="color-indicator" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                      </td>
                      <td className="category-name">{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <span className="ticket-count">
                          {category.ticketCount} tiket
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn edit"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDelete(category.id)}
                          >
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

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
                <button 
                  className="modal-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    setFormData({ name: '', description: '', color: '#3b82f6' });
                  }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Nama Kategori</label>
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
                  <label>Warna</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="form-input color-input"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Update' : 'Tambah'}
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

export default KategoriTiketPage;