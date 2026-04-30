import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

/**
 * Interface untuk Detail Jalur dari Firestore
 */
interface JalurDetail {
    status_lampu?: string;
    status_kepadatan?: string;
    realtime_antrean?: number;
}

/**
 * Interface untuk Data Persimpangan
 */
interface DataSimpang {
    jalur?: {
        selatan?: JalurDetail;
        timur?: JalurDetail;
        barat?: JalurDetail;
    };
}

/**
 * Komponen LiveSchema
 * Menampilkan visualisasi real-time dari persimpangan lalu lintas berdasarkan data Firestore.
 */
const LiveSchema: React.FC = () => {
    // --- States (Status) ---
    const [dataSimpang, setDataSimpang] = useState<DataSimpang | null>(null);
    const [statusKoneksi, setStatusKoneksi] = useState('Menghubungkan...');

    // --- Side Effects (Efek Samping) ---
    /**
     * Berlangganan ke update real-time dari dokumen Firestore
     */
    useEffect(() => {
        const docRef = doc(db, 'persimpangan', 'simpang-utama');

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setDataSimpang(docSnap.data() as DataSimpang);
                setStatusKoneksi('Sinkronisasi Aktif');
            } else {
                setStatusKoneksi('Menunggu Data...');
            }
        }, (error) => {
            console.error("Firebase Error:", error);
            setStatusKoneksi('Gagal Sinkron');
        });

        return () => unsubscribe();
    }, []);

    // --- Helpers (Pembantu) ---
    /**
     * Mengembalikan class tailwind untuk visualisasi lampu lalu lintas
     * @param status - Status lampu saat ini (HIJAU, KUNING, MERAH)
     */
    const getLampuClass = (status: string | undefined): string => {
        switch (status) {
            case 'HIJAU':
                return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]';
            case 'KUNING':
                return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]';
            case 'MERAH':
                return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]';
            default:
                return 'bg-slate-400';
        }
    };

    return (
        <div className="bg-bg-card rounded-xl shadow-sm flex flex-col h-full overflow-hidden border border-border-color transition-all duration-200 hover:-translate-y-0.5">
            
            {/* Header Komponen */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-white/10 relative z-30 bg-[#1e1f20]">
                <h3 className="text-[15px] font-semibold text-white">Skema Persimpangan Langsung</h3>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusKoneksi === 'Sinkronisasi Aktif' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">{statusKoneksi}</span>
                </div>
            </div>

            {/* Area Skema Interaktif */}
            <div className="flex-1 relative min-h-[380px] overflow-hidden bg-[#131314]">

                {/* Jalan Horizontal Utama (Barat - Timur) */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-28 bg-[#1a1a1b] shadow-lg">
                    <div className="absolute h-1 w-full top-1/2 -translate-y-1/2 border-t-4 border-dashed border-white/10 opacity-70"></div>
                </div>

                {/* Jalan Vertikal (Persimpangan T Selatan) */}
                <div className="absolute top-1/2 bottom-0 left-1/2 -translate-x-1/2 w-28 bg-[#1a1a1b] shadow-lg">
                    <div className="absolute w-1 h-full left-1/2 -translate-x-1/2 border-l-4 border-dashed border-white/10 opacity-70"></div>
                </div>

                {/* Kotak Tengah Persimpangan */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#232324] z-10 flex items-center justify-center">
                    <div className="w-20 h-20 border-b-0 border-2 border-yellow-500/30"></div>
                </div>

                {/* INDIKATOR SENSOR SELATAN */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full border-2 border-white/20 relative flex justify-center items-center ${getLampuClass(dataSimpang?.jalur?.selatan?.status_lampu)}`}>
                        {dataSimpang?.jalur?.selatan?.status_kepadatan === 'Padat' && (
                            <div className="absolute w-10 h-10 rounded-full border-2 border-red-500 opacity-40 animate-ping"></div>
                        )}
                    </div>
                    <span className="text-[11px] font-extrabold text-[#e3e3e3] mt-2 bg-[#1e1f20]/90 px-2 py-0.5 rounded shadow-sm border border-white/10">
                        SELATAN {dataSimpang?.jalur?.selatan?.realtime_antrean ? `(${dataSimpang.jalur.selatan.realtime_antrean}cm)` : ''}
                    </span>
                </div>

                {/* INDIKATOR SENSOR TIMUR */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex items-center">
                    <span className="text-[11px] font-extrabold text-[#e3e3e3] mr-3 bg-[#1e1f20]/90 px-2 py-0.5 rounded shadow-sm border border-white/10">
                        TIMUR {dataSimpang?.jalur?.timur?.realtime_antrean ? `(${dataSimpang.jalur.timur.realtime_antrean}cm)` : ''}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 border-white/20 relative flex justify-center items-center ${getLampuClass(dataSimpang?.jalur?.timur?.status_lampu)}`}>
                        {dataSimpang?.jalur?.timur?.status_kepadatan === 'Padat' && (
                            <div className="absolute w-10 h-10 rounded-full border-2 border-red-500 opacity-40 animate-ping"></div>
                        )}
                    </div>
                </div>

                {/* INDIKATOR SENSOR BARAT */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 border-white/20 relative flex justify-center items-center ${getLampuClass(dataSimpang?.jalur?.barat?.status_lampu)}`}>
                        {dataSimpang?.jalur?.barat?.status_kepadatan === 'Padat' && (
                            <div className="absolute w-10 h-10 rounded-full border-2 border-red-500 opacity-40 animate-ping"></div>
                        )}
                    </div>
                    <span className="text-[11px] font-extrabold text-[#e3e3e3] ml-3 bg-[#1e1f20]/90 px-2 py-0.5 rounded shadow-sm border border-white/10">
                        BARAT {dataSimpang?.jalur?.barat?.realtime_antrean ? `(${dataSimpang.jalur.barat.realtime_antrean}cm)` : ''}
                    </span>
                </div>

            </div>
        </div>
    );
}

export default LiveSchema;