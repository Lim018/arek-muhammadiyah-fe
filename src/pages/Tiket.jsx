import React, { useState, useEffect } from 'react';

function Tiket({ token }) {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: null,
    status: 'unread',
    resolution: ''
  });

  const statusOptions = [
    { value: 'semua', label: 'Semua Status' },
    { value: 'unread', label: 'Belum Dibaca' },
    { value: 'read', label: 'Sudah Dibaca' },
    { value: 'in_progress', label: 'Diproses' },
    { value: 'resolved', label: 'Selesai' },
    { value: 'rejected', label: 'Ditolak' }
  ];

  const editStatusOptions = [
    { value: 'unread', label: 'Belum Dibaca' },
    { value: 'read', label: 'Sudah Dibaca' },
    { value: 'in_progress', label: 'Diproses' },
    { value: 'resolved', label: 'Selesai' },
    { value: 'rejected', label: 'Ditolak' }
  ];

  useEffect(() => {
    if (token) {
      fetchTickets();
      fetchCategories();
    }
  }, [token, selectedStatus]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories?page=1&limit=100', {
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

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      let url = 'http://localhost:8080/api/tickets?page=1&limit=1000';
      if (selectedStatus !== 'semua') {
        url += `&status=${selectedStatus}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTickets(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (ticketId) => {
    setShowDetailModal(true);
    setLoadingDetail(true);
    setSelectedTicket(null);
    
    try {
      const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSelectedTicket(result.data);
      }
    } catch (error) {
      console.error('Error fetching ticket detail:', error);
      alert('Gagal memuat detail tiket');
      setShowDetailModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    setFormData({
      title: '',
      description: '',
      category_id: null,
      status: 'unread',
      resolution: ''
    });
    setShowFormModal(true);
  };

  const handleEdit = async (ticketId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        const ticket = result.data;
        setIsEditMode(true);
        setSelectedTicket(ticket);
        setFormData({
          title: ticket.title || '',
          description: ticket.description || '',
          category_id: ticket.category_id,
          status: ticket.status || 'unread',
          resolution: ticket.resolution || ''
        });
        setShowFormModal(true);
      }
    } catch (error) {
      console.error('Error fetching ticket for edit:', error);
      alert('Gagal memuat data tiket');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Judul dan deskripsi harus diisi');
      return;
    }

    try {
      let url = 'http://localhost:8080/api/tickets';
      let method = 'POST';
      let body = {};

      if (isEditMode && selectedTicket) {
        url = `http://localhost:8080/api/tickets/${selectedTicket.id}`;
        method = 'PUT';
        body = {
          status: formData.status,
          resolution: formData.resolution || null
        };
      } else {
        body = {
          title: formData.title,
          description: formData.description,
          category_id: formData.category_id ? parseInt(formData.category_id) : null
        };
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (result.success) {
        alert(isEditMode ? 'Tiket berhasil diperbarui!' : 'Tiket berhasil dibuat!');
        setShowFormModal(false);
        fetchTickets();
      } else {
        alert(result.message || 'Gagal menyimpan tiket');
      }
    } catch (error) {
      console.error('Error saving ticket:', error);
      alert('Terjadi kesalahan saat menyimpan tiket');
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tiket ini?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        alert('Tiket berhasil dihapus!');
        fetchTickets();
      } else {
        alert(result.message || 'Gagal menghapus tiket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Terjadi kesalahan saat menghapus tiket');
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedTicket(null);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setSelectedTicket(null);
    setFormData({
      title: '',
      description: '',
      category_id: null,
      status: 'unread',
      resolution: ''
    });
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      'unread': { bg: '#fee2e2', color: '#dc2626', label: 'Belum Dibaca', icon: '🔴' },
      'read': { bg: '#fef3c7', color: '#f59e0b', label: 'Sudah Dibaca', icon: '👁️' },
      'in_progress': { bg: '#dbeafe', color: '#3b82f6', label: 'Diproses', icon: '⏳' },
      'resolved': { bg: '#d1fae5', color: '#059669', label: 'Selesai', icon: '✅' },
      'rejected': { bg: '#fee2e2', color: '#991b1b', label: 'Ditolak', icon: '❌' }
    };
    
    const config = statusConfig[status] || statusConfig['unread'];
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        background: config.bg,
        color: config.color,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {config.icon} {config.label}
      </span>
    );
  };

  const getStatusStats = () => {
    return {
      total: tickets.length,
      unread: tickets.filter(t => t.status === 'unread').length,
      read: tickets.filter(t => t.status === 'read').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      rejected: tickets.filter(t => t.status === 'rejected').length
    };
  };

  const stats = getStatusStats();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>
          Tiket Layanan
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Kelola tiket layanan dan bantuan
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>Total Tiket</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>{stats.total}</div>
        </div>
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>Belum Dibaca</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#dc2626' }}>{stats.unread}</div>
        </div>
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>Diproses</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6' }}>{stats.in_progress}</div>
        </div>
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>Selesai</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>{stats.resolved}</div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Cari tiket berdasarkan judul atau pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: '250px',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                minWidth: '180px'
              }}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddNew}
              style={{
                padding: '10px 20px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ➕ Tambah Tiket
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Judul Tiket</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Kategori</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Pengguna</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Tanggal Dibuat</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    Memuat data...
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    Tidak ada tiket yang ditemukan
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <code style={{ 
                        fontSize: '13px', 
                        background: '#f3f4f6', 
                        padding: '2px 6px', 
                        borderRadius: '4px' 
                      }}>
                        #{ticket.id}
                      </code>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ display: 'block', marginBottom: '4px' }}>{ticket.title}</strong>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#6b7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '300px'
                      }}>
                        {ticket.description}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {ticket.category ? (
                        <span style={{ fontSize: '13px' }}>
                          {ticket.category.name}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {ticket.user ? (
                        <div style={{ fontSize: '13px' }}>
                          <div style={{ fontWeight: '500' }}>{ticket.user.name}</div>
                          <div style={{ color: '#6b7280', fontSize: '12px' }}>
                            {ticket.user.telp || '-'}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{getStatusBadge(ticket.status)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280' }}>
                      {formatDate(ticket.created_at)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleViewDetail(ticket.id)}
                          title="Lihat Detail"
                          style={{
                            padding: '6px 12px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleEdit(ticket.id)}
                          title="Edit Tiket"
                          style={{
                            padding: '6px 12px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(ticket.id)}
                          title="Hapus Tiket"
                          style={{
                            padding: '6px 12px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
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

        {!loading && filteredTickets.length > 0 && (
          <div style={{ 
            padding: '16px 20px', 
            borderTop: '1px solid #e5e7eb',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Menampilkan {filteredTickets.length} dari {tickets.length} tiket
          </div>
        )}
      </div>

      {/* Modal Form Add/Edit */}
      {showFormModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={closeFormModal}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>
                {isEditMode ? '✏️ Edit Tiket' : '➕ Tambah Tiket Baru'}
              </h2>
              <button 
                onClick={closeFormModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0',
                  width: '32px',
                  height: '32px'
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div style={{ padding: '24px' }}>
                {isEditMode ? (
                  // Form Edit (hanya status dan resolusi)
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        Status <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        {editStatusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        Resolusi/Catatan
                      </label>
                      <textarea
                        value={formData.resolution}
                        onChange={(e) => setFormData({...formData, resolution: e.target.value})}
                        placeholder="Masukkan catatan resolusi atau tindak lanjut..."
                        rows="4"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{
                      padding: '12px',
                      background: '#fef3c7',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#92400e',
                      border: '1px solid #fbbf24'
                    }}>
                      ℹ️ Untuk admin: Anda hanya dapat mengubah status dan menambahkan resolusi. Judul dan deskripsi tidak dapat diubah.
                    </div>
                  </>
                ) : (
                  // Form Add (semua field)
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        Judul Tiket <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Masukkan judul tiket"
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        Deskripsi <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Jelaskan masalah atau permintaan Anda secara detail..."
                        rows="5"
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        Kategori
                      </label>
                      <select
                        value={formData.category_id || ''}
                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button
                  type="button"
                  onClick={closeFormModal}
                  style={{
                    padding: '10px 24px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {isEditMode ? '💾 Simpan Perubahan' : '➕ Buat Tiket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {showDetailModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={closeDetailModal}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '700px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Detail Tiket</h2>
              <button 
                onClick={closeDetailModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0',
                  width: '32px',
                  height: '32px'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              {loadingDetail ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Memuat data...
                </div>
              ) : !selectedTicket ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Data tidak ditemukan
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {/* Header */}
                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '8px',
                    color: 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px' }}>
                        {selectedTicket.title}
                      </h3>
                      <code style={{ 
                        background: 'rgba(255,255,255,0.2)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        #{selectedTicket.id}
                      </code>
                    </div>
                    <div>{getStatusBadge(selectedTicket.status)}</div>
                  </div>

                  {/* Info Pengguna */}
                  <div>
                    <h4 style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Informasi Pengguna
                    </h4>
                    {selectedTicket.user ? (
                      <div style={{ display: 'grid', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                          <span style={{ color: '#6b7280', fontSize: '14px' }}>Nama</span>
                          <strong style={{ fontSize: '14px' }}>{selectedTicket.user.name}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                          <span style={{ color: '#6b7280', fontSize: '14px' }}>No. Telepon</span>
                          <strong style={{ fontSize: '14px' }}>
                            {selectedTicket.user.telp || '-'}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                          <span style={{ color: '#6b7280', fontSize: '14px' }}>Wilayah</span>
                          <strong style={{ fontSize: '14px' }}>
                            {selectedTicket.user.city_name || '-'}
                          </strong>
                        </div>
                      </div>
                    ) : (
                      <p style={{ color: '#6b7280' }}>Data pengguna tidak tersedia</p>
                    )}
                  </div>

                  {/* Kategori */}
                  {selectedTicket.category && (
                    <div>
                      <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#374151',
                        marginBottom: '12px',
                        paddingBottom: '8px',
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        Kategori
                      </h4>
                      <div style={{ 
                        padding: '12px',
                        background: '#f9fafb',
                        borderRadius: '6px',
                        borderLeft: `4px solid ${selectedTicket.category.color}`
                      }}>
                        <strong>{selectedTicket.category.name}</strong>
                        {selectedTicket.category.description && (
                          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
                            {selectedTicket.category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Deskripsi */}
                  <div>
                    <h4 style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Deskripsi Masalah
                    </h4>
                    <div style={{ 
                      padding: '12px',
                      background: '#f9fafb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selectedTicket.description}
                    </div>
                  </div>

                  {/* Resolusi (jika ada) */}
                  {selectedTicket.resolution && (
                    <div>
                      <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#374151',
                        marginBottom: '12px',
                        paddingBottom: '8px',
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        Resolusi
                      </h4>
                      <div style={{ 
                        padding: '12px',
                        background: '#d1fae5',
                        borderRadius: '6px',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        border: '1px solid #059669'
                      }}>
                        {selectedTicket.resolution}
                      </div>
                    </div>
                  )}

                  {/* Dokumen (jika ada) */}
                  {selectedTicket.documents && selectedTicket.documents.length > 0 && (
                    <div>
                      <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#374151',
                        marginBottom: '12px',
                        paddingBottom: '8px',
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        Dokumen Lampiran ({selectedTicket.documents.length})
                      </h4>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {selectedTicket.documents.map((doc, index) => (
                          <div key={index} style={{
                            padding: '12px',
                            background: '#f9fafb',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <strong style={{ fontSize: '14px' }}>📎 {doc.file_name}</strong>
                              {doc.description && (
                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                                  {doc.description}
                                </p>
                              )}
                            </div>
                            {doc.file_size && (
                              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                {(doc.file_size / 1024).toFixed(2)} KB
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div style={{
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Dibuat:</span>
                      <strong>{formatDate(selectedTicket.created_at)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Terakhir diubah:</span>
                      <strong>{formatDate(selectedTicket.updated_at)}</strong>
                    </div>
                    {selectedTicket.resolved_at && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Diselesaikan:</span>
                        <strong>{formatDate(selectedTicket.resolved_at)}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end'
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
                  cursor: 'pointer',
                  fontSize: '14px'
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

export default Tiket;