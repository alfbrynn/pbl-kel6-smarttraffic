import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  const handleToggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  return (
    <div className={`flex min-h-screen bg-bg-main transition-all duration-300 ease-in-out ${isCollapsed ? 'pl-[80px]' : 'pl-[250px]'}`}>
      {/* Fungsi onToggle sekarang dikirim ke Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggleSidebar={handleToggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header hanya butuh info isCollapsed untuk menggeser margin kirinya */}
        <Header isCollapsed={isCollapsed} />
        <main className="flex-1 p-8 pt-[104px] overflow-y-auto page-enter">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;