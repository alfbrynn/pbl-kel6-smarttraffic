import React, { useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`flex min-h-screen ${collapsed ? 'pl-[64px]' : 'pl-[250px]'} bg-bg-main transition-all duration-300 ease-out`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header collapsed={collapsed} />
        <main className="flex-1 p-8 pt-[104px] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
