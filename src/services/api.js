import { authService } from '../utils/auth';

// Ganti dengan URL backend Anda
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function untuk membuat request
const request = async (endpoint, options = {}) => {
  const token = authService.getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Tambahkan token ke header jika ada
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`📡 API Request: ${config.method || 'GET'} ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Coba parse JSON
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('❌ Response bukan JSON:', text);
      throw new Error('Server mengembalikan response bukan JSON format');
    }

    console.log(`📥 API Response:`, data);

    if (!response.ok) {
      // Handle error responses
      if (response.status === 401) {
        // Token expired atau invalid
        authService.logout();
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
      }
      throw new Error(data.message || data.error || 'Terjadi kesalahan');
    }

    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};

// API Services
export const api = {
  // AUTH
  login: async (credentials) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Handle different response formats
    // Format 1: { success, token, user }
    // Format 2: { success, data: { token, user } }
    // Format 3: { token, user }
    
    return {
      success: response.success !== false,
      token: response.token || response.data?.token,
      user: response.user || response.data?.user || response.data,
      message: response.message
    };
  },

  // DASHBOARD
  getDashboardStats: () => request('/dashboard/stats'),

  // USERS (Anggota)
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/users?${queryString}`);
  },
  
  createUser: (userData) =>
    request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  updateUser: (id, userData) =>
    request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),

  deleteUser: (id) =>
    request(`/users/${id}`, {
      method: 'DELETE'
    }),

  // VILLAGES
  getVillages: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/villages?${queryString}`);
  },

  getVillagesWithStats: () => request('/villages/stats'),

  createVillage: (villageData) =>
    request('/villages', {
      method: 'POST',
      body: JSON.stringify(villageData)
    }),

  updateVillage: (id, villageData) =>
    request(`/villages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(villageData)
    }),

  deleteVillage: (id) =>
    request(`/villages/${id}`, {
      method: 'DELETE'
    }),

  // ARTICLES
  getArticles: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/articles?${queryString}`);
  },

  getArticle: (id) => request(`/articles/${id}`),

  createArticle: (articleData) =>
    request('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData)
    }),

  updateArticle: (id, articleData) =>
    request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData)
    }),

  deleteArticle: (id) =>
    request(`/articles/${id}`, {
      method: 'DELETE'
    }),

  // CATEGORIES
  getCategories: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/categories?${queryString}`);
  },

  createCategory: (categoryData) =>
    request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    }),

  updateCategory: (id, categoryData) =>
    request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    }),

  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: 'DELETE'
    }),

  // TICKETS
  getTickets: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/tickets?${queryString}`);
  },

  getTicket: (id) => request(`/tickets/${id}`),

  updateTicket: (id, ticketData) =>
    request(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData)
    }),

  // BIDANG (Organizations)
  getBidangs: () => request('/bidangs'),

  createBidang: (bidangData) =>
    request('/bidangs', {
      method: 'POST',
      body: JSON.stringify(bidangData)
    }),

  updateBidang: (id, bidangData) =>
    request(`/bidangs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bidangData)
    }),

  deleteBidang: (id) =>
    request(`/bidangs/${id}`, {
      method: 'DELETE'
    }),

  // UPLOAD
  uploadFile: async (file, type = 'article') => {
    const token = authService.getToken();
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/${type}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload gagal');
    }

    return response.json();
  }
};