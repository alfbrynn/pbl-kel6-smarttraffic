import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';

/**
 * Props untuk Komponen Sidebar
 */
interface SidebarProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

/**
 * Komponen Navigasi Sidebar
 * Mengelola navigasi samping dan fungsionalitas collapse/expand sidebar.
 */
const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleSidebar }) => {
  const router = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error("Gagal melakukan logout:", error);
    }
  };

  // --- Konfigurasi Menu ---
  const navItems = [
    {
      name: 'Beranda',
      path: '/beranda',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      name: 'Persimpangan',
      path: '/persimpangan',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="2" width="8" height="20" rx="3" ry="3"></rect>
          <circle cx="12" cy="7" r="1.5"></circle>
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="12" cy="17" r="1.5"></circle>
        </svg>
      )
    },
    {
      name: 'Pusat Data',
      path: '/pusat-data',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="8" y1="17" x2="8" y2="13"></line>
          <line x1="12" y1="17" x2="12" y2="9"></line>
          <line x1="16" y1="17" x2="16" y2="11"></line>
        </svg>
      )
    }
  ];

  return (
    <aside
      className={`h-screen fixed top-0 left-0 bg-[#f0f4ff] flex flex-col z-[100] shadow-[4px_0_24px_rgba(0,0,0,0.03)] border-r border-blue-100/50 transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-[80px]' : 'w-[250px]'}`}
    >
      {/* Header Sidebar & Tombol Toggle */}
      <div className={`h-[72px] flex items-center justify-between px-6`}>
        {!isCollapsed && (
          <span className="font-extrabold text-lg text-blue-900 tracking-wide">Smartraf</span>
        )}
        <button
          onClick={onToggleSidebar}
          className="text-slate-500 hover:text-blue-900 transition-colors ml-auto"
          aria-label="Toggle Sidebar"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex flex-col mt-4 gap-1">
        {navItems.map((item) => {
          const isActive = router.pathname.startsWith(item.path);

          return (
            <Link
              href={item.path}
              key={item.name}
              title={isCollapsed ? item.name : ''}
              className={`flex items-center py-[12px] px-4 mx-3 rounded-xl text-[14px] cursor-pointer relative transition-all duration-150 ease-out
                ${isActive
                  ? 'bg-blue-600/10 text-blue-700 font-bold shadow-sm shadow-blue-500/5'
                  : 'text-slate-600 font-semibold hover:bg-blue-600/5 hover:text-blue-700'}`}
            >
              {/* Ikon Menu */}
              <span className={`flex items-center justify-center ${isCollapsed ? 'w-6' : 'mr-3'}`}>
                {item.icon}
              </span>

              {/* Teks Menu (Sembunyi saat collapsed) */}
              {!isCollapsed && (
                <span className="whitespace-nowrap transition-opacity duration-200">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer: Profile and Action */}
      <div className="mt-auto p-4 flex flex-col gap-3">
        {/* Profile Info */}
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300 shadow-sm shrink-0">
            <svg className="w-full h-full" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" fill="#1e293b" />
              <path d="M18 19c-3.5 0-6.5-1.5-8-4 0-5 3.5-9 8-9s8 4 8 9c-1.5 2.5-4.5 4-8 4z" fill="#fcd34d" />
              <path d="M8 32v-2c0-4 4-7 10-7s10 3 10 7v2H8z" fill="#3b82f6" />
              <path d="M11 12c1.5-2 4-3 7-3s5.5 1 7 3v1c0 3-3 6-7 6s-7-3-7-6v-1z" fill="#fbbf24" />
              <path d="M11 9c2-2 4-2 7-2s5 0 7 2c0-1.5-3-3-7-3s-7 1.5-7 3z" fill="#0f172a" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">Operator 01</p>
              <p className="text-[11px] text-slate-500">Sistem Aktif</p>
            </div>
          )}
        </div>

        {/* Action (Logout Only) */}
        {!isCollapsed ? (
          <button 
            onClick={handleLogout}
            className="w-full mt-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-500/15 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar</span>
          </button>
        ) : (
          <div className="flex flex-col items-center mt-1">
            {/* Icon Logout */}
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-500/15 active:scale-95"
              title="Keluar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;