import Head from 'next/head';
import { useEffect, useState } from 'react';
import StatsRow from '@/components/beranda/KPIStatRow';
import TrafficGrid from '@/components/shared/LaneMetricsList';
import SensorCard from '@/components/shared/JunctionSchema';
import TabelLogSensor from '@/components/pusat-data/SensorLogTable';
import PageHeader from '@/components/shared/PageHeader';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

/**
 * Halaman Utama Dashboard
 * Pusat kontrol utama yang menampilkan statistik lalu lintas real-time,
 * skema persimpangan interaktif, dan metrik per jalur.
 */
const HomePage: React.FC = () => {
    // --- States (Status) ---
    const [isMounted, setIsMounted] = useState(false);
    const [secondsAgo, setSecondsAgo] = useState(0);

    // --- Side Effects (Efek Samping) ---
    /**
     * Memastikan hidrasi sisi klien sebelum rendering untuk menghindari ketidaksesuaian SSR
     */
    useEffect(() => {
        setIsMounted(true);

        const docRef = doc(db, 'persimpangan', 'simpang-utama');
        let lastUpdateTime = Date.now();
        setSecondsAgo(0);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                lastUpdateTime = Date.now();
                setSecondsAgo(0);
            }
        }, (error) => {
            console.error("Firebase Header Error:", error);
        });

        const timer = setInterval(() => {
            const diffSeconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
            setSecondsAgo(diffSeconds);
        }, 1000);

        return () => {
            unsubscribe();
            clearInterval(timer);
        };
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <Head>
                <title>Smartraf | Pusat Kontrol</title>
                <meta name="description" content="Sistem manajemen lalu lintas cerdas dashboard." />
            </Head>

            <div className="flex flex-col gap-6 h-full animate-fade-in">

                {/* Page Greeting & Title */}
                <PageHeader
                    title="Pemantauan Lalu Lintas"
                    subtitle={
                        <>
                            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-0.5"></span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">Live</span>
                            <span className="text-slate-300 dark:text-slate-700 font-normal">•</span>
                            <span className="text-slate-600 dark:text-slate-400">3 jalur aktif</span>
                            <span className="text-slate-300 dark:text-slate-700 font-normal">•</span>
                            <span className="font-medium text-slate-500">Update {secondsAgo} dtk lalu</span>
                        </>
                    }
                />

                {/* Barisan Statistik KPI */}
                <StatsRow />
 
                {/* Layout Grid Dashboard (Bento Grid) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch pb-2">
 
                    {/* Konten Utama: Skema Persimpangan Live (Hero Bento Box - 8 Span) */}
                    <section className="xl:col-span-8 w-full h-full min-h-[460px] flex flex-col">
                        <SensorCard />
                    </section>

                    {/* Konten Sekunder: Grid Metrik Jalur (Sidekick Bento Box - 4 Span) */}
                    <section className="xl:col-span-4 w-full flex flex-col">
                        <TrafficGrid />
                    </section>
 
                </div>


                {/* Log Sensor Real-time (Bottom Section) */}
                <div className="w-full pb-6">
                    <TabelLogSensor limitCount={5} showMoreLink={true} />
                </div>




            </div>
        </>
    );
};

export default HomePage;