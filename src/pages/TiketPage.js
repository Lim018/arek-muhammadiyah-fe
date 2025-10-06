import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Ticket, Search, Eye, MessageSquare, Clock, CheckCircle, AlertCircle, Tag, User, MapPin, Phone } from 'lucide-react';
import '../styles/CommonPages.css';

const TiketPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [categories, setCategories] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTickets();
  }, []);

  const fetchCategories = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:3000/api/categories?active=true');
      // const data = await response.json();
      // setCategories(data.data);
      
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

  const fetchTickets = async () => {
    try {
      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token');
      // const response = await fetch('http://localhost:3000/api/tickets', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();
      // setTickets(data.data);
      
      setTimeout(() => {
        setTickets([
          { 
            id: 1,
            user_id: '081234567894',
            category_id: 1,
            title: 'Bantuan Beasiswa Anak',
            description: 'Mohon bantuan beasiswa untuk anak saya yang akan masuk SMA. Keadaan ekonomi sedang sulit karena pandemi kemarin. Anak saya memiliki prestasi yang baik di sekolah dengan nilai rata-rata 85.',
            status: 'unread',
            resolution: null,
            created_at: '2024-09-20T10:30:00',
            updated_at: '2024-09-20T10:30:00',
            resolved_at: null,
            user: { 
              id: '081234567894',
              name: 'Joko Widodo', 
              telp: '081234567894', 
              village: { id: 1, name: 'Gubeng' },
              address: 'Jl. Gubeng Kertajaya No. 10, Surabaya'
            },
            category: { id: 1, name: 'Pendidikan', color: '#3B82F6' }
          },
          { 
            id: 2,
            user_id: '081234567895',
            category_id: 2,
            title: 'Bantuan Biaya Rumah Sakit',
            description: 'Memerlukan bantuan biaya operasi untuk ibu saya yang sakit jantung. Biaya operasi sekitar 50 juta rupiah dan keluarga kami kesulitan untuk memenuhinya.',
            status: 'in_progress',
            resolution: 'Sedang diproses oleh tim bantuan kesehatan. Silakan melengkapi dokumen pendukung (surat keterangan dokter, kartu keluarga).',
            created_at: '2024-09-19T14:20:00',
            updated_at: '2024-09-20T09:15:00',
            resolved_at: null,
            user: { 
              id: '081234567895',
              name: 'Sri Mulyani', 
              telp: '081234567895', 
              village: { id: 2, name: 'Airlangga' },
              address: 'Jl. Airlangga Dalam No. 5, Surabaya'
            },
            category: { id: 2, name: 'Kesehatan', color: '#10B981' }
          },
          { 
            id: 3,
            user_id: '081234567896',
            category_id: 3,
            title: 'Modal Usaha Kecil',
            description: 'Ingin mengajukan bantuan modal untuk usaha warung makan. Saya sudah memiliki tempat dan pengalaman, hanya butuh modal untuk bahan baku awal sekitar 5 juta rupiah.',
            status: 'read',
            resolution: null,
            created_at: '2024-09-18T08:45:00',
            updated_at: '2024-09-19T11:00:00',
            resolved_at: null,
            user: { 
              id: '081234567896',
              name: 'Bambang Sutopo', 
              telp: '081234567896', 
              village: { id: 3, name: 'Wonokromo' },
              address: 'Jl. Wonokromo Indah No. 12, Surabaya'
            },
            category: { id: 3, name: 'Ekonomi', color: '#F59E0B' }
          },
          { 
            id: 4,
            user_id: '081234567897',
            category_id: 4,
            title: 'Renovasi Musholla',
            description: 'Mohon bantuan untuk renovasi musholla di RT kami yang sudah rusak. Atapnya bocor dan lantainya retak. Diperkirakan butuh dana sekitar 15 juta.',
            status: 'unread',
            resolution: null,
            created_at: '2024-09-17T16:30:00',
            updated_at: '2024-09-17T16:30:00',
            resolved_at: null,
            user: { 
              id: '081234567897',
              name: 'Rina Susanti', 
              telp: '081234567897', 
              village: { id: 4, name: 'Sawahan' },
              address: 'Jl. Sawahan Permai No. 7, Surabaya'
            },
            category: { id: 4, name: 'Keagamaan', color: '#8B5CF6' }
          },
          { 
            id: 5,
            user_id: '081234567894',
            category_id: 1,
            title: 'Pelatihan Komputer',
            description: 'Ingin mengikuti pelatihan komputer untuk meningkatkan skill. Saya ingin belajar Microsoft Office dan desain grafis dasar.',
            status: 'resolved',
            resolution: 'Pelatihan telah dilaksanakan pada 15 September 2024. Peserta telah menerima sertifikat. Terima kasih atas partisipasinya.',
            created_at: '2024-09-10T13:20:00',
            updated_at: '2024-09-20T15:45:00',
            resolved_at: '2024-09-20T15:45:00',
            user: { 
              id: '081234567894',
              name: 'Joko Widodo', 
              telp: '081234567894', 
              village: { id: 1, name: 'Gubeng' },
              address: 'Jl. Gubeng Kertajaya No. 10, Surabaya'
            },
            category: { id: 1, name: 'Pendidikan', color: '#3B82F6' }
          },
          { 
            id: 6,
            user_id: '081234567898',
            category_id: 2,
            title: 'Pemeriksaan Kesehatan Gratis',
            description: 'Mohon info jadwal pemeriksaan kesehatan gratis berikutnya. Ibu saya perlu cek kesehatan rutin.',
            status: 'resolved',
            resolution: 'Pemeriksaan kesehatan gratis akan diadakan tanggal 15 Oktober 2024 di Balai Kelurahan Gubeng, pukul 08.00-14.00 WIB. Harap membawa kartu anggota.',
            created_at: '2024-09-16T09:10:00',
            updated_at: '2024-09-18T10:30:00',
            resolved_at: '2024-09-18T10:30:00',
            user: { 
              id: '081234567898',
              name: 'Agus Salim', 
              telp: '081234567898', 
              village: { id: 5, name: 'Genteng' },
              address: 'Jl. Genteng Besar No. 34, Surabaya'
            },
            category: { id: 2, name: 'Kesehatan', color: '#10B981' }
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'semua' || ticket.status === selectedStatus;
    const matchesCategory = selectedCategory === 'semua' || ticket.category_id === parseInt(selectedCategory);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'unread':
        return { text: 'Belum Dibaca', className: 'status-unread', icon: AlertCircle, color: '#EF4444' };
      case 'read':
        return { text: 'Sudah Dibaca', className: 'status-read', icon: Eye, color: '#F59E0B' };
      case 'in_progress':
        return { text: 'Diproses', className: 'status-progress', icon: Clock, color: '#3B82F6' };
      case 'resolved':
        return { text: 'Selesai', className: 'status-completed', icon: CheckCircle, color: '#10B981' };
      case 'closed':
        return { text: 'Ditutup', className: 'status-closed', icon: CheckCircle, color: '#6B7280' };
      default:
        return { text: status, className: 'status-default', icon: AlertCircle, color: '#6B7280' };
    }
  };

  const handleViewDetail = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailModal(true);
    
    // Mark as read if it was unread
    if (ticket.status === 'unread') {
      // TODO: Call API to update status
      // updateTicketStatus(ticket.id, 'read', null);
      
      setTickets(tickets.map(t => 
        t.id === ticket.id 
          ? { ...t, status: 'read', updated_at: new Date().toISOString() }
          : t
      ));
      setSelectedTicket({ ...ticket, status: 'read' });
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus, resolution) => {
    setUpdateLoading(true);
    
    try {
      // TODO: Call API to update ticket
      // const token = localStorage.getItem('token');
      // const response = await fetch(`http://localhost:3000/api/tickets/${ticketId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     status: newStatus,
      //     resolution: resolution
      //   })
      // });
      // const data = await response.json();
      
      // Simulate API call
      setTimeout(() => {
        const now = new Date().toISOString();
        const resolvedAt = (newStatus === 'resolved' || newStatus === 'closed') ? now : null;
        
        setTickets(tickets.map(t => 
          t.id === ticketId 
            ? { 
                ...t, 
                status: newStatus, 
                resolution: resolution,
                updated_at: now,
                resolved_at: resolvedAt
              }
            : t
        ));
        
        setUpdateLoading(false);
        setShowDetailModal(false);
        
        // Show success notification (you can implement a toast notification)
        alert('Tiket berhasil diupdate!');
      }, 500);
      
    } catch (error) {
      console.error('Error updating ticket:', error);
      setUpdateLoading(false);
      alert('Gagal mengupdate tiket. Silakan coba lagi.');
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">
              <Ticket className="page-icon" />
              Manajemen Tiket
            </h1>
            <p className="page-subtitle">Kelola permintaan bantuan dari anggota</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card red">
            <div className="stat-icon">🔴</div>
            <div className="stat-content">
              <div className="stat-number">{tickets.filter(t => t.status === 'unread').length}</div>
              <div className="stat-description">Belum Dibaca</div>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon">👁️</div>
            <div className="stat-content">
              <div className="stat-number">{tickets.filter(t => t.status === 'read').length}</div>
              <div className="stat-description">Sudah Dibaca</div>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{tickets.filter(t => t.status === 'in_progress').length}</div>
              <div className="stat-description">Diproses</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{tickets.filter(t => t.status === 'resolved').length}</div>
              <div className="stat-description">Selesai</div>
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
                  placeholder="Cari berdasarkan judul, deskripsi, atau nama pemohon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-section">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="semua">Semua Status</option>
                  <option value="unread">Belum Dibaca</option>
                  <option value="read">Sudah Dibaca</option>
                  <option value="in_progress">Diproses</option>
                  <option value="resolved">Selesai</option>
                  <option value="closed">Ditutup</option>
                </select>
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
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Pemohon</th>
                  <th>Deskripsi</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="loading-cell">Memuat data...</td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-cell">Tidak ada data yang ditemukan</td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => {
                    const statusInfo = getStatusInfo(ticket.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr key={ticket.id}>
                        <td className="ticket-title">
                          <strong>{ticket.title}</strong>
                        </td>
                        <td>
                          <div 
                            className="category-badge"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: ticket.category?.color + '20',
                              color: ticket.category?.color,
                              width: 'fit-content'
                            }}
                          >
                            <Tag size={12} />
                            {ticket.category?.name || 'Tanpa Kategori'}
                          </div>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500' }}>{ticket.user?.name}</div>
                            <div style={{ fontSize: '0.85em', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <MapPin size={10} />
                              {ticket.user?.village?.name || '-'}
                            </div>
                          </div>
                        </td>
                        <td style={{ maxWidth: '300px' }}>
                          <div style={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap' 
                          }} title={ticket.description}>
                            {ticket.description}
                          </div>
                        </td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{
                              backgroundColor: statusInfo.color + '20',
                              color: statusInfo.color,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              width: 'fit-content',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.85em'
                            }}
                          >
                            <StatusIcon size={12} />
                            {statusInfo.text}
                          </span>
                        </td>
                        <td>{new Date(ticket.created_at).toLocaleDateString('id-ID')}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="action-btn view"
                              onClick={() => handleViewDetail(ticket)}
                              title="Lihat Detail"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedTicket && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Detail Tiket #{selectedTicket.id}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowDetailModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="ticket-detail">
                  {/* Ticket Information */}
                  <div className="ticket-info-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px',
                    marginBottom: '24px'
                  }}>
                    <div className="info-item">
                      <label style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Judul:</label>
                      <span style={{ fontWeight: '500' }}>{selectedTicket.title}</span>
                    </div>
                    <div className="info-item">
                      <label style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Kategori:</label>
                      <div 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: selectedTicket.category?.color + '20',
                          color: selectedTicket.category?.color,
                          width: 'fit-content'
                        }}
                      >
                        <Tag size={12} />
                        {selectedTicket.category?.name || 'Tanpa Kategori'}
                      </div>
                    </div>
                    <div className="info-item">
                      <label style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Pemohon:</label>
                      <div>
                        <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={14} />
                          {selectedTicket.user?.name}
                        </div>
                        <div style={{ fontSize: '0.9em', color: '#6b7280', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={12} />
                          {selectedTicket.user?.telp}
                        </div>
                      </div>
                    </div>
                    <div className="info-item">
                      <label style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Lokasi:</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} style={{ color: '#6b7280' }} />
                        <div>
                          <div>{selectedTicket.user?.village?.name || '-'}</div>
                          <div style={{ fontSize: '0.85em', color: '#9ca3af' }}>{selectedTicket.user?.address}</div>
                        </div>
                      </div>
                    </div>
                    <div className="info-item">
                      <label style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Status Saat Ini:</label>
                      {(() => {
                        const statusInfo = getStatusInfo(selectedTicket.status);
                        const StatusIcon = statusInfo.icon;
                        return (
                          <span 
                            style={{
                              backgroundColor: statusInfo.color + '20',
                              color: statusInfo.color,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              width: 'fit-content',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '0.9em',
                              fontWeight: '500'
                            }}
                          >
                            <StatusIcon size={14} />
                            {statusInfo.text}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="info-item">
                      <label style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Tanggal Dibuat:</label>
                      <span>{new Date(selectedTicket.created_at).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="ticket-description" style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      fontSize: '0.95em', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '8px', 
                      display: 'block' 
                    }}>
                      Deskripsi Permohonan:
                    </label>
                    <p style={{ 
                      background: '#f9fafb', 
                      padding: '16px', 
                      borderRadius: '8px',
                      lineHeight: '1.6',
                      color: '#4b5563',
                      border: '1px solid #e5e7eb'
                    }}>
                      {selectedTicket.description}
                    </p>
                  </div>

                  {/* Resolution */}
                  {selectedTicket.resolution && (
                    <div className="ticket-resolution" style={{ marginBottom: '24px' }}>
                      <label style={{ 
                        fontSize: '0.95em', 
                        fontWeight: '600', 
                        color: '#374151',
                        marginBottom: '8px', 
                        display: 'block' 
                      }}>
                        Resolusi/Tanggapan:
                      </label>
                      <p style={{ 
                        background: '#ecfdf5', 
                        padding: '16px', 
                        borderRadius: '8px',
                        lineHeight: '1.6',
                        borderLeft: '4px solid #10b981',
                        color: '#065f46'
                      }}>
                        {selectedTicket.resolution}
                      </p>
                      {selectedTicket.resolved_at && (
                        <div style={{ 
                          fontSize: '0.85em', 
                          color: '#6b7280', 
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Clock size={12} />
                          Diselesaikan pada: {new Date(selectedTicket.resolved_at).toLocaleDateString('id-ID', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Update Form */}
                  <div className="response-form" style={{
                    background: '#f9fafb',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <label style={{ 
                      fontSize: '0.95em', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '12px', 
                      display: 'block' 
                    }}>
                      Update Status & Tanggapan:
                    </label>
                    <select 
                      className="filter-select"
                      style={{ 
                        width: '100%', 
                        marginBottom: '12px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db'
                      }}
                      defaultValue={selectedTicket.status}
                      id="status-select"
                    >
                      <option value="unread">Belum Dibaca</option>
                      <option value="read">Sudah Dibaca</option>
                      <option value="in_progress">Diproses</option>
                      <option value="resolved">Selesai</option>
                      <option value="closed">Ditutup</option>
                    </select>
                    <textarea 
                      placeholder="Tulis tanggapan atau resolusi (opsional)..."
                      className="response-textarea"
                      rows="4"
                      id="resolution-textarea"
                      defaultValue={selectedTicket.resolution || ''}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.95em',
                        lineHeight: '1.5',
                        resize: 'vertical'
                      }}
                    />
                    <div className="response-actions" style={{ 
                      display: 'flex',
                      gap: '12px',
                      marginTop: '16px',
                      justifyContent: 'flex-end'
                    }}>
                      <button 
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowDetailModal(false)}
                        disabled={updateLoading}
                      >
                        Batal
                      </button>
                      <button 
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          const newStatus = document.getElementById('status-select').value;
                          const resolution = document.getElementById('resolution-textarea').value;
                          handleUpdateStatus(selectedTicket.id, newStatus, resolution);
                        }}
                        disabled={updateLoading}
                      >
                        {updateLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TiketPage;