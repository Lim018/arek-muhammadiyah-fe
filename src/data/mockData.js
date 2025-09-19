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
  "JAWA TENGAH": { members: 3600, tickets: 152, articles: 81 },
  "DI YOGYAKARTA": { members: 1100, tickets: 49, articles: 27 },
  "JAWA TIMUR": { members: 4200, tickets: 176, articles: 91 },
  "BANTEN": { members: 2300, tickets: 95, articles: 52 },
  "BALI": { members: 1800, tickets: 72, articles: 39 },
  "NUSA TENGGARA BARAT": { members: 780, tickets: 31, articles: 17 },
  "NUSA TENGGARA TIMUR": { members: 650, tickets: 28, articles: 15 },
  "KALIMANTAN BARAT": { members: 1150, tickets: 47, articles: 25 },
  "KALIMANTAN TENGAH": { members: 720, tickets: 29, articles: 16 },
  "KALIMANTAN SELATAN": { members: 950, tickets: 39, articles: 20 },
  "KALIMANTAN TIMUR": { members: 1350, tickets: 58, articles: 31 },
  "KALIMANTAN UTARA": { members: 280, tickets: 11, articles: 5 },
  "SULAWESI UTARA": { members: 880, tickets: 35, articles: 18 },
  "SULAWESI TENGAH": { members: 690, tickets: 27, articles: 14 },
  "SULAWESI SELATAN": { members: 1950, tickets: 82, articles: 45 },
  "SULAWESI TENGGARA": { members: 750, tickets: 30, articles: 16 },
  "GORONTALO": { members: 380, tickets: 14, articles: 7 },
  "SULAWESI BARAT": { members: 320, tickets: 13, articles: 6 },
  "MALUKU": { members: 450, tickets: 18, articles: 9 },
  "MALUKU UTARA": { members: 390, tickets: 16, articles: 8 },
  "PAPUA BARAT": { members: 290, tickets: 12, articles: 6 },
  "PAPUA": { members: 580, tickets: 24, articles: 13 },
  "PAPUA TENGAH": { members: 150, tickets: 5, articles: 2},
  "PAPUA PEGUNUNGAN": { members: 120, tickets: 4, articles: 2},
  "PAPUA SELATAN": { members: 180, tickets: 7, articles: 3},
  "PAPUA BARAT DAYA": { members: 210, tickets: 9, articles: 4}
};


