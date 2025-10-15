import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AnggotaMUPage from './pages/AnggotaMUPage';
import ArtikelPage from './pages/ArtikelPage';
import BidangPage from './pages/BidangPage';
import KategoriTiketPage from './pages/KategoriTiketPage';
import MobileAppPage from './pages/MobileAppPage';
import TiketPage from './pages/TiketPage';
import { authService } from './utils/auth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            authService.isAuthenticated() ? 
              <Navigate to="/dashboard" replace /> : 
              <LoginPage />
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/anggota" 
          element={
            <ProtectedRoute>
              <AnggotaMUPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/artikel" 
          element={
            <ProtectedRoute>
              <ArtikelPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bidang" 
          element={
            <ProtectedRoute>
              <BidangPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/kategori-tiket" 
          element={
            <ProtectedRoute>
              <KategoriTiketPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mobile-app" 
          element={
            <ProtectedRoute>
              <MobileAppPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tiket" 
          element={
            <ProtectedRoute>
              <TiketPage />
            </ProtectedRoute>
          } 
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;