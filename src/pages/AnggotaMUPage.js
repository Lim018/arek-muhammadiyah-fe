import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, Filter, UserCheck, Upload, Download, Eye, Edit, Trash2, Plus, MapPin } from 'lucide-react';
import '../styles/CommonPages.css';

const AnggotaMUPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState('semua');
  const [selectedCardStatus, setSelectedCardStatus] = useState('semua');
  const [villages, setVillages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    // Fetch villages
    fetchVillages();
    // Fetch members
    fetchMembers();
  }, []);

  const fetchVillages = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:3000/api/villages?active=true');
      // const data = await response.json();
      
      // Dummy data
      setVillages([
        { id: 1, name: 'Gubeng', code: 'SBY-GBG-001' },
        { id: 2, name: 'Airlangga', code: 'SBY-ARL-002' },
        { id: 3, name: 'Wonokromo', code: 'SBY-WNK-003' },
        { id: 4, name: 'Sawahan', code: 'SBY-SWH-004' },
        { id: 5, name: 'Genteng', code: 'SBY-GTG-005' },
      ]);
    } catch (error) {
      console.error('Error fetching villages:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token');
      // const response = await fetch('http://localhost:3000/api/users?page=1&limit=100', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Dummy data sesuai struktur database baru
      setTimeout(() => {
        setMembers([
          { 
            id: '081234567890',
            name: 'Budi Santoso',
            telp: '081234567890',
            village_id: 1,
            village: { id: 1, name: 'Gubeng', code: 'SBY-GBG-001' },
            nik: '3578011234567890',
            address: 'Jl. Gubeng Pojok No. 15, Surabaya',
            card_status: 'delivered',
            role: { id: 1, name: 'admin' }
          },
          { 
            id: '081234567891',
            name: 'Siti Nurhaliza',
            telp: '081234567891',
            village_id: 2,
            village: { id: 2, name: 'Airlangga', code: 'SBY-ARL-002' },
            nik: '3578012234567891',
            address: 'Jl. Airlangga No. 45, Surabaya',
            card_status: 'delivered',
            role: { id: 1, name: 'admin' }
          },
          { 
            id: '081234567894',
            name: 'Joko Widodo',
            telp: '081234567894',
            village_id: 1,
            village: { id: 1, name: 'Gubeng', code: 'SBY-GBG-001' },
            nik: '3578015234567894',
            address: 'Jl. Gubeng Kertajaya No. 10, Surabaya',
            card_status: 'delivered',
            role: { id: 3, name: 'member' }
          },
          { 
            id: '081234567895',
            name: 'Sri Mulyani',
            telp: '081234567895',
            village_id: 2,
            village: { id: 2, name: 'Airlangga', code: 'SBY-ARL-002' },
            nik: '3578016234567895',
            address: 'Jl. Airlangga Dalam No. 5, Surabaya',
            card_status: 'delivered',
            role: { id: 3, name: 'member' }
          },
          { 
            id: '081234567896',
            name: 'Bambang Sutopo',
            telp: '081234567896',
            village_id: 3,
            village: { id: 3, name: 'Wonokromo', code: 'SBY-WNK-003' },
            nik: '3578017234567896',
            address: 'Jl. Wonokromo Indah No. 12, Surabaya',
            card_status: 'approved',
            role: { id: 3, name: 'member' }
          },
          { 
            id: '081234567897',
            name: 'Rina Susanti',
            telp: '081234567897',
            village_id: 4,
            village: { id: 4, name: 'Sawahan', code: 'SBY-SWH-004' },
            nik: '3578018234567897',
            address: 'Jl. Sawahan Permai No. 7, Surabaya',
            card_status: 'printed',
            role: { id: 3, name: 'member' }
          },
          { 
            id: '081234567898',
            name: 'Agus Salim',
            telp: '081234567898',
            village_id: 5,
            village: { id: 5, name: 'Genteng', code: 'SBY-GTG-005' },
            nik: '3578019234567898',
            address: 'Jl. Genteng Besar No. 34, Surabaya',
            card_status: 'pending',
            role: { id: 3, name: 'member' }
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching members:', error);
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.nik?.includes(searchTerm) ||
                         member.telp?.includes(searchTerm) ||
                         member.village?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVillage = selectedVillage === 'semua' || member.village_id === parseInt(selectedVillage);
    const matchesCardStatus = selectedCardStatus === 'semua' || member.card_status === selectedCardStatus;
    
    return matchesSearch && matchesVillage && matchesCardStatus;
  });

  const cardStatusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'approved', label: 'Disetujui', color: 'blue' },
    { value: 'printed', label: 'Dicetak', color: 'purple' },
    { value: 'delivered', label: 'Terkirim', color: 'green' }
  ];

  const getCardStatusLabel = (status) => {
    const statusObj = cardStatusOptions.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const getCardStatusColor = (status) => {
    const statusObj = cardStatusOptions.find(s => s.value === status);
    return statusObj ? statusObj.color : 'gray';
  };

  const cardStatusCounts = {
    pending: members.filter(m => m.card_status === 'pending').length,
    approved: members.filter(m => m.card_status === 'approved').length,
    printed: members.filter(m => m.card_status === 'printed').length,
    delivered: members.filter(m => m.card_status === 'delivered').length,
  };

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
          <div className="stat-card yellow">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{cardStatusCounts.pending}</div>
              <div className="stat-description">Pending</div>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">🖨️</div>
            <div className="stat-content">
              <div className="stat-number">{cardStatusCounts.printed}</div>
              <div className="stat-description">Dicetak</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{cardStatusCounts.delivered}</div>
              <div className="stat-description">Terkirim</div>
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
                <select
                  value={selectedCardStatus}
                  onChange={(e) => setSelectedCardStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="semua">Semua Status Kartu</option>
                  {cardStatusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
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
                  <th>Nama</th>
                  <th>No. Telepon</th>
                  <th>Kelurahan</th>
                  <th>NIK</th>
                  <th>Alamat</th>
                  <th>Status Kartu</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="loading-cell">Memuat data...</td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-cell">Tidak ada data yang ditemukan</td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="member-name">
                        <strong>{member.name}</strong>
                      </td>
                      <td>{member.telp || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} style={{ color: '#6b7280' }} />
                          {member.village?.name || '-'}
                        </div>
                      </td>
                      <td>
                        <code style={{ 
                          fontSize: '0.85em', 
                          background: '#f3f4f6', 
                          padding: '2px 6px', 
                          borderRadius: '4px' 
                        }}>
                          {member.nik || '-'}
                        </code>
                      </td>
                      <td style={{ maxWidth: '250px' }}>
                        <div style={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }} title={member.address}>
                          {member.address || '-'}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${getCardStatusColor(member.card_status)}`}>
                          {getCardStatusLabel(member.card_status)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view" title="Lihat Detail">
                            <Eye size={16} />
                          </button>
                          <button className="action-btn edit" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button className="action-btn delete" title="Hapus">
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

          {/* Pagination */}
          {!loading && filteredMembers.length > 0 && (
            <div className="pagination">
              <button className="btn btn-outline" disabled>
                Previous
              </button>
              <span className="pagination-info">
                Menampilkan {filteredMembers.length} dari {members.length} anggota
              </span>
              <button className="btn btn-outline" disabled>
                Next
              </button>
            </div>
          )}
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
                  <input 
                    type="file" 
                    accept=".xlsx,.csv" 
                    className="file-input"
                    style={{ display: 'none' }}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="btn btn-primary">
                    Pilih File
                  </label>
                </div>
                <div className="upload-instructions">
                  <h4>Petunjuk Upload:</h4>
                  <ul>
                    <li>File harus berformat .xlsx atau .csv</li>
                    <li>Kolom wajib: <strong>id, name, password, telp, village_id, nik, address</strong></li>
                    <li>Format CSV: id,name,password,telp,role_id,village_id,nik,address,card_status</li>
                    <li>Maksimal 1000 data per upload</li>
                    <li>Password akan di-hash secara otomatis oleh sistem</li>
                  </ul>
                  <div style={{ marginTop: '16px', padding: '12px', background: '#f3f4f6', borderRadius: '6px' }}>
                    <strong>Contoh format CSV:</strong>
                    <pre style={{ 
                      fontSize: '0.8em', 
                      overflow: 'auto', 
                      padding: '8px',
                      background: 'white',
                      borderRadius: '4px',
                      marginTop: '8px'
                    }}>
{`id,name,password,telp,role_id,village_id,nik,address,card_status
081234567890,Budi,password123,081234567890,3,1,3578011234567890,Jl. Test,pending
081234567891,Ani,password123,081234567891,3,2,3578012234567891,Jl. Test 2,pending`}
                    </pre>
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

export default AnggotaMUPage;