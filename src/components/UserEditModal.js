import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const UserEditModal = ({ 
  isOpen, 
  onClose, 
  user, 
  villages,
  subVillages,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    telp: '',
    gender: 'male',
    job: '',
    role_id: 3,
    sub_village_id: '',
    nik: '',
    address: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredSubVillages, setFilteredSubVillages] = useState([]);
  const [selectedVillageId, setSelectedVillageId] = useState('');

  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      const birthDate = user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '';
      
      setFormData({
        name: user.name || '',
        birth_date: birthDate,
        telp: user.telp || '',
        gender: user.gender || 'male',
        job: user.job || '',
        role_id: user.role_id || 3,
        sub_village_id: user.sub_village_id || '',
        nik: user.nik || '',
        address: user.address || ''
      });

      // Set village dari sub_village
      if (user.sub_village && user.sub_village.village_id) {
        setSelectedVillageId(user.sub_village.village_id);
        filterSubVillagesByVillage(user.sub_village.village_id);
      }
    }
  }, [user, subVillages]);

  const filterSubVillagesByVillage = (villageId) => {
    if (!villageId || !subVillages) {
      setFilteredSubVillages([]);
      return;
    }
    const filtered = subVillages.filter(sv => sv.village_id === parseInt(villageId));
    setFilteredSubVillages(filtered);
  };

  if (!isOpen) return null;

  const handleVillageChange = (e) => {
    const villageId = e.target.value;
    setSelectedVillageId(villageId);
    filterSubVillagesByVillage(villageId);
    
    // Reset sub_village selection
    setFormData(prev => ({
      ...prev,
      sub_village_id: ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field being edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nama wajib diisi';
    }
    
    if (!formData.birth_date) {
      errors.birth_date = 'Tanggal lahir wajib diisi';
    }
    
    if (!formData.telp.trim()) {
      errors.telp = 'Nomor telepon wajib diisi';
    } else if (!/^08\d{8,12}$/.test(formData.telp)) {
      errors.telp = 'Format nomor telepon tidak valid (contoh: 081234567890)';
    }
    
    if (!formData.gender) {
      errors.gender = 'Jenis kelamin wajib dipilih';
    }
    
    if (!selectedVillageId) {
      errors.village = 'Kabupaten/Kota wajib dipilih';
    }
    
    if (!formData.sub_village_id) {
      errors.sub_village_id = 'Kecamatan wajib dipilih';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare payload - convert to integers
      const payload = {
        name: formData.name.trim(),
        birth_date: formData.birth_date,
        telp: formData.telp.trim(),
        gender: formData.gender,
        job: formData.job.trim() || null,
        role_id: parseInt(formData.role_id),
        sub_village_id: parseInt(formData.sub_village_id),
        nik: formData.nik.trim(),
        address: formData.address.trim()
      };
      
      console.log('Update payload:', payload);
      
      // Call parent's onSuccess with user id and payload
      await onSuccess(user.id, payload);
      
    } catch (error) {
      console.error('Error in form submit:', error);
      alert('Terjadi kesalahan: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onClose}
      >
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'slideUp 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            zIndex: 1,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              Edit Anggota
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.2s',
                opacity: isSubmitting ? 0.5 : 1
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={24} style={{ color: '#6b7280' }} />
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '16px' }}>
                
                {/* Nama */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Nama Lengkap <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: formErrors.name ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      transition: 'border-color 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => !formErrors.name && (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => !formErrors.name && (e.target.style.borderColor = '#d1d5db')}
                  />
                  {formErrors.name && (
                    <span style={{ 
                      color: '#ef4444', 
                      fontSize: '12px', 
                      marginTop: '4px', 
                      display: 'block' 
                    }}>
                      {formErrors.name}
                    </span>
                  )}
                </div>

                {/* Row: Jenis Kelamin dan Tanggal Lahir */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '6px', 
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Jenis Kelamin <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: formErrors.gender ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                    {formErrors.gender && (
                      <span style={{ 
                        color: '#ef4444', 
                        fontSize: '12px', 
                        marginTop: '4px', 
                        display: 'block' 
                      }}>
                        {formErrors.gender}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '6px', 
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Tanggal Lahir <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: formErrors.birth_date ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        transition: 'border-color 0.2s',
                        outline: 'none'
                      }}
                      onFocus={(e) => !formErrors.birth_date && (e.target.style.borderColor = '#3b82f6')}
                      onBlur={(e) => !formErrors.birth_date && (e.target.style.borderColor = '#d1d5db')}
                    />
                    {formErrors.birth_date && (
                      <span style={{ 
                        color: '#ef4444', 
                        fontSize: '12px', 
                        marginTop: '4px', 
                        display: 'block' 
                      }}>
                        {formErrors.birth_date}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row: Telepon dan Role */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '6px', 
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      No. Telepon <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="telp"
                      value={formData.telp}
                      onChange={handleInputChange}
                      placeholder="081234567890"
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: formErrors.telp ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        transition: 'border-color 0.2s',
                        outline: 'none'
                      }}
                      onFocus={(e) => !formErrors.telp && (e.target.style.borderColor = '#3b82f6')}
                      onBlur={(e) => !formErrors.telp && (e.target.style.borderColor = '#d1d5db')}
                    />
                    {formErrors.telp && (
                      <span style={{ 
                        color: '#ef4444', 
                        fontSize: '12px', 
                        marginTop: '4px', 
                        display: 'block' 
                      }}>
                        {formErrors.telp}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '6px', 
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Role
                    </label>
                    <select
                      name="role_id"
                      value={formData.role_id}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
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
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Pekerjaan
                  </label>
                  <input
                    type="text"
                    name="job"
                    value={formData.job}
                    onChange={handleInputChange}
                    placeholder="Contoh: Guru, Dokter, Wiraswasta"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      transition: 'border-color 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                {/* NIK */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    NIK (16 digit) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleInputChange}
                    placeholder="3507091203000001"
                    maxLength="16"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: formErrors.nik ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      transition: 'border-color 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => !formErrors.nik && (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => !formErrors.nik && (e.target.style.borderColor = '#d1d5db')}
                  />
                  {formErrors.nik && (
                    <span style={{ 
                      color: '#ef4444', 
                      fontSize: '12px', 
                      marginTop: '4px', 
                      display: 'block' 
                    }}>
                      {formErrors.nik}
                    </span>
                  )}
                </div>

                {/* Row: Kabupaten dan Kecamatan */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '6px', 
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Kabupaten/Kota <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={selectedVillageId}
                      onChange={handleVillageChange}
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: formErrors.village ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <option value="">Pilih Kabupaten/Kota</option>
                      {villages && villages.map(village => (
                        <option key={village.id} value={village.id}>
                          {village.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.village && (
                      <span style={{ 
                        color: '#ef4444', 
                        fontSize: '12px', 
                        marginTop: '4px', 
                        display: 'block' 
                      }}>
                        {formErrors.village}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '6px', 
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Kecamatan <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      name="sub_village_id"
                      value={formData.sub_village_id}
                      onChange={handleInputChange}
                      disabled={isSubmitting || !selectedVillageId}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: formErrors.sub_village_id ? '2px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        cursor: (isSubmitting || !selectedVillageId) ? 'not-allowed' : 'pointer',
                        opacity: !selectedVillageId ? 0.6 : 1
                      }}
                    >
                      <option value="">Pilih Kecamatan</option>
                      {filteredSubVillages.map(subVillage => (
                        <option key={subVillage.id} value={subVillage.id}>
                          {subVillage.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.sub_village_id && (
                      <span style={{ 
                        color: '#ef4444', 
                        fontSize: '12px', 
                        marginTop: '4px', 
                        display: 'block' 
                      }}>
                        {formErrors.sub_village_id}
                      </span>
                    )}
                  </div>
                </div>

                {/* Alamat */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Alamat Lengkap <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Jl. Merdeka No. 45, Surabaya"
                    rows="3"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: formErrors.address ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      transition: 'border-color 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => !formErrors.address && (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => !formErrors.address && (e.target.style.borderColor = '#d1d5db')}
                  />
                  {formErrors.address && (
                    <span style={{ 
                      color: '#ef4444', 
                      fontSize: '12px', 
                      marginTop: '4px', 
                      display: 'block' 
                    }}>
                      {formErrors.address}
                    </span>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '12px',
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    color: '#374151',
                    borderRadius: '6px',
                    fontWeight: '500',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px',
                    opacity: isSubmitting ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#f9fafb')}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: isSubmitting ? '#93c5fd' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '500',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#2563eb')}
                  onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#3b82f6')}
                >
                  <Save size={16} />
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default UserEditModal;