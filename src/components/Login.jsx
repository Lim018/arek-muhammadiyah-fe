import React, { useState } from 'react';

function Login({ onLogin }) {
  // 1. Ubah state 'id' menjadi 'telp'
  const [telp, setTelp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 3. Kirim 'telp' di body, bukan 'id'
        body: JSON.stringify({ telp, password }),
      });

      const data = await response.json();
      console.log('Login response:', data); 
      console.log('HTTP response status OK:', response.ok);
      
      const authToken = data.data ? data.data.token : null;

      if (response.ok && authToken && authToken !== '') {
        console.log('Token successfully received. Passing to App.jsx');
        onLogin(authToken);
      } else {
        console.error('Login Gagal (Client Check):', data);
        setError(data.message || 'Login gagal. Token tidak ditemukan dalam respons.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Pastikan backend berjalan dan alamat benar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src="/img/logo.png" alt="Logo" />
        </div>
        <h1 className="login-title">Arek - Muhammadiyah</h1>
        <form onSubmit={handleSubmit} className="login-form">
          {/* 2. Ubah input field dari 'id' menjadi 'telp' */}
          <div className="form-group">
            <label htmlFor="telp">No. Telepon</label>
            <input
              type="tel"
              id="telp"
              value={telp}
              onChange={(e) => setTelp(e.target.value)}
              placeholder="Contoh: 081234567890"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;