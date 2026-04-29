import React, { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

function LaneCard({ jalur, data }: { jalur: any, data: any }) {
  const [countdown, setCountdown] = useState(0);
  const [prevLampu, setPrevLampu] = useState('MATI');

  // 1. SMART SYNC LOGIC (Anti-Glitch)
  useEffect(() => {
    if (!data) return;

    setCountdown((waktuLokalSaatIni) => {
      const lampuBerubah = data.status_lampu !== prevLampu;
      const latensiDrift = Math.abs(waktuLokalSaatIni - data.sisa_waktu_detik);

      // Hanya paksa sinkronisasi jika lampu berganti ATAU selisih waktu > 2 detik
      if (lampuBerubah || latensiDrift > 2) {
        setPrevLampu(data.status_lampu);
        return data.sisa_waktu_detik;
      }

      // Jika selisih kecil (hanya delay internet biasa), abaikan data server, 
      // biarkan timer lokal yang jalan terus agar UI mulus.
      return waktuLokalSaatIni;
    });
  }, [data?.sisa_waktu_detik, data?.status_lampu, prevLampu]);

  // 2. LOKAL TIMER (Smooth 1s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const lampu = data?.status_lampu ?? 'MATI';
  const status = data?.status_kepadatan ?? 'Offline';

  return (
    <div className="bg-bg-card rounded-xl p-4 flex flex-col border border-border-color hover:-translate-y-0.5 transition-all shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[14px] font-semibold text-text-main">{jalur.nama}</h3>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${status === 'Padat' ? 'bg-red-100 text-red-600' :
          status === 'Lancar' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
          }`}>
          {status}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className="bg-slate-800 w-10 rounded-2xl py-2 flex flex-col items-center gap-2 border border-slate-700">
          <div className={`w-4 h-4 rounded-full transition-all duration-150 ${lampu === 'MERAH' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] scale-110' : 'bg-red-950 opacity-30'}`} />
          <div className={`w-4 h-4 rounded-full transition-all duration-150 ${lampu === 'KUNING' ? 'bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)] scale-110' : 'bg-yellow-950 opacity-30'}`} />
          <div className={`w-4 h-4 rounded-full transition-all duration-150 ${lampu === 'HIJAU' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] scale-110' : 'bg-emerald-950 opacity-30'}`} />
        </div>

        <div className="flex-1">
          <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Antrean</div>
          <div className="text-xl font-bold text-text-main">
            {data?.jarak_cm ?? '--'} <span className="text-xs font-medium">CM</span>
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-text-secondary border-t border-border-color pt-2">
            <div>🚗 Total: <b className="text-text-main">{data?.jumlah_kendaraan ?? 0}</b></div>
            <div>Sisa: <b className="text-blue-500 text-[14px]">{countdown}s</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrafficGrid() {
  const [dataMap, setDataMap] = useState<any>({});

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'persimpangan', 'simpang-utama'), (snap) => {
      if (snap.exists()) setDataMap(snap.data().jalur || {});
    });
    return () => unsub();
  }, []);

  const jalurList = [
    { arah: 'barat', nama: 'Jalur Barat' },
    { arah: 'timur', nama: 'Jalur Timur' },
    { arah: 'selatan', nama: 'Jalur Selatan' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {jalurList.map((j) => <LaneCard key={j.arah} jalur={j} data={dataMap[j.arah]} />)}
    </div>
  );
}