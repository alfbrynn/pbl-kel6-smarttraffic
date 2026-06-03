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
  const densityStatus = data?.status_kepadatan ?? 'Tidak Aktif';

  return (
    <div className="bg-card rounded-[24px] p-6 flex flex-col border border-border/10 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Informasi Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-foreground">{jalur.nama}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          densityStatus === 'Padat' ? 'bg-red-500/20 text-red-500' :
          densityStatus === 'Lancar' ? 'bg-emerald-500/20 text-emerald-500' :
          'bg-amber-500/20 text-amber-500'
        }`}>
          {densityStatus}
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Visualisasi Hardware Lampu Lalu Lintas */}
        <div className="bg-[#131314] w-10 rounded-2xl py-2.5 flex flex-col items-center gap-2.5 border border-white/5">
          <div className={`w-4 h-4 rounded-full transition-all duration-150 ${lampuStatus === 'MERAH' ? 'bg-red-500' : 'bg-red-950 opacity-20'}`} />
          <div className={`w-4 h-4 rounded-full transition-all duration-150 ${lampuStatus === 'KUNING' ? 'bg-amber-500' : 'bg-amber-950 opacity-20'}`} />
          <div className={`w-4 h-4 rounded-full transition-all duration-150 ${lampuStatus === 'HIJAU' ? 'bg-emerald-500' : 'bg-emerald-950 opacity-20'}`} />
        </div>

        {/* Metrik Detail */}
        <div className="flex-1">
          <div className="text-xs font-semibold text-muted mb-0.5">Jarak Antrean</div>
          <div className="text-2xl font-black text-foreground">
            {data?.jarak_cm ?? '--'} <span className="text-xs font-semibold text-muted">CM</span>
          </div>

          <div className="flex justify-between mt-2.5 text-xs text-muted border-t border-border/30 pt-2.5">
            <div>🚗 Kendaraan: <b className="text-foreground font-bold">{data?.jumlah_kendaraan ?? 0}</b></div>
            <div>Waktu: <b className="text-primary text-sm font-black">{countdown}d</b></div>
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