import React, { useState } from 'react';

function Sidebar({ isOpen, currentPage, setCurrentPage }) {
  const [anggotaOpen, setAnggotaOpen] = useState(false);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <ul className="sidebar-menu">
        <li 
          className={currentPage === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentPage('dashboard')}
        >
          <span>Dashboard</span>
        </li>
        <li className={anggotaOpen ? 'has-submenu open' : 'has-submenu'}>
          <span onClick={() => setAnggotaOpen(!anggotaOpen)}>
            Anggota MU
            <svg className="chevron" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.94 6.94L8 10l3.06-3.06.94.94L8 12l-4-4 .94-.94z"/>
            </svg>
          </span>
          <ul className="submenu">
            <li 
              className={currentPage === 'anggota-terdaftar' ? 'active' : ''}
              onClick={() => setCurrentPage('anggota-terdaftar')}
            >
              Anggota Terdaftar
            </li>
            <li 
              className={currentPage === 'pengguna-mobile' ? 'active' : ''}
              onClick={() => setCurrentPage('pengguna-mobile')}
            >
              Pengguna Mobile
            </li>
          </ul>
        </li>
        <li 
          className={currentPage === 'kategori' ? 'active' : ''}
          onClick={() => setCurrentPage('kategori')}
        >
          <span>Kategori</span>
        </li>
        <li 
          className={currentPage === 'tiket' ? 'active' : ''}
          onClick={() => setCurrentPage('tiket')}
        >
          <span>Tiket</span>
        </li>
        <li 
          className={currentPage === 'artikel' ? 'active' : ''}
          onClick={() => setCurrentPage('artikel')}
        >
          <span>Artikel</span>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;