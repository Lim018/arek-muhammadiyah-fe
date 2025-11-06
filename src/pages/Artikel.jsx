import React, { useState, useEffect } from 'react';
// 1. Impor 'useQuill' dari 'react-quilljs'
import { useQuill } from 'react-quilljs';
// 2. Impor CSS dari 'quill' (sesuai instalasi npm Anda)
import 'quill/dist/quill.snow.css'; 

// 3. Buat komponen "Wrapper" untuk Quill
// Ini adalah praktik terbaik untuk mengisolasi hook 'useQuill'
// dan mengelolanya dengan state React (controlled component)
const QuillEditor = ({ value, onChange, modules, formats, placeholder, style }) => {
  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules,
    formats,
    placeholder
  });

  // Efek untuk menyinkronkan state (value) dari parent ke editor Quill
  useEffect(() => {
    if (quill) {
      // Hanya update jika kontennya benar-benar berbeda
      if (value !== quill.root.innerHTML) {
        // Cek jika keduanya "kosong" untuk menghindari loop
        if (value === '' && quill.root.innerHTML === '<p><br></p>') {
          return;
        }
        
        // Set konten dari parent state
        quill.clipboard.dangerouslyPasteHTML(value || '');
      }
    }
  }, [quill, value]); // Hanya berjalan saat quill siap atau 'value' dari parent berubah

  // Efek untuk menyinkronkan perubahan dari editor Quill ke parent state (onChange)
  useEffect(() => {
    if (!quill) return;

    const handleChange = (delta, oldDelta, source) => {
      if (source === 'user') { // Hanya jalankan jika perubahan dari user
        const html = quill.root.innerHTML;
        onChange(html);
      }
    };

    quill.on('text-change', handleChange);
    return () => {
      quill.off('text-change', handleChange);
    };
  }, [quill, onChange]);
  
  // Berikan style (tinggi) ke div yang akan menjadi area editor
  return (
    <div style={style}>
      <div ref={quillRef} />
    </div>
  );
};


