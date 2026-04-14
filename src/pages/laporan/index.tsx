import Head from 'next/head';
import MainLayout from '@/components/layouts/MainLayout';
import PageHeader from '@/components/laporan/PageHeader';
import StatsRow from '@/components/laporan/StatsRow';
import DataTable from '@/components/laporan/DataTable';
import BottomCards from '@/components/laporan/BottomCard';


export default function Laporan() {
  return (
    <>
      <Head>
        <title>SMARTRAF - Laporan</title>
        <meta name="description" content="Laporan Data Sensor Real-time" />
      </Head>

      <MainLayout>
        <div className="flex flex-col gap-6">

          {/* PAGE HEADER */}
          <PageHeader />

          {/* STATS ROW */}
          <StatsRow />

          {/* DATA TABLE */}
          <DataTable />

          {/* BOTTOM CARDS */}
          <BottomCards />

          <div className="text-center pt-4 pb-0 text-[12px] text-[#94a3b8]">
            SMARTRAF 2026 — PBL KELOMPOK 6.
          </div>

        </div>
      </MainLayout>
    </>
  );
}
