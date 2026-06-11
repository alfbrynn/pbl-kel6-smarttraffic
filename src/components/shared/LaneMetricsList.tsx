import React, { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

/**
 * Props untuk Komponen LaneCard
 */
interface LaneCardProps {
  jalur: {
    arah: string;
    nama: string;
  };
  data: any;
}

/**
 * Komponen LaneCard
 * Menampilkan data jalur lalu lintas individual, termasuk countdown dan visualisasi lampu.
 */
const LaneCard: React.FC<LaneCardProps> = ({ jalur, data }) => {
  // --- States (Status) ---
  const [countdown, setCountdown] = useState(0);
  const [prevLampu, setPrevLampu] = useState('MATI');

  // --- Side Effects (Efek Samping) ---
  useEffect(() => {
    if (!data) return;

    setCountdown((currentLocalTime) => {
      const hasLampuChanged = data.status_lampu !== prevLampu;
      const latencyDrift = Math.abs(currentLocalTime - data.sisa_waktu_detik);

      if (hasLampuChanged || latencyDrift > 2) {
        setPrevLampu(data.status_lampu);
        return data.sisa_waktu_detik;
      }

      return currentLocalTime;
    });
  }, [data?.sisa_waktu_detik, data?.status_lampu, prevLampu]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Derived Values (Nilai Turunan) ---
  const lampuStatus = data?.status_lampu ?? 'MATI';
  const densityStatus = data?.status_kepadatan ?? 'Tidak Aktif';

  // Logika jarak antrean: jika 0 maka dikit (0%), jika 200 maka full (100%)
  const maxJarak = 200;
  const currentJarak = data?.jarak_cm ?? 0;
  const densityPct = Math.max(0, Math.min(100, Math.round((currentJarak / maxJarak) * 100)));

  // Tentukan warna progress bar dan border glow kartu secara dinamis
  const progressBarColor = densityPct > 70 ? 'bg-red-500' :
                             densityPct > 35 ? 'bg-amber-500' : 'bg-emerald-500';

  const shadowGlow = lampuStatus === 'HIJAU' ? 'shadow-[0_4px_20px_rgba(16,185,129,0.06)] border-emerald-500/20' :
                     lampuStatus === 'MERAH' ? 'shadow-[0_4px_20px_rgba(239,68,68,0.06)] border-red-500/20' :
                     lampuStatus === 'KUNING' ? 'shadow-[0_4px_20px_rgba(245,158,11,0.06)] border-amber-500/20' : 'border-border/10';

  return (
    <div className={`bg-card rounded-[24px] p-6 flex flex-col border transition-all duration-300 hover:scale-[1.02] ${shadowGlow}`}>

      {/* Informasi Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-foreground capitalize">Jalur {jalur.arah}</h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
          densityStatus === 'PADAT' || densityStatus === 'MACET' ? 'bg-red-500/15 text-red-500' :
          densityStatus === 'LANCAR' ? 'bg-emerald-500/15 text-emerald-500' :
          'bg-amber-500/15 text-amber-500'
        }`}>
          {densityStatus.toLowerCase()}
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Visualisasi Hardware Lampu Lalu Lintas dengan Efek Glow */}
        <div className="bg-[#131314] w-10 rounded-2xl py-3 flex flex-col items-center gap-3.5 border border-white/5 shadow-inner">
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${lampuStatus === 'MERAH' ? 'bg-red-500 shadow-[0_0_12px_#ef4444]' : 'bg-red-950/40 opacity-30'}`} />
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${lampuStatus === 'KUNING' ? 'bg-amber-500 shadow-[0_0_12px_#f59e0b] animate-pulse' : 'bg-amber-950/40 opacity-30'}`} />
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${lampuStatus === 'HIJAU' ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-emerald-950/40 opacity-30'}`} />
        </div>

        {/* Metrik Detail dengan Progress Bar Visual */}
        <div className="flex-1 flex flex-col gap-2.5">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-muted mb-1.5">
              <span>Jarak Antrean</span>
              <span className="font-bold text-foreground">{data?.jarak_cm ?? '--'} CM</span>
            </div>
            {/* Visualisasi Bar Kepadatan */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border/5">
              <div 
                className={`h-full ${progressBarColor} rounded-full transition-all duration-500`}
                style={{ width: `${densityPct}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between mt-1 text-xs text-muted border-t border-border/30 pt-2.5">
            <div className="flex items-center gap-1">
              <span>🚗</span> 
              <span>Kendaraan: <b className="text-foreground font-black">{data?.jumlah_kendaraan ?? 0}</b></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              <span>Waktu: <b className="text-primary text-sm font-black">{countdown}d</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Komponen TrafficGrid
 * Mengatur beberapa komponen LaneCard dengan menyediakan data dari Firestore.
 */
const TrafficGrid: React.FC = () => {
  // --- States (Status) ---
  const [dataMap, setDataMap] = useState<any>({});

  // --- Side Effects (Efek Samping) ---
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'persimpangan', 'simpang-utama'), (snap) => {
      if (snap.exists()) {
        setDataMap(snap.data().jalur || {});
      }
    });
    return () => unsub();
  }, []);

  // --- Konfigurasi Layout ---
  const jalurList = [
    { arah: 'barat', nama: 'Jalur Barat' },
    { arah: 'timur', nama: 'Jalur Timur' },
    { arah: 'selatan', nama: 'Jalur Selatan' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {jalurList.map((j) => (
        <LaneCard key={j.arah} jalur={j} data={dataMap[j.arah]} />
      ))}
    </div>
  );
};

export default TrafficGrid;