function Artikel({ token }) {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: null,
    feature_image: '',
    is_published: false
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quill modules configuration (tetap sama)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  useEffect(() => {
    if (token) {
      fetchArticles();
      fetchCategories();
    }
  }, [token, selectedCategory, selectedStatus]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      let url = 'http://localhost:8080/api/articles?page=1&limit=1000';
      if (selectedStatus !== 'semua') {
        url += `&published=${selectedStatus === 'published'}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setArticles(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (article = null) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        content: article.content,
        category_id: article.category_id || null,
        feature_image: article.feature_image || '',
        is_published: article.is_published
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        content: '',
        category_id: null,
        feature_image: '',
        is_published: false
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      content: '',
      category_id: null,
      feature_image: '',
      is_published: false
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'category_id' ? (value ? parseInt(value) : null) : value)
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
    
    if (formErrors.content) {
      setFormErrors(prev => ({ ...prev, content: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Judul artikel wajib diisi';
    // Validasi konten tetap sama, karena 'react-quilljs' juga menghasilkan '<p><br></p>' saat kosong
    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      errors.content = 'Konten artikel wajib diisi';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const url = editingArticle
        ? `http://localhost:8080/api/articles/${editingArticle.id}`
        : 'http://localhost:8080/api/articles';
      
      const method = editingArticle ? 'PUT' : 'POST';
      
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category_id: formData.category_id,
        feature_image: formData.feature_image.trim() || null,
        is_published: formData.is_published
      };
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Gagal menyimpan artikel');
      }
      
      alert(editingArticle ? 'Artikel berhasil diperbarui!' : 'Artikel berhasil dibuat!');
      handleCloseModal();
      fetchArticles();
      
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Gagal menyimpan artikel: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetail = async (articleId) => {
    setShowDetailModal(true);
    setLoadingDetail(true);
    setSelectedArticle(null);
    
    try {
      const response = await fetch(`http://localhost:8080/api/articles/${articleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSelectedArticle(result.data);
      }
    } catch (error) {
      console.error('Error fetching article detail:', error);
      alert('Gagal memuat detail artikel');
      setShowDetailModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedArticle(null);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Gagal menghapus artikel');
      }
      
      alert('Artikel berhasil dihapus');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Gagal menghapus artikel: ' + error.message);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'semua' || 
                           (article.category_id && article.category_id.toString() === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const getStatusStats = () => {
    return {
      total: articles.length,
      published: articles.filter(a => a.is_published).length,
      draft: articles.filter(a => !a.is_published).length
    };
  };

  const stats = getStatusStats();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Artikel</h1>
        <button 
          className="btn-primary"
          onClick={() => handleOpenModal()}
        >
          + Buat Artikel
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Artikel</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Dipublikasi</h3>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {stats.published}
          </div>
        </div>
        <div className="stat-card">
          <h3>Draft</h3>
          <div className="stat-value" style={{ color: '#6b7280' }}>
            {stats.draft}
          </div>
        </div>
      </div>

      <div className="page-container" style={{ background: 'white', marginTop: '20px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                minWidth: '150px'
              }}
            >
              <option value="semua">Semua Kategori</option>
              {categories.filter(c => c.is_active).map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                minWidth: '150px'
              }}
            >
              <option value="semua">Semua Status</option>
              <option value="published">Dipublikasi</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Penulis</th>
                <th>Status</th>
                <th>Tanggal Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    Memuat data...
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    Tidak ada artikel yang ditemukan
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <strong>{article.title}</strong>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#6b7280', 
                        marginTop: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '300px'
                      }}>
                        {stripHtml(article.content).substring(0, 80)}...
                      </div>
                    </td>
                    <td>
                      {article.category ? (
                        <span style={{ 
                          fontSize: '13px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: article.category.color + '20',
                          color: article.category.color
                        }}>
                          {article.category.name}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>-</span>
                      )}
                    </td>
                    <td>
                      {article.user ? (
                        <div style={{ fontSize: '13px' }}>
                          {article.user.name}
                        </div>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>-</span>
                      )}
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: article.is_published ? '#d1fae5' : '#f3f4f6',
                        color: article.is_published ? '#059669' : '#6b7280'
                      }}>
                        {article.is_published ? '✓ Dipublikasi' : '📝 Draft'}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: '#6b7280' }}>
                      {formatDate(article.created_at)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-view" 
                          onClick={() => handleViewDetail(article.id)}
                          title="Lihat Detail"
                        >
                          👁️
                        </button>
                        <button 
                          className="btn-edit" 
                          onClick={() => handleOpenModal(article)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(article.id, article.title)}
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredArticles.length > 0 && (
          <div style={{ 
            padding: '16px 20px', 
            borderTop: '1px solid #e5e7eb',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Menampilkan {filteredArticles.length} dari {articles.length} artikel
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: '900px',
              maxHeight: 'calc(100vh - 40px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="modal-header">
              <h2>{editingArticle ? 'Edit Artikel' : 'Buat Artikel Baru'}</h2>
              <button 
                className="modal-close"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
              <form onSubmit={handleSubmit} id="articleForm">
                <div style={{ display: 'grid', gap: '16px' }}>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                      Judul Artikel <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Masukkan judul artikel"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: formErrors.title ? '1px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                    {formErrors.title && (
                      <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        {formErrors.title}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Kategori
                      </label>
                      <select
                        name="category_id"
                        value={formData.category_id || ''}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Pilih Kategori (Opsional)</option>
                        {categories.filter(c => c.is_active).map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '30px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          name="is_published"
                          checked={formData.is_published}
                          onChange={handleInputChange}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: '500' }}>Publikasikan Artikel</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                      URL Gambar Utama
                    </label>
                    <input
                      type="text"
                      name="feature_image"
                      value={formData.feature_image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg (Opsional)"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                      Konten Artikel <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ 
                      border: formErrors.content ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      minHeight: '300px' // Container ini akan menampung toolbar + editor
                    }}>
                      {/* 4. Ganti <ReactQuill> dengan <QuillEditor> */}
                      <QuillEditor
                        value={formData.content}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        placeholder="Tulis konten artikel di sini..."
                        // 'useQuill' menerapkan tinggi ke area editor saja
                        // 'minHeight: 300px' di parent akan menampung toolbar + editor 250px
                        style={{ height: '250px' }} 
                      />
                    </div>
                    {formErrors.content && (
                      <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        {formErrors.content}
                      </span>
                    )}
                  </div>

                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: '12px',
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e5e7eb',
                  position: 'sticky',
                  bottom: 0,
                  background: 'white',
                  marginLeft: '-24px',
                  marginRight: '-24px',
                  paddingLeft: '24px',
                  paddingRight: '24px'
                }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      padding: '10px 20px',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    disabled={isSubmitting}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                    form="articleForm"
                  >
                    {isSubmitting ? 'Menyimpan...' : editingArticle ? 'Simpan Perubahan' : 'Buat Artikel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {showDetailModal && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: '800px',
              maxHeight: 'calc(100vh - 40px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="modal-header">
              <h2>Detail Artikel</h2>
              <button 
                className="modal-close"
                onClick={closeDetailModal}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
              {loadingDetail ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Memuat data...
                </div>
              ) : !selectedArticle ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Data tidak ditemukan
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {selectedArticle.feature_image && (
                    <img 
                      src={selectedArticle.feature_image} 
                      alt={selectedArticle.title}
                      style={{
                        width: '100%',
                        maxHeight: '300px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                      {selectedArticle.title}
                    </h1>
                    
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {selectedArticle.category && (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: selectedArticle.category.color + '20',
                          color: selectedArticle.category.color
                        }}>
                          {selectedArticle.category.name}
                        </span>
                      )}
                      
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: selectedArticle.is_published ? '#d1fae5' : '#f3f4f6',
                        color: selectedArticle.is_published ? '#059669' : '#6b7280'
                      }}>
                        {selectedArticle.is_published ? '✓ Dipublikasi' : '📝 Draft'}
                      </span>
                    </div>
                    
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#6b7280',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Oleh: <strong>{selectedArticle.user?.name || 'Unknown'}</strong> • {formatDate(selectedArticle.created_at)}
                    </div>
                  </div>

                  <div 
                    className="article-content"
                    style={{ 
                      lineHeight: '1.8',
                      fontSize: '15px',
                      color: '#374151'
                    }}
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  />

                  {selectedArticle.documents && selectedArticle.documents.length > 0 && (
                    <div style={{
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#374151',
                        marginBottom: '12px'
                      }}>
                        Dokumen Lampiran ({selectedArticle.documents.length})
                      </h4>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {selectedArticle.documents.map((doc, index) => (
                          <div key={index} style={{
                            padding: '12px',
                            background: 'white',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                          }}>
                            <strong style={{ fontSize: '14px' }}>📎 {doc.file_name}</strong>
                            {doc.description && (
                              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                                {doc.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              position: 'sticky',
              bottom: 0,
              background: 'white'
            }}>
              <button
                onClick={closeDetailModal}
                style={{
                  padding: '10px 24px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Artikel;