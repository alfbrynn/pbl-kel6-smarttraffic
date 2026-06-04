import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSimpangUtama from '@/hooks/useSimpangUtama';

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
  const { dataSimpang } = useSimpangUtama();
  const [countdownMap, setCountdownMap] = useState<Record<string, number>>({ barat: 0, timur: 0, selatan: 0 });

  // Sinkronisasi countdown dari data real-time firestore
  useEffect(() => {
    if (!dataSimpang?.jalur) return;
    setCountdownMap({
      barat: dataSimpang.jalur.barat?.sisa_waktu_detik ?? 0,
      timur: dataSimpang.jalur.timur?.sisa_waktu_detik ?? 0,
      selatan: dataSimpang.jalur.selatan?.sisa_waktu_detik ?? 0,
    });
  }, [dataSimpang]);

  // Timer lokal agar hitung mundur berjalan mulus tiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownMap((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          if (next[key] > 0) next[key] -= 1;
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }, []);


  // --- Konfigurasi Menu ---
  const navItems = [
    {
      name: 'Beranda',
      path: '/dashboard',
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
      path: '/intersection',
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
      path: '/data-center',
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
      ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-[80px]' : 'translate-x-0 w-[250px]'}`}
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

      {/* Status Lampu Lalu Lintas 3 Jalur di bagian bawah */}
      {isCollapsed ? (
        <div className="mt-auto border-t border-border/40 p-4 flex flex-col items-center gap-4">
          {['barat', 'timur', 'selatan'].map((laneKey) => {
            const laneData = dataSimpang?.jalur?.[laneKey as 'barat' | 'timur' | 'selatan'];
            const statusLampu = laneData?.status_lampu ?? 'MATI';
            const countdown = countdownMap[laneKey] ?? 0;
            
            const dotColor = statusLampu === 'HIJAU' ? 'bg-emerald-500 text-emerald-500' :
                             statusLampu === 'KUNING' ? 'bg-amber-500 text-amber-500' :
                             statusLampu === 'MERAH' ? 'bg-red-500 text-red-500' : 'bg-slate-500 text-slate-500';
            return (
              <div key={laneKey} className="flex flex-col items-center gap-1" title={`${laneKey.toUpperCase()}: ${statusLampu} (${countdown}s)`}>
                <span className={`w-3 h-3 rounded-full ${dotColor.split(' ')[0]} shadow-[0_0_6px_currentColor]`} />
                <span className="text-[9px] font-mono font-bold text-slate-500">{countdown}s</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-auto border-t border-border/40 p-5 flex flex-col gap-3.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block">Status Lampu</span>
          <div className="flex flex-col gap-2">
            {['barat', 'timur', 'selatan'].map((laneKey) => {
              const laneData = dataSimpang?.jalur?.[laneKey as 'barat' | 'timur' | 'selatan'];
              const statusLampu = laneData?.status_lampu ?? 'MATI';
              const countdown = countdownMap[laneKey] ?? 0;
              
              const dotColor = statusLampu === 'HIJAU' ? 'bg-emerald-500 text-emerald-500' :
                               statusLampu === 'KUNING' ? 'bg-amber-500 text-amber-500' :
                               statusLampu === 'MERAH' ? 'bg-red-500 text-red-500' : 'bg-slate-500 text-slate-500';
              return (
                <div key={laneKey} className="flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-xl border border-border/20">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColor.split(' ')[0]} shadow-[0_0_6px_currentColor]`} />
                    <span className="text-[11px] font-bold text-slate-600 capitalize">{laneKey}</span>
                  </div>
                  <span className="text-[11px] font-mono font-black text-blue-700">{countdown}d</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;