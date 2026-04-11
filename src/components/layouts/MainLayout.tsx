import React from 'react';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Header />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
