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
            jalur.barat?.realtime_antrean || 0,
            jalur.timur?.realtime_antrean || 0,
            jalur.selatan?.realtime_antrean || 0
          );
          
          setValue(`${maxAntrean}cm`);
          setTrendText(maxAntrean > 100 ? "Perlu Prioritas" : "Masih Aman");
          setTrendType(maxAntrean > 100 ? "negative" : "positive");
        }
        
        // --- 4. Efisiensi Rata-rata ---
        else if (title === "Efisiensi Sistem") {
          const avgAntrean = ((jalur.barat?.realtime_antrean || 0) + 
                              (jalur.timur?.realtime_antrean || 0) + 
                              (jalur.selatan?.realtime_antrean || 0)) / 3;
          
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

  const bgColor = trendType === 'positive' ? 'bg-green-500/10' : trendType === 'neutral' ? 'bg-blue-500/10' : 'bg-red-500/10';
  const textColor = trendType === 'positive' ? 'text-green-500' : trendType === 'neutral' ? 'text-blue-500' : 'text-red-500';

  return (
    <div className="bg-bg-card p-5 rounded-xl shadow-sm border border-border-color flex-1 flex flex-col justify-center animate-fade-in hover:border-accent-cyan/30 transition-all duration-300">
      <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-3xl font-bold text-text-main truncate">{value}</p>
      <span className={`text-[10px] font-medium mt-2 w-fit px-2 py-0.5 rounded ${bgColor} ${textColor} transition-colors duration-300`}>
        {trendText}
      </span>
    </div>
  );
}