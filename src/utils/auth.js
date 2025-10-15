const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const authService = {
  // Simpan token setelah login
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Ambil token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Hapus token saat logout
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Simpan data user
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Ambil data user
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Cek apakah user sudah login
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Logout
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/login';
  }
};