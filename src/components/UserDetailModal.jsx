import React from 'react';

const UserDetailModal = ({ isOpen, onClose, user, loading }) => {
  if (!isOpen) return null;

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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '600px',
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="modal-header">
          <h2>Detail Anggota</h2>
          <button 
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Memuat data...
            </div>
          ) : !user ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Data tidak ditemukan
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Header dengan Status */}
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                color: 'white'
              }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>
                  {user.name}
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {user.is_mobile && (
                    <span style={{
                      padding: '4px 10px',
                      background: 'rgba(255, 255, 255, 0.25)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      📱 Pengguna Mobile
                    </span>
                  )}
                  <span style={{
                    padding: '4px 10px',
                    background: 'rgba(255, 255, 255, 0.25)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {user.gender === 'male' ? '👨 Laki-laki' : '👩 Perempuan'}
                  </span>
                </div>
              </div>

              {/* Data Pribadi */}
              <div>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  Data Pribadi
                </h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>NIK</span>
                    <code style={{ 
                      fontSize: '14px', 
                      background: '#f3f4f6', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {user.nik || '-'}
                    </code>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Tanggal Lahir</span>
                    <strong style={{ fontSize: '14px' }}>{formatDate(user.birth_date)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Usia</span>
                    <strong style={{ fontSize: '14px' }}>
                      {user.birth_date ? `${calculateAge(user.birth_date)} tahun` : '-'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Pekerjaan</span>
                    <strong style={{ fontSize: '14px' }}>{user.job || '-'}</strong>
                  </div>
                </div>
              </div>

              {/* Kontak */}
              <div>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  Kontak
                </h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>No. Telepon</span>
                    <strong style={{ fontSize: '14px' }}>
                      {user.telp ? `📞 ${user.telp}` : '-'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Alamat & Wilayah */}
              <div>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  Alamat & Wilayah
                </h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ padding: '8px 0' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Alamat Lengkap
                    </span>
                    <strong style={{ fontSize: '14px' }}>{user.address || '-'}</strong>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Kelurahan/Desa
                    </span>
                    <strong style={{ fontSize: '14px' }}>{user.village_name || '-'}</strong>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Kecamatan
                    </span>
                    <strong style={{ fontSize: '14px' }}>{user.district_name || '-'}</strong>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      Kabupaten/Kota
                    </span>
                    <strong style={{ fontSize: '14px' }}>{user.city_name || '-'}</strong>
                  </div>
                </div>
              </div>

              {/* Info Tambahan */}
              {(user.created_at || user.updated_at) && (
                <div style={{
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  {user.created_at && (
                    <div>Terdaftar: {formatDate(user.created_at)}</div>
                  )}
                  {user.updated_at && (
                    <div>Terakhir diubah: {formatDate(user.updated_at)}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'sticky',
          bottom: 0,
          background: 'white'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;