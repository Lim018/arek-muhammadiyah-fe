import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { authService } from '../utils/auth';
import { LogIn, Phone, Lock, AlertCircle } from 'lucide-react';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Panggil API login
      const response = await api.login({
        id: formData.id,
        password: formData.password
      });

      // Simpan token dan data user
      if (response.token) {
        authService.setToken(response.token);
        authService.setUser(response.user);
        
        // Redirect ke dashboard
        navigate('/dashboard');
      } else {
        setError('Login gagal. Token tidak ditemukan.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sistem Informasi Anggota</h1>
          <p>Muhammadiyah Surabaya</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label>
              <Phone size={16} />
              Nomor Telepon
            </label>
            <input
              type="text"
              placeholder="08123456789"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={16} />
              Password
            </label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              'Memproses...'
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;