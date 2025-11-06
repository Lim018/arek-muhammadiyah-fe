import React, { useState, useEffect } from 'react';

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

const UserEditModal = ({ isOpen, onClose, user, cities, districts, villages, onSuccess, token }) => {
  const [formData, setFormData] = useState({
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
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);

  useEffect(() => {
    if (user && isOpen) {
      // Parse birth_date
      let birthDateValue = '';
      if (user.birth_date) {
        const date = new Date(user.birth_date);
        birthDateValue = date.toISOString().split('T')[0];
      }

      // Check if job is custom (not in predefined options)
      const isCustomJob = user.job && !jobOptions.find(opt => opt.value === user.job);
      
      setFormData({
        name: user.name || '',
        birth_date: birthDateValue,
        telp: user.telp || '',
        gender: user.gender || 'male',
        job: isCustomJob ? 'Lainnya' : (user.job || ''),
        job_other: isCustomJob ? user.job : '',
        village_id: user.village_id || '',
        nik: user.nik || '',
        address: user.address || ''
      });

      // Set wilayah
      if (user.city_id) {
        setSelectedCity(user.city_id);
      }
      if (user.district_id) {
        setSelectedDistrict(user.district_id);
      }
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (selectedCity) {
      const filtered = districts.filter(d => d.city_id === selectedCity);
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
      setFilteredVillages([]);
    }
  }, [selectedCity, districts]);

  useEffect(() => {
    if (selectedDistrict) {
      const filtered = villages.filter(v => v.district_id === selectedDistrict);
      setFilteredVillages(filtered);
    } else {
      setFilteredVillages([]);
    }
  }, [selectedDistrict, villages]);

  if (!isOpen || !user) return null;

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

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setSelectedDistrict('');
    setFormData(prev => ({ 
      ...prev, 
      village_id: '' 
    }));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
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
    
    if (!selectedCity) errors.city = 'Kabupaten/Kota wajib dipilih';
    if (!selectedDistrict) errors.district = 'Kecamatan wajib dipilih';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const finalJob = formData.job === 'Lainnya' ? formData.job_other : formData.job;
      
      const payload = {
        name: formData.name.trim(),
        birth_date: formData.birth_date + 'T00:00:00Z',
        telp: formData.telp.trim(),
        gender: formData.gender,
        job: finalJob || null,
        village_id: formData.village_id,
        nik: formData.nik.trim(),
        address: formData.address.trim()
      };
      
      console.log('Updating user:', user.id, payload);
      
      await onSuccess(user.id, payload);
      
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
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
          <h2>Edit Data Anggota</h2>
          <button 
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
          <form onSubmit={handleSubmit} id="editUserForm">
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
                    value={selectedCity}
                    onChange={handleCityChange}
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
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!selectedCity}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: formErrors.district ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      opacity: !selectedCity ? 0.6 : 1,
                      cursor: !selectedCity ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="">Pilih Kecamatan</option>
                    {filteredDistricts.map(district => (
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
                    disabled={!selectedDistrict}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: formErrors.village_id ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      opacity: !selectedDistrict ? 0.6 : 1,
                      cursor: !selectedDistrict ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="">Pilih Kelurahan/Desa</option>
                    {filteredVillages.map(village => (
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
                onClick={onClose}
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
                form="editUserForm"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;