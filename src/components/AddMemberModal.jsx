import React, { useState, useEffect } from 'react';
// Tidak perlu import uuid, lihat penjelasan di bawah

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

const AddMemberModal = ({ isOpen, onClose, cities, districts, villages, onSuccess, token }) => {
  const [formData, setFormData] = useState({
    // id: '', // <-- DIHILANGKAN
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
  const [selectedCityForAdd, setSelectedCityForAdd] = useState('');
  const [selectedDistrictForAdd, setSelectedDistrictForAdd] = useState('');
  const [filteredDistrictsForAdd, setFilteredDistrictsForAdd] = useState([]);
  const [filteredVillagesForAdd, setFilteredVillagesForAdd] = useState([]);

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

  useEffect(() => {
    filterDistrictsForAddForm(selectedCityForAdd); 
  }, [selectedCityForAdd, districts]);

  useEffect(() => {
    filterVillagesForAddForm(selectedDistrictForAdd);
  }, [selectedDistrictForAdd, villages]);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      // id: '', // <-- DIHILANGKAN
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

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCityChangeForAdd = (e) => {
    const cityId = e.target.value;
    setSelectedCityForAdd(cityId);
    setSelectedDistrictForAdd('');
    setFormData(prev => ({ 
      ...prev, 
      village_id: '' 
    }));
  };

  const handleDistrictChangeForAdd = (e) => {
    const districtId = e.target.value;
    setSelectedDistrictForAdd(districtId);
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
    
    // if (!formData.id.trim()) errors.id = 'ID/Username wajib diisi'; // <-- DIHILANGKAN
    if (!formData.name.trim()) errors.name = 'Nama lengkap wajib diisi';
    if (!formData.birth_date) errors.birth_date = 'Tanggal lahir wajib diisi';
    
    if (!formData.telp.trim()) {
      errors.telp = 'No. telepon wajib diisi';
    } else if (!/^[0-9]{10,15}$/.test(formData.telp.trim())) {
      errors.telp = 'No. telepon harus 10-15 digit angka';
    }
    
    if (!formData.job) errors.job = 'Pekerjaan wajib dipilih';
    
    if (formData.job === 'Lainnya' && !formData.job_other.trim()) {
      errors.job_other = 'Harap sebutkan profesi lainnya';
    }
    
    if (!selectedCityForAdd) errors.city = 'Kabupaten/Kota wajib dipilih';
    if (!selectedDistrictForAdd) errors.district = 'Kecamatan wajib dipilih';
    if (!formData.village_id) errors.village_id = 'Kelurahan/Desa wajib dipilih';
    
    if (!formData.nik.trim()) {
      errors.nik = 'NIK wajib diisi';
    } else if (!/^[0-9]{16}$/.test(formData.nik.trim())) {
      errors.nik = 'NIK harus 16 digit angka';
    }
    
    if (!formData.address.trim()) errors.address = 'Alamat wajib diisi';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const finalJob = formData.job === 'Lainnya' ? formData.job_other : formData.job;
      
      const payload = {
        // id: formData.id.trim(), // <-- DIHILANGKAN
        name: formData.name.trim(),
        password: 'password123', 
        birth_date: formData.birth_date + 'T00:00:00Z',
        telp: formData.telp.trim(),
        gender: formData.gender,
        job: finalJob || null,
        role_id: 3, 
        village_id: formData.village_id,
        nik: formData.nik.trim(),
        address: formData.address.trim(),
        is_mobile: false 
      };
      
      console.log('Submitting payload:', payload);
      
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Gagal menambahkan anggota');
      }
      
      handleCloseModal();
      onSuccess(); 
      alert('Anggota berhasil ditambahkan! Password default: password123');
      
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Gagal menambahkan anggota: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: '700px', 
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="modal-header">
          <h2>Tambah Anggota Baru</h2>
          <button 
            className="modal-close"
            onClick={handleCloseModal}
          >
            ×
          </button>
        </div>
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
          <form onSubmit={handleSubmitAdd} id="addMemberForm">
            <div style={{ display: 'grid', gap: '16px' }}>
              
              {/* --- BLOK ID/USERNAME DIHILANGKAN --- */}
              
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
                  📍 Wilayah Domisili
                </h4>
                
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
                form="addMemberForm"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Anggota'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;