import Head from 'next/head';
import { useEffect, useState } from 'react';
import StatsRow from '@/components/beranda/StatRow';
import TrafficGrid from '@/components/beranda/TrafficGrid';
import SensorCard from '@/components/beranda/SensorCard';

/**
 * Halaman Utama Dashboard
 * Pusat kontrol utama yang menampilkan statistik lalu lintas real-time,
 * skema persimpangan interaktif, dan metrik per jalur.
 */
const HomePage: React.FC = () => {
    // --- States (Status) ---
    const [isMounted, setIsMounted] = useState(false);

    // --- Side Effects (Efek Samping) ---
    /**
     * Memastikan hidrasi sisi klien sebelum rendering untuk menghindari ketidaksesuaian SSR
     */
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <Head>
                <title>SMARTRAF | Pusat Kontrol</title>
                <meta name="description" content="Sistem manajemen lalu lintas cerdas dashboard." />
            </Head>

            <div className="flex flex-col gap-5 h-full animate-fade-in">

                {/* Barisan Statistik KPI */}
                <StatsRow />

                {/* Bagian Monitoring Utama */}
                <div className="flex justify-between items-center mt-2 px-1">
                    <h2 className="text-[17px] font-bold text-text-main tracking-tight">
                        Pemantauan Waktu Nyata
                    </h2>

                    {/* Indikator Status Live */}
                    <div className="flex items-center text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        Koneksi Aktif
                    </div>
                </div>

                {/* Layout Grid Dashboard */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start flex-1 pb-6">

                    {/* Konten Utama: Skema Persimpangan Live */}
                    <section className="xl:col-span-7 w-full h-full min-h-[420px]">
                        <SensorCard />
                    </section>

                    {/* Konten Sekunder: Grid Metrik Jalur */}
                    <section className="xl:col-span-5 w-full">
                        <TrafficGrid />
                    </section>

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
};

export default HomePage;