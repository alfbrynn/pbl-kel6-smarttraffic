"use client";
import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase'; // Pastikan path ini sesuai dengan project Anda

export default function ParameterCard() {
  const [params, setParams] = useState({
    jarakKepadatan: '150',
    bobotWaktu: '2',
    durasiHijauMin: '15',
    durasiHijauMaks: '60',
    durasiKuning: '3',
    allRed: '2'
  });
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleSaveParameter = async () => {
    setLoading(true);
    setAlertMsg(null);

    try {
      const docRef = doc(db, 'persimpangan', 'simpang-utama');

      // Mengubah string dari input menjadi number sesuai format yang diharapkan
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

      // Menggunakan setDoc dengan opsi merge agar field lain (seperti status_darurat) tidak terhapus
      await setDoc(docRef, payload, { merge: true });

      setAlertMsg({ type: 'success', text: 'Parameter berhasil disimpan!' });

      // Hilangkan notifikasi setelah 3 detik
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (error) {
      console.error("Gagal menyimpan parameter:", error);
      setAlertMsg({ type: 'error', text: 'Gagal menyimpan data ke server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-card border border-border-color rounded-xl p-5 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5 border-b border-border-color pb-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-text-main leading-tight">Pengaturan Parameter</h3>
          <p className="text-[11px] text-text-secondary">Konfigurasi algoritma adaptif</p>
        </div>
      </div>

      {/* Alert Notifikasi Sederhana */}
      {alertMsg && (
        <div className={`mb-4 px-3 py-2 text-[12px] font-bold rounded-lg ${alertMsg.type === 'success' ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' : 'bg-accent-red/10 text-accent-red border border-accent-red/20'}`}>
          {alertMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 flex-1 content-start">
        {[
          { label: 'Batas Kepadatan', name: 'jarakKepadatan', unit: 'CM' },
          { label: 'Bobot Waktu', name: 'bobotWaktu', unit: 'DETIK/UNIT' },
          { label: 'Durasi Hijau Min', name: 'durasiHijauMin', unit: 'DETIK' },
          { label: 'Durasi Hijau Maks', name: 'durasiHijauMaks', unit: 'DETIK' },
          { label: 'Durasi Kuning', name: 'durasiKuning', unit: 'DETIK' },
          { label: 'Jeda All-Red', name: 'allRed', unit: 'DETIK' },
        ].map((item) => (
          <div key={item.name} className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wide">{item.label}</label>
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

      <button onClick={handleSaveParameter} disabled={loading} className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white text-[12px] font-bold py-3 rounded-lg transition-colors mt-auto tracking-widest flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            MENYIMPAN...
          </>
        ) : 'SIMPAN PERUBAHAN'}
      </button>
    </div>
  );
}