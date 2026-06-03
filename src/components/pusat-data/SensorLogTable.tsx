// components/pusat-data/TabelLogSensor.tsx
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface LogData {
    id: string;
    waktu: any;
    timestamp_ms?: number;
    jalur_arah: string;
    jarak_cm: number;
    jumlah_kendaraan: number;
    status_kepadatan: string;
    status_lampu: string;
}

export default function TabelLogSensor() {
    const [logs, setLogs] = useState<LogData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mengambil 10 data log terbaru dari firestore
        const q = query(
            collection(db, 'kepadatan_jalan'),
            orderBy('waktu', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: LogData[] = [];
            snapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as LogData);
            });
            setLogs(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching logs:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <section className="bg-card p-8 rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300 border border-border/10">
            <h2 className="text-lg font-black mb-6 text-foreground">Log Data Sensor Real-time</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[700px]">
                    <thead>
                        <tr className="text-xs font-semibold text-slate-500 bg-transparent">
                            <th className="pb-3 px-5">Waktu</th>
                            <th className="pb-3 px-5">Jalur</th>
                            <th className="pb-3 px-5">Jarak (cm)</th>
                            <th className="pb-3 px-5">Jml. Kendaraan</th>
                            <th className="pb-3 px-5">Status Lampu</th>
                            <th className="pb-3 px-5">Kepadatan</th>
                        </tr>
                    </thead>
                    <tbody>
                         {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-muted font-bold">Memuat log sensor...</td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-muted font-bold">Belum ada data log</td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="text-sm text-foreground group hover:-translate-y transition-all duration-200">
                                    <td className="py-4 px-5 whitespace-nowrap font-medium rounded-l-2xl bg-card border-l border-y border-border/5 group-hover:bg-background transition-colors">
                                        {log.timestamp_ms
                                            ? new Date(log.timestamp_ms).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                            : (log.waktu && typeof log.waktu.toDate === 'function'
                                                ? log.waktu.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                                : (log.waktu && log.waktu.seconds
                                                    ? new Date(log.waktu.seconds * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                                    : (typeof log.waktu === 'string' && log.waktu.includes('at') ? log.waktu.split('at')[1].trim() : String(log.waktu || ''))))}
                                    </td>
                                    <td className="py-4 px-5 capitalize font-semibold bg-card border-y border-border/5 group-hover:bg-background transition-colors">
                                        {log.jalur_arah}
                                    </td>
                                    <td className="py-4 px-5 font-mono font-bold text-muted bg-card border-y border-border/5 group-hover:bg-background transition-colors">
                                        {log.jarak_cm}
                                    </td>
                                    <td className="py-4 px-5 font-mono font-bold text-muted bg-card border-y border-border/5 group-hover:bg-background transition-colors">
                                        {log.jumlah_kendaraan}
                                    </td>
                                    <td className="py-4 px-5 bg-card border-y border-border/5 group-hover:bg-background transition-colors">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${log.status_lampu === 'HIJAU' ? 'bg-emerald-500/20 text-emerald-500' :
                                            log.status_lampu === 'KUNING' ? 'bg-amber-500/20 text-amber-500' :
                                                'bg-red-500/20 text-red-500'
                                            }`}>
                                            {log.status_lampu ? log.status_lampu.toLowerCase() : ''}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 rounded-r-2xl bg-card border-r border-y border-border/5 group-hover:bg-background transition-colors">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${log.status_kepadatan === 'PADAT' || log.status_kepadatan === 'MACET' ? 'bg-red-500/20 text-red-500' :
                                            log.status_kepadatan === 'LANCAR' ? 'bg-emerald-500/20 text-emerald-500' :
                                                'bg-amber-500/20 text-amber-500'
                                            }`}>
                                            {log.status_kepadatan ? log.status_kepadatan.toLowerCase() : ''}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}