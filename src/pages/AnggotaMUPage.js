import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import UserDetailModal from '../components/UserDetailModal';
import UserEditModal from '../components/UserEditModal';
import { Search, Filter, UserCheck, Upload, Download, Eye, Edit, Trash2, Plus, MapPin } from 'lucide-react';
import '../styles/CommonPages.css';
import { api } from '../services/api';
import { exportMembersToCSV } from '../utils/exportUtils';

// Note: Tambahkan endpoint berikut ke api.js:
// getCities: () => request('/wilayah/cities'),
// getDistricts: (cityId) => request(`/wilayah/cities/${cityId}/districts`),
// getVillages: (cityId, districtId) => request(`/wilayah/cities/${cityId}/districts/${districtId}/villages`),

const AnggotaMUPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('semua');
  const [selectedDistrict, setSelectedDistrict] = useState('semua');
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Form state untuk add member
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    birth_date: '',
    telp: '',
    gender: 'male',
    job: '',
    job_other: '',
    village_id: '',
    nik: '',
    address: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk dropdown wilayah di form add
  const [selectedCityForAdd, setSelectedCityForAdd] = useState('');
  const [selectedDistrictForAdd, setSelectedDistrictForAdd] = useState('');
  const [filteredDistrictsForAdd, setFilteredDistrictsForAdd] = useState([]);
  const [filteredVillagesForAdd, setFilteredVillagesForAdd] = useState([]);

  // Job options
  const jobOptions = [
    { value: 'Belum / Tidak Bekerja', label: 'Belum / Tidak Bekerja' },
    { value: 'Mengurus Rumah Tangga', label: 'Mengurus Rumah Tangga' },
    { value: 'Pelajar / Mahasiswa', label: 'Pelajar / Mahasiswa' },
    { value: 'Pensiunan', label: 'Pensiunan' },
    { value: 'Pegawai Negeri Sipil (PNS) / ASN', label: 'Pegawai Negeri Sipil (PNS) / ASN' },
    { value: 'TNI / POLRI', label: 'TNI / POLRI' },
    { value: 'Karyawan Swasta', label: 'Karyawan Swasta' },
    { value: 'Karyawan BUMN / BUMD', label: 'Karyawan BUMN / BUMD' },
    { value: 'Wiraswasta', label: 'Wiraswasta' },
    { value: 'Lainnya', label: 'Profesi Lainnya' }
  ];

  useEffect(() => {
    fetchWilayahData();
    fetchMembers();
  }, []);

  useEffect(() => {
    filterDistrictsByCity(selectedCity);
  }, [selectedCity, districts]);

  // Fetch wilayah data dari backend
