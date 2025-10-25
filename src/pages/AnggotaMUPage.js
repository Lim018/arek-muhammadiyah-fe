import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import UserDetailModal from '../components/UserDetailModal';
import UserEditModal from '../components/UserEditModal';
import { Search, Filter, UserCheck, Upload, Download, Eye, Edit, Trash2, Plus, MapPin } from 'lucide-react';
import '../styles/CommonPages.css';
import { api } from '../services/api';
import { exportMembersToCSV } from '../utils/exportUtils';

const AnggotaMUPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState('semua');
  const [selectedSubVillage, setSelectedSubVillage] = useState('semua');
  const [villages, setVillages] = useState([]);
  const [subVillages, setSubVillages] = useState([]);
  const [filteredSubVillages, setFilteredSubVillages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    birth_date: '',
    telp: '',
    gender: 'male',
    job: '',
    role_id: 3,
    sub_village_id: '',
    nik: '',
    address: '',
    is_mobile: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVillageForAdd, setSelectedVillageForAdd] = useState('');
  const [filteredSubVillagesForAdd, setFilteredSubVillagesForAdd] = useState([]);

  useEffect(() => {
    fetchVillages();
    fetchSubVillages();
    fetchMembers();
  }, []);

  useEffect(() => {
    filterSubVillagesByVillage(selectedVillage);
  }, [selectedVillage, subVillages]);

  const fetchVillages = async () => {
    try {
      const response = await api.getVillages({ active: true });
      const villagesData = response.data || response;
      
      if (Array.isArray(villagesData)) {
        setVillages(villagesData);
      } else {
        console.error('Format villages tidak sesuai:', villagesData);
      }
    } catch (error) {
      console.error('Error fetching villages:', error);
      setVillages([
        { id: 1, name: 'Surabaya', code: 'KAB-SBY-001' },
        { id: 2, name: 'Sidoarjo', code: 'KAB-SDA-002' },
        { id: 3, name: 'Gresik', code: 'KAB-GRK-003' },
      ]);
    }
  };

  const fetchSubVillages = async () => {
    try {
      const response = await api.getSubVillages({ active: true });
      const subVillagesData = response.data || response;
      
      if (Array.isArray(subVillagesData)) {
        setSubVillages(subVillagesData);
      } else {
        console.error('Format sub villages tidak sesuai:', subVillagesData);
      }
    } catch (error) {
      console.error('Error fetching sub villages:', error);
    }
  };

  const filterSubVillagesByVillage = (villageId) => {
    if (villageId === 'semua') {
      setFilteredSubVillages([]);
      setSelectedSubVillage('semua');
      return;
    }
    const filtered = subVillages.filter(sv => sv.village_id === parseInt(villageId));
    setFilteredSubVillages(filtered);
  };

  const filterSubVillagesForAddForm = (villageId) => {
    if (!villageId) {
      setFilteredSubVillagesForAdd([]);
      return;
    }
    const filtered = subVillages.filter(sv => sv.village_id === parseInt(villageId));
    setFilteredSubVillagesForAdd(filtered);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getUsers({ 
        page: 1, 
        limit: 100 
      });
      
      console.log('API Response:', response);
      
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
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (filteredMembers.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }
    exportMembersToCSV(filteredMembers);
  };

  const handleViewDetail = async (userId) => {
    setShowDetailModal(true);
    setLoadingDetail(true);
    setSelectedUser(null);
    try {
      const response = await api.getUser(userId);
      const userData = response.data || response;
      setSelectedUser(userData);
    } catch (err) {
      console.error("Error fetching user detail:", err);
      alert('Gagal memuat detail anggota.');
      setShowDetailModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleUpdateUser = async (userId, payload) => {
    try {
      await api.updateUser(userId, payload);
      alert('Data anggota berhasil diperbarui!');
      handleCloseEditModal();
      await fetchMembers();
    } catch (error) {
      console.error('Error updating user:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Gagal memperbarui data: ${errorMessage}`);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.nik?.includes(searchTerm) ||
                         member.telp?.includes(searchTerm) ||
                         member.sub_village?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.sub_village?.village?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVillage = selectedVillage === 'semua' || 
                          member.sub_village?.village_id === parseInt(selectedVillage);
    
    const matchesSubVillage = selectedSubVillage === 'semua' || 
                             member.sub_village_id === parseInt(selectedSubVillage);
    
    return matchesSearch && matchesVillage && matchesSubVillage;
  });

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      return;
    }

    try {
      await api.deleteUser(id);
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
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleVillageChangeForAdd = (e) => {
    const villageId = e.target.value;
    setSelectedVillageForAdd(villageId);
    filterSubVillagesForAddForm(villageId);
    setFormData(prev => ({ ...prev, sub_village_id: '' }));
  };

  const validateForm = () => {
    const errors = {};
    
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
      const payload = {
        name: formData.name.trim(),
        password: formData.password,
        birth_date: formData.birth_date,
        telp: formData.telp.trim(),
        gender: formData.gender,
        job: formData.job.trim() || null,
        role_id: parseInt(formData.role_id),
        sub_village_id: parseInt(formData.sub_village_id),
        nik: formData.nik.trim(),
        address: formData.address.trim(),
        is_mobile: formData.is_mobile
      };
      
      console.log('Submitting payload:', payload);
      
      const response = await api.createUser(payload);
      
      console.log('Create user response:', response);
      
      setShowAddModal(false);
      resetForm();
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
      birth_date: '',
      telp: '',
      gender: 'male',
      job: '',
      role_id: 3,
      sub_village_id: '',
      nik: '',
      address: '',
      is_mobile: false
    });
    setFormErrors({});
    setSelectedVillageForAdd('');
    setFilteredSubVillagesForAdd([]);
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
          <div className="stat-card green">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <div className="stat-number">
                {members.filter(m => m.gender === 'male').length}
              </div>
              <div className="stat-description">Laki-laki</div>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <div className="stat-number">
                {members.filter(m => m.gender === 'female').length}
              </div>
              <div className="stat-description">Perempuan</div>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon">📱</div>
            <div className="stat-content">
              <div className="stat-number">
                {members.filter(m => m.is_mobile).length}
              </div>
              <div className="stat-description">Pengguna Mobile</div>
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
                  placeholder="Cari berdasarkan nama, NIK, telepon, atau wilayah..."
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
                  <option value="semua">Semua Kabupaten/Kota</option>
                  {villages.map(village => (
                    <option key={village.id} value={village.id}>{village.name}</option>
                  ))}
                </select>
                <select
                  value={selectedSubVillage}
                  onChange={(e) => setSelectedSubVillage(e.target.value)}
                  className="filter-select"
                  disabled={selectedVillage === 'semua'}
                >
                  <option value="semua">Semua Kecamatan</option>
                  {filteredSubVillages.map(subVillage => (
                    <option key={subVillage.id} value={subVillage.id}>
                      {subVillage.name}
                    </option>
                  ))}
                </select>
                <button className="btn btn-outline" onClick={handleExportData}>
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
                  <th>Jenis Kelamin</th>
                  <th>Usia</th>
                  <th>No. Telepon</th>
                  <th>Wilayah</th>
                  <th>NIK</th>
                  <th>Pekerjaan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="loading-cell">Memuat data...</td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-cell">
                      {error ? 'Gagal memuat data' : 'Tidak ada data yang ditemukan'}
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="member-name">
                        <strong>{member.name}</strong>
                        {member.is_mobile && (
                          <span style={{
                            marginLeft: '6px',
                            fontSize: '0.75rem',
                            color: '#059669',
                            backgroundColor: '#d1fae5',
                            padding: '2px 6px',
                            borderRadius: '8px'
                          }}>
                            📱
                          </span>
                        )}
                      </td>
                      <td>
                        {member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                      </td>
                      <td>
                        {member.birth_date ? `${calculateAge(member.birth_date)} tahun` : '-'}
                      </td>
                      <td>{member.telp || '-'}</td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                            {member.sub_village?.name || '-'}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                            {member.sub_village?.village?.name || '-'}
                          </div>
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
                      <td>{member.job || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view" 
                            title="Lihat Detail"
                            onClick={() => handleViewDetail(member.id)}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="action-btn edit" 
                            title="Edit"
                            onClick={() => handleOpenEditModal(member)}
                          >
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
                    <li>Kolom wajib: <strong>name, password, birth_date, telp, gender, sub_village_id, nik, address</strong></li>
                    <li>Format tanggal: YYYY-MM-DD (contoh: 1990-05-15)</li>
                    <li>Gender: male atau female</li>
                    <li>Maksimal 1000 data per upload</li>
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
{`name,password,birth_date,telp,gender,job,role_id,sub_village_id,nik,address
Budi,password123,1990-05-15,081234567890,male,Guru,3,1,3578011234567890,Jl. Test`}
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
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
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

                    {/* Row: Jenis Kelamin dan Tanggal Lahir */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                          Jenis Kelamin <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="male">Laki-laki</option>
                          <option value="female">Perempuan</option>
                        </select>
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                          Tanggal Lahir <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="date"
                          name="birth_date"
                          value={formData.birth_date}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: formErrors.birth_date ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                        {formErrors.birth_date && (
                          <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {formErrors.birth_date}
                          </span>
                        )}
                      </div>
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
                          <option value="2">Operator</option>
                          <option value="3">Member</option>
                        </select>
                      </div>
                    </div>

                    {/* Pekerjaan */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Pekerjaan
                      </label>
                      <input
                        type="text"
                        name="job"
                        value={formData.job}
                        onChange={handleInputChange}
                        placeholder="Contoh: Guru, Dokter, Wiraswasta"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
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

                    {/* Row: Kabupaten dan Kecamatan */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                          Kabupaten/Kota <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                          value={selectedVillageForAdd}
                          onChange={handleVillageChangeForAdd}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: formErrors.village ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Pilih Kabupaten/Kota</option>
                          {villages.map(village => (
                            <option key={village.id} value={village.id}>
                              {village.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.village && (
                          <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {formErrors.village}
                          </span>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                          Kecamatan <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                          name="sub_village_id"
                          value={formData.sub_village_id}
                          onChange={handleInputChange}
                          disabled={!selectedVillageForAdd}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: formErrors.sub_village_id ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            opacity: !selectedVillageForAdd ? 0.6 : 1
                          }}
                        >
                          <option value="">Pilih Kecamatan</option>
                          {filteredSubVillagesForAdd.map(subVillage => (
                            <option key={subVillage.id} value={subVillage.id}>
                              {subVillage.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.sub_village_id && (
                          <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {formErrors.sub_village_id}
                          </span>
                        )}
                      </div>
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

                    {/* Akses Mobile */}
                    <div>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          name="is_mobile"
                          checked={formData.is_mobile}
                          onChange={handleInputChange}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>Berikan akses Mobile App</span>
                      </label>
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

        <UserEditModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          user={editingUser}
          villages={villages}
          subVillages={subVillages}
          onSuccess={handleUpdateUser}
        />
        <UserDetailModal
          isOpen={showDetailModal}
          onClose={closeDetailModal}
          user={selectedUser}
          loading={loadingDetail}
        />
      </div>
    </Layout>
  );
};

export default AnggotaMUPage;