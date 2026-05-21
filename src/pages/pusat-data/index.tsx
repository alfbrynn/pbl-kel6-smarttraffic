// pages/pusat-data/index.tsx
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import ButtonUnduhCSV from '@/components/pusat-data/ButtonUnduhCSV';
import CardRingkasan from '@/components/pusat-data/CardRingkasan';
import TabelLogSensor from '@/components/pusat-data/TabelLogSensor';
import DensityChart from '@/components/pusat-data/DensityChart';
import { collection, query, where, getCountFromServer, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/utils/firebase';

/**
 * Halaman Pusat Data Traffic
 * Digunakan oleh tim Big Data untuk menganalisis data traffic.
 */
export default function PusatDataPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [entryCount, setEntryCount] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);

    const fetchCount = async () => {
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const startMs = todayStart.getTime();

        const q = query(
          collection(db, 'kepadatan_jalan'),
          where('timestamp_ms', '>=', startMs)
        );
        const snapshot = await getCountFromServer(q);
        setEntryCount(snapshot.data().count);
      } catch (error) {
        console.error("Gagal mengambil jumlah log:", error);
      }
    };

    fetchCount();

    // Trigger update count whenever a new log arrives
    const latestQuery = query(
      collection(db, 'kepadatan_jalan'),
      orderBy('timestamp_ms', 'desc'),
      limit(1)
    );
    const unsubscribe = onSnapshot(latestQuery, () => {
      fetchCount();
    });

    return () => unsubscribe();
  }, []);

  if (!isMounted) return null;

  const formattedCount = entryCount !== null ? entryCount.toLocaleString('id-ID') : '...';

  return (
    <>
      <Head>
        <title>Pusat Data | Smartraf</title>
        <meta name="description" content="Pusat Analisis Data Traffic" />
      </Head>

      <div className="flex flex-col gap-6 h-full animate-fade-in">

        {/* HEADER DASHBOARD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-text-main dark:text-white tracking-tight">Pusat Data</h1>
            <p className="text-sm text-text-secondary mt-1 font-semibold flex items-center gap-1.5">
              <span>Log sensor</span>
              <span className="text-slate-300 dark:text-slate-700 font-normal">•</span>
              <span className="text-slate-500">Hari ini: <strong className="text-text-main dark:text-white font-bold">{formattedCount}</strong> entri</span>
            </p>
          </div>
          <ButtonUnduhCSV />
        </div>

        {/* BARIS 1: VISUALISASI UTAMA (Cinematic Ultra-Wide) */}
        <div className="w-full h-[400px]">
          <DensityChart />
        </div>

        {/* BARIS 2: RINGKASAN KPI (4-Column Bento Row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardRingkasan title="Rata-rata Beban" />
          <CardRingkasan title="Titik Terpadat" />
          <CardRingkasan title="Antrean Terpanjang" />
          <CardRingkasan title="Efisiensi Sistem" />
        </div>

        {/* BARIS 3: LOG SENSOR */}
        <div className="w-full">
          <TabelLogSensor />
        </div>



      </div>
    </>
  );
}
