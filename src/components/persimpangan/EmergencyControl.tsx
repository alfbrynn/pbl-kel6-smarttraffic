"use client";
import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const jalurs = [
  { key: 'barat', label: 'Barat', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /> },
  { key: 'timur', label: 'Timur', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /> },
  { key: 'selatan', label: 'Selatan', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> },
];

export default function EmergencyCard() {
  const [activeEmergency, setActiveEmergency] = useState<string>('OFF');
  const [loading, setLoading] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<{ active: boolean; key: string | null }>({
    active: false,
    key: null
  });

  /**
   * Memicu Modal Konfirmasi
   */
  const handleEmergency = (key: string) => {
    if (loading) return;
    setShowModal({ active: true, key });
  };

  /**
   * Eksekusi Perintah Darurat setelah konfirmasi
   */
  const executeEmergency = async () => {
    const key = showModal.key;
    if (!key) return;

    setLoading(key);
    setShowModal({ active: false, key: null });

    try {
      const docRef = doc(db, 'persimpangan', 'simpang-utama');
      const newStatus = activeEmergency === key ? 'OFF' : key;

      await setDoc(docRef, {
        status_darurat: newStatus
      }, { merge: true });

      setActiveEmergency(newStatus);
    } catch (error) {
      console.error("Gagal mengupdate status darurat:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-card border border-border/10 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative">

      {/* MODAL KONFIRMASI DARURAT */}
      {showModal.active && (
        <div className="absolute inset-0 z-200 flex items-center justify-center p-4 bg-accent-red/10 backdrop-blur-sm rounded-[24px] animate-fade-in">
          <div className="bg-card border border-accent-red/20 p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-scale-up">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white shadow-lg ${activeEmergency === showModal.key ? 'bg-accent-green' : 'bg-accent-red'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                {activeEmergency === showModal.key
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                }
              </svg>
            </div>
            <h3 className="text-lg font-black text-foreground mb-2 tracking-tight">
              {activeEmergency === showModal.key ? 'Matikan Darurat?' : 'Peringatan Darurat!'}
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              {activeEmergency === showModal.key
                ? `Apakah Anda yakin ingin menonaktifkan kendali darurat pada Jalur ${showModal.key ? showModal.key.charAt(0).toUpperCase() + showModal.key.slice(1) : ''} dan kembali ke mode otomatis?`
                : `Apakah Anda yakin ingin memaksakan fase hijau pada Jalur ${showModal.key ? showModal.key.charAt(0).toUpperCase() + showModal.key.slice(1) : ''}? Tindakan ini akan menghentikan alur adaptif normal.`
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal({ active: false, key: null })}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted text-xs font-bold hover:bg-background transition-colors"
              >
                Batal
              </button>
              <button
                onClick={executeEmergency}
                className="flex-1 px-4 py-2.5 rounded-xl text-black text-xs font-bold transition-transform active:scale-95 shadow-lg bg-accent-red hover:bg-accent-red-hover shadow-accent-red/20"
              >
                Ya, Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-red/10 flex items-center justify-center text-accent-red shadow-sm">
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground dark:text-dark leading-tight">Kendali Darurat</h2>
            <p className="text-[11px] text-accent-red font-medium">Override T-Junction (Ambulans/Damkar)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 flex-1 content-center">
        {jalurs.map((j) => {
          const isActive = activeEmergency === j.key;
          const isLoading = loading === j.key;

          return (
            <button
              key={j.key}
              onClick={() => handleEmergency(j.key)}
              disabled={!!loading || (activeEmergency !== 'OFF' && !isActive)}
              className={`relative flex items-center justify-center gap-3 p-3.5 rounded-xl border transition-all duration-300 disabled:opacity-40 
                ${isActive
                  ? 'bg-accent-red border-accent-red text-black shadow-[0_4px_12px_rgba(239,68,68,0.3)]'
                  : 'bg-background border-border hover:border-accent-red/50 text-muted hover:text-accent-red'
                }`}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              ) : (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {j.icon}
                </svg>
              )}

              <span className="text-xs font-semibold">
                {isActive ? `Nonaktifkan Darurat ${j.label}` : j.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}