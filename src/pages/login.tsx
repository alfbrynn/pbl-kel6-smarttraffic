"use client"; // Wajib ditambahkan karena kita menggunakan hooks (useState, useRouter)

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

      <div className="flex min-h-screen w-full bg-linear-to-br from-[#ebf4ff] via-[#f8fafc] to-[#ebf4ff] font-sans text-foreground">

        {/* KOLOM KIRI: Visual & Branding */}
        <div className="relative hidden md:flex md:w-[50%] flex-col justify-end p-12 overflow-hidden border-r border-border/5">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-linear-to-t from-slate-950 via-slate-900/30 to-transparent" />
          <div className="relative z-20 mb-8 animate-fade-up">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-white mb-2 drop-shadow-sm">
              SMART<span className="text-primary">RAF</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-200 font-semibold tracking-wide">
              Sistem Tata Kelola Lalu Lintas
            </p>
          </div>
        </div>

        {/* KOLOM KANAN: Form Login */}
        <div className="relative flex w-full md:w-[50%] flex-col justify-center bg-transparent px-8 sm:px-12 lg:px-16">

          <div className="absolute top-8 left-8 sm:left-12 lg:left-16 z-20">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-muted hover:text-primary transition-all duration-300 group"
            >
              <div className="w-9 h-9 rounded-xl bg-card/85 flex items-center justify-center border border-border/80 shadow-sm group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:-translate-x-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">Landing Page</span>
            </Link>
          </div>

          <div className="w-full max-w-md mx-auto z-10 animate-scale-in bg-white/70 backdrop-blur-xl border border-border/10 p-8 sm:p-10 rounded-[32px] shadow-2xl">

            <div className="mb-10">
              <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">
                Otorisasi Operator
              </h2>
              <p className="text-muted text-sm font-semibold">
                Silakan masuk untuk mengakses pusat kendali.
              </p>
            </div>

            {/* Alert Box untuk Error Message */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-accent-red/10 border border-accent-red/20 flex items-center gap-3 animate-fade-in">
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
                <label className="block text-xs font-bold text-muted uppercase tracking-widest">
                  ID / Email Operator
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/80 text-foreground placeholder-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  placeholder="operator@smartraf.id"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-muted uppercase tracking-widest">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/80 text-foreground placeholder-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center mt-4 py-3.5 px-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl tracking-[0.15em] uppercase transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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
        </div>
      </div>
    </>
  );
}