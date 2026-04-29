import Head from 'next/head';
import ProfileCard from '@/components/persimpangan/ProfilCard';
import ParameterCard from '@/components/persimpangan/ParameterCard';
import Emergency from '@/components/persimpangan/EmergencyCard';
import StatsRow from '@/components/persimpangan/StatsRow';

export default function Persimpangan() {
  return (
    <>
      <Head>
        <title>SMARTRAF - Persimpangan</title>
        <meta name="description" content="Manajemen Persimpangan" />
      </Head>

      <div className="flex flex-col gap-6">

        {/* STATS ROW */}
        <StatsRow />

        {/* PROFILE LOKASI */}
        <ProfileCard />

        {/* PARAMETER */}
        <ParameterCard />

        {/* EMERGENCY */}
        <Emergency />

        <div className="text-center pt-4 pb-0 text-[12px] text-[#94a3b8]">
          SMARTRAF 2026 — PBL KELOMPOK 6.
        </div>

      </div>
    </>
  );
}
