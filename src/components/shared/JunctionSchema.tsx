import React from 'react';
import useSimpangUtama from '@/hooks/useSimpangUtama';

const LiveSchema: React.FC = () => {
    const { dataSimpang, statusKoneksi } = useSimpangUtama();


    // --- Helpers (Pembantu) ---
    /**
     * Mengembalikan class tailwind untuk visualisasi lampu lalu lintas
     * @param status - Status lampu saat ini (HIJAU, KUNING, MERAH)
     */
    const getLampuClass = (status: string | undefined): string => {
        switch (status) {
            case 'HIJAU':
                return 'bg-emerald-500';
            case 'KUNING':
                return 'bg-amber-500';
            case 'MERAH':
                return 'bg-red-500';
            default:
                return 'bg-slate-500';
        }
    };

    return (
        <div className="bg-card rounded-[24px] shadow-sm flex flex-col h-full overflow-hidden border border-border/10 p-6 gap-4">


            {/* Header Komponen */}
            <div className="flex justify-between items-center relative z-30 bg-transparent">
                <h3 className="text-[16px] font-black text-foreground">Skema Persimpangan</h3>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusKoneksi === 'Sinkronisasi Aktif' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <span className="text-xs font-semibold text-muted">{statusKoneksi}</span>
                </div>
            </div>

            {/* Area Skema Interaktif */}
            <div className="flex-1 relative min-h-[380px] rounded-[18px] overflow-hidden bg-blue-600/10 border border-border/5">

                {/* Jalan Horizontal Utama (Barat - Timur) */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-24 bg-slate-800 dark:bg-slate-800 rounded-2xl shadow-inner">
                </div>

                {/* Jalan Vertikal (Persimpangan T Selatan) */}
                <div className="absolute top-1/2 bottom-6 left-1/2 -translate-x-1/2 w-24 bg-slate-800 dark:bg-slate-800 rounded-2xl shadow-inner">
                </div>

                {/* Kotak Tengah Persimpangan */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-slate-800 z-10 rounded-xl flex items-center justify-center">
                </div>

                {/* INDIKATOR SENSOR SELATAN */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full border-2 border-white/20 relative flex justify-center items-center ${getLampuClass(dataSimpang?.jalur?.selatan?.status_lampu)}`}>
                        {(dataSimpang?.jalur?.selatan?.status_kepadatan === 'PADAT' || dataSimpang?.jalur?.selatan?.status_kepadatan === 'MACET') && (
                            <div className="absolute w-10 h-10 rounded-full border-2 border-red-500 opacity-40 animate-ping"></div>
                        )}
                    </div>
                    <span className="text-[10px] font-extrabold text-[#e3e3e3] mt-2 bg-slate-900/90 px-2 py-1 rounded-md shadow-md border border-white/10 tracking-wider">
                        SELATAN {dataSimpang?.jalur?.selatan?.jarak_cm ? `(${dataSimpang.jalur.selatan.jarak_cm}cm)` : ''}
                    </span>
                </div>

                {/* INDIKATOR SENSOR TIMUR */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 z-20 flex items-center">
                    <span className="text-[10px] font-extrabold text-[#e3e3e3] mr-3 bg-slate-900/90 px-2 py-1 rounded-md shadow-md border border-white/10 tracking-wider">
                        TIMUR {dataSimpang?.jalur?.timur?.jarak_cm ? `(${dataSimpang.jalur.timur.jarak_cm}cm)` : ''}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 border-white/20 relative flex justify-center items-center ${getLampuClass(dataSimpang?.jalur?.timur?.status_lampu)}`}>
                        {(dataSimpang?.jalur?.timur?.status_kepadatan === 'PADAT' || dataSimpang?.jalur?.timur?.status_kepadatan === 'MACET') && (
                            <div className="absolute w-10 h-10 rounded-full border-2 border-red-500 opacity-40 animate-ping"></div>
                        )}
                    </div>
                </div>

                {/* INDIKATOR SENSOR BARAT */}
                <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20 flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 border-white/20 relative flex justify-center items-center ${getLampuClass(dataSimpang?.jalur?.barat?.status_lampu)}`}>
                        {(dataSimpang?.jalur?.barat?.status_kepadatan === 'PADAT' || dataSimpang?.jalur?.barat?.status_kepadatan === 'MACET') && (
                            <div className="absolute w-10 h-10 rounded-full border-2 border-red-500 opacity-40 animate-ping"></div>
                        )}
                    </div>
                    <span className="text-[10px] font-extrabold text-[#e3e3e3] ml-3 bg-slate-900/90 px-2 py-1 rounded-md shadow-md border border-white/10 tracking-wider">
                        BARAT {dataSimpang?.jalur?.barat?.jarak_cm ? `(${dataSimpang.jalur.barat.jarak_cm}cm)` : ''}
                    </span>
                </div>

            </div>
        </div>
    );
}

export default LiveSchema;