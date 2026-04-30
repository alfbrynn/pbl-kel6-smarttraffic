// pages/pusat-data/index.tsx
import React from 'react';
import HeaderPusatData from '@/components/pusat-data/HeaderPusatData';
import CardRingkasan from '@/components/pusat-data/CardRingkasan';
import TabelLogSensor from '@/components/pusat-data/TabelLogSensor';

/**
 * Halaman Pusat Data Traffic
 * Digunakan oleh tim Big Data untuk menganalisis data traffic.
 */
export default function PusatDataPage() {
  return (
    <div className="min-h-screen bg-bg-main p-8 text-text-main">
      <HeaderPusatData />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-bg-card p-6 rounded-xl shadow-sm border border-border-color">
          <h2 className="text-lg font-semibold mb-4 text-text-main">Pola Kepadatan Mingguan</h2>
          <div className="w-full h-72">
            {/* DensityChart akan dirender di sini */}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <CardRingkasan
            title="Total Kendaraan"
            value="12,450"
            trendText="+5.2% dari minggu lalu"
            trendType="positive"
          />
          <CardRingkasan
            title="Efisiensi Rata-rata"
            value="87%"
            trendText="Kondisi Optimal"
            trendType="neutral"
          />
        </div>
      </section>

      <TabelLogSensor />
    </div>
  );
}
