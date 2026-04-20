import React, { useState, useEffect } from 'react';
const Header = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <header className="flex items-center justify-between fixed left-[250px] right-0 top-0 h-[72px] px-8 bg-bg-card border-b border-border-color z-50">
      <div className="flex items-center">
        <h1 className="text-[18px] font-semibold text-text-main m-0">Pusat Kontrol</h1>
        
        <div className="w-[1px] h-6 bg-border-color mx-6"></div>
        
        <div className="flex items-center bg-bg-main border border-border-color rounded-[20px] px-4 py-2 min-w-[300px]">
          <div className="text-text-secondary mr-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Cari sensor atau jalur..." 
            className="border-none bg-transparent outline-none text-[14px] text-text-main w-full placeholder:text-text-secondary"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="btn-icon" aria-label="Toggle dark mode" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>

        <button className="btn-icon relative" aria-label="Notifications">
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute top-1 right-[5px] w-2 h-2 bg-accent-red rounded-full border-[1.5px] border-bg-card"></span>
        </button>

        <div className="flex items-center gap-3 cursor-pointer ml-3">
          <div className="w-9 h-9 rounded-full bg-[#1a2533] flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" fill="#1e293b"/>
              <path d="M18 19c-3.5 0-6.5-1.5-8-4 0-5 3.5-9 8-9s8 4 8 9c-1.5 2.5-4.5 4-8 4z" fill="#fcd34d"/>
              <path d="M8 32v-2c0-4 4-7 10-7s10 3 10 7v2H8z" fill="#3b82f6"/>
              <path d="M11 12c1.5-2 4-3 7-3s5.5 1 7 3v1c0 3-3 6-7 6s-7-3-7-6v-1z" fill="#fbbf24"/>
              <path d="M11 9c2-2 4-2 7-2s5 0 7 2c0-1.5-3-3-7-3s-7 1.5-7 3z" fill="#0f172a"/>
            </svg>
          </div>
          <span className="text-[14px] font-medium text-text-main">Operator 01</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
