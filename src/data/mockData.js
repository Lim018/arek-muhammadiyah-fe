// src/data/mockData.js

export const mockProvinceData = {
  "ACEH": { members: 1250, tickets: 45, articles: 23 },
  "SUMATERA UTARA": { members: 2100, tickets: 78, articles: 41 },
  "SUMATERA BARAT": { members: 890, tickets: 32, articles: 18 },
  "RIAU": { members: 1450, tickets: 56, articles: 29 },
  "JAMBI": { members: 670, tickets: 25, articles: 12 },
  "SUMATERA SELATAN": { members: 1230, tickets: 43, articles: 21 },
  "BENGKULU": { members: 420, tickets: 15, articles: 8 },
  "LAMPUNG": { members: 980, tickets: 38, articles: 19 },
  "KEPULAUAN BANGKA BELITUNG": { members: 340, tickets: 12, articles: 6 },
  "KEPULAUAN RIAU": { members: 560, tickets: 21, articles: 11 },
  "DKI JAKARTA": { members: 3200, tickets: 125, articles: 68 },
  "JAWA BARAT": { members: 4800, tickets: 189, articles: 95 },
  "JAWA TENGAH": { members: 3600, tickets: 142, articles: 71 },
  "DI YOGYAKARTA": { members: 850, tickets: 34, articles: 18 },
  "JAWA TIMUR": { members: 4200, tickets: 165, articles: 83 },
  "BANTEN": { members: 1890, tickets: 72, articles: 36 },
  "BALI": { members: 980, tickets: 39, articles: 20 },
  "NUSA TENGGARA BARAT": { members: 720, tickets: 28, articles: 14 },
  "NUSA TENGGARA TIMUR": { members: 640, tickets: 24, articles: 12 },
  "KALIMANTAN BARAT": { members: 890, tickets: 35, articles: 17 },
  "KALIMANTAN TENGAH": { members: 560, tickets: 22, articles: 11 },
  "KALIMANTAN SELATAN": { members: 780, tickets: 31, articles: 15 },
  "KALIMANTAN TIMUR": { members: 920, tickets: 36, articles: 18 },
  "KALIMANTAN UTARA": { members: 340, tickets: 13, articles: 7 },
  "SULAWESI UTARA": { members: 670, tickets: 26, articles: 13 },
  "SULAWESI TENGAH": { members: 560, tickets: 22, articles: 11 },
  "SULAWESI SELATAN": { members: 1240, tickets: 48, articles: 24 },
  "SULAWESI TENGGARA": { members: 480, tickets: 19, articles: 9 },
  "GORONTALO": { members: 290, tickets: 11, articles: 6 },
  "SULAWESI BARAT": { members: 320, tickets: 12, articles: 6 },
  "MALUKU": { members: 380, tickets: 15, articles: 7 },
  "MALUKU UTARA": { members: 290, tickets: 11, articles: 6 },
  "PAPUA BARAT": { members: 450, tickets: 17, articles: 9 },
  "PAPUA": { members: 680, tickets: 26, articles: 13 },
  "PAPUA SELATAN": { members: 320, tickets: 12, articles: 6 },
  "PAPUA TENGAH": { members: 280, tickets: 11, articles: 5 },
  "PAPUA PEGUNUNGAN": { members: 240, tickets: 9, articles: 4 },
  "PAPUA BARAT DAYA": { members: 350, tickets: 13, articles: 7 }
};

export const calculateTotals = (data) => {
  return Object.values(data).reduce(
    (acc, province) => ({
      members: acc.members + province.members,
      tickets: acc.tickets + province.tickets,
      articles: acc.articles + province.articles
    }),
    { members: 0, tickets: 0, articles: 0 }
  );
};

// Fungsi helper untuk mendapatkan data provinsi
export const getProvinceData = (provinceName) => {
  return mockProvinceData[provinceName] || { members: 0, tickets: 0, articles: 0 };
};

// Fungsi untuk mendapatkan warna berdasarkan jumlah anggota
export const getColorByMemberCount = (memberCount) => {
  return memberCount > 3000 ? '#800026' :
         memberCount > 2000 ? '#BD0026' :
         memberCount > 1500 ? '#E31A1C' :
         memberCount > 1000 ? '#FC4E2A' :
         memberCount > 500  ? '#FD8D3C' :
         memberCount > 200  ? '#FEB24C' :
         memberCount > 100  ? '#FED976' :
                              '#FFEDA0';
};

// Legend data untuk komponen
export const legendData = [
  { color: '#800026', range: '> 3,000' },
  { color: '#BD0026', range: '2,000 - 3,000' },
  { color: '#E31A1C', range: '1,500 - 2,000' },
  { color: '#FC4E2A', range: '1,000 - 1,500' },
  { color: '#FD8D3C', range: '500 - 1,000' },
  { color: '#FEB24C', range: '200 - 500' },
  { color: '#FED976', range: '100 - 200' },
  { color: '#FFEDA0', range: '< 100' }
];

// Fungsi untuk mencari provinsi berdasarkan nama (case insensitive)
export const findProvinceData = (searchName) => {
  const normalizedSearch = searchName.toUpperCase().trim();
  const exactMatch = mockProvinceData[normalizedSearch];
  
  if (exactMatch) {
    return { name: normalizedSearch, data: exactMatch };
  }
  
  // Cari dengan partial match jika exact match tidak ditemukan
  const partialMatch = Object.keys(mockProvinceData).find(key => 
    key.includes(normalizedSearch) || normalizedSearch.includes(key)
  );
  
  if (partialMatch) {
    return { name: partialMatch, data: mockProvinceData[partialMatch] };
  }
  
  return null;
};

// Data statistik untuk dashboard cards
export const getDashboardStats = () => {
  const totals = calculateTotals(mockProvinceData);
  
  return {
    totalTickets: totals.tickets,
    pendingTickets: Math.floor(totals.tickets * 0.6), // 60% pending
    completedTickets: Math.floor(totals.tickets * 0.4), // 40% completed
    totalMembers: totals.members,
    totalArticles: totals.articles,
    totalProvinces: Object.keys(mockProvinceData).length
  };
};