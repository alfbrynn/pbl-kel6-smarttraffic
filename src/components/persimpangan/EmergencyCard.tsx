"use client";
import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const jalurs = [
  { key: 'utara',   label: 'Jalur Utara',   icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/> },
  { key: 'selatan', label: 'Jalur Selatan',  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/> },
  { key: 'timur',   label: 'Jalur Timur',    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/> },
  { key: 'barat',   label: 'Jalur Barat',    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/> },
];

export default function Emergency() {
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleOverride = async (key: string) => {
    if (loading) return;
    setLoading(key);
    try {
      await setDoc(
        doc(db, 'persimpangan', 'simpang-polinema'),
        {
          override_darurat: {
            jalur: key,
            aktif: true,
            timestamp: new Date().toISOString(),
            operator: 'Operator 01',
          }
        },
        { merge: true }
      );
      setActive(key);
      // Auto reset setelah 5 detik
      setTimeout(async () => {
        await setDoc(
          doc(db, 'persimpangan', 'simpang-polinema'),
          { override_darurat: { jalur: key, aktif: false, timestamp: new Date().toISOString() } },
          { merge: true }
        );
        setActive(null);
      }, 5000);
    } catch {
      console.error('Gagal kirim override');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-bg-card-alt border border-accent-orange rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-[#fef3c7] rounded-lg flex items-center justify-center text-[#d97706]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-text-main m-0">Kendali Darurat</h2>
            <p className="text-[13px] text-accent-orange mt-1 mb-0 font-medium">Otomasi Override Prioritas (Ambulans/Pemadam)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-bg-card border border-accent-red text-accent-red text-[11px] font-bold px-4 py-2 rounded-[20px] tracking-[0.5px]">
          <span className="w-1.5 h-1.5 bg-[#ef4444] rounded-full animate-pulse"/>
          SIAGA KENDALI MANUAL
        </div>
      </div>

      {/* Active override banner */}
      {active && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
          <span className="text-[12px] font-semibold text-emerald-700">
            Override aktif: {jalurs.find(j => j.key === active)?.label} — Fase hijau dipaksakan. Auto-reset dalam 5 detik.
          </span>
        </div>
      )}

      <div className="grid grid-cols-4 gap-6 mb-6">
        {jalurs.map((j) => {
          const isActive  = active === j.key;
          const isLoading = loading === j.key;
          return (
            <button
              key={j.key}
              onClick={() => handleOverride(j.key)}
              disabled={!!loading || !!active}
              className={`rounded-custom px-4 py-6 flex flex-col items-center gap-3 cursor-pointer
                transition-all duration-200 border
                disabled:opacity-60 disabled:cursor-not-allowed
                ${isActive
                  ? 'bg-emerald-50 border-emerald-400 shadow-[0_4px_12px_rgba(16,185,129,0.2)]'
                  : 'bg-bg-card border-border-color hover:border-[#fcd34d] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-[#f8fafc] text-[#475569]'
              }`}>
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {j.icon}
                  </svg>
                )}
              </div>
              <div className="text-[13px] font-semibold text-text-main">{j.label}</div>
              <div className={`text-[10px] font-bold uppercase transition-colors ${
                isActive ? 'text-emerald-600' : 'text-[#f59e0b]'
              }`}>
                {isActive ? 'AKTIF ✓' : 'PAKSA HIJAU DARURAT'}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-bg-card border border-border-color rounded-lg p-4 flex gap-3 items-start">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-text-secondary">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p className="m-0 text-[12px] text-text-secondary leading-normal font-semibold">
          Peringatan: Menekan tombol paksa hijau akan mereset siklus normal lampu lalu lintas. Gunakan hanya saat kendaraan prioritas terdeteksi atau dalam koordinasi dengan petugas lapangan.
        </p>
      </div>
    </div>
  );
}
