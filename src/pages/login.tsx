"use client"; // Wajib ditambahkan karena kita menggunakan hooks (useState, useRouter)

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/utils/firebase'; // Pastikan path ini sesuai dengan file konfigurasi Firebase Anda

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Tambahan state untuk UX (Loading & Error)
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fungsi untuk menangani aksi submit form
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(''); // Reset error setiap kali mencoba login

    try {
      // 1. Autentikasi dengan Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Validasi Hak Akses di Firestore (Koleksi 'operators')
      const docRef = doc(db, 'operators', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log('Login berhasil. Selamat datang:', userData.nama);

        // 3. Arahkan ke halaman Dashboard/Beranda
        router.push('/beranda');
      } else {
        // Jika UID tidak terdaftar sebagai operator
        setErrorMsg('Akses Ditolak: Anda tidak terdaftar sebagai Operator.');
        await auth.signOut(); // Keluarkan kembali paksa
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Menangani pesan error umum
      setErrorMsg('Kredensial tidak valid. Silakan periksa Email dan Kata Sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login Operator | SMARTRAF</title>
      </Head>

      <div className="flex min-h-screen w-full bg-bg-main font-sans text-text-main">

        {/* KOLOM KIRI: Visual & Branding */}
        <div className="relative hidden md:flex md:w-[55%] flex-col justify-end p-12 overflow-hidden border-r border-border-color/50">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg-main via-bg-main/60 to-transparent" />
          <div className="relative z-20 mb-8 animate-fade-up">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-text-main mb-2">
              SMART<span className="text-accent-cyan">RAF</span>
            </h1>
            <p className="text-lg lg:text-xl text-text-secondary font-medium tracking-wide">
              Sistem Tata Kelola Lalu Lintas Terpadu
            </p>
          </div>
        </div>

        {/* KOLOM KANAN: Form Login */}
        <div className="relative flex w-full md:w-[45%] flex-col justify-center bg-bg-main px-8 sm:px-12 lg:px-16">

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

          <div className="w-full max-w-md mx-auto z-10 animate-scale-in">

            <div className="mb-10">
              <h2 className="text-3xl font-black text-text-main mb-2 tracking-tight">
                Otorisasi Operator
              </h2>
              <p className="text-text-secondary text-sm font-medium">
                Silakan masuk untuk mengakses pusat kendali.
              </p>
            </div>

            {/* Alert Box untuk Error Message */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-lg bg-accent-red/10 border border-accent-red/20 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-red shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-xs font-bold text-accent-red leading-relaxed">
                  {errorMsg}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">

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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center mt-4 py-3.5 px-4 bg-accent-cyan hover:bg-accent-cyan-hover text-white font-black rounded-lg tracking-[0.2em] uppercase transition-all duration-300 shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40 hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    MEMVERIFIKASI...
                  </>
                ) : (
                  'LOGIN'
                )}
              </button>

            </form>
          </div>

          {/* FOOTER: Badge Status Sistem */}
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