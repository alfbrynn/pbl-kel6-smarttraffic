"use client";
import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

// Pisahkan nilai default agar mudah digunakan untuk fitur Reset
const DEFAULT_PARAMS = {
  jarakKepadatan: '150',
  bobotWaktu: '2',
  durasiHijauMin: '15',
  durasiHijauMaks: '60',
  durasiKuning: '3',
  allRed: '2'
};

export default function ParameterCard() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [initialParams, setInitialParams] = useState(DEFAULT_PARAMS); // Untuk melacak perubahan
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // State Modal Konfirmasi
  const [showModal, setShowModal] = useState<{ active: boolean; type: 'save' | 'reset' }>({
    active: false,
    type: 'save'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  // Cek apakah ada perubahan data
  const isDirty = JSON.stringify(params) !== JSON.stringify(initialParams);

  // Eksekusi Simpan
  const executeSave = async () => {
    setLoading(true);
    setShowModal({ ...showModal, active: false });
    setAlertMsg(null);

    try {
      const docRef = doc(db, 'persimpangan', 'simpang-utama');
      const payload = {
        pengaturan_manual: {
          jarak_padat_cm: Number(params.jarakKepadatan),
          bobot_waktu: Number(params.bobotWaktu),
          min_hijau_detik: Number(params.durasiHijauMin),
          max_hijau_detik: Number(params.durasiHijauMaks),
          kuning_detik: Number(params.durasiKuning),
          all_red_detik: Number(params.allRed)
        }
      };

      await setDoc(docRef, payload, { merge: true });
      setInitialParams(params); // Update nilai awal setelah berhasil simpan
      setAlertMsg({ type: 'success', text: 'Parameter algoritma berhasil diperbarui!' });
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (error) {
      console.error("Gagal menyimpan parameter:", error);
      setAlertMsg({ type: 'error', text: 'Gagal mengirim data ke server IoT.' });
    } finally {
      setLoading(false);
    }
  };

  // Eksekusi Reset
  const executeReset = () => {
    setParams(DEFAULT_PARAMS);
    setShowModal({ ...showModal, active: false });
  };

  // Objek Penjelasan Parameter untuk Tooltip
  const PARAM_DESCRIPTIONS: Record<string, string> = {
    jarakKepadatan: 'Ambang batas panjang antrean. Jika sensor mendeteksi antrean kendaraan telah mencapai atau melebihi jarak ini, jalur tersebut otomatis dikategorikan sebagai "Padat".',
    bobotWaktu: 'Waktu tambahan lampu hijau yang diberikan untuk setiap 1 unit mobil yang terdeteksi. (Contoh: Jika Bobot = 2 dan ada 5 mobil, maka dapat tambahan waktu 10 detik).',
    durasiHijauMin: 'Waktu minimum lampu hijau menyala, meskipun sensor mendeteksi jalur tersebut sedang kosong melompong.',
    durasiHijauMaks: 'Batas waktu maksimal lampu hijau menyala. Ini adalah fitur anti-starvation agar jalur lain tidak dikunci lampu merah selamanya saat jalur utama sedang macet parah.',
    durasiKuning: 'Waktu transisi lampu kuning peringatan sebelum berubah menjadi merah.',
    allRed: 'Waktu safety clearance di mana ketiga jalur berwarna merah semua secara bersamaan. Berfungsi memberi kesempatan kendaraan terakhir yang berada di tengah persimpangan untuk lewat sebelum jalur lain mulai jalan.'
  };

  return (
    <div className="bg-bg-card border border-border-color rounded-xl p-5 shadow-sm flex flex-col h-full relative">
      
      {/* MODAL KONFIRMASI KUSTOM */}
      {showModal.active && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-4 bg-bg-main/80 backdrop-blur-sm rounded-xl animate-fade-in">
          <div className="bg-bg-card border border-border-color p-6 rounded-xl shadow-2xl max-w-sm w-full animate-scale-up">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${showModal.type === 'save' ? 'bg-amber-500/10 text-amber-500' : 'bg-accent-red/10 text-accent-red'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-black text-text-main mb-2">
              {showModal.type === 'save' ? 'Konfirmasi Perubahan?' : 'Konfirmasi Reset?'}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              {showModal.type === 'save' 
                ? 'Perubahan ini akan langsung berdampak pada siklus lampu lalu lintas di lapangan secara real-time.' 
                : 'Semua nilai akan dikembalikan ke standar pabrik. Tindakan ini tidak dapat dibatalkan.'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal({ ...showModal, active: false })}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border-color text-text-secondary text-xs font-bold hover:bg-bg-main transition-colors"
              >
                BATAL
              </button>
              <button 
                onClick={showModal.type === 'save' ? executeSave : executeReset}
                className={`flex-1 px-4 py-2.5 rounded-lg text-white text-xs font-bold transition-transform active:scale-95 ${showModal.type === 'save' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-accent-red hover:bg-accent-red-hover'}`}
              >
                YA, TERAPKAN
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-5 border-b border-border-color pb-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-text-main leading-tight">Pengaturan Parameter</h3>
          <p className="text-[11px] text-text-secondary">Konfigurasi algoritma adaptif</p>
        </div>
      </div>

      {alertMsg && (
        <div className={`mb-4 px-3 py-2 text-[12px] font-bold rounded-lg ${alertMsg.type === 'success' ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' : 'bg-accent-red/10 text-accent-red border border-accent-red/20'}`}>
          {alertMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-6 mb-6 flex-1 content-start">
        {[
          { label: 'Batas Kepadatan', name: 'jarakKepadatan', unit: 'CM' },
          { label: 'Bobot Waktu', name: 'bobotWaktu', unit: 'DETIK/UNIT' },
          { label: 'Durasi Hijau Min', name: 'durasiHijauMin', unit: 'DETIK' },
          { label: 'Durasi Hijau Maks', name: 'durasiHijauMaks', unit: 'DETIK' },
          { label: 'Durasi Kuning', name: 'durasiKuning', unit: 'DETIK' },
          { label: 'Jeda All-Red', name: 'allRed', unit: 'DETIK' },
        ].map((item) => (
          <div key={item.name} className="flex flex-col gap-1.5 relative group">
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-[110] w-64 p-3 bg-slate-800 dark:bg-slate-700 text-white text-[10px] leading-relaxed rounded-lg shadow-xl border border-white/10 animate-fade-in pointer-events-none">
              {PARAM_DESCRIPTIONS[item.name]}
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45 border-r border-b border-white/10" />
            </div>

            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wide flex items-center gap-1 cursor-help">
              {item.label}
              <svg className="w-3 h-3 text-slate-400 hover:text-accent-cyan transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                name={item.name}
                value={params[item.name as keyof typeof params]}
                onChange={handleChange}
                className="w-full h-9 bg-bg-main border border-border-color rounded-md px-3 text-[13px] text-text-main font-mono outline-none focus:border-accent-cyan transition-colors"
              />
              <span className="absolute right-3 text-[9px] font-bold text-text-secondary">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex gap-3">
        <button
          onClick={() => setShowModal({ active: true, type: 'reset' })}
          disabled={loading}
          className="w-24 bg-transparent border border-border-color text-text-secondary hover:border-accent-red hover:text-accent-red text-[11px] font-bold py-3 rounded-lg transition-all tracking-widest disabled:opacity-50"
        >
          RESET
        </button>
        <button
          onClick={() => setShowModal({ active: true, type: 'save' })}
          disabled={loading || !isDirty}
          className={`flex-1 text-[12px] font-bold py-3 rounded-lg transition-all tracking-widest flex justify-center items-center gap-2 
            ${loading || !isDirty 
              ? 'bg-bg-main border border-border-color text-text-secondary opacity-50 cursor-not-allowed' 
              : 'bg-accent-cyan hover:bg-accent-cyan-hover text-white'}`}
        >
          {loading ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
        </button>
      </div>
    </div>
  );
}