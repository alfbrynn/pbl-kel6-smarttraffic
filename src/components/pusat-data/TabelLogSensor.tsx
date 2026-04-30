// components/pusat-data/TabelLogSensor.tsx
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface LogData {
    id: string;
    waktu: string;
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
            orderBy('timestamp_ms', 'desc'),
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
        <section className="bg-bg-card p-6 rounded-xl shadow-sm border border-border-color">
            <h2 className="text-lg font-semibold mb-4 text-text-main">Log Data Sensor Real-time</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="border-b border-border-color text-sm text-text-secondary">
                            <th className="py-3 px-4 font-semibold">Waktu</th>
                            <th className="py-3 px-4 font-semibold">Jalur</th>
                            <th className="py-3 px-4 font-semibold">Jarak (cm)</th>
                            <th className="py-3 px-4 font-semibold">Jml. Kendaraan</th>
                            <th className="py-3 px-4 font-semibold">Status Lampu</th>
                            <th className="py-3 px-4 font-semibold">Kepadatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-text-secondary">Memuat log sensor...</td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-text-secondary">Belum ada data log</td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="border-b border-border-color/30 hover:bg-white/5 transition-colors text-sm text-text-main">
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        {log.timestamp_ms 
                                            ? new Date(log.timestamp_ms).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
                                            : (typeof log.waktu === 'string' && log.waktu.includes('at') ? log.waktu.split('at')[1].trim() : log.waktu)}
                                    </td>
                                    <td className="py-3 px-4 capitalize">{log.jalur_arah}</td>
                                    <td className="py-3 px-4 font-mono">{log.jarak_cm}</td>
                                    <td className="py-3 px-4 font-mono">{log.jumlah_kendaraan}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-extrabold tracking-wider ${
                                            log.status_lampu === 'HIJAU' ? 'bg-emerald-500/20 text-emerald-500' :
                                            log.status_lampu === 'KUNING' ? 'bg-amber-500/20 text-amber-500' :
                                            'bg-red-500/20 text-red-500'
                                        }`}>
                                            {log.status_lampu}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-extrabold tracking-wider ${
                                            log.status_kepadatan === 'Padat' || log.status_kepadatan === 'Sangat Padat' ? 'bg-red-500/20 text-red-500' :
                                            log.status_kepadatan === 'Cukup Padat' ? 'bg-amber-500/20 text-amber-500' :
                                            'bg-emerald-500/20 text-emerald-500'
                                        }`}>
                                            {log.status_kepadatan}
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