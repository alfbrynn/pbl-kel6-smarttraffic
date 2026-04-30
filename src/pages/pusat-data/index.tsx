// pages/pusat-data/index.tsx
import Head from 'next/head';
import React from 'react';
import HeaderPusatData from '@/components/pusat-data/HeaderPusatData';
import CardRingkasan from '@/components/pusat-data/CardRingkasan';
import TabelLogSensor from '@/components/pusat-data/TabelLogSensor';
import DensityChart from '@/components/pusat-data/DensityChart';

/**
 * Halaman Pusat Data Traffic
 * Digunakan oleh tim Big Data untuk menganalisis data traffic.
 */
export default function PusatDataPage() {
  return (
    <>
      <Head>
        <title>Pusat Data | SMARTRAF</title>
        <meta name="description" content="Pusat Analisis Data Traffic" />
      </Head>

      <div className="flex flex-col gap-5 h-full animate-fade-in">
        
        {/* HEADER DASHBOARD */}
        <HeaderPusatData />

        {/* BARIS ATAS: VISUALISASI & RINGKASAN */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch flex-1">
          
          {/* KOLOM KIRI - Pola Kepadatan (Span 8) */}
          <div className="xl:col-span-8 flex flex-col h-full">
            <DensityChart />
          </div>

          {/* KOLOM KANAN - Ringkasan KPI (Span 4) */}
          <div className="xl:col-span-4 flex flex-col gap-6 h-full">
            <CardRingkasan title="Total Kendaraan Hari Ini" />
            <CardRingkasan title="Efisiensi Rata-rata" />
          </div>

        </div>

        {/* BARIS BAWAH: LOG SENSOR */}
        <div className="mt-2">
          <TabelLogSensor />
        </div>

        {/* ── FOOTER ── */}
        <footer className="mt-auto pt-4 pb-2 border-t border-border-color/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 opacity-30">
            <div className="text-[12px] font-black tracking-[0.2em] uppercase text-text-main">
              Smartraf
            </div>
            <p className="text-[9px] text-text-secondary font-medium tracking-wider">
              © 2026 PBL KELOMPOK 6. POLITEKNIK NEGERI MALANG.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
