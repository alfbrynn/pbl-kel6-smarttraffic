"use client";
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const DOC_REF = doc(db, 'persimpangan', 'simpang-polinema');

export default function ParameterCard() {
  const [jarakKepadatan, setJarakKepadatan] = useState('');
  const [durasiLampu, setDurasiLampu] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Load nilai saat ini dari Firestore
  useEffect(() => {
    getDoc(DOC_REF).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.batas_jarak_cm) setJarakKepadatan(String(d.batas_jarak_cm));
        if (d.durasi_hijau_detik) setDurasiLampu(String(d.durasi_hijau_detik));
      }
    });
  }, []);

  const handleSave = async () => {
    const jarak = Number(jarakKepadatan);
    const durasi = Number(durasiLampu);

    if (!jarak || jarak < 10 || jarak > 500) {
      setError('Batas jarak harus antara 10–500 cm'); return;
    }
    if (!durasi || durasi < 5 || durasi > 180) {
      setError('Durasi lampu harus antara 5–180 detik'); return;
    }

    setError('');
    setLoading(true);
    try {
      await setDoc(DOC_REF, {
        batas_jarak_cm: jarak,
        durasi_hijau_detik: durasi,
        updated_at: new Date().toISOString(),
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Gagal menyimpan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
      <div className="flex gap-4 items-start mb-6">
        <div className="w-10 h-10 bg-[#f1f5f9] rounded-lg flex items-center justify-center text-[#475569]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-text-main m-0">Pengaturan Parameter</h2>
          <p className="text-[13px] text-text-secondary mt-1 mb-0">Konfigurasi ambang batas sensor dan waktu siklus</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-text-main">Batas Jarak Kepadatan (cm)</label>
          <div className="relative flex items-center">
            <input
              type="number" min={10} max={500}
              value={jarakKepadatan}
              onChange={(e) => setJarakKepadatan(e.target.value)}
              className="w-full h-12 bg-bg-card-alt border border-border-color rounded-lg px-4 pr-16 text-[14px] text-text-main outline-none font-sans placeholder:text-text-secondary focus:border-accent-cyan transition-colors"
              placeholder="Contoh: 150"
            />
            <span className="absolute right-4 text-[10px] font-bold bg-border-color text-text-main px-2 py-1 rounded-[12px]">CM</span>
          </div>
          <span className="text-[11px] text-[#64748b] italic">Jarak minimum kendaraan terdeteksi padat oleh sensor ultrasonik.</span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-text-main">Durasi Lampu Hijau Maksimal (detik)</label>
          <div className="relative flex items-center">
            <input
              type="number" min={5} max={180}
              value={durasiLampu}
              onChange={(e) => setDurasiLampu(e.target.value)}
              className="w-full h-12 bg-bg-card-alt border border-border-color rounded-lg px-4 pr-16 text-[14px] text-text-main outline-none font-sans placeholder:text-text-secondary focus:border-accent-cyan transition-colors"
              placeholder="Contoh: 60"
            />
            <span className="absolute right-4 text-[10px] font-bold bg-border-color text-text-main px-2 py-1 rounded-[12px]">DET</span>
          </div>
          <span className="text-[11px] text-[#64748b] italic">Waktu maksimal fase hijau untuk menghindari antrian panjang di jalur lain.</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-600 font-medium">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`btn-primary min-w-[160px] transition-all ${saved ? 'bg-emerald-500 hover:bg-emerald-500' : ''}`}
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </>
          ) : saved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Tersimpan!
            </>
          ) : (
            <>
              Simpan Pengaturan
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
