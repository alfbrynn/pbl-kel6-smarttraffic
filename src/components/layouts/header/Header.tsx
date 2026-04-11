import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      {/* Left Section (Title & Search) */}
      <div className={styles.leftSection}>
        <h1 className={styles.title}>Pusat Kontrol</h1>
        
        <div className={styles.divider}></div>
        
        <div className={styles.searchContainer}>
          <div className={styles.searchIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Cari sensor atau jalur..." 
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Right Section (Icons & Profile) */}
      <div className={styles.rightSection}>
        <button className={styles.iconButton} aria-label="Toggle dark mode">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <button className={styles.iconButton} aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className={styles.notificationDot}></span>
        </button>

        <div className={styles.profileSection}>
          <div className={styles.avatar}>
            {/* Using a placeholder SVG for the avatar matching the male character with blue shirt roughly */}
            <svg className={styles.avatarSvg} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" fill="#1e293b"/>
              <path d="M18 19c-3.5 0-6.5-1.5-8-4 0-5 3.5-9 8-9s8 4 8 9c-1.5 2.5-4.5 4-8 4z" fill="#fcd34d"/>
              <path d="M8 32v-2c0-4 4-7 10-7s10 3 10 7v2H8z" fill="#3b82f6"/>
              <path d="M11 12c1.5-2 4-3 7-3s5.5 1 7 3v1c0 3-3 6-7 6s-7-3-7-6v-1z" fill="#fbbf24"/>
              <path d="M11 9c2-2 4-2 7-2s5 0 7 2c0-1.5-3-3-7-3s-7 1.5-7 3z" fill="#0f172a"/>
            </svg>
          </div>
          <span className={styles.profileName}>Operator 01</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
