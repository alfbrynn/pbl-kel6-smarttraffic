import Head from 'next/head';
import { useEffect, useState } from 'react';
import SensorCard from '@/components/shared/JunctionSchema';
import TrafficGrid from '@/components/shared/LaneMetricsList';
import ParameterCard from '@/components/persimpangan/ParameterControl';
import EmergencyCard from '@/components/persimpangan/EmergencyControl';
import AuditLogTable from '@/components/persimpangan/AuditLogTable';
import PageHeader from '@/components/shared/PageHeader';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export default function Persimpangan() {
  const [isMounted, setIsMounted] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const docRef = doc(db, 'persimpangan', 'simpang-utama');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const emergencyStatus = data.status_darurat && data.status_darurat !== 'OFF';
        setIsEmergency(!!emergencyStatus);
      }
    }, (error) => {
      console.error("Firebase Persimpangan Error:", error);
    });

    return () => unsubscribe();
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <Head>
        <title>Pusat Kendali | Smartraf</title>
        <meta name="description" content="Manajemen Persimpangan T-Junction" />
      </Head>

      <div className="flex flex-col gap-6 animate-fade-in">

        {/* Page Greeting & Title */}
        <PageHeader
          title="Pusat Kendali Simpang"
          subtitle={
            <>
              <span>simpang-utama</span>
              <span className="text-slate-300 dark:text-slate-700 font-normal">•</span>
              {isEmergency ? (
                <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
                  <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-red-500 animate-pulse mr-0.5"></span>
                  ⚠ Mode Darurat Aktif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-0.5"></span>
                  Mode: Normal
                </span>
              )}
            </>
          }
        />

        {/* BARIS ATAS: VISUALISASI (Bento Grid) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">

          {/* KOLOM KIRI (Data Sensor) - Hero Bento Box (8 Span) */}
          <div className="xl:col-span-8 flex flex-col h-full">
            <SensorCard />
          </div>

          {/* KOLOM KANAN (Status Lampu) - Sidekick Bento Box (4 Span) */}
          <div className="xl:col-span-4 flex flex-col h-full">
            <TrafficGrid />
          </div>

        </div>

        {/* BARIS BAWAH: KENDALI (Parameter & Darurat) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-2">

          {/* KOLOM KIRI (Pengaturan Parameter) - Span 8 (Lebih Panjang) */}
          <div className="xl:col-span-8 flex flex-col h-full">
            <ParameterCard />
          </div>

          {/* KOLOM KANAN (Kendali Darurat) - Span 4 */}
          <div className="xl:col-span-4 flex flex-col h-full">
            <EmergencyCard />
          </div>

        </div>

        {/* BARIS KETIGA: AUDIT LOG */}
        <div className="w-full mt-2">
          <AuditLogTable />
        </div>

      </div>
    </>
  );
}