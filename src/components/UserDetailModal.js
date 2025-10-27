import React from 'react';
import { X, User, Phone, CreditCard, Home, MapPin, Briefcase, Calendar, Users, Cake } from 'lucide-react';

const UserDetailModal = ({ 
  isOpen, 
  onClose, 
  user, 
  loading 
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    // Gunakan tanggal sebagai objek Date
    const date = new Date(dateString); 
    // Format tanggal hanya jika date valid
    if (isNaN(date.getTime())) return dateString; 
    
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; 
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '-';
    const birth = new Date(birthDate);
    const today = new Date();
    
    if (isNaN(birth.getTime())) return '-';

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getRoleBadge = (roleName) => {
    const roleConfig = {
      admin: { label: 'Admin', color: '#dc2626', bg: '#fee2e2' },
      operator: { label: 'Operator', color: '#7c3aed', bg: '#ede9fe' },
      member: { label: 'Anggota', color: '#059669', bg: '#d1fae5' }
    };
    
    // Asumsi: properti role adalah objek, misalnya user.role.name
    const roleDisplay = roleName?.toLowerCase() || 'member'; 
    const config = roleConfig[roleDisplay] || { label: roleName, color: '#6b7280', bg: '#f3f4f6' };
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: config.color,
        backgroundColor: config.bg,
        textTransform: 'capitalize'
      }}>
        {config.label}
      </span>
    );
  };

  const getGenderLabel = (gender) => {
    if (!gender) return '-';
    return gender?.toLowerCase() === 'male' ? 'Laki-laki' : 'Perempuan';
  };

  return (
    <>
      <div style={{
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
        <div style={{
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
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <User size={24} style={{ color: '#3b82f6' }} />
              Detail Anggota
            </h2>
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={24} style={{ color: '#6b7280' }} />
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ padding: '24px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ 
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '16px', color: '#6b7280' }}>Memuat detail...</p>
              </div>
            ) : user ? (
              <div>
                {/* User Info Section */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: user.gender?.toLowerCase() === 'female' ? '#ec4899' : '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '600'
                    }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '8px'
                      }}>
                        {user.name}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap'
                      }}>
                        {user.is_mobile && (
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            color: '#059669',
                            backgroundColor: '#d1fae5',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            📱 Mobile App
                          </span>
                        )}
                        {/* Mengakses role name, misal: user.role.name */}
                        {user.role?.name && getRoleBadge(user.role.name)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gap: '16px'
                }}>
                  {/* Personal Info Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    {/* Jenis Kelamin */}
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '6px'
                      }}>
                        <Users size={16} style={{ color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Jenis Kelamin
                        </span>
                      </div>
                      <div style={{ fontWeight: '500', color: '#111827' }}>
                        {getGenderLabel(user.gender)}
                      </div>
                    </div>

                    {/* Tanggal Lahir */}
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '6px'
                      }}>
                        <Cake size={16} style={{ color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Tanggal Lahir
                        </span>
                      </div>
                      <div style={{ fontWeight: '500', color: '#111827' }}>
                        {formatDate(user.birth_date)}
                        {user.birth_date && (
                          <span style={{ 
                            marginLeft: '8px', 
                            fontSize: '0.875rem', 
                            color: '#6b7280' 
                          }}>
                            ({calculateAge(user.birth_date)} tahun)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <Phone size={20} style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                        No. Telepon
                      </div>
                      <div style={{ fontWeight: '500', color: '#111827' }}>
                        {user.telp || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Pekerjaan */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <Briefcase size={20} style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                        Pekerjaan
                      </div>
                      <div style={{ fontWeight: '500', color: '#111827' }}>
                        {user.job || '-'}
                      </div>
                    </div>
                  </div>

                  {/* NIK */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <CreditCard size={20} style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                        NIK
                      </div>
                      <div style={{ 
                        fontWeight: '500', 
                        color: '#111827',
                        fontFamily: 'monospace',
                        fontSize: '0.95rem'
                      }}>
                        {user.nik || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Alamat (Rincian) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <Home size={20} style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                        Alamat Lengkap
                      </div>
                      <div style={{ fontWeight: '500', color: '#111827', lineHeight: '1.5' }}>
                        {user.address || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Location Info (DISESUAIKAN) */}
                  {(user.village_name || user.district_name || user.city_name) && (
                    <div style={{
                      padding: '16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px'
                      }}>
                        <MapPin size={20} style={{ color: '#3b82f6' }} />
                        <span style={{ fontWeight: '600', color: '#111827' }}>
                          Informasi Wilayah
                        </span>
                      </div>
                      <div style={{ display: 'grid', gap: '10px' }}>
                        
                        {/* Kelurahan/Desa */}
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>
                            Kelurahan/Desa
                          </div>
                          <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>
                            {user.village_name || '-'}
                            {user.village_id && (
                              <code style={{
                                marginLeft: '8px',
                                fontSize: '0.75rem',
                                backgroundColor: '#f3f4f6',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 'normal'
                              }}>
                                {user.village_id}
                              </code>
                            )}
                          </div>
                        </div>

                        {/* Kecamatan */}
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>
                            Kecamatan
                          </div>
                          <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>
                            {user.district_name || '-'}
                            {user.district_id && (
                              <code style={{
                                marginLeft: '8px',
                                fontSize: '0.75rem',
                                backgroundColor: '#f3f4f6',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 'normal'
                              }}>
                                {user.district_id}
                              </code>
                            )}
                          </div>
                        </div>

                        {/* Kabupaten/Kota */}
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>
                            Kabupaten/Kota
                          </div>
                          <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>
                            {user.city_name || '-'}
                            {user.city_id && (
                              <code style={{
                                marginLeft: '8px',
                                fontSize: '0.75rem',
                                backgroundColor: '#f3f4f6',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 'normal'
                              }}>
                                {user.city_id}
                              </code>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginTop: '8px'
                  }}>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '6px'
                      }}>
                        <Calendar size={16} style={{ color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Dibuat
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                        {formatDateTime(user.created_at)}
                      </div>
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '6px'
                      }}>
                        <Calendar size={16} style={{ color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Diperbarui
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                        {formatDateTime(user.updated_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Tidak ada data
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'white',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
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

export default UserDetailModal;