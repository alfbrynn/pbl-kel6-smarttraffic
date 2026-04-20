"use client";
import React, { useEffect, useRef, useState } from 'react';
// UBAH IMPORT: Buang collection, query, where. Ganti jadi doc.
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface JalurData {
  jalur_arah?: string;
  jarak_cm: number;
  jumlah_kendaraan: number;
  status_kepadatan: string;
  status_lampu: string;
}

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

export default function StatsRow() {
  const [dataMap, setDataMap] = useState<Record<string, JalurData>>({});
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // PERBAIKAN: Langsung tembak ke dokumen persimpangan
    const docRef = doc(db, 'persimpangan', 'simpang-utama');

    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Set dataMap langsung dari object 'jalur' yang dikirim oleh Bridge
        setDataMap(data.jalur || {});
      }
    });

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

  // PERBAIKAN LOGIKA KALKULASI: Pastikan tidak error kalau nilainya undefined
  const jalurValues = Object.values(dataMap);
  const totalDeteksi = jalurValues.reduce((a, d) => a + (d.jumlah_kendaraan ?? 0), 0);
  const rataJarak = jalurValues.length > 0
    ? Math.round(jalurValues.reduce((a, d) => a + (d.jarak_cm ?? 0), 0) / jalurValues.length)
    : 0;
  const jalurNormal = jalurValues.filter(d => d.status_kepadatan === 'Lancar').length;
  const statusNormal = jalurValues.length > 0 ? Math.round((jalurNormal / jalurValues.length) * 100) : 0;

  // Karena di script python ada status "Antre" pas lagi merah, mending kita hitung juga sebagai alert ringan
  const alertCount = jalurValues.filter(d =>
    d.status_kepadatan === 'Padat' || d.status_kepadatan === 'Cukup Padat' || d.status_kepadatan === 'Antre'
  ).length;

  const cTotal = useCountUp(totalDeteksi, 1400, triggered);
  const cJarak = useCountUp(rataJarak, 1000, triggered);
  const cNormal = useCountUp(statusNormal, 1200, triggered);
  const cAlert = useCountUp(alertCount, 800, triggered);

  const stats = [
    {
      label: "TOTAL DETEKSI",
      value: cTotal.toLocaleString('id-ID'),
      suffix: "",
      badge: "Real-time",
      badgeColor: "text-emerald-600 bg-emerald-50",
      sub: "Kendaraan terdeteksi (IR)",
      color: "text-text-main",
      iconBg: "bg-blue-50 text-blue-500",
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17H5a2 2 0 01-2-2V9a2 2 0 012-2h3m6 10h4a2 2 0 002-2V9a2 2 0 00-2-2h-3M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M9 7h6" />
        </svg>
      ),
    },
    {
      label: "RATA-RATA JARAK",
      value: cJarak,
      suffix: "cm",
      badge: null,
      sub: "Antrean semua jalur (US)",
      color: "text-text-main",
      iconBg: "bg-emerald-50 text-emerald-500",
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />
        </svg>
      ),
    },
    {
      label: "STATUS NORMAL",
      value: `${cNormal}`,
      suffix: "%",
      badge: null,
      sub: "Jalur dalam kondisi lancar",
      color: cNormal >= 75 ? "text-emerald-600" : cNormal >= 50 ? "text-amber-500" : "text-red-500",
      iconBg: "bg-violet-50 text-violet-500",
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      label: "ALERT SISTEM",
      value: String(cAlert).padStart(2, '0'),
      suffix: "",
      badge: null,
      sub: "Jalur perlu perhatian",
      color: cAlert > 0 ? "text-red-500" : "text-text-main",
      iconBg: cAlert > 0 ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400",
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="bg-bg-card rounded-custom p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-border-color
            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          style={{
            opacity: triggered ? 1 : 0,
            transform: triggered ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 0.5s ease-out ${i * 80}ms, transform 0.5s ease-out ${i * 80}ms, box-shadow 0.2s`,
          }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">{s.label}</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
              {s.icon}
            </div>
          </div>

          {/* Value */}
          <div className="flex items-end gap-2 mb-1">
            <span className={`text-[32px] font-black leading-none tabular-nums ${s.color}`}>
              {s.value}
            </span>
            {s.suffix && (
              <span className="text-[16px] font-semibold text-text-secondary mb-0.5">{s.suffix}</span>
            )}
            {s.badge && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full mb-1 ${s.badgeColor}`}>
                {s.badge}
              </span>
            )}
          </div>

          {/* Sub */}
          <p className="text-[11px] text-text-secondary mt-2 border-t border-border-color pt-2">
            {s.sub}
          </p>
        </div>
      ))}
    </div>
  );
}