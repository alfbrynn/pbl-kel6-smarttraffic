import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';

/**
 * Props untuk Komponen Header
 */
interface HeaderProps {
  isCollapsed: boolean;
}

/**
 * Komponen Header
 * Menampilkan judul halaman/branding dan aksi global seperti toggle tema dan notifikasi.
 */
const Header: React.FC<HeaderProps> = ({ isCollapsed }) => {
  // --- States (Status) ---
  const [theme, setTheme] = useState('light');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // --- Side Effects (Efek Samping) ---
  /**
   * Sinkronisasi status tema dengan atribut dokumen saat dimuat
   */
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme);

    // Click-outside listener untuk menutup pop-up profil
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Handlers (Pengelola) ---

  /**
   * Proses logout melalui Firebase Auth
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error("Gagal melakukan logout:", error);
    }
  };

  // --- Handlers (Pengelola) ---
  /**
   * Mengalihkan antara tema terang dan gelap
   * Menyimpan pilihan di localStorage dan memperbarui atribut dokumen.
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <header
      className={`flex items-center justify-end fixed right-5 top-5 h-[72px] z-[90] transition-all duration-300 ease-in-out pointer-events-none
      ${isCollapsed ? 'left-[80px]' : 'left-[250px]'}`}
    >
      {/* Area Aksi Global - Wrapped in a floating glassy card */}
      <div className="flex items-center gap-4 pointer-events-auto bg-bg-card/85 dark:bg-bg-card/75 backdrop-blur-md border border-border-color/10 px-4 py-2.5 rounded-[20px] shadow-lg shadow-slate-950/5">

        {/* Tombol Toggle Tema */}
        <button
          className="btn-icon"
          aria-label={`Beralih ke mode ${theme === 'light' ? 'gelap' : 'terang'}`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>

        {/* User Profile Summary */}
        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-bg-hover transition-colors"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-9 h-9 rounded-full bg-[#1a2533] flex items-center justify-center overflow-hidden border border-border-color shadow-sm">
              {/* Avatar SVG */}
              <svg className="w-full h-full" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" fill="#1e293b" />
                <path d="M18 19c-3.5 0-6.5-1.5-8-4 0-5 3.5-9 8-9s8 4 8 9c-1.5 2.5-4.5 4-8 4z" fill="#fcd34d" />
                <path d="M8 32v-2c0-4 4-7 10-7s10 3 10 7v2H8z" fill="#3b82f6" />
                <path d="M11 12c1.5-2 4-3 7-3s5.5 1 7 3v1c0 3-3 6-7 6s-7-3-7-6v-1z" fill="#fbbf24" />
                <path d="M11 9c2-2 4-2 7-2s5 0 7 2c0-1.5-3-3-7-3s-7 1.5-7 3z" fill="#0f172a" />
              </svg>
            </div>
            <span className="text-[13px] font-bold text-text-main tracking-wide hidden sm:block">Operator 01</span>
            <svg
              className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Logout Dropdown Pop-up */}
          <div
            className={`absolute right-0 mt-3 w-56 bg-bg-card border border-border-color rounded-xl shadow-xl py-2 z-50 transition-all duration-200 origin-top-right ${isProfileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}
          >
            <div className="px-5 py-3 border-b border-border-color mb-2">
              <p className="text-xs font-semibold text-text-secondary mb-1">Masuk sebagai</p>
              <p className="text-sm font-black text-text-main truncate tracking-wide">Operator 01</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-5 py-2 text-[11px] text-accent-red hover:bg-accent-red/10 transition-colors flex items-center gap-3 group"
            >
              <div className="p-1 rounded-md bg-accent-red/10 text-accent-red group-hover:bg-accent-red group-hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="font-bold tracking-wide mt-0.5">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;