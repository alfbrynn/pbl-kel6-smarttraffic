import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const router = useRouter();
  
  const navItems = [
    {
      name: 'Beranda',
      path: '/',
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
      name: 'Status Cloud',
      path: '/status-cloud',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
          <polyline points="9 16 11 18 15 14"></polyline>
        </svg>
      )
    }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.logoTitle}>SMARTRAF</h1>
        <p className={styles.logoSubtitle}>IoT Controller</p>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = router.pathname === item.path || 
                           (item.path !== '/' && router.pathname.startsWith(item.path));
          
          return (
            <Link href={item.path} key={item.name} className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
              <span className={styles.icon}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
