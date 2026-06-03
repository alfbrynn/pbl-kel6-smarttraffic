import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
      className={`h-screen fixed top-0 left-0 bg-background flex flex-col z-100 shadow-sm border-r border-border/40 transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-[80px]' : 'w-[250px]'}`}
    >
      {/* Header Sidebar & Tombol Toggle */}
      <div className={`h-[72px] flex items-center justify-between px-6`}>
        {!isCollapsed && (
          <span className="text-lg font-black text-blue-900 tracking-tighter uppercase">
            Smart<span className="text-blue-700">raf</span>
          </span>
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

    </aside>
  );
};

export default Sidebar;