import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar/Sidebar';

/**
 * Interface untuk Props MainLayout
 */
interface MainLayoutProps {
  children: React.ReactNode;
}

// Konstanta untuk key penyimpanan lokal
const SIDEBAR_STATE_KEY = 'sidebarCollapsed';

/**
 * Komponen MainLayout
 * Menyediakan struktur global aplikasi termasuk Sidebar dan Header yang persisten.
 * Mengelola status collapse sidebar secara responsif.
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // --- States (Status) ---
  const [isCollapsed, setIsCollapsed] = useState(false);

  // --- Side Effects (Efek Samping) ---
  /**
   * Inisialisasi status sidebar berdasarkan ukuran layar saat pertama kali dimuat (mount)
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Jalankan sekali saat mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Event Handlers (Pengelola Event) ---
  /**
   * Mengubah status collapse sidebar
   */
  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`flex min-h-screen bg-gradient-to-br from-[#ebf4ff] via-[#f8fafc] to-white transition-all duration-300 ease-in-out 
      ${isCollapsed ? 'pl-[80px]' : 'pl-[250px]'}`}
    >
      {/* Persistent Navigation Components */}
      <Sidebar isCollapsed={isCollapsed} onToggleSidebar={handleToggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto page-enter flex flex-col">
          <div className="flex-grow">
            {children}
          </div>
          {/* Modern Minimalist Footer */}
          <footer className="mt-12 pb-6 pt-4 border-t border-border-color/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-text-main tracking-wider uppercase">Smartraf</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-bg-card/50 text-text-secondary border border-border-color/10">v1.2.0</span>
              </div>
              <p className="text-[11px] font-semibold text-text-secondary tracking-wide">
                © 2026 PBL Kelompok 6 • Politeknik Negeri Malang
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;