import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

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
   * Inisialisasi status sidebar dari local storage saat pertama kali dimuat (mount)
   */
  useEffect(() => {
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // --- Event Handlers (Pengelola Event) ---
  /**
   * Mengubah status collapse sidebar dan menyimpannya ke local storage
   */
  const handleToggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(SIDEBAR_STATE_KEY, String(newState));
  };

  return (
    <div 
      className={`flex min-h-screen bg-bg-main transition-all duration-300 ease-in-out 
      ${isCollapsed ? 'pl-[80px]' : 'pl-[250px]'}`}
    >
      {/* Persistent Navigation Components */}
      <Sidebar isCollapsed={isCollapsed} onToggleSidebar={handleToggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header isCollapsed={isCollapsed} />
        
        {/* Main Content Area */}
        <main className="flex-1 p-8 pt-[104px] overflow-y-auto page-enter">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;