// Fungsi untuk menghasilkan angka acak dalam rentang tertentu
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Daftar semua kabupaten dari file GeoJSON
const kabupatenList = [
    "Tapanuli Utara", "Melawi", "Tangerang", "Bener Meriah", "Belitung Timur",
    "Kupang", "Lombok Barat", "Sumbawa Barat", "Alor", "Buleleng", "Timor Tengah Selatan",
    "Sikka", "Manggarai Barat", "Lombok Tengah", "Sumba Barat", "Gianyar",
    "Manggarai Timur", "Sumbawa", "Dompu", "Timor Tengah Utara", "Flores Timur",
    "Lombok Timur", "Karangasem", "Belu", "Kota Bima", "Ende", "Kota Mataram",
    "Jembrana", "Badung", "Lembata", "Kota Denpasar", "Bima", "Klungkung",
    "Kota Kupang", "Sumba Timur", "Bangli", "Tabanan", "Nagekeo", "Manggarai",
    "Sumba Tengah", "Rote Ndao", "Sumba Barat Daya", "Lombok Utara", "Sabu Raijua",
    "Malaka", "Kota Pontianak", "Kapuas Hulu", "Sintang", "Ketapang", "Sanggau",
    "Landak", "Bengkayang", "Mempawah", "Kota Singkawang", "Kubu Raya", "Kayong Utara",
    "Barito Utara", "Barito Selatan", "Kapuas", "Kotawaringin Barat", "Kotawaringin Timur",
"Sukamara", "Lamandau", "Seruyan", "Katingan", "Pulang Pisau", "Gunung Mas", "Barito Timur", "Murung Raya", "Kota Palangka Raya",
"Tanah Laut", "Kotabaru", "Banjar", "Barito Kuala", "Tapin", "Hulu Sungai Selatan", "Hulu Sungai Tengah", "Hulu Sungai Utara", "Tabalong",
"Tanah Bumbu", "Balangan", "Kota Banjarmasin", "Kota Banjar Baru", "Paser", "Kutai Kartanegara", "Berau", "Kutai Barat",
"Kutai Timur", "Penajam Paser Utara", "Mahakam Ulu", "Kota Balikpapan", "Kota Samarinda", "Kota Bontang", "Bulungan", "Malinau", "Nunukan",
"Tana Tidung", "Kota Tarakan", "Bolaang Mongondow", "Minahasa", "Kepulauan Sangihe", "Kepulauan Talaud", "Minahasa Selatan",
"Minahasa Utara", "Kepulauan Siau Tagulandang Biaro", "Minahasa Tenggara", "Bolaang Mongondow Selatan", "Bolaang Mongondow Timur",
"Bolaang Mongondow Utara", "Kota Manado", "Kota Bitung", "Kota Tomohon", "Kota Kotamobagu", "Banggai", "Poso", "Donggala",
"Toli-Toli", "Buol", "Morowali", "Banggai Kepulauan", "Parigi Moutong", "Tojo Una-Una", "Sigi", "Banggai Laut", "Morowali Utara",
"Kota Palu", "Selayar (Kepulauan Selayar)", "Bulukumba", "Bantaeng", "Jeneponto", "Takalar", "Gowa", "Sinjai", "Maros", "Pangkajene Dan Kepulauan",
"Barru", "Bone", "Soppeng", "Wajo", "Sidenreng Rappang", "Pinrang", "Enrekang", "Luwu", "Tana Toraja", "Luwu Utara", "Luwu Timur",
"Toraja Utara", "Kota Makassar", "Kota Parepare", "Kota Palopo", "Buton", "Muna", "Konawe", "Kolaka", "Konawe Selatan", "Bombana",
"Wakatobi", "Kolaka Utara", "Buton Utara", "Konawe Utara", "Kolaka Timur", "Konawe Kepulauan", "Muna Barat", "Buton Tengah", "Buton Selatan",
"Kota Kendari", "Kota Baubau", "Boalemo", "Gorontalo", "Pohuwato", "Bone Bolango", "Gorontalo Utara", "Majene", "Polewali Mandar", "Mamasa",
"Mamuju", "Pasangkayu", "Mamuju Tengah", "Maluku Tengah", "Maluku Tenggara", "Kepulauan Tanimbar", "Buru", "Seram Bagian Timur", "Seram Bagian Barat",
"Kepulauan Aru", "Kepulauan Tual", "Buru Selatan", "Kota Ambon", "Halmahera Barat", "Halmahera Tengah", "Kepulauan Sula", "Halmahera Selatan",
"Halmahera Utara", "Halmahera Timur", "Pulau Morotai", "Pulau Taliabu", "Kota Ternate", "Kota Tidore Kepulauan", "Fakfak", "Kaimana",
"Teluk Wondama", "Teluk Bintuni", "Manokwari", "Sorong Selatan", "Sorong", "Raja Ampat", "Tambrauw", "Maybrat", "Manokwari Selatan",
"Pegunungan Arfak", "Merauke", "Jayawijaya", "Jayapura", "Nabire", "Kepulauan Yapen", "Biak Numfor", "Paniai", "Puncak Jaya", "Mimika",
"Boven Digoel", "Mappi", "Asmat", "Yahukimo", "Pegunungan Bintang", "Tolikara", "Sarmi", "Keerom", "Waropen", "Supiori", "Mamberamo Raya",
"Nduga", "Lanny Jaya", "Mamberamo Tengah", "Yalimo", "Puncak", "Dogiyai", "Intan Jaya", "Deiyai", "Kota Jayapura", "Simeulue",
"Aceh Singkil", "Aceh Selatan", "Aceh Tenggara", "Aceh Timur", "Aceh Tengah", "Aceh Barat", "Aceh Besar", "Pidie", "Bireuen",
"Aceh Utara", "Aceh Barat Daya", "Gayo Lues", "Aceh Tamiang", "Nagan Raya", "Aceh Jaya", "Pidie Jaya", "Kota Banda Aceh", "Kota Sabang",
"Kota Langsa", "Kota Lhokseumawe", "Kota Subulussalam", "Nias", "Mandailing Natal", "Tapanuli Selatan", "Tapanuli Tengah",
"Labuhanbatu", "Asahan", "Simalungun", "Dairi", "Karo", "Deli Serdang", "Langkat", "Nias Selatan", "Humbang Hasundutan", "Pakpak Bharat",
"Samosir", "Serdang Bedagai", "Batu Bara", "Padang Lawas Utara", "Padang Lawas", "Labuhanbatu Selatan", "Labuhanbatu Utara",
"Nias Utara", "Nias Barat", "Kota Sibolga", "Kota Tanjung Balai", "Kota Pematang Siantar", "Kota Tebing Tinggi", "Kota Medan",
"Kota Binjai", "Kota Padangsidimpuan", "Kota Gunungsitoli", "Kepulauan Mentawai", "Pesisir Selatan", "Solok", "Sijunjung",
"Tanah Datar", "Padang Pariaman", "Agam", "Lima Puluh Kota", "Pasaman", "Solok Selatan", "Dharmasraya", "Pasaman Barat",
"Kota Padang", "Kota Solok", "Kota Sawah Lunto", "Kota Padang Panjang", "Kota Bukittinggi", "Kota Payakumbuh", "Kota Pariaman",
"Kuantan Singingi", "Indragiri Hulu", "Indragiri Hilir", "Pelalawan", "S I A K", "Kampar", "Rokan Hulu", "Bengkalis", "Rokan Hilir",
"Kepulauan Meranti", "Kota Pekanbaru", "Kota D U M A I", "Kerinci", "Merangin", "Sarolangun", "Batang Hari", "Muaro Jambi", "Tanjung Jabung Timur",
"Tanjung Jabung Barat", "Tebo", "Bungo", "Kota Jambi", "Kota Sungai Penuh", "Ogan Komering Ulu", "Ogan Komering Ilir", "Muara Enim",
"Lahat", "Musi Rawas", "Musi Banyuasin", "Banyu Asin", "Ogan Komering Ulu Selatan", "Ogan Komering Ulu Timur", "Ogan Ilir",
"Empat Lawang", "Penukal Abab Lematang Ilir", "Musi Rawas Utara", "Kota Palembang", "Kota Prabumulih", "Kota Pagar Alam", "Kota Lubuklinggau",
"Bengkulu Selatan", "Rejang Lebong", "Bengkulu Utara", "Kaur", "Seluma", "Mukomuko", "Lebong", "Kepahiang", "Bengkulu Tengah", "Kota Bengkulu",
"Lampung Barat", "Tanggamus", "Lampung Selatan", "Lampung Timur", "Lampung Tengah", "Lampung Utara", "Way Kanan", "Tulangbawang", "Pesawaran",
"Pringsewu", "Mesuji", "Tulang Bawang Barat", "Pesisir Barat", "Kota Bandar Lampung", "Kota Metro", "Bangka", "Belitung", "Bangka Barat",
"Bangka Tengah", "Bangka Selatan", "Kota Pangkal Pinang", "Karimun", "Bintan", "Natuna", "Lingga", "Kepulauan Anambas", "Kota B A T A M", "Kota Tanjung Pinang",
"Kepulauan Seribu", "Jakarta Selatan", "Jakarta Timur", "Jakarta Pusat", "Jakarta Barat", "Jakarta Utara", "Bogor", "Sukabumi", "Cianjur", "Bandung",
"Garut", "Tasikmalaya", "Ciamis", "Kuningan", "Cirebon", "Majalengka", "Sumedang", "Indramayu", "Subang", "Purwakarta", "Karawang", "Bekasi",
"Bandung Barat", "Pangandaran", "Kota Bogor", "Kota Sukabumi", "Kota Bandung", "Kota Cirebon", "Kota Bekasi", "Kota Depok", "Kota Cimahi", "Kota Tasikmalaya",
"Kota Banjar", "Cilacap", "Banyumas", "Purbalingga", "Banjarnegara", "Kebumen", "Purworejo", "Wonosobo", "Magelang", "Boyolali", "Klaten", "Sukoharjo",
"Wonogiri", "Karanganyar", "Sragen", "Grobogan", "Blora", "Rembang", "Pati", "Kudus", "Jepara", "Demak", "Semarang", "Temanggung", "Kendal",
"Batang", "Pekalongan", "Pemalang", "Tegal", "Brebes", "Kota Magelang", "Kota Surakarta", "Kota Salatiga", "Kota Semarang", "Kota Pekalongan",
"Kota Tegal", "Kulon Progo", "Bantul", "Gunung Kidul", "Sleman", "Kota Yogyakarta", "Pacitan", "Ponorogo", "Trenggalek", "Tulungagung",
"Blitar", "Kediri", "Malang", "Lumajang", "Jember", "Banyuwangi", "Bondowoso", "Situbondo", "Probolinggo", "Pasuruan", "Sidoarjo",
"Mojokerto", "Jombang", "Nganjuk", "Madiun", "Magetan", "Ngawi", "Bojonegoro", "Tuban", "Lamongan", "Gresik", "Bangkalan", "Sampang",
"Pamekasan", "Sumenep", "Kota Kediri", "Kota Blitar", "Kota Malang", "Kota Probolinggo", "Kota Pasuruan", "Kota Mojokerto", "Kota Madiun",
"Kota Surabaya", "Kota Batu", "Pandeglang", "Lebak", "Serang", "Kota Cilegon", "Kota Serang"
];

// Membuat data mock untuk setiap kabupaten
export const mockKabupatenData = kabupatenList.reduce((acc, kabupaten) => {
  acc[kabupaten] = {
    members: getRandomInt(50, 500),
    tickets: getRandomInt(5, 50),
    articles: getRandomInt(2, 20),
  };
  return acc;
}, {});


// Fungsi untuk mendapatkan data provinsi (case insensitive)
export const getProvinceData = (provinceName) => {
  const normalizedName = provinceName.toUpperCase().trim();
  return mockProvinceData[normalizedName] || { members: 0, tickets: 0, articles: 0 };
};

// Fungsi baru untuk mendapatkan data kabupaten
export const getKabupatenData = (kabupatenName) => {
  // Memberikan data default jika kabupaten tidak ditemukan
  return mockKabupatenData[kabupatenName] || { members: 0, tickets: 0, articles: 0 };
};

// Fungsi untuk mendapatkan warna berdasarkan jumlah anggota
export const getColorByMemberCount = (members) => {
    if (members > 3000) return '#800026';
    if (members > 2000) return '#BD0026';
    if (members > 1500) return '#E31A1C';
    if (members > 1000) return '#FC4E2A';
    if (members > 500) return '#FD8D3C';
    if (members > 200) return '#FEB24C';
    if (members > 100) return '#FED976';
    return '#FFEDA0';
  };

// Fungsi untuk menghitung statistik dashboard
export const getDashboardStats = () => {
  const totalMembers = Object.values(mockProvinceData).reduce((sum, item) => sum + item.members, 0);
  const totalArticles = Object.values(mockProvinceData).reduce((sum, item) => sum + item.articles, 0);
  const totalProvinces = Object.keys(mockProvinceData).length;

  return { totalMembers, totalArticles, totalProvinces };
};

// Data untuk legenda
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