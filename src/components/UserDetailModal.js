import React from 'react';
import { X, User, Phone, CreditCard, Home, MapPin, Briefcase, Calendar, CheckCircle, Smartphone } from 'lucide-react';

const UserDetailModal = ({ 
  isOpen, 
  onClose, 
  user, 
  loading 
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCardStatusBadge = (status) => {
    const statusConfig = {
      delivered: { label: 'Terkirim', color: '#10b981', bg: '#d1fae5' },
      pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
      approved: { label: 'Disetujui', color: '#3b82f6', bg: '#dbeafe' },
      printed: { label: 'Dicetak', color: '#8b5cf6', bg: '#ede9fe' },
      processing: { label: 'Diproses', color: '#3b82f6', bg: '#dbeafe' },
      cancelled: { label: 'Dibatalkan', color: '#ef4444', bg: '#fee2e2' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: config.color,
        backgroundColor: config.bg
      }}>
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (roleName) => {
    const roleConfig = {
      admin: { label: 'Admin', color: '#dc2626', bg: '#fee2e2' },
      coordinator: { label: 'Koordinator', color: '#7c3aed', bg: '#ede9fe' },
      member: { label: 'Anggota', color: '#059669', bg: '#d1fae5' }
    };
    
    const config = roleConfig[roleName?.toLowerCase()] || { label: roleName, color: '#6b7280', bg: '#f3f4f6' };
    
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
          maxWidth: '600px',
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
              Detail Pengguna
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
                      backgroundColor: '#3b82f6',
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
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Smartphone size={16} style={{ color: '#10b981' }} />
                            <span style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
                              Mobile App
                            </span>
                          </div>
                        )}
                        {user.role && (
                          <div>
                            {getRoleBadge(user.role.name)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gap: '16px'
                }}>
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

                  {/* Address */}
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
                        Alamat
                      </div>
                      <div style={{ fontWeight: '500', color: '#111827', lineHeight: '1.5' }}>
                        {user.address || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Village */}
                  {user.village && (
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
                          Informasi Kelurahan
                        </span>
                      </div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Nama:</span>
                          <span style={{ fontWeight: '500', color: '#111827' }}>
                            {user.village.name}
                          </span>
                        </div>
                        {user.village.code && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Kode:</span>
                            <code style={{
                              fontWeight: '500',
                              color: '#111827',
                              backgroundColor: '#f3f4f6',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.875rem'
                            }}>
                              {user.village.code}
                            </code>
                          </div>
                        )}
                        {user.village.description && (
                          <div style={{ 
                            marginTop: '4px',
                            paddingTop: '8px',
                            borderTop: '1px solid #e5e7eb'
                          }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {user.village.description}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Status */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={20} style={{ color: '#3b82f6' }} />
                      <span style={{ fontWeight: '500', color: '#111827' }}>Status Kartu:</span>
                    </div>
                    {getCardStatusBadge(user.card_status)}
                  </div>

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
                        {formatDate(user.created_at)}
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
                        {formatDate(user.updated_at)}
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