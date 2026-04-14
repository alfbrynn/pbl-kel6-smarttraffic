import Head from 'next/head';
import Image from 'next/image';
import MainLayout from '@/components/layouts/MainLayout';
import StatsRow from '@/components/dashboard/StatRow';
import TrafficGrid from '@/components/dashboard/TrafficGrid';
import MapCard from '@/components/dashboard/MapCard';
import ActivityLog from '@/components/dashboard/ActivityLog';

export default function Home() {
    return (
        <>
            <Head>
                <title>SMARTRAF - Pusat Kontrol</title>
                <meta name="description" content="Dashboard Smart Traffic" />
            </Head>

            <MainLayout>
                <div className="flex flex-col gap-6">

                    {/* STATS ROW */}
                    <StatsRow />

                    {/* SECTION HEADER */}
                    <div className="flex justify-between items-center mt-2">
                        <h2 className="text-[18px] font-semibold text-text-main">Monitoring Persimpangan Utama</h2>
                        <div className="flex items-center text-[12px] font-medium text-text-main bg-bg-card px-[10px] py-1 rounded-[20px]">
                            <span className="w-[6px] h-[6px] bg-[#10b981] rounded-full mr-1.5"></span>
                            Live Update
                        </div>
                    </div>

                    {/* TRAFFIC GRID */}
                    <TrafficGrid />

                    {/* BOTTOM ROW */}
                    <div className="grid grid-cols-[2fr_1fr] gap-6">
                        {/* MAP CARD */}
                        <MapCard />

                        {/* ACTIVITY SYSTEM */}
                        <ActivityLog />

                    </div>

                    <div className="text-center pt-4 pb-0 text-[12px] text-[#94a3b8]">
                        SMARTRAF 2026 — PBL KELOMPOK 6.
                    </div>

                </div>
            </MainLayout>
        </>
    );
}
