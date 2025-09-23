import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FileText, Search, Plus, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import '../styles/CommonPages.css';

const ArtikelPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBidang, setSelectedBidang] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setArticles([
        {
          id: 1,
          title: 'Program Vaksinasi Gratis untuk Anggota Muhammadiyah',
          content: 'Muhammadiyah mengadakan program vaksinasi gratis untuk seluruh anggota...',
          bidang: 'Kesehatan',
          author: 'Dr. Ahmad Syafi\'i',
          publishDate: '2024-09-20',
          status: 'published',
          views: 245,
          image: null
        },
        {
          id: 2,
          title: 'Beasiswa Pendidikan untuk Anak Kurang Mampu',
          content: 'Dalam rangka meningkatkan akses pendidikan, Muhammadiyah memberikan beasiswa...',
          bidang: 'Pendidikan',
          author: 'Prof. Siti Maryam',
          publishDate: '2024-09-19',
          status: 'published',
          views: 189,
          image: null
        },
        {
          id: 3,
          title: 'Pelatihan Kewirausahaan untuk Anggota Muda',
          content: 'Program pelatihan kewirausahaan khusus untuk anggota muda Muhammadiyah...',
          bidang: 'Ekonomi',
          author: 'Ir. Fatimah Zahra',
          publishDate: '2024-09-18',
          status: 'draft',
          views: 0,
          image: null
        },
        {
          id: 4,
          title: 'Kajian Rutin Minggu Pagi',
          content: 'Kajian rutin setiap minggu pagi dengan tema yang berbeda setiap minggunya...',
          bidang: 'Keagamaan',
          author: 'Ustadz Muhammad Ali',
          publishDate: '2024-09-17',
          status: 'published',
          views: 156,
          image: null
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBidang = selectedBidang === 'semua' || article.bidang === selectedBidang;
    const matchesStatus = selectedStatus === 'semua' || article.status === selectedStatus;
    
    return matchesSearch && matchesBidang && matchesStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const bidangOptions = ['Pendidikan', 'Kesehatan', 'Ekonomi', 'Keagamaan'];

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
              <div className="stat-number">{articles.filter(a => a.status === 'published').length}</div>
              <div className="stat-description">Artikel Terbit</div>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-number">{articles.filter(a => a.status === 'draft').length}</div>
              <div className="stat-description">Draft</div>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">👀</div>
            <div className="stat-content">
              <div className="stat-number">{articles.reduce((sum, a) => sum + a.views, 0)}</div>
              <div className="stat-description">Total Views</div>
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
                  value={selectedBidang}
                  onChange={(e) => setSelectedBidang(e.target.value)}
                  className="filter-select"
                >
                  <option value="semua">Semua Bidang</option>
                  {bidangOptions.map(bidang => (
                    <option key={bidang} value={bidang}>{bidang}</option>
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
                      <span className={`bidang-badge ${article.bidang.toLowerCase()}`}>
                        {article.bidang}
                      </span>
                      <span className={`status-badge ${article.status === 'published' ? 'active' : 'inactive'}`}>
                        {article.status === 'published' ? 'Terbit' : 'Draft'}
                      </span>
                    </div>
                    <div className="article-actions">
                      <button className="action-btn view">
                        <Eye size={16} />
                      </button>
                      <button className="action-btn edit">
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(article.id)}
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
                        <span>{article.author}</span>
                      </div>
                      <div className="article-date">
                        <Calendar size={14} />
                        <span>{new Date(article.publishDate).toLocaleDateString('id-ID')}</span>
                      </div>
                      {article.status === 'published' && (
                        <div className="article-views">
                          <Eye size={14} />
                          <span>{article.views} views</span>
                        </div>
                      )}
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