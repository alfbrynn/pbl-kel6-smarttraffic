import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import Header from './Header';

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
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  // --- States (Status) ---
  const [isCollapsed, setIsCollapsed] = useState(false);

  // --- Side Effects (Efek Samping) ---
  /**
   * Reset scroll ke atas ketika berpindah rute/halaman
   */
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [router.pathname]);

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
      className={`flex h-screen overflow-hidden bg-background transition-all duration-300 ease-in-out 
      ${isCollapsed ? 'pl-0 lg:pl-[80px]' : 'pl-0 lg:pl-[250px]'}`}
    >
      {/* Backdrop overlay for mobile when sidebar is open */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-99 lg:hidden cursor-pointer"
          onClick={handleToggleSidebar}
        />
      )}

      {/* Persistent Navigation Components */}
      <Sidebar isCollapsed={isCollapsed} onToggleSidebar={handleToggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={handleToggleSidebar} />

        {/* Main Content Area */}
        <main ref={mainRef} className="flex-1 p-6 md:p-8 overflow-y-auto page-enter flex flex-col">
          <div className="grow">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;