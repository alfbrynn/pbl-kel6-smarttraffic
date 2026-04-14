import Head from 'next/head';
import MainLayout from '@/components/layouts/MainLayout';
import PredictionCard from '@/components/analitik/PredictionCard';
import PolaChartCard from '@/components/analitik/PolaChartCard';
import MeanChartCard from '@/components/analitik/MeanChartCard';
import RightStatsCard from '@/components/analitik/RightStatCard';

export default function Analitik() {
  return (
    <>
      <Head>
        <title>SMARTRAF - Analitik</title>
        <meta name="description" content="Analisis Data Lalu Lintas" />
      </Head>

      <MainLayout>
        <div className="flex flex-col gap-6">

          {/* AI PREDICTION CARD */}
          <PredictionCard />

          {/* MAIN CHART CARD */}
          <PolaChartCard />

          {/* BOTTOM ROW */}
          <div className="grid grid-cols-[2.2fr_1fr] gap-6">
            {/* MINI CHART */}
            <MeanChartCard />

            {/* RIGHT STATS */}
            <RightStatsCard />
          </div>

          <div className="text-center pt-4 pb-0 text-[12px] text-[#94a3b8]">
            SMARTRAF 2026 — PBL KELOMPOK 6.
          </div>
        </div>
      </MainLayout>
    </>
  );
}