const fetchWilayahData = async () => {
  try {
    const response = await api.getCities();
    
    // Perbaikan: Ambil data dari properti 'data' jika ada, atau gunakan respons itu sendiri
    // Berdasarkan contoh Postman Anda, yang benar adalah response.data
    const citiesData = response.data || response;
    
    // Jika format API Anda selalu { data: [...] }, maka gunakan ini:
    // const citiesData = response.data;

    // Pastikan citiesData adalah array sebelum memproses
    if (Array.isArray(citiesData)) {
      setCities(citiesData);
      
      // Extract semua districts dan villages (Logika ini sudah benar)
      const allDistricts = [];
      const allVillages = [];
      
      citiesData.forEach(city => {
        if (city.districts && Array.isArray(city.districts)) {
          city.districts.forEach(district => {
            allDistricts.push({
              ...district,
              city_id: city.id,
              city_name: city.name
            });
            
            if (district.villages && Array.isArray(district.villages)) {
              district.villages.forEach(village => {
                allVillages.push({
                  ...village,
                  district_id: district.id,
                  district_name: district.name,
                  city_id: city.id,
                  city_name: city.name
                });
              });
            }
          });
        }
      });
      
      setDistricts(allDistricts);
      setVillages(allVillages);
    } else {
        // Tambahkan error handling jika response.data tidak ada atau bukan array
        console.error('Data wilayah tidak ditemukan di properti "data" atau bukan array.', response);
        setError('Gagal memuat data wilayah: Format respons API tidak sesuai.');
    }
  } catch (error) {
    console.error('Error fetching wilayah data:', error);
    setError('Gagal memuat data wilayah');
  }
};

  const filterDistrictsByCity = (cityId) => {
    if (cityId === 'semua') {
      setFilteredDistricts([]);
      setSelectedDistrict('semua');
      return;
    }
    const filtered = districts.filter(d => d.city_id === cityId);
    setFilteredDistricts(filtered);
  };

  const filterDistrictsForAddForm = (cityId) => {
    if (!cityId) {
      setFilteredDistrictsForAdd([]);
      setFilteredVillagesForAdd([]);
      return;
    }
    const filtered = districts.filter(d => d.city_id === cityId);
    setFilteredDistrictsForAdd(filtered);
  };

  const filterVillagesForAddForm = (districtId) => {
    if (!districtId) {
      setFilteredVillagesForAdd([]);
      return;
    }
    const filtered = villages.filter(v => v.district_id === districtId);
    setFilteredVillagesForAdd(filtered);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getUsers({ 
        page: 1, 
        limit: 1000 
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
                         member.village_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.city_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = selectedCity === 'semua' || 
                       member.city_id === selectedCity;
    
    const matchesDistrict = selectedDistrict === 'semua' || 
                           member.district_id === selectedDistrict;
    
    return matchesSearch && matchesCity && matchesDistrict;
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error untuk field yang diubah
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCityChangeForAdd = (e) => {
    const cityId = e.target.value;
    setSelectedCityForAdd(cityId);
    filterDistrictsForAddForm(cityId);
    setSelectedDistrictForAdd('');
    setFormData(prev => ({ 
      ...prev, 
      village_id: '' 
    }));
    setFilteredVillagesForAdd([]);
  };

  const handleDistrictChangeForAdd = (e) => {
    const districtId = e.target.value;
    setSelectedDistrictForAdd(districtId);
    filterVillagesForAddForm(districtId);
    setFormData(prev => ({ 
      ...prev, 
      village_id: '' 
    }));
  };

  const handleJobChange = (e) => {
    const job = e.target.value;
    setFormData(prev => ({
      ...prev,
      job: job,
      job_other: job === 'Lainnya' ? prev.job_other : ''
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.id.trim()) {
      errors.id = 'ID/Username wajib diisi';
    }
    
    if (!formData.name.trim()) {
      errors.name = 'Nama lengkap wajib diisi';
    }
    
    if (!formData.birth_date) {
      errors.birth_date = 'Tanggal lahir wajib diisi';
    }
    
    if (!formData.telp.trim()) {
      errors.telp = 'No. telepon wajib diisi';
    } else if (!/^[0-9]{10,15}$/.test(formData.telp.trim())) {
      errors.telp = 'No. telepon harus 10-15 digit angka';
    }
    
    if (!formData.job) {
      errors.job = 'Pekerjaan wajib dipilih';
    }
    
    if (formData.job === 'Lainnya' && !formData.job_other.trim()) {
      errors.job_other = 'Harap sebutkan profesi lainnya';
    }
    
    if (!selectedCityForAdd) {
      errors.city = 'Kabupaten/Kota wajib dipilih';
    }
    
    if (!selectedDistrictForAdd) {
      errors.district = 'Kecamatan wajib dipilih';
    }
    
    if (!formData.village_id) {
      errors.village_id = 'Kelurahan/Desa wajib dipilih';
    }
    
    if (!formData.nik.trim()) {
      errors.nik = 'NIK wajib diisi';
    } else if (!/^[0-9]{16}$/.test(formData.nik.trim())) {
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
      const finalJob = formData.job === 'Lainnya' ? formData.job_other : formData.job;
      
      const payload = {
        id: formData.id.trim(),
        name: formData.name.trim(),
        password: 'password123', // Default password
        birth_date: formData.birth_date + 'T00:00:00Z',
        telp: formData.telp.trim(),
        gender: formData.gender,
        job: finalJob || null,
        role_id: 3, // Default role: member
        village_id: formData.village_id,
        nik: formData.nik.trim(),
        address: formData.address.trim(),
        is_mobile: false // Default: tidak mobile
      };
      
      console.log('Submitting payload:', payload);
      
      const response = await api.createUser(payload);
      
      console.log('Create user response:', response);
      
      setShowAddModal(false);
      resetForm();
      await fetchMembers();
      alert('Anggota berhasil ditambahkan! Password default: password123');
      
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Gagal menambahkan anggota: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      birth_date: '',
      telp: '',
      gender: 'male',
      job: '',
      job_other: '',
      village_id: '',
      nik: '',
      address: ''
    });
    setFormErrors({});
    setSelectedCityForAdd('');
    setSelectedDistrictForAdd('');
    setFilteredDistrictsForAdd([]);
    setFilteredVillagesForAdd([]);
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
            <div className="stat-icon">👨</div>
            <div className="stat-content">
              <div className="stat-number">
                {members.filter(m => m.gender === 'male').length}
              </div>
              <div className="stat-description">Laki-laki</div>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">👩</div>
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
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="filter-select"
                >
                  <option value="semua">Semua Kabupaten/Kota</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="filter-select"
                  disabled={selectedCity === 'semua'}
                >
                  <option value="semua">Semua Kecamatan</option>
                  {filteredDistricts.map(district => (
                    <option key={district.id} value={district.id}>
                      {district.name}
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
                            {member.village_name || '-'}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                            {member.district_name || '-'}, {member.city_name || '-'}
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

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={handleCloseAddModal}>
            <div 
              className="modal-content" 
              onClick={e => e.stopPropagation()} 
              style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}
            >
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
                    
                    {/* ID/Username */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        ID/Username <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleInputChange}
                        placeholder="Contoh: user123"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: formErrors.id ? '1px solid #ef4444' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      {formErrors.id && (
                        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                          {formErrors.id}
                        </span>
                      )}
                      <small style={{ color: '#6b7280', fontSize: '12px' }}>
                        Password default: password123
                      </small>
                    </div>

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

                    {/* No. Telepon */}
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

                    {/* Pekerjaan */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                        Pekerjaan <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        name="job"
                        value={formData.job}
                        onChange={handleJobChange}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: formErrors.job ? '1px solid #ef4444' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Pilih Pekerjaan</option>
                        {jobOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {formErrors.job && (
                        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                          {formErrors.job}
                        </span>
                      )}
                    </div>

                    {/* Input Pekerjaan Lainnya (jika dipilih) */}
                    {formData.job === 'Lainnya' && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                          Sebutkan Profesi Lainnya <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="job_other"
                          value={formData.job_other}
                          onChange={handleInputChange}
                          placeholder="Contoh: Freelancer, Designer, dll"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: formErrors.job_other ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                        {formErrors.job_other && (
                          <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {formErrors.job_other}
                          </span>
                        )}
                      </div>
                    )}

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

                    {/* Wilayah Section */}
                    <div style={{ 
                      padding: '12px', 
                      background: '#f9fafb', 
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
                        <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        Wilayah Domisili
                      </h4>
                      
                      {/* Kabupaten/Kota */}
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                          Kabupaten/Kota <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                          value={selectedCityForAdd}
                          onChange={handleCityChangeForAdd}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: formErrors.city ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Pilih Kabupaten/Kota</option>
                          {cities.map(city => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.city && (
                          <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {formErrors.city}
                          </span>
                        )}
                      </div>

                      {/* Kecamatan */}
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                          Kecamatan <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                          value={selectedDistrictForAdd}
                          onChange={handleDistrictChangeForAdd}
                          disabled={!selectedCityForAdd}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: formErrors.district ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            opacity: !selectedCityForAdd ? 0.6 : 1,
                            cursor: !selectedCityForAdd ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <option value="">Pilih Kecamatan</option>
                          {filteredDistrictsForAdd.map(district => (
                            <option key={district.id} value={district.id}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.district && (
                          <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {formErrors.district}
                          </span>
                        )}
                      </div>

                      {/* Kelurahan/Desa */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                          Kelurahan/Desa <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                          name="village_id"
                          value={formData.village_id}
                          onChange={handleInputChange}
                          disabled={!selectedDistrictForAdd}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: formErrors.village_id ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            opacity: !selectedDistrictForAdd ? 0.6 : 1,
                            cursor: !selectedDistrictForAdd ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <option value="">Pilih Kelurahan/Desa</option>
                          {filteredVillagesForAdd.map(village => (
                            <option key={village.id} value={village.id}>
                              {village.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.village_id && (
                          <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                            {formErrors.village_id}
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
                        placeholder="Jl. Merdeka No. 45, RT 01/RW 02"
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

                    {/* Info Default Values */}
                    <div style={{
                      padding: '12px',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#1e40af'
                    }}>
                      <strong>ℹ️ Informasi:</strong>
                      <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                        <li>Password default: <code>password123</code></li>
                        <li>Role: Member (3)</li>
                        <li>Akses Mobile App: Tidak aktif</li>
                      </ul>
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
                    <li>Kolom wajib: <strong>id, name, birth_date, telp, gender, village_id, nik, address</strong></li>
                    <li>Format tanggal: YYYY-MM-DD (contoh: 1990-05-15)</li>
                    <li>Gender: male atau female</li>
                    <li>village_id harus sesuai dengan data wilayah (contoh: 3576011001)</li>
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
{`id,name,birth_date,telp,gender,job,village_id,nik,address
user001,Budi Santoso,1990-05-15,081234567890,male,Guru,3576011001,3576011234567890,Jl. Merdeka No.1`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <UserEditModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          user={editingUser}
          cities={cities}
          districts={districts}
          villages={villages}
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

export default AnggotaMUPage