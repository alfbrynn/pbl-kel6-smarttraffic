"use client";
import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";

// Counter animasi naik dari 0
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

interface StatData {
  totalKendaraan: number;
  rataJarak: number;
  jalurPadat: number;
  sensorAktif: number;
}

export default function PersimpanganStatsRow() {
  const [data, setData] = useState<StatData>({ totalKendaraan: 0, rataJarak: 0, jalurPadat: 0, sensorAktif: 0 });
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Firestore realtime
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "kepadatan_jalan"), where("pers_id", "==", "simpang-polinema")),
      (snap) => {
        if (snap.empty) return;
        // Ambil dokumen terbaru per jalur
        const latest: Record<string, any> = {};
        snap.docs.forEach((doc) => {
          const d = doc.data();
          const arah = d.jalur_arah;
          if (!latest[arah] || d.timestamp_ms > latest[arah].timestamp_ms) {
            latest[arah] = d;
          }
        });
        const rows = Object.values(latest);
        const totalKendaraan = rows.reduce((a, d) => a + (d.jumlah_kendaraan ?? 0), 0);
        const rataJarak = rows.length ? Math.round(rows.reduce((a, d) => a + (d.jarak_cm ?? 0), 0) / rows.length) : 0;
        const jalurPadat = rows.filter((d) => d.status_kepadatan === "Padat" || d.status_kepadatan === "Cukup Padat").length;
        const sensorAktif = rows.length;
        setData({ totalKendaraan, rataJarak, jalurPadat, sensorAktif });
      }
    );
    return () => unsub();
  }, []);

  // Trigger counter saat masuk viewport
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const totalKendaraan = useCountUp(data.totalKendaraan, 1400, triggered);
  const rataJarak      = useCountUp(data.rataJarak, 1000, triggered);
  const jalurPadat     = useCountUp(data.jalurPadat, 800, triggered);
  const sensorAktif    = useCountUp(data.sensorAktif, 600, triggered);

  const stats = [
    {
      label: "Total Kendaraan",
      value: totalKendaraan.toLocaleString("id-ID"),
      suffix: "",
      sub: "Terdeteksi hari ini",
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17H5a2 2 0 01-2-2V9a2 2 0 012-2h3m6 10h4a2 2 0 002-2V9a2 2 0 00-2-2h-3M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M9 7h6" />
        </svg>
      ),
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Rata-rata Jarak Antrean",
      value: rataJarak,
      suffix: " cm",
      sub: "Semua jalur aktif",
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Jalur Padat",
      value: jalurPadat,
      suffix: " / 4",
      sub: "Memerlukan perhatian",
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "Sensor Aktif",
      value: sensorAktif,
      suffix: " / 4",
      sub: "Terhubung & sinkron",
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`bg-bg-card rounded-custom border ${s.border} p-5 flex flex-col gap-3
            shadow-[0_1px_3px_rgba(0,0,0,0.06)]
            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]`}
          style={{
            opacity: triggered ? 1 : 0,
            transform: triggered ? "translateY(0)" : "translateY(16px)",
            transition: `opacity 0.5s ease-out ${i * 80}ms, transform 0.5s ease-out ${i * 80}ms, box-shadow 0.2s, translate 0.2s`,
          }}
        >
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
            {s.icon}
          </div>

          {/* Value */}
          <div>
            <div className={`text-[28px] font-black leading-none ${s.color} tabular-nums`}>
              {s.value}<span className="text-[16px] font-semibold text-text-secondary">{s.suffix}</span>
            </div>
            <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mt-1.5">
              {s.label}
            </div>
          </div>

          {/* Sub */}
          <div className="text-[11px] text-text-secondary border-t border-border-color pt-2.5 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${s.bg.replace("bg-", "bg-").replace("-50", "-400")}`} />
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
