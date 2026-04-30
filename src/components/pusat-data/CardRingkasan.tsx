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
    const docRef = doc(db, 'persimpangan', 'simpang-utama');

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (title === "Total Kendaraan") {
          const jalur = data.jalur || {};
          const total = (jalur.barat?.jumlah_kendaraan || 0) + 
                        (jalur.timur?.jumlah_kendaraan || 0) + 
                        (jalur.selatan?.jumlah_kendaraan || 0);
          
          setValue(total.toLocaleString());
          setTrendText(total > 15 ? "Kepadatan Tinggi" : "Kepadatan Normal");
          setTrendType(total > 15 ? "negative" : "positive");
        } 
        
        else if (title === "Efisiensi Rata-rata") {
          // Logika sederhana untuk efisiensi berdasarkan antrean
          const jalur = data.jalur || {};
          const avgAntrean = ((jalur.barat?.realtime_antrean || 0) + 
                              (jalur.timur?.realtime_antrean || 0) + 
                              (jalur.selatan?.realtime_antrean || 0)) / 3;
          
          // Semakin kecil antrean, semakin tinggi efisiensi
          const efficiency = Math.max(0, Math.min(100, 100 - (avgAntrean / 2)));
          setValue(`${Math.round(efficiency)}%`);
          setTrendText(efficiency > 80 ? "Kondisi Optimal" : "Perlu Penyesuaian");
          setTrendType(efficiency > 80 ? "positive" : "neutral");
        }
      }
    }, (error) => {
      console.error(`Error fetching ${title}:`, error);
      setValue('Error');
    });

    return () => unsubscribe();
  }, [title]);

  // Logika warna berdasarkan trendType
  const bgColor = trendType === 'positive' ? 'bg-green-500/10' : trendType === 'neutral' ? 'bg-blue-500/10' : 'bg-red-500/10';
  const textColor = trendType === 'positive' ? 'text-green-500' : trendType === 'neutral' ? 'text-blue-500' : 'text-red-500';

  return (
    <div className="bg-bg-card p-6 rounded-xl shadow-sm border border-border-color flex-1 flex flex-col justify-center animate-fade-in">
      <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-4xl font-bold text-text-main">{value}</p>
      <span className={`text-xs font-medium mt-2 w-fit px-2 py-1 rounded ${bgColor} ${textColor} transition-colors duration-300`}>
        {trendText}
      </span>
    </div>
  );
}