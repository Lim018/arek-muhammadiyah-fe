import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, Filter, UserCheck, Upload, Download, Eye, Edit, Trash2, Plus, MapPin } from 'lucide-react';
import '../styles/CommonPages.css';
import { api } from '../services/api';

const AnggotaMUPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState('semua');
  const [selectedCardStatus, setSelectedCardStatus] = useState('semua');
  const [villages, setVillages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    telp: '',
    role_id: 3, // default: member
    village_id: '',
    nik: '',
    address: '',
    card_status: 'pending',
    is_mobile: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchVillages();
    fetchMembers();
  }, []);

  const fetchVillages = async () => {
    try {
      const response = await api.getVillages({ active: true });
      
      // Handle response format: { success, data: [...] } atau langsung array
      const villagesData = response.data || response;
      
      if (Array.isArray(villagesData)) {
        setVillages(villagesData);
      } else {
        console.error('Format villages tidak sesuai:', villagesData);
      }
    } catch (error) {
      console.error('Error fetching villages:', error);
      // Fallback ke dummy data jika API gagal
      setVillages([
        { id: 1, name: 'Gubeng', code: 'SBY-GBG-001' },
        { id: 2, name: 'Airlangga', code: 'SBY-ARL-002' },
        { id: 3, name: 'Wonokromo', code: 'SBY-WNK-003' },
        { id: 4, name: 'Sawahan', code: 'SBY-SWH-004' },
        { id: 5, name: 'Genteng', code: 'SBY-GTG-005' },
      ]);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call API with pagination params
      const response = await api.getUsers({ 
        page: 1, 
        limit: 100 
      });
      
      console.log('API Response:', response);
      
      // Handle response format
      // Backend returns: { success: true, message: "...", data: [...] }
      let membersData = [];
      
      if (response.data && Array.isArray(response.data)) {
        membersData = response.data;
      } else if (Array.isArray(response)) {
        membersData = response;
      } else {
        throw new Error('Format response tidak sesuai');
      }
      
      console.log('Members data:', membersData);
      setMembers(membersData);
      
    } catch (error) {
      console.error('Error fetching members:', error);
      setError(error.message || 'Gagal memuat data anggota');
      
      // Optional: Show dummy data jika API gagal (untuk development)
      // Uncomment jika ingin fallback ke dummy data
      /*
      setMembers([
        { 
          id: 1,
          name: 'Budi Santoso',
          telp: '081234567890',
          village_id: 1,
          village: { id: 1, name: 'Gubeng', code: 'SBY-GBG-001' },
          nik: '3578011234567890',
          address: 'Jl. Gubeng Pojok No. 15, Surabaya',
          card_status: 'delivered',
          role: { id: 1, name: 'admin' }
        },
      ]);
      */
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.nik?.includes(searchTerm) ||
                         member.telp?.includes(searchTerm) ||
                         member.village?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      return;
    }

    try {
      await api.deleteUser(id);
      // Refresh data setelah delete
      fetchMembers();
      alert('Anggota berhasil dihapus');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Gagal menghapus anggota: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error untuk field yang sedang diubah
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nama wajib diisi';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }
    
    if (!formData.telp.trim()) {
      errors.telp = 'Nomor telepon wajib diisi';
    } else if (!/^08\d{8,12}$/.test(formData.telp)) {
      errors.telp = 'Format nomor telepon tidak valid (contoh: 081234567890)';
    }
    
    if (!formData.village_id) {
      errors.village_id = 'Kelurahan wajib dipilih';
    }
    
    if (!formData.nik.trim()) {
      errors.nik = 'NIK wajib diisi';
    } else if (!/^\d{16}$/.test(formData.nik)) {
      errors.nik = 'NIK harus 16 digit angka';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Alamat wajib diisi';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert village_id dan role_id ke integer
      const payload = {
        ...formData,
        role_id: parseInt(formData.role_id),
        village_id: parseInt(formData.village_id)
      };
      
      console.log('Submitting payload:', payload);
      
      const response = await api.createUser(payload);
      
      console.log('Create user response:', response);
      
      // Tutup modal dan reset form
      setShowAddModal(false);
      resetForm();
      
      // Refresh data
      await fetchMembers();
      
      alert('Anggota berhasil ditambahkan!');
      
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Gagal menambahkan anggota: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      password: '',
      telp: '',
      role_id: 3,
      village_id: '',
      nik: '',
      address: '',
      card_status: 'pending',
      is_mobile: false
    });
    setFormErrors({});
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetForm();
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
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} />
              Tambah Anggota
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            color: '#991B1B',
            marginBottom: '16px'
          }}>
            ⚠️ {error}
          </div>
        )}

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
                    <td colSpan="7" className="empty-cell">
                      {error ? 'Gagal memuat data' : 'Tidak ada data yang ditemukan'}
                    </td>
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
                          <button 
                            className="action-btn delete" 
                            title="Hapus"
                            onClick={() => handleDelete(member.id)}
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

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={handleCloseAddModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="modal-header">
                <h2>Tambah Anggota Baru</h2>
                <button 
                  className="modal-close"
                  onClick={handleCloseAddModal}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitAdd}>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    
                    {/* Nama */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Nama Lengkap <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: formErrors.name ? '1px solid #ef4444' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      {formErrors.name && (
                        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                          {formErrors.name}
                        </span>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Password <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Minimal 6 karakter"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: formErrors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      {formErrors.password && (
                        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                          {formErrors.password}
                        </span>
                      )}
                    </div>

                    {/* Row: Telepon dan Role */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                          No. Telepon <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="telp"
                          value={formData.telp}
                          onChange={handleInputChange}
                          placeholder="081234567890"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: formErrors.telp ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                        {formErrors.telp && (
                          <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {formErrors.telp}
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                          Role
                        </label>
                        <select
                          name="role_id"
                          value={formData.role_id}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="1">Admin</option>
                          <option value="2">Koordinator</option>
                          <option value="3">Member</option>
                        </select>
                      </div>
                    </div>

                    {/* NIK */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        NIK (16 digit) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="nik"
                        value={formData.nik}
                        onChange={handleInputChange}
                        placeholder="3507091203000001"
                        maxLength="16"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: formErrors.nik ? '1px solid #ef4444' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      {formErrors.nik && (
                        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                          {formErrors.nik}
                        </span>
                      )}
                    </div>

                    {/* Kelurahan */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Kelurahan <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        name="village_id"
                        value={formData.village_id}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: formErrors.village_id ? '1px solid #ef4444' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Pilih Kelurahan</option>
                        {villages.map(village => (
                          <option key={village.id} value={village.id}>
                            {village.name} ({village.code})
                          </option>
                        ))}
                      </select>
                      {formErrors.village_id && (
                        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                          {formErrors.village_id}
                        </span>
                      )}
                    </div>

                    {/* Alamat */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Alamat Lengkap <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Jl. Merdeka No. 45, Surabaya"
                        rows="3"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: formErrors.address ? '1px solid #ef4444' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                      />
                      {formErrors.address && (
                        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                          {formErrors.address}
                        </span>
                      )}
                    </div>

                    {/* Row: Status Kartu dan Is Mobile */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                          Status Kartu
                        </label>
                        <select
                          name="card_status"
                          value={formData.card_status}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Disetujui</option>
                          <option value="printed">Dicetak</option>
                          <option value="delivered">Terkirim</option>
                        </select>
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                          &nbsp;
                        </label>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          padding: '10px 12px',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="checkbox"
                            name="is_mobile"
                            checked={formData.is_mobile}
                            onChange={handleInputChange}
                            style={{ cursor: 'pointer' }}
                          />
                          <span>Akses Mobile App</span>
                        </label>
                      </div>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '12px',
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <button
                      type="button"
                      onClick={handleCloseAddModal}
                      className="btn btn-outline"
                      disabled={isSubmitting}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Menyimpan...' : 'Simpan Anggota'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AnggotaMUPage;