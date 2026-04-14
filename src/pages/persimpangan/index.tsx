import Head from 'next/head';
import MainLayout from '@/components/layouts/MainLayout';
import ProfileCard from '@/components/persimpangan/PorfilCard';
import SensorCard from '@/components/persimpangan/SensorCard';
import ParameterCard from '@/components/persimpangan/ParameterCard';
import Emergency from '@/components/persimpangan/EmergencyCard';

export default function Persimpangan() {
  return (
    <>
      <Head>
        <title>SMARTRAF - Persimpangan</title>
        <meta name="description" content="Manajemen Persimpangan" />
      </Head>

      <MainLayout>
        <div className="flex flex-col gap-6">

          {/* TOP ROW */}
          <div className="grid grid-cols-[2fr_1fr] gap-6">
            {/* PROFILE LOKASI */}
            <ProfileCard />

            {/* SKEMA TATA LETAK SENSOR */}
            <SensorCard />

          </div>

          {/* MIDDLE ROW */}
          <ParameterCard />

          {/* BOTTOM ROW */}
          <Emergency />

          <div className="text-center pt-4 pb-0 text-[12px] text-[#94a3b8]">
            SMARTRAF 2026 — PBL KELOMPOK 6.
          </div>

        </div>
      </MainLayout>
    </>
  );
}
