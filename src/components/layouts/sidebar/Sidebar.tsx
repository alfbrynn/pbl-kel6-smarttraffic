import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

const Sidebar = ({ isCollapsed, onToggleSidebar }: SidebarProps) => {
  const router = useRouter();

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
      name: 'Analitik',
      path: '/analitik',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="8" y1="17" x2="8" y2="13"></line>
          <line x1="12" y1="17" x2="12" y2="9"></line>
          <line x1="16" y1="17" x2="16" y2="11"></line>
        </svg>
      )
    },
    {
      name: 'Laporan',
      path: '/laporan',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    {
      name: 'Kesehatan Sistem',
      path: '/kesehatan-sistem',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
          <polyline points="9 16 11 18 15 14"></polyline>
        </svg>
      )
    }
  ];

  return (
    <aside className={`h-screen fixed top-0 left-0 bg-bg-card flex flex-col z-[100] border-r border-border-color transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-[80px]' : 'w-[250px]'}`}>

      {/* Tombol Collapse yang posisinya terkunci di kiri (pl-6) tanpa berpindah */}
      <div className="h-[72px] flex items-center pl-6">
        <button onClick={onToggleSidebar} className="text-text-secondary hover:text-text-main transition-colors" aria-label="Toggle Sidebar">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-col mt-2">
        {navItems.map((item) => {
          const isActive = router.pathname.startsWith(item.path);

          return (
            <Link href={item.path} key={item.name}
              title={isCollapsed ? item.name : ''}
              className={`flex items-center py-[14px] text-[14px] font-semibold cursor-pointer relative transition-colors duration-150 ease-out
                ${isCollapsed ? 'justify-center px-0' : 'px-6'}
                ${isActive
                  ? 'bg-[#131314] text-white dark:bg-bg-hover dark:text-accent-cyan after:content-[""] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-1 dark:after:bg-accent-cyan after:bg-white after:rounded-l-full'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-main'}`}>

              <span className={`flex items-center justify-center ${isCollapsed ? '' : 'mr-3'}`}>
                {item.icon}
              </span>

              {!isCollapsed && (
                <span className="whitespace-nowrap">
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