// components/pusat-data/CardRingkasan.tsx
import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface CardRingkasanProps {
  title: string;
}

export default function CardRingkasan({ title }: CardRingkasanProps) {
  const [value, setValue] = useState<string | number>('...');
  const [trendText, setTrendText] = useState('Memuat...');
  const [trendType, setTrendType] = useState<'positive' | 'neutral' | 'negative'>('neutral');

  useEffect(() => {
    // SEMUA kartu di sini hanya membaca 1 DOKUMEN (Simpang Utama) agar HEMAT KUOTA/CREDIT
    const docRef = doc(db, 'persimpangan', 'simpang-utama');

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const jalur = data.jalur || {};

        // --- 1. Rata-rata Kendaraan / Jalur ---
        if (title === "Rata-rata Beban") {
          const total = (jalur.barat?.jumlah_kendaraan || 0) +
            (jalur.timur?.jumlah_kendaraan || 0) +
            (jalur.selatan?.jumlah_kendaraan || 0);
          const avg = (total / 3).toFixed(1);

          setValue(avg);
          setTrendText("Kendaraan per jalur");
          setTrendType("neutral");
        }

        // --- 2. Titik Paling Padat ---
        else if (title === "Titik Terpadat") {
          const l = [
            { n: 'Barat', v: jalur.barat?.jumlah_kendaraan || 0 },
            { n: 'Timur', v: jalur.timur?.jumlah_kendaraan || 0 },
            { n: 'Selatan', v: jalur.selatan?.jumlah_kendaraan || 0 }
          ];
          const busiest = l.sort((a, b) => b.v - a.v)[0];

          setValue(busiest.n);
          setTrendText(`${busiest.v} Kendaraan`);
          setTrendType(busiest.v > 10 ? "negative" : "neutral");
        }

        // --- 3. Estimasi Antrean Terpanjang ---
        else if (title === "Antrean Terpanjang") {
          const maxAntrean = Math.max(
            jalur.barat?.jarak_cm || 0,
            jalur.timur?.jarak_cm || 0,
            jalur.selatan?.jarak_cm || 0
          );

          setValue(`${maxAntrean}cm`);
          setTrendText(maxAntrean > 100 ? "Perlu Prioritas" : "Masih Aman");
          setTrendType(maxAntrean > 100 ? "negative" : "positive");
        }

        // --- 4. Efisiensi Rata-rata ---
        else if (title === "Efisiensi Sistem") {
          const avgAntrean = ((jalur.barat?.jarak_cm || 0) +
            (jalur.timur?.jarak_cm || 0) +
            (jalur.selatan?.jarak_cm || 0)) / 3;

          const efficiency = Math.max(0, Math.min(100, 100 - (avgAntrean / 2)));
          setValue(`${Math.round(efficiency)}%`);
          setTrendText(efficiency > 80 ? "Kondisi Optimal" : "Terjadi Bottleneck");
          setTrendType(efficiency > 80 ? "positive" : "neutral");
        }
      }
    }, (error) => {
      console.error(`Error fetching ${title}:`, error);
      setValue('Error');
    });

    return () => unsubscribe();
  }, [title]);

  const bgColor = trendType === 'positive' ? 'bg-emerald-500/15' : trendType === 'neutral' ? 'bg-primary/15' : 'bg-red-500/15';
  const textColor = trendType === 'positive' ? 'text-emerald-500' : trendType === 'neutral' ? 'text-primary' : 'text-red-500';

  return (
    <div className="bg-card p-6 rounded-[24px] shadow-sm hover:shadow-md border border-border/10 flex-1 flex flex-col justify-center animate-fade-in hover:-translate-y-1 transition-all duration-300">
      <span className="text-xs font-semibold text-muted mb-1.5 block">{title}</span>
      <p className="text-3xl font-black text-foreground dark:text-black truncate">{value}</p>
      <span className={`text-xs font-semibold mt-3.5 w-fit px-2.5 py-0.5 rounded-full ${bgColor} ${textColor} transition-colors duration-300`}>
        {trendText}
      </span>
    </div>
  );
}