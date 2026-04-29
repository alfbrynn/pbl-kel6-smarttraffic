"use client";
import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface JalurData {
  jarak_cm: number;
  jumlah_kendaraan: number;
  status_kepadatan: string;
}

export default function StatsRow() {
  const [dataMap, setDataMap] = useState<Record<string, JalurData>>({});

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

  const jalurEntries = Object.entries(dataMap);
  const totalKendaraan = jalurEntries.reduce((sum, [_, d]) => sum + (d.jumlah_kendaraan ?? 0), 0);
  const alertCount = jalurEntries.filter(([_, d]) =>
    d.status_kepadatan === 'Padat' || d.status_kepadatan === 'Cukup Padat'
  ).length;

  // --- LOGIKA INSIGHT ---
  let statusUtama = "Lancar", statusColor = "text-accent-green",
    statusBg = "bg-accent-green-bg", statusIcon = "✅",
    statusDesc = "Lalu lintas terpantau kondusif.";

  if (alertCount >= 2) {
    statusUtama = "Padat";
    statusColor = "text-accent-red";
    statusBg = "bg-accent-red-bg";
    statusIcon = "🚨";
    statusDesc = "Terjadi penumpukan di beberapa titik.";
  } else if (alertCount === 1) {
    statusUtama = "Ramai";
    statusColor = "text-accent-orange";
    statusBg = "bg-accent-orange-bg";
    statusIcon = "⚠️";
    statusDesc = "Satu jalur mulai mengalami antrean.";
  }

  const terpadat = jalurEntries.length > 0
    ? [...jalurEntries].sort((a, b) => (a[1].jarak_cm ?? 150) - (b[1].jarak_cm ?? 150))[0]
    : null;

  const insights = [
    {
      label: "Status Persimpangan",
      value: statusUtama,
      desc: statusDesc,
      icon: statusIcon,
      iconBg: statusBg,
      valColor: statusColor,
      anim: "animate-fade-up-1"
    },
    {
      label: "Titik Perhatian",
      value: terpadat ? `Jalur ${terpadat[0].charAt(0).toUpperCase() + terpadat[0].slice(1)}` : "Stabil",
      desc: terpadat ? `Antrean terpanjang: ${terpadat[1].jarak_cm} cm` : "Tidak ada antrean panjang",
      icon: "📍",
      iconBg: "bg-bg-card-alt",
      valColor: "text-text-main",
      anim: "animate-fade-up-2"
    },
    {
      label: "IOT Terhubung",
      value: "Node Aktif",
      desc: "Sensor mengirimkan data real-time",
      icon: "🌐",
      iconBg: "bg-bg-card-alt",
      valColor: "text-text-main",
      anim: "animate-fade-up-3"
    },
    {
      label: "Volume Kendaraan",
      value: `${totalKendaraan} Unit`,
      desc: "Total terdeteksi melintas saat ini",
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
          <div
            className="bg-bg-card rounded-custom p-4 border border-border-color flex items-start gap-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 h-full cursor-default"
          >
            {/* Icon Style yang lebih subtle agar selaras dengan grid bawah */}
            <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-base ${item.iconBg}`}>
              {item.icon}
            </div>

            <div className="flex-1 min-w-0">
              {/* Label disamakan ukurannya dengan label 'Antrean' di TrafficGrid */}
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                {item.label}
              </p>
              {/* Judul dengan font yang lebih proporsional */}
              <h3 className={`text-[16px] font-bold leading-tight ${item.valColor} truncate`}>
                {item.value}
              </h3>
              {/* Deskripsi yang lebih clean */}
              <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}