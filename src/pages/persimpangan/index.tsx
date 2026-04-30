import Head from 'next/head';
import SensorCard from '@/components/beranda/SensorCard';
import TrafficGrid from '@/components/beranda/TrafficGrid';
import ParameterCard from '@/components/persimpangan/ParameterCard';
import EmergencyCard from '@/components/persimpangan/EmergencyCard';

export default function Persimpangan() {
  return (
    <>
      <Head>
        <title>Pusat Kendali | SMARTRAF</title>
        <meta name="description" content="Manajemen Persimpangan T-Junction" />
      </Head>

      <div className="flex flex-col gap-5 animate-fade-in">

        {/* HEADER DASHBOARD */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-color pb-4">
          <div>
            <h1 className="text-2xl font-black text-text-main uppercase tracking-wide">Pusat Kendali</h1>
            <p className="text-sm text-text-secondary mt-1">Sistem Pemantauan & Kendali Simpang T Aktif</p>
          </div>
          <div className="flex items-center gap-2 bg-bg-card border border-border-color px-3 py-1.5 rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse shadow-[0_0_5px_#10b981]"></span>
            <span className="text-[11px] font-bold text-text-main uppercase tracking-widest">Sistem Berjalan</span>
          </div>
        </div>

        {/* BARIS ATAS: VISUALISASI (Tanpa Pembungkus Box) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">

          {/* KOLOM KIRI (Data Sensor) - Span 7 */}
          <div className="xl:col-span-7 flex flex-col h-full">
            <SensorCard />
          </div>

          {/* KOLOM KANAN (Status Lampu) - Span 5 */}
          <div className="xl:col-span-5 flex flex-col h-full">
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