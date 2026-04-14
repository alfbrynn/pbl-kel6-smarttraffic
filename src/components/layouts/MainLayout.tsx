import React from 'react';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen pl-[250px] bg-bg-main">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 p-8 pt-[104px] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
