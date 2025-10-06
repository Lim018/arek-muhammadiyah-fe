import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FileText, Search, Plus, Edit, Trash2, Eye, Calendar, User, Tag } from 'lucide-react';
import '../styles/CommonPages.css';

const ArtikelPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, []);

  const fetchCategories = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:3000/api/categories?active=true');
      setCategories([
        { id: 1, name: 'Pendidikan', color: '#3B82F6' },
        { id: 2, name: 'Kesehatan', color: '#10B981' },
        { id: 3, name: 'Ekonomi', color: '#F59E0B' },
        { id: 4, name: 'Keagamaan', color: '#8B5CF6' },
      ]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:3000/api/articles');
      
      setTimeout(() => {
        setArticles([
          {
            id: 1,
            user_id: '081234567890',
            category_id: 1,
            title: 'Program Beasiswa 2025 Telah Dibuka',
            slug: 'program-beasiswa-2025-telah-dibuka',
            content: 'Organisasi kami dengan bangga mengumumkan pembukaan program beasiswa tahun 2025...',
            feature_image: '/uploads/articles/beasiswa_2025.jpg',
            is_published: true,
            created_at: '2024-09-20',
            updated_at: '2024-09-20',
            user: { name: 'Budi Santoso' },
            category: { name: 'Pendidikan', color: '#3B82F6' }
          },
          {
            id: 2,
            user_id: '081234567891',
            category_id: 2,
            title: 'Pemeriksaan Kesehatan Gratis Bulan Oktober',
            slug: 'pemeriksaan-kesehatan-gratis-oktober',
            content: 'Dalam rangka meningkatkan kesehatan anggota, organisasi akan menyelenggarakan...',
            feature_image: '/uploads/articles/kesehatan_gratis.jpg',
            is_published: true,
            created_at: '2024-09-19',
            updated_at: '2024-09-19',
            user: { name: 'Siti Nurhaliza' },
            category: { name: 'Kesehatan', color: '#10B981' }
          },
          {
            id: 3,
            user_id: '081234567890',
            category_id: 3,
            title: 'Pelatihan Kewirausahaan untuk Anggota',
            slug: 'pelatihan-kewirausahaan-anggota',
            content: 'Bidang Ekonomi mengadakan pelatihan kewirausahaan gratis...',
            feature_image: '/uploads/articles/pelatihan_wirausaha.jpg',
            is_published: false,
            created_at: '2024-09-18',
            updated_at: '2024-09-18',
            user: { name: 'Budi Santoso' },
            category: { name: 'Ekonomi', color: '#F59E0B' }
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'semua' || article.category_id === parseInt(selectedCategory);
    const matchesStatus = selectedStatus === 'semua' || 
                         (selectedStatus === 'published' && article.is_published) ||
                         (selectedStatus === 'draft' && !article.is_published);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">
              <FileText className="page-icon" />
              Manajemen Artikel
            </h1>
            <p className="page-subtitle">Kelola artikel dan berita organisasi</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-primary">
              <Plus size={16} />
              Tulis Artikel Baru
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">📄</div>
            <div className="stat-content">
              <div className="stat-number">{articles.length}</div>
              <div className="stat-description">Total Artikel</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{articles.filter(a => a.is_published).length}</div>
              <div className="stat-description">Artikel Terbit</div>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-number">{articles.filter(a => !a.is_published).length}</div>
              <div className="stat-description">Draft</div>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">🏷️</div>
            <div className="stat-content">
              <div className="stat-number">{categories.length}</div>
              <div className="stat-description">Kategori</div>
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
                  placeholder="Cari berdasarkan judul, konten, atau penulis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-section">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="semua">Semua Kategori</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="semua">Semua Status</option>
                  <option value="published">Terbit</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          <div className="articles-grid">
            {loading ? (
              <div className="loading-cell">Memuat data...</div>
            ) : filteredArticles.length === 0 ? (
              <div className="empty-cell">Tidak ada data yang ditemukan</div>
            ) : (
              filteredArticles.map((article) => (
                <div key={article.id} className="article-card">
                  <div className="article-header">
                    <div className="article-meta">
                      <span 
                        className="bidang-badge"
                        style={{ 
                          backgroundColor: article.category?.color || '#6b7280',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Tag size={12} />
                        {article.category?.name || 'Tanpa Kategori'}
                      </span>
                      <span className={`status-badge ${article.is_published ? 'active' : 'inactive'}`}>
                        {article.is_published ? 'Terbit' : 'Draft'}
                      </span>
                    </div>
                    <div className="article-actions">
                      <button className="action-btn view" title="Lihat">
                        <Eye size={16} />
                      </button>
                      <button className="action-btn edit" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(article.id)}
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="article-content">
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-excerpt">
                      {article.content.substring(0, 120)}...
                    </p>
                    
                    <div className="article-info">
                      <div className="article-author">
                        <User size={14} />
                        <span>{article.user?.name || 'Unknown'}</span>
                      </div>
                      <div className="article-date">
                        <Calendar size={14} />
                        <span>{new Date(article.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtikelPage;