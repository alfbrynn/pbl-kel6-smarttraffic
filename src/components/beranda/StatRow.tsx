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
    d.status_kepadatan === 'Padat' || d.status_kepadatan === 'Cukup Padat'
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

  // Bangun konfigurasi insight
  const insights = [
    {
      label: "Status Persimpangan",
      value: statusTitle,
      desc: statusDesc,
      icon: statusIcon,
      iconBg: statusBg,
      valColor: statusColor,
      anim: "animate-fade-up-1"
    },
    {
      label: "Titik Perhatian",
      value: busiestPoint ? `Jalur ${busiestPoint[0].charAt(0).toUpperCase() + busiestPoint[0].slice(1)}` : "Stabil",
      desc: busiestPoint ? `Panjang antrean: ${busiestPoint[1].jarak_cm} cm` : "Tidak ada antrean signifikan terdeteksi.",
      icon: "📍",
      iconBg: "bg-bg-card-alt",
      valColor: "text-text-main",
      anim: "animate-fade-up-2"
    },
    {
      label: "Konektivitas IoT",
      value: "Node Aktif",
      desc: "Aliran telemetri real-time sedang aktif.",
      icon: "🌐",
      iconBg: "bg-bg-card-alt",
      valColor: "text-text-main",
      anim: "animate-fade-up-3"
    },
    {
      label: "Volume Kendaraan",
      value: `${totalVehicles} Unit`,
      desc: "Total kendaraan yang terdeteksi saat ini.",
      icon: "🚗",
      iconBg: "bg-bg-card-alt",
      valColor: "text-text-main",
      anim: "animate-fade-up-4"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {insights.map((item) => (
        <div key={item.label} className={item.anim}>
          <div className="bg-bg-card rounded-custom p-4 border border-border-color flex items-start gap-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 h-full cursor-default">
            
            {/* Kontainer Ikon Kartu */}
            <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-base ${item.iconBg}`}>
              {item.icon}
            </div>

            {/* Konten Kartu */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <h3 className={`text-[16px] font-bold leading-tight ${item.valColor} truncate`}>
                {item.value}
              </h3>
              <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                {item.desc}
              </p>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;