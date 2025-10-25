/**
 * Export Utils - Helper functions untuk export data
 */

/**
 * Convert array of objects to CSV string
 */
export const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Create header row
  const headerRow = headers.map(h => h.label).join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return headers.map(header => {
      let value = row[header.key];
      
      // Handle nested objects (e.g., village.name)
      if (header.key.includes('.')) {
        const keys = header.key.split('.');
        value = keys.reduce((obj, key) => obj?.[key], row);
      }
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        value = '';
      }
      
      // Convert to string and escape quotes
      value = String(value).replace(/"/g, '""');
      
      // Wrap in quotes if contains comma, newline, or quote
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        value = `"${value}"`;
      }
      
      return value;
    }).join(',');
  }).join('\n');
  
  return `${headerRow}\n${dataRows}`;
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename = 'export.csv') => {
  // Add BOM for proper Excel UTF-8 support
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};

/**
 * Format date for CSV export
 */
export const formatDateForExport = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * Export members data to CSV
 */
export const exportMembersToCSV = (members) => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nama' },
    { key: 'telp', label: 'No. Telepon' },
    { key: 'nik', label: 'NIK' },
    { key: 'village.name', label: 'Kelurahan' },
    { key: 'village.code', label: 'Kode Kelurahan' },
    { key: 'address', label: 'Alamat' },
    { key: 'role.name', label: 'Role' },
    { key: 'card_status', label: 'Status Kartu' },
    { key: 'is_mobile', label: 'Mobile App' },
    { key: 'created_at', label: 'Tanggal Dibuat' },
    { key: 'updated_at', label: 'Tanggal Diperbarui' }
  ];
  
  // Format data
  const formattedData = members.map(member => ({
    ...member,
    is_mobile: member.is_mobile ? 'Ya' : 'Tidak',
    created_at: formatDateForExport(member.created_at),
    updated_at: formatDateForExport(member.updated_at)
  }));
  
  const csvContent = convertToCSV(formattedData, headers);
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `anggota-muhammadiyah-${timestamp}.csv`;
  
  downloadCSV(csvContent, filename);
};

/**
 * Export mobile users data to CSV
 */
export const exportMobileUsersToCSV = (users) => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nama' },
    { key: 'telp', label: 'No. Telepon' },
    { key: 'nik', label: 'NIK' },
    { key: 'village.name', label: 'Kelurahan' },
    { key: 'village.code', label: 'Kode Kelurahan' },
    { key: 'address', label: 'Alamat' },
    { key: 'role.name', label: 'Role' },
    { key: 'card_status', label: 'Status Kartu' },
    { key: 'created_at', label: 'Tanggal Terdaftar' }
  ];
  
  // Format data
  const formattedData = users.map(user => ({
    ...user,
    created_at: formatDateForExport(user.created_at)
  }));
  
  const csvContent = convertToCSV(formattedData, headers);
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `pengguna-mobile-app-${timestamp}.csv`;
  
  downloadCSV(csvContent, filename);
};