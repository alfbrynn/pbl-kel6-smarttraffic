import Head from 'next/head';
import SensorCard from '@/components/beranda/SensorCard';
import TrafficGrid from '@/components/beranda/TrafficGrid';
import ParameterCard from '@/components/persimpangan/ParameterCard';
import EmergencyCard from '@/components/persimpangan/EmergencyCard';

export default function Persimpangan() {
  return (
    <>
      <Head>
        <title>Command Center | SMARTRAF</title>
        <meta name="description" content="Manajemen Persimpangan T-Junction" />
      </Head>

      <div className="flex flex-col gap-5 p-6">

        {/* HEADER DASHBOARD */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-color pb-4">
          <div>
            <h1 className="text-2xl font-black text-text-main uppercase tracking-wide">Command Center</h1>
            <p className="text-sm text-text-secondary mt-1">Sistem Pemantauan & Kendali T-Junction Aktif</p>
          </div>
          <div className="flex items-center gap-2 bg-bg-card border border-border-color px-3 py-1.5 rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse shadow-[0_0_5px_#10b981]"></span>
            <span className="text-[11px] font-bold text-text-main uppercase tracking-widest">Sistem Berjalan</span>
          </div>
        </div>

        {/* BARIS ATAS: VISUALISASI */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">

          {/* KOLOM KIRI (Data Sensor) - Span 7 */}
          <div className="xl:col-span-7 flex flex-col h-full">
            <div className="bg-bg-card rounded-xl shadow-sm border border-border-color flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-border-color bg-bg-card-alt flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-text-main uppercase tracking-wider">Data Kepadatan Sensor</h3>
              </div>
              <div className="p-4 flex-1">
                <SensorCard />
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (Status Lampu) - Span 5 */}
          <div className="xl:col-span-5 flex flex-col h-full">
            <div className="bg-bg-card rounded-xl shadow-sm border border-border-color flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-border-color bg-bg-card-alt flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-text-main uppercase tracking-wider">Visualisasi Simpang</h3>
              </div>
              <div className="p-4 flex-1">
                <TrafficGrid />
              </div>
            </div>
          </div>

        </div>

        {/* BARIS BAWAH: KONTROL */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">

          {/* KOLOM KIRI (Pengaturan Parameter) - Span 8 (Lebih Panjang) */}
          <div className="xl:col-span-8 flex flex-col h-full">
            <ParameterCard />
          </div>

          {/* KOLOM KANAN (Kendali Darurat) - Span 4 */}
          <div className="xl:col-span-4 flex flex-col h-full">
            <EmergencyCard />
          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center pt-6 text-[11px] font-bold tracking-widest uppercase text-text-secondary/40">
          SMARTRAF 2026 — PBL KELOMPOK 6
        </div>

      </div>
    </>
  );
}