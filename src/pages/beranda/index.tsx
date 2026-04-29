import Head from 'next/head';
import StatsRow from '@/components/beranda/StatRow';
import TrafficGrid from '@/components/beranda/TrafficGrid';
import SensorCard from '@/components/beranda/SensorCard'; // Ini adalah Live Schema
import { useEffect, useState } from 'react';

export default function Home() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <Head>
                <title>SMARTRAF - Pusat Kontrol</title>
                <meta name="description" content="Dashboard Smart Traffic" />
            </Head>

            {/* Mengurangi gap agar lebih hemat ruang vertikal */}
            <div className="flex flex-col gap-4 h-full">

                {/* STATS ROW (Kompak) */}
                <StatsRow />

                {/* SECTION HEADER */}
                <div className="flex justify-between items-center mt-1">
                    <h2 className="text-[16px] font-semibold text-text-main">Monitoring Persimpangan</h2>
                    <div className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-[20px]">
                        <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full mr-1.5 animate-pulse"></span>
                        Live Update Aktif
                    </div>
                </div>

                {/* SPLIT LAYOUT: Kiri (Schema) & Kanan (Grid Vertikal) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start flex-1 pb-2">

                    {/* KIRI: Live Schema (Ambil 7 kolom agar sedikit lebih luas) */}
                    <div className="xl:col-span-7 w-full h-full min-h-[380px]">
                        <SensorCard />
                    </div>

                    {/* KANAN: Traffic Grid (Ambil 5 kolom, susun vertikal) */}
                    <div className="xl:col-span-5 w-full">
                        <TrafficGrid />
                    </div>

                </div>

            </div>
        </>
    );
}