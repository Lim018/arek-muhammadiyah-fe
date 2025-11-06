import React, { useState, useEffect, useCallback } from 'react';
import UserDetailModal from '../components/UserDetailModal';
import UserEditModal from '../components/UserEditModal';
import AddMemberModal from '../components/AddMemberModal';

// Tentukan limit per halaman
const PAGE_LIMIT = 10;

function AnggotaTerdaftar({ token }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState([]); // Sekarang hanya berisi data per halaman
  const [loading, setLoading] = useState(true);
  
  // State Filter
  const [selectedCity, setSelectedCity] = useState('semua');
  const [selectedDistrict, setSelectedDistrict] = useState('semua');
  
  // State Wilayah Dropdown
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  
  // State Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  
  // State Error & Export
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // --- State Baru untuk Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState(null); // { current_page, per_page, total_pages, total_items }

  // --- Memuat data Wilayah (hanya sekali) ---
  useEffect(() => {
    fetchWilayahData();
  }, []);

  // --- Fungsi Fetch Wilayah (Tidak berubah) ---
  const fetchWilayahData = async () => {
    try {
      const response = await fetch('/data/wilayah.json'); 
      const citiesData = await response.json();
      
      if (Array.isArray(citiesData)) {
        setCities(citiesData);
        const allDistricts = [];
        const allVillages = [];
        citiesData.forEach(city => {
          if (city.districts && Array.isArray(city.districts)) {
            city.districts.forEach(district => {
              allDistricts.push({ ...district, city_id: city.id, city_name: city.name });
              if (district.villages && Array.isArray(district.villages)) {
                district.villages.forEach(village => {
                  allVillages.push({ ...village, district_id: district.id, district_name: district.name, city_id: city.id, city_name: city.name });
                });
              }
            });
          }
        });
        setDistricts(allDistricts);
        setVillages(allVillages);
      }
    } catch (error) {
      console.error('Error fetching wilayah data:', error);
      setError('Gagal memuat data wilayah');
    }
  };

  // --- Fungsi Fetch Anggota (Dimodifikasi Total) ---
  const fetchMembers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Bangun query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: PAGE_LIMIT,
      });

      // 2. Tambahkan filter ke query
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (selectedCity !== 'semua') {
        params.append('city_id', selectedCity);
      }
      if (selectedDistrict !== 'semua') {
        params.append('district_id', selectedDistrict);
      }

      // 3. Panggil API dengan query params
      const response = await fetch(`http://localhost:8080/api/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      // 4. Set state berdasarkan PaginatedResponse dari backend
      if (result.success && result.data && result.pagination) {
        setMembers(Array.isArray(result.data) ? result.data : []);
        setPaginationInfo(result.pagination);
      } else {
        throw new Error(result.message || 'Gagal memuat data anggota');
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err.message || 'Gagal memuat data anggota');
      setMembers([]);
      setPaginationInfo(null);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, searchTerm, selectedCity, selectedDistrict]); // <-- dependensi fetchMembers

  // --- Effect untuk memanggil fetchMembers ---
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]); // <-- Dipanggil setiap kali dependensi fetchMembers berubah

  // --- Effect untuk mereset halaman ke 1 jika filter berubah ---
  useEffect(() => {
    // Hanya reset jika currentPage BUKAN 1
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCity, selectedDistrict]); // <-- Jangan tambahkan currentPage di sini

  // --- (Fungsi-fungsi lain tidak berubah banyak) ---

  useEffect(() => {
    filterDistrictsByCity(selectedCity);
  }, [selectedCity, districts]);

  const filterDistrictsByCity = (cityId) => {
    if (cityId === 'semua') {
      setFilteredDistricts([]);
      setSelectedDistrict('semua'); // Otomatis reset kecamatan
      return;
    }
    const filtered = districts.filter(d => d.city_id === cityId);
    setFilteredDistricts(filtered);
  };

  const handleViewDetail = async (userId) => {
    setShowDetailModal(true);
    setLoadingDetail(true);
    setSelectedUser(null);
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      setSelectedUser(result.data || result);
    } catch (err) {
      console.error("Error fetching user detail:", err);
      alert('Gagal memuat detail anggota.');
      setShowDetailModal(false);
    } finally {
      setLoadingDetail(false);
    }
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
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Update failed');
      alert('Data anggota berhasil diperbarui!');
      handleCloseEditModal();
      fetchMembers(); // Panggil ulang fetchMembers
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Gagal memperbarui data: ${error.message}`);
    }
  };
  
  const handleAddSuccess = () => {
    // Panggil ulang fetchMembers, idealnya di halaman 1 jika ingin data baru muncul
    // Tapi untuk simplicity, kita refresh halaman saat ini
    fetchMembers(); 
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) return;
    try {
      const response = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Delete failed');
      fetchMembers(); // Panggil ulang fetchMembers
      alert('Anggota berhasil dihapus');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Gagal menghapus anggota: ' + error.message);
    }
  };

  // --- Fungsi utilitas (tidak berubah) ---
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };
  const formatDateForCSV = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  // --- PERHATIAN: EXPORT CSV SEKARANG HANYA MENGEKSPOR DATA DI HALAMAN SAAT INI ---
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    const headers = ['ID', 'Nama', 'NIK', 'Jenis Kelamin', 'Tanggal Lahir', 'Usia', 'No. Telepon', 'Pekerjaan', 'Alamat', 'Kelurahan/Desa', 'Kecamatan', 'Kabupaten/Kota', 'Role', 'Pengguna Mobile', 'Tanggal Terdaftar'];
    const rows = data.map(member => {
      const age = calculateAge(member.birth_date);
      return [
        member.id || '', member.name || '', member.nik || '',
        member.gender === 'male' ? 'Laki-laki' : member.gender === 'female' ? 'Perempuan' : '',
        formatDateForCSV(member.birth_date), age ? `${age} tahun` : '',
        member.telp || '', member.job || '', member.address || '',
        member.village_name || '', member.district_name || '', member.city_name || '',
        member.role?.name || '', member.is_mobile ? 'Ya' : 'Tidak',
        formatDateForCSV(member.created_at)
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  };

  const handleExportCSV = () => {
    // Peringatan: Ini hanya mengekspor 'members' (data di halaman saat ini)
    if (members.length === 0) {
      alert('Tidak ada data untuk diekspor di halaman ini');
      return;
    }
    setIsExporting(true);
    try {
      const csv = convertToCSV(members);
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `data-anggota-halaman-${currentPage}-${timestamp}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert(`Berhasil mengekspor ${members.length} data anggota (halaman ${currentPage})`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Gagal mengekspor data ke CSV');
    } finally {
      setIsExporting(false);
    }
  };
  
  // --- Fungsi ganti halaman ---
  const handlePageChange = (newPage) => {
    if (newPage > 0 && paginationInfo && newPage <= paginationInfo.total_pages) {
      setCurrentPage(newPage);
    }
  };

  // --- KARTU STATISTIK: PERHATIAN ---
  // Angka-angka ini sekarang TIDAK AKURAT (kecuali Total Anggota).
  // Mereka hanya menghitung dari 10 data di halaman saat ini.
  const maleOnPage = members.filter(m => m.gender === 'male').length;
  const femaleOnPage = members.filter(m => m.gender === 'female').length;
  const mobileOnPage = members.filter(m => m.is_mobile).length;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* --- Header (Tombol Export & Tambah) --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>Anggota Terdaftar</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px', margin: 0 }}>
            {paginationInfo ? `Total ${paginationInfo.total_items} anggota ditemukan` : 'Kelola data anggota'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCSV}
            disabled={isExporting || members.length === 0}
            style={{
              padding: '10px 20px',
              background: isExporting || members.length === 0 ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isExporting || members.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            {isExporting ? '⏳ Mengekspor...' : '📥 Download CSV (Halaman Ini)'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            ➕ Tambah Anggota
          </button>
        </div>
      </div>

      {/* --- Error Message --- */}
      {error && (
        <div style={{ padding: '12px 16px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', marginBottom: '16px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* --- Kartu Statistik (ANGKA SEBAGIAN TIDAK AKURAT) --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>Total Anggota</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>
            {paginationInfo ? paginationInfo.total_items : (loading ? '...' : 0)}
          </div>
        </div>
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>Laki-laki (Halaman Ini)</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6' }}>{maleOnPage}</div>
        </div>
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>Perempuan (Halaman Ini)</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#ec4899' }}>{femaleOnPage}</div>
        </div>
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>Pengguna Mobile (Halaman Ini)</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>{mobileOnPage}</div>
        </div>
      </div>

      {/* --- Filter & Search Bar --- */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Cari berdasarkan nama, NIK, telepon, atau wilayah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // State diupdate, effect akan jalan
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)} // State diupdate, effect akan jalan
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
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
              onChange={(e) => setSelectedDistrict(e.target.value)} // State diupdate, effect akan jalan
              disabled={selectedCity === 'semua'}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: selectedCity === 'semua' ? 'not-allowed' : 'pointer',
                opacity: selectedCity === 'semua' ? 0.6 : 1
              }}
            >
              <option value="semua">Semua Kecamatan</option>
              {filteredDistricts.map(district => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- Tabel Data --- */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            {/* KODE YANG DIPERBAIKI (THEAD) */}
            <thead style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Nama</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Jenis Kelamin</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Usia</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>No. Telepon</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Wilayah</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>NIK</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Pekerjaan</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>Memuat data...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  {error ? 'Gagal memuat data' : 'Tidak ada data yang ditemukan'}
                </td></tr>
              ) : (
                // KODE YANG DIPERBAIKI (TBODY TR)
                members.map((member) => (
                  <tr key={member.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <strong>{member.name}</strong>
                      {member.is_mobile && (
                        <span style={{
                          marginLeft: '6px',
                          fontSize: '11px',
                          color: '#059669',
                          backgroundColor: '#d1fae5',
                          padding: '2px 6px',
                          borderRadius: '8px'
                        }}>
                          📱
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {member.birth_date ? `${calculateAge(member.birth_date)} tahun` : '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{member.telp || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{member.village_name || '-'}</div>
                        <div style={{ color: '#6b7280', fontSize: '12px' }}>
                          {member.district_name || '-'}, {member.city_name || '-'}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <code style={{ 
                        fontSize: '13px', 
                        background: '#f3f4f6', 
                        padding: '2px 6px', 
                        borderRadius: '4px' 
                      }}>
                        {member.nik || '-'}
                      </code>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{member.job || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleViewDetail(member.id)}
                          title="Lihat Detail"
                          style={{
                            padding: '6px 12px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(member)}
                          title="Edit"
                          style={{
                            padding: '6px 12px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          title="Hapus"
                          style={{
                            padding: '6px 12px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- KONTROL PAGINATION BARU --- */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {paginationInfo && (
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                Menampilkan {members.length} dari {paginationInfo.total_items} anggota
              </span>
            )}
          </div>
          {paginationInfo && paginationInfo.total_pages > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  background: currentPage === 1 ? '#f9fafb' : 'white',
                  borderRadius: '6px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: currentPage === 1 ? '#9ca3af' : '#374151',
                }}
              >
                &laquo; Sebelumnya
              </button>
              <span style={{ padding: '8px 12px', fontSize: '14px', color: '#374151', alignSelf: 'center' }}>
                Halaman {paginationInfo.current_page} / {paginationInfo.total_pages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!paginationInfo || currentPage === paginationInfo.total_pages}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  background: (!paginationInfo || currentPage === paginationInfo.total_pages) ? '#f9fafb' : 'white',
                  borderRadius: '6px',
                  cursor: (!paginationInfo || currentPage === paginationInfo.total_pages) ? 'not-allowed' : 'pointer',
                  color: (!paginationInfo || currentPage === paginationInfo.total_pages) ? '#9ca3af' : '#374151',
                }}
              >
                Berikutnya &raquo;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Modals (Render di sini) --- */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        cities={cities}
        districts={districts}
        villages={villages}
        onSuccess={handleAddSuccess}
        token={token}
      />
      <UserEditModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        user={editingUser}
        cities={cities}
        districts={districts}
        villages={villages}
        onSuccess={handleUpdateUser}
        token={token}
      />
      <UserDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        user={selectedUser}
        loading={loadingDetail}
      />
     
    </div>
  );
}

export default AnggotaTerdaftar;