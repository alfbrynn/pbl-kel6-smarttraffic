import React, { useState } from 'react';
import Head from 'next/head';

export default function Login() {
  // State untuk menyimpan input pengguna (opsional, bisa Anda sesuaikan dengan fungsi API nanti)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fungsi untuk menangani aksi submit form
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // TODO: Tambahkan logika autentikasi Anda di sini
  };

  return (
    <>
      <Head>
        <title>Login Operator | SMARTRAF</title>
      </Head>

      {/* Kontainer Utama - Memenuhi seluruh layar (min-h-screen) */}
      <div className="flex min-h-screen w-full bg-bg-main font-sans text-text-main">

        {/* ========================================================
            KOLOM KIRI: Visual & Branding (Lebar 55%) 
            ======================================================== */}
        <div className="relative hidden md:flex md:w-[55%] flex-col justify-end p-12 overflow-hidden border-r border-border-color/50">
          {/* Gambar Background Unsplash */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')",
            }}
          />

          {/* Overlay Gradient (Menggunakan warna bg-main) */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg-main via-bg-main/60 to-transparent" />

          {/* Konten Teks Kiri Bawah (Di atas overlay) */}
          <div className="relative z-20 mb-8 animate-fade-up">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-text-main mb-2">
              SMART<span className="text-accent-cyan">RAF</span>
            </h1>
            <p className="text-lg lg:text-xl text-text-secondary font-medium tracking-wide">
              Sistem Tata Kelola Lalu Lintas Terpadu
            </p>
          </div>
        </div>

        {/* ========================================================
            KOLOM KANAN: Form Login (Lebar 45%)
            ======================================================== */}
        <div className="relative flex w-full md:w-[45%] flex-col justify-center bg-bg-main px-8 sm:px-12 lg:px-16">
          
          {/* Tombol Kembali ke Landing Page */}
          <div className="absolute top-8 left-8 sm:left-12 lg:left-16 z-20">
            <a 
              href="/" 
              className="flex items-center gap-2.5 text-text-secondary hover:text-accent-cyan transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center border border-border-color group-hover:border-accent-cyan/50 group-hover:bg-accent-cyan/10 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:-translate-x-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">Beranda</span>
            </a>
          </div>

          {/* Kontainer Form di tengah */}
          <div className="w-full max-w-md mx-auto z-10 animate-scale-in">

            {/* Header Form */}
            <div className="mb-10">
              <h2 className="text-3xl font-black text-text-main mb-2 tracking-tight">
                Otorisasi Operator
              </h2>
              <p className="text-text-secondary text-sm font-medium">
                Silakan masuk untuk mengakses pusat kendali.
              </p>
            </div>

            {/* Form Login */}
            <form onSubmit={handleLogin} className="space-y-6">

              {/* Input Email */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest">
                  ID / Email Operator
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-bg-card border border-border-color text-text-main placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent-cyan/20 focus:border-accent-cyan transition-all duration-300"
                  placeholder="operator@smartraf.id"
                  required
                />
              </div>

              {/* Input Password */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-bg-card border border-border-color text-text-main placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent-cyan/20 focus:border-accent-cyan transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Tombol Login */}
              <button
                type="submit"
                className="w-full mt-4 py-3.5 px-4 bg-accent-cyan hover:bg-accent-cyan-hover text-white font-black rounded-lg tracking-[0.2em] uppercase transition-all duration-300 shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 hover:-translate-y-0.5 active:scale-95"
              >
                LOGIN
              </button>

            </form>
          </div>

          {/* ========================================================
              FOOTER: Badge Status Sistem 
              ======================================================== */}
          <div className="absolute bottom-8 left-0 w-full flex justify-center pointer-events-none">
            <div className="flex items-center space-x-2 bg-bg-card border border-border-color px-4 py-2 rounded-full shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green"></span>
              </span>
              <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">
                SYSTEM ONLINE: V2.4.0
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}