// pages/pusat-data/index.tsx
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import CSVEksportButton from '@/components/pusat-data/CSVEksportButton';
import DataSummaryCard from '@/components/pusat-data/DataSummaryCard';
import SensorLogTable from '@/components/pusat-data/SensorLogTable';
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
        <PageHeader
          title="Pusat Data"
          subtitle={
            <>
              <span>Log sensor</span>
              <span className="text-slate-300 dark:text-slate-700 font-normal">•</span>
              <span className="text-slate-500">Hari ini: <strong className="text-foreground dark:text-white font-bold">{formattedCount}</strong> entri</span>
            </>
          }
          actions={<CSVEksportButton />}
        />

        {/* BARIS 1: VISUALISASI UTAMA (Cinematic Ultra-Wide) */}
        <div className="w-full h-[400px]">
          <DensityChart />
        </div>

        {/* BARIS 2: RINGKASAN KPI (4-Column Bento Row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DataSummaryCard title="Rata-rata Beban" />
          <DataSummaryCard title="Titik Terpadat" />
          <DataSummaryCard title="Antrean Terpanjang" />
          <DataSummaryCard title="Efisiensi Sistem" />
        </div>

        {/* BARIS 3: LOG SENSOR */}
        <div className="w-full">
          <SensorLogTable />
        </div>

      </div>
    </>
  );
}
