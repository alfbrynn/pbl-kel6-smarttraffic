import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';

/**
 * Komponen Header
 * Menampilkan bar navigasi atas admin dengan profil operator dan aksi keluar (logout).
 */
const Header: React.FC = () => {
  // --- States (Status) ---
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // --- Side Effects (Efek Samping) ---
  useEffect(() => {
    // Click-outside listener untuk menutup pop-up profil
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <header className="sticky top-0 w-full h-[72px] bg-card border-b border-border/40 flex items-center justify-end px-6 md:px-8 shrink-0 z-40">
      {/* User Profile Summary */}
      <div className="relative" ref={profileRef}>
        <div
          className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-secondary-light transition-colors"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <div className="w-9 h-9 rounded-full bg-[#1a2533] flex items-center justify-center overflow-hidden border border-border shadow-sm">
            {/* Avatar SVG */}
            <svg className="w-full h-full" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" fill="#1e293b" />
              <path d="M18 19c-3.5 0-6.5-1.5-8-4 0-5 3.5-9 8-9s8 4 8 9c-1.5 2.5-4.5 4-8 4z" fill="#fcd34d" />
              <path d="M8 32v-2c0-4 4-7 10-7s10 3 10 7v2H8z" fill="#3b82f6" />
              <path d="M11 12c1.5-2 4-3 7-3s5.5 1 7 3v1c0 3-3 6-7 6s-7-3-7-6v-1z" fill="#fbbf24" />
              <path d="M11 9c2-2 4-2 7-2s5 0 7 2c0-1.5-3-3-7-3s-7 1.5-7 3z" fill="#0f172a" />
            </svg>
          </div>
          <span className="text-[13px] font-bold text-foreground tracking-wide hidden sm:block">Operator 01</span>
          <svg
            className={`w-4 h-4 text-muted transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Logout Dropdown Pop-up */}
        <div
          className={`absolute right-0 mt-3 w-56 bg-card border border-border rounded-xl shadow-xl py-2 z-50 transition-all duration-200 origin-top-right ${isProfileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}
        >
          <div className="px-5 py-3 border-b border-border mb-2">
            <p className="text-xs font-semibold text-muted mb-1">Masuk sebagai</p>
            <p className="text-sm font-black text-foreground truncate tracking-wide">Operator 01</p>
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
    </header>
  );
};

export default Header;