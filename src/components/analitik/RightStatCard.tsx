"use client";
import { useEffect, useRef, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';

function useCountUp(target: number, duration = 1200, trigger = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger || target === 0) return;
    let start: number;
    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(ease(p) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [trigger, target, duration]);
  return val;
}

export default function RightStatCard() {
  const [totalKendaraan, setTotalKendaraan] = useState(0);
  const [efisiensi, setEfisiensi] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'kepadatan_jalan'), where('pers_id', '==', 'simpang-polinema')),
      (snap) => {
        const latest: Record<string, any> = {};
        snap.docs.forEach((doc) => {
          const d = doc.data();
          if (!latest[d.jalur_arah] || d.timestamp_ms > latest[d.jalur_arah].timestamp_ms) {
            latest[d.jalur_arah] = d;
          }
        });
        const rows = Object.values(latest);
        const total = rows.reduce((a, d) => a + (d.jumlah_kendaraan ?? 0), 0);
        const lancar = rows.filter(d => d.status_kepadatan === 'Lancar').length;
        const ef = rows.length ? Math.round((lancar / rows.length) * 100) : 0;
        setTotalKendaraan(total);
        setEfisiensi(ef);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const cTotal    = useCountUp(totalKendaraan, 1400, triggered);
  const cEfisiensi = useCountUp(efisiensi, 1000, triggered);
  const kapasitas  = totalKendaraan > 0 ? Math.min(Math.round((totalKendaraan / 500) * 100), 100) : 68;

  return (
    <div ref={ref} className="flex flex-col gap-6">
      {/* Efisiensi */}
      <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex-1 flex flex-col justify-center">
        <div className="text-[11px] font-bold text-text-secondary tracking-[0.5px] uppercase mb-3">EFISIENSI RATA-RATA</div>
        <div className="flex items-baseline gap-2 mb-2">
          <div className="text-[32px] font-bold text-text-main tabular-nums">
            {efisiensi > 0 ? cEfisiensi : 84}
          </div>
          <div className="text-[18px] text-text-secondary font-semibold">%</div>
          <div className="flex items-center text-[13px] font-bold text-accent-green">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            12%
          </div>
        </div>
        <div className="text-[12px] text-text-secondary leading-normal">Peningkatan arus lalu lintas dibandingkan pekan lalu.</div>
      </div>

      {/* Total Kendaraan */}
      <div className="bg-[#0f172a] text-[#f8fafc] rounded-custom p-6 shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex-1 flex flex-col justify-center">
        <div className="text-[11px] font-semibold tracking-[0.5px] text-[#94a3b8] mb-2 uppercase">Total Kendaraan Terdeteksi</div>
        <div className="text-[32px] font-bold text-white mb-4 tabular-nums">
          {totalKendaraan > 0 ? cTotal.toLocaleString('id-ID') : '42,891'}
        </div>
        <div className="w-full h-1.5 bg-[#334155] rounded-[4px] overflow-hidden mb-2">
          <div
            className="h-full bg-[#06b6d4] rounded-[4px] transition-all duration-1000"
            style={{ width: `${kapasitas}%` }}
          />
        </div>
        <div className="text-[11px] text-[#94a3b8]">{kapasitas}% dari kapasitas maksimal.</div>
      </div>
    </div>
  );
}
