"use client";

import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

/**
 * Interface untuk Data Jalur Individual
 */
interface JalurData {
  jarak_cm: number;
  jumlah_kendaraan: number;
  status_kepadatan: string;
}

/**
 * Komponen StatsRow
 * Menampilkan barisan kartu statistik ringkasan berdasarkan data persimpangan real-time.
 * Menghitung insight seperti status persimpangan keseluruhan dan titik terpadat.
 */
const StatsRow: React.FC = () => {
  // --- States (Status) ---
  const [dataMap, setDataMap] = useState<Record<string, JalurData>>({});

  // --- Side Effects (Efek Samping) ---
  /**
   * Mendengarkan update real-time dari dokumen persimpangan Firestore
   */
  useEffect(() => {
    const docRef = doc(db, 'persimpangan', 'simpang-utama');
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDataMap(data.jalur || {});
      }
    });
    return () => unsub();
  }, []);

  // --- Kalkulasi & Insight ---
  const jalurEntries = Object.entries(dataMap);
  const totalVehicles = jalurEntries.reduce((sum, [_, d]) => sum + (d.jumlah_kendaraan ?? 0), 0);

  // Hitung jalur yang padat
  const congestedLanesCount = jalurEntries.filter(([_, d]) =>
    d.status_kepadatan === 'PADAT' || d.status_kepadatan === 'MACET'
  ).length;

  // Tentukan status persimpangan keseluruhan
  let statusTitle = "Lancar", statusColor = "text-accent-green",
    statusBg = "bg-accent-green-bg", statusIcon = "✅",
    statusDesc = "Arus lalu lintas saat ini terpantau optimal.";

  if (congestedLanesCount >= 2) {
    statusTitle = "Padat";
    statusColor = "text-accent-red";
    statusBg = "bg-accent-red-bg";
    statusIcon = "🚨";
    statusDesc = "Terjadi hambatan signifikan di beberapa titik.";
  } else if (congestedLanesCount === 1) {
    statusTitle = "Ramai";
    statusColor = "text-accent-orange";
    statusBg = "bg-accent-orange-bg";
    statusIcon = "⚠️";
    statusDesc = "Satu jalur mulai mengalami peningkatan beban.";
  }

  // Cari jalur dengan jarak terpendek (antrean tertinggi)
  const busiestPoint = jalurEntries.length > 0
    ? [...jalurEntries].sort((a, b) => (a[1].jarak_cm ?? 150) - (b[1].jarak_cm ?? 150))[0]
    : null;

  // Helper untuk merender ikon SVG modern
  const getIcon = (label: string, value: string) => {
    switch (label) {
      case "Status Persimpangan":
        if (value === "Lancar") {
          return (
            <div className="shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          );
        } else if (value === "Ramai") {
          return (
            <div className="shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          );
        } else {
          return (
            <div className="shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          );
        }
      case "Titik Perhatian":
        return (
          <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        );
      case "Koneksi Sistem":
        return (
          <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <circle cx="12" cy="20" r="1"></circle>
            </svg>
          </div>
        );
      case "Volume Kendaraan":
        return (
          <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Bangun konfigurasi insight
  const insights = [
    {
      label: "Status Persimpangan",
      value: statusTitle,
      desc: statusDesc,
      iconLabel: "Status Persimpangan",
      cardBg: statusTitle === "Lancar" ? "bg-emerald-200" :
        statusTitle === "Ramai" ? "bg-amber-200" :
          "bg-red-200",
      cardBorder: statusTitle === "Lancar" ? "border-emerald-300" :
        statusTitle === "Ramai" ? "border-amber-300" :
          "border-red-300",
      valueColor: "text-black",
      labelColor: "text-slate-800",
      descColor: "text-slate-800",
    },
    {
      label: "Titik Perhatian",
      value: busiestPoint ? `Jalur ${busiestPoint[0].charAt(0).toUpperCase() + busiestPoint[0].slice(1)}` : "Stabil",
      desc: busiestPoint ? `Panjang antrean: ${busiestPoint[1].jarak_cm} cm` : "Tidak ada antrean signifikan terdeteksi.",
      iconLabel: "Titik Perhatian",
      cardBg: "bg-card",
      cardBorder: "border-border/10",
      valueColor: "text-foreground",
      labelColor: "text-muted",
      descColor: "text-muted",
    },
    {
      label: "Koneksi Sistem",
      value: "Sistem Aktif",
      desc: "Sinkronisasi data sedang berjalan.",
      iconLabel: "Koneksi Sistem",
      cardBg: "bg-card",
      cardBorder: "border-border/10",
      valueColor: "text-foreground",
      labelColor: "text-muted",
      descColor: "text-muted",
    },
    {
      label: "Volume Kendaraan",
      value: `${totalVehicles} Unit`,
      desc: "Total kendaraan yang terdeteksi saat ini.",
      iconLabel: "Volume Kendaraan",
      cardBg: "bg-card",
      cardBorder: "border-border/10",
      valueColor: "text-foreground",
      labelColor: "text-muted",
      descColor: "text-muted",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {insights.map((item) => (
        <div key={item.label} className={`${item.cardBg} rounded-[24px] p-6 border ${item.cardBorder} flex items-start gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out h-full cursor-default`}>

          {/* Kontainer Ikon Kartu SVG */}
          {getIcon(item.iconLabel, item.value)}

          {/* Konten Kartu */}
          <div className="flex-1 min-w-0">
            <span className={`text-xs font-semibold mb-1.5 block ${item.labelColor}`}>
              {item.label}
            </span>
            <h3 className={`text-2xl font-black leading-tight ${item.valueColor} truncate`}>
              {item.value}
            </h3>
            <p className={`text-[11px] mt-2 leading-relaxed ${item.descColor}`}>
              {item.desc}
            </p>
          </div>

        </div>
      ))}
    </div>
  );
};

export default StatsRow;