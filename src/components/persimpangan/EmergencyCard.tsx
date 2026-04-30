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
    <div className="bg-bg-card border border-accent-red/30 rounded-xl p-5 shadow-sm flex flex-col h-full relative">
      
      {/* MODAL KONFIRMASI DARURAT */}
      {showModal.active && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-4 bg-accent-red/10 backdrop-blur-sm rounded-xl animate-fade-in">
          <div className="bg-bg-card border border-accent-red/30 p-6 rounded-xl shadow-2xl max-w-sm w-full animate-scale-up">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white shadow-lg ${activeEmergency === showModal.key ? 'bg-accent-green' : 'bg-accent-red'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                {activeEmergency === showModal.key 
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                }
              </svg>
            </div>
            <h3 className="text-lg font-black text-text-main mb-2 uppercase tracking-tight">
              {activeEmergency === showModal.key ? 'Matikan Darurat?' : 'Peringatan Darurat!'}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              {activeEmergency === showModal.key 
                ? `Apakah Anda yakin ingin menonaktifkan kendali darurat pada JALUR ${showModal.key?.toUpperCase()} dan kembali ke mode otomatis?`
                : `Apakah Anda yakin ingin memaksakan fase hijau pada JALUR ${showModal.key?.toUpperCase()}? Tindakan ini akan menghentikan alur adaptif normal.`
              }
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal({ active: false, key: null })}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border-color text-text-secondary text-xs font-bold hover:bg-bg-main transition-colors"
              >
                BATAL
              </button>
              <button 
                onClick={executeEmergency}
                className={`flex-1 px-4 py-2.5 rounded-lg text-white text-xs font-bold transition-transform active:scale-95 shadow-lg ${activeEmergency === showModal.key ? 'bg-accent-green hover:bg-green-600 shadow-green-500/20' : 'bg-accent-red hover:bg-accent-red-hover shadow-accent-red/20'}`}
              >
                YA, TERAPKAN
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-5 border-b border-border-color pb-3">
        <div className="w-8 h-8 rounded-lg bg-accent-red/10 flex items-center justify-center text-accent-red">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-bold text-text-main leading-tight">Kendali Darurat</h3>
          <p className="text-[11px] text-accent-red font-medium">Override T-Junction (Ambulans/Damkar)</p>
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
              className={`relative flex items-center justify-center gap-3 p-3.5 rounded-lg border transition-all duration-300 disabled:opacity-40 
                ${isActive
                    ? 'bg-accent-red border-accent-red text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    : 'bg-bg-main border-border-color hover:border-accent-red/50 text-text-secondary hover:text-accent-red'
                }`}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              ) : (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {j.icon}
                </svg>
              )}

              <span className="text-[11px] font-bold uppercase tracking-widest">
                {isActive ? `NONAKTIFKAN DARURAT ${j.label}` : j.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}