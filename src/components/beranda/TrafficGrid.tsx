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
  /**
   * Logika Smart Sync: Sinkronisasi countdown lokal dengan data Firestore.
   * Mencegah glitch pada UI dengan hanya memaksa sinkronisasi jika status lampu berubah atau drift besar.
   */
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

  /**
   * Timer Lokal: Mengurangi countdown setiap detik untuk UI yang mulus.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Derived Values (Nilai Turunan) ---
  const lampuStatus = data?.status_lampu ?? 'MATI';
  const densityStatus = data?.status_kepadatan ?? 'Offline';

  return (
    <div className="bg-bg-card rounded-xl p-4 flex flex-col border border-border-color hover:-translate-y-0.5 transition-all shadow-sm">
      {/* Informasi Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[14px] font-semibold text-text-main">{jalur.nama}</h3>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          densityStatus === 'Padat' ? 'bg-red-100 text-red-600' :
          densityStatus === 'Lancar' ? 'bg-green-100 text-green-600' : 
          'bg-orange-100 text-orange-600'
        }`}>
          {densityStatus}
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Visualisasi Hardware Lampu Lalu Lintas */}
        <div className="bg-[#131314] w-10 rounded-2xl py-2 flex flex-col items-center gap-2 border border-white/5">
          <div className={`w-4 h-4 rounded-full transition-all duration-150 ${lampuStatus === 'MERAH' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] scale-110' : 'bg-red-950 opacity-30'}`} />
          <div className={`w-4 h-4 rounded-full transition-all duration-150 ${lampuStatus === 'KUNING' ? 'bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] scale-110' : 'bg-yellow-950 opacity-30'}`} />
          <div className={`w-4 h-4 rounded-full transition-all duration-150 ${lampuStatus === 'HIJAU' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] scale-110' : 'bg-emerald-950 opacity-30'}`} />
        </div>

        {/* Metrik Detail */}
        <div className="flex-1">
          <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Jarak Antrean</div>
          <div className="text-xl font-bold text-text-main">
            {data?.jarak_cm ?? '--'} <span className="text-xs font-medium">CM</span>
          </div>
          
          <div className="flex justify-between mt-2 text-[11px] text-text-secondary border-t border-border-color pt-2">
            <div>🚗 Kendaraan: <b className="text-text-main">{data?.jumlah_kendaraan ?? 0}</b></div>
            <div>Timer: <b className="text-blue-500 text-[14px]">{countdown}s</b></div>
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