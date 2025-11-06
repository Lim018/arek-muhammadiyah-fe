import React, { useState, useEffect } from 'react';
import UserDetailModal from '../components/UserDetailModal';

function PenggunaMobile({ token }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('semua');
  const [selectedDistrict, setSelectedDistrict] = useState('semua');
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (token) {
      fetchWilayahData();
      fetchMobileUsers();
    }
  }, [token]);
  
  useEffect(() => {
    filterDistrictsByCity(selectedCity);
  }, [selectedCity, districts]);

  const fetchWilayahData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cities', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      const citiesData = result.data || result;
      
      if (Array.isArray(citiesData)) {
        setCities(citiesData);
        
        const allDistricts = [];
        
        citiesData.forEach(city => {
          if (city.districts && Array.isArray(city.districts)) {
            city.districts.forEach(district => {
              allDistricts.push({
                ...district,
                city_id: city.id,
                city_name: city.name
              });
            });
          }
        });
        
        setDistricts(allDistricts);
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

  const fetchMobileUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8080/api/users/mobile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      let usersData = [];
      
      if (result.data && Array.isArray(result.data)) {
        usersData = result.data;
      } else if (Array.isArray(result)) {
        usersData = result;
      }

      setUsers(usersData);
      
    } catch (error) {
      console.error('Error fetching mobile users:', error);
      setError(error.message || 'Gagal memuat data pengguna mobile');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (userId) => {
    setShowModal(true);
    setLoadingDetail(true);
    setSelectedUser(null);
    
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      const userData = result.data || result;
      setSelectedUser(userData);
    } catch (error) {
      console.error('Error fetching user detail:', error);
      alert('Gagal memuat detail pengguna');
      setShowModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = user.name?.toLowerCase().includes(searchTermLower) ||
                         user.telp?.includes(searchTerm) ||
                         user.nik?.includes(searchTerm) ||
                         user.village_name?.toLowerCase().includes(searchTermLower) ||
                         user.city_name?.toLowerCase().includes(searchTermLower);
    
    const matchesCity = selectedCity === 'semua' || user.city_id === selectedCity;
    const matchesDistrict = selectedDistrict === 'semua' || user.district_id === selectedDistrict;
    
    return matchesSearch && matchesCity && matchesDistrict;
  });

  const uniqueVillagesCount = new Set(users.map(u => u.village_id)).size;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Pengguna Mobile App</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Anggota yang menggunakan aplikasi mobile
        </p>
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

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Pengguna</h3>
          <div className="stat-value" style={{ color: '#3b82f6' }}>
            {users.length}
          </div>
        </div>
        <div className="stat-card">
          <h3>Akun Aktif</h3>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {users.filter(u => u.is_mobile).length}
          </div>
        </div>
        <div className="stat-card">
          <h3>Kelurahan Terdaftar</h3>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>
            {uniqueVillagesCount}
          </div>
        </div>
      </div>

      <div className="page-container" style={{ background: 'white', marginTop: '20px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Cari berdasarkan nama, NIK, telepon, atau wilayah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="semua">Semua Kabupaten/Kota</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={selectedCity === 'semua'}
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="semua">Semua Kecamatan</option>
              {filteredDistricts.map(district => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>No. Telepon</th>
                <th>Wilayah Domisili</th>
                <th>NIK</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    Memuat data...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    {error ? 'Terjadi kesalahan saat memuat data' : 'Tidak ada pengguna mobile yang ditemukan'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📞 {user.telp || '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>
                        <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                          {user.village_name || '-'}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '12px' }}>
                          {user.district_name || '-'}, {user.city_name || '-'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ 
                        fontSize: '13px', 
                        background: '#f3f4f6', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        💳 {user.nik || '-'}
                      </code>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }} title={user.address}>
                        {user.address || '-'}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-view" 
                          onClick={() => handleViewDetail(user.id)}
                          title="Lihat Detail"
                        >
                          👁️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && filteredUsers.length > 0 && (
          <div style={{ 
            padding: '16px 20px', 
            borderTop: '1px solid #e5e7eb',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Menampilkan {filteredUsers.length} dari {users.length} pengguna mobile
          </div>
        )}
      </div>

      {showModal && (
        <UserDetailModal
          isOpen={showModal}
          onClose={closeModal}
          user={selectedUser}
          loading={loadingDetail}
        />
      )}
    </div>
  );
};

export default PenggunaMobile;