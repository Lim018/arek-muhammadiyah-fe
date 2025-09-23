import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Ticket, Search, Filter, Eye, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import '../styles/CommonPages.css';

const TiketPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setTickets([
        { 
          id: 1, 
          title: 'Bantuan Biaya Pengobatan', 
          category: 'Bantuan Kesehatan', 
          categoryColor: '#ef4444',
          submitter: 'Ahmad Ridwan', 
          phone: '081234567890',
          location: 'Jakarta Selatan',
          status: 'belum_dibaca', 
          priority: 'tinggi',
          submittedDate: '2024-09-20',
          description: 'Saya membutuhkan bantuan untuk biaya pengobatan ibu saya yang sedang sakit...',
          responses: []
        },
        { 
          id: 2, 
          title: 'Bantuan Beasiswa Kuliah', 
          category: 'Bantuan Pendidikan', 
          categoryColor: '#3b82f6',
          submitter: 'Siti Aisyah', 
          phone: '081234567891',
          location: 'Bandung',
          status: 'sudah_dibaca', 
          priority: 'sedang',
          submittedDate: '2024-09-19',
          description: 'Mohon bantuan beasiswa untuk melanjutkan kuliah semester depan...',
          responses: [
            { id: 1, message: 'Terima kasih atas pengajuan Anda. Sedang kami proses.', date: '2024-09-19', admin: 'Admin Pendidikan' }
          ]
        },
        { 
          id: 3, 
          title: 'Bantuan Modal Usaha', 
          category: 'Bantuan Ekonomi', 
          categoryColor: '#10b981',
          submitter: 'Muhammad Fauzi', 
          phone: '081234567892',
          location: 'Surabaya',
          status: 'selesai', 
          priority: 'rendah',
          submittedDate: '2024-09-15',
          description: 'Membutuhkan bantuan modal untuk usaha warung makan...',
          responses: [
            { id: 1, message: 'Pengajuan Anda telah disetujui. Silakan datang ke kantor.', date: '2024-09-16', admin: 'Admin Ekonomi' },
            { id: 2, message: 'Bantuan telah disalurkan. Semoga bermanfaat.', date: '2024-09-18', admin: 'Admin Ekonomi' }
          ]
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.submitter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'semua' || ticket.status === selectedStatus;
    const matchesCategory = selectedCategory === 'semua' || ticket.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'belum_dibaca':
        return { text: 'Belum Dibaca', className: 'status-unread', icon: AlertCircle };
      case 'sudah_dibaca':
        return { text: 'Sudah Dibaca', className: 'status-read', icon: Clock };
      case 'selesai':
        return { text: 'Selesai', className: 'status-completed', icon: CheckCircle };
      default:
        return { text: status, className: 'status-default', icon: AlertCircle };
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'tinggi': return 'priority-high';
      case 'sedang': return 'priority-medium';
      case 'rendah': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const handleViewDetail = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailModal(true);
    
    // Mark as read if it was unread
    if (ticket.status === 'belum_dibaca') {
      setTickets(tickets.map(t => 
        t.id === ticket.id 
          ? { ...t, status: 'sudah_dibaca' }
          : t
      ));
    }
  };

  const categories = ['Bantuan Kesehatan', 'Bantuan Pendidikan', 'Bantuan Ekonomi', 'Bantuan Keagamaan', 'Masalah Teknis'];

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
              <div className="stat-number">{tickets.filter(t => t.status === 'belum_dibaca').length}</div>
              <div className="stat-description">Belum Dibaca</div>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon">🟡</div>
            <div className="stat-content">
              <div className="stat-number">{tickets.filter(t => t.status === 'sudah_dibaca').length}</div>
              <div className="stat-description">Sudah Dibaca</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{tickets.filter(t => t.status === 'selesai').length}</div>
              <div className="stat-description">Selesai</div>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">🎫</div>
            <div className="stat-content">
              <div className="stat-number">{tickets.length}</div>
              <div className="stat-description">Total Tiket</div>
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
                  placeholder="Cari berdasarkan judul, nama, atau lokasi..."
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
                  <option value="belum_dibaca">Belum Dibaca</option>
                  <option value="sudah_dibaca">Sudah Dibaca</option>
                  <option value="selesai">Selesai</option>
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="semua">Semua Kategori</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
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
                  <th>Lokasi</th>
                  <th>Prioritas</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="loading-cell">Memuat data...</td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-cell">Tidak ada data yang ditemukan</td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => {
                    const statusInfo = getStatusInfo(ticket.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr key={ticket.id}>
                        <td className="ticket-title">{ticket.title}</td>
                        <td>
                          <div className="category-badge">
                            <div 
                              className="category-color" 
                              style={{ backgroundColor: ticket.categoryColor }}
                            ></div>
                            {ticket.category}
                          </div>
                        </td>
                        <td>{ticket.submitter}</td>
                        <td>{ticket.location}</td>
                        <td>
                          <span className={`priority-badge ${getPriorityClass(ticket.priority)}`}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${statusInfo.className}`}>
                            <StatusIcon size={14} />
                            {statusInfo.text}
                          </span>
                        </td>
                        <td>{new Date(ticket.submittedDate).toLocaleDateString('id-ID')}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="action-btn view"
                              onClick={() => handleViewDetail(ticket)}
                            >
                              <Eye size={16} />
                            </button>
                            <button className="action-btn reply">
                              <MessageSquare size={16} />
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
                <h2>Detail Tiket</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowDetailModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="ticket-detail">
                  <div className="ticket-info-grid">
                    <div className="info-item">
                      <label>Judul:</label>
                      <span>{selectedTicket.title}</span>
                    </div>
                    <div className="info-item">
                      <label>Kategori:</label>
                      <div className="category-badge">
                        <div 
                          className="category-color" 
                          style={{ backgroundColor: selectedTicket.categoryColor }}
                        ></div>
                        {selectedTicket.category}
                      </div>
                    </div>
                    <div className="info-item">
                      <label>Pemohon:</label>
                      <span>{selectedTicket.submitter}</span>
                    </div>
                    <div className="info-item">
                      <label>No. Telepon:</label>
                      <span>{selectedTicket.phone}</span>
                    </div>
                    <div className="info-item">
                      <label>Lokasi:</label>
                      <span>{selectedTicket.location}</span>
                    </div>
                    <div className="info-item">
                      <label>Tanggal:</label>
                      <span>{new Date(selectedTicket.submittedDate).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  
                  <div className="ticket-description">
                    <label>Deskripsi:</label>
                    <p>{selectedTicket.description}</p>
                  </div>

                  <div className="ticket-responses">
                    <label>Riwayat Tanggapan:</label>
                    {selectedTicket.responses.length === 0 ? (
                      <p className="no-responses">Belum ada tanggapan</p>
                    ) : (
                      selectedTicket.responses.map(response => (
                        <div key={response.id} className="response-item">
                          <div className="response-header">
                            <strong>{response.admin}</strong>
                            <span className="response-date">{new Date(response.date).toLocaleDateString('id-ID')}</span>
                          </div>
                          <p>{response.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="response-form">
                    <label>Tambah Tanggapan:</label>
                    <textarea 
                      placeholder="Tulis tanggapan Anda..."
                      className="response-textarea"
                      rows="4"
                    />
                    <div className="response-actions">
                      <button className="btn btn-primary">Kirim Tanggapan</button>
                      <button className="btn btn-success">Tandai Selesai</button>
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