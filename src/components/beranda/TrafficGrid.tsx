import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export default function TrafficGrid() {
    const [dataSimpang, setDataSimpang] = useState<any>(null);

    useEffect(() => {
        const docRef = doc(db, 'persimpangan', 'simpang-polinema');
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setDataSimpang(docSnap.data());
            }
        });
        return () => unsubscribe();
    }, []);

    const jalurList = [
        { arah: 'utara', nama: 'Jalur Utara', sensorId: 'SN-UTARA-01' },
        { arah: 'selatan', nama: 'Jalur Selatan', sensorId: 'SN-SELATAN-02' },
        { arah: 'timur', nama: 'Jalur Timur', sensorId: 'SN-TIMUR-03' },
        { arah: 'barat', nama: 'Jalur Barat', sensorId: 'SN-BARAT-04' }
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Padat': return 'bg-[#fee2e2] text-[#991b1b]';
            case 'Cukup Padat': return 'bg-[#fef3c7] text-[#92400e]';
            default: return 'bg-[#dcfce7] text-[#166534]';
        }
    };

    const getBarColor = (status: string) => {
        switch (status) {
            case 'Padat': return 'bg-[#ef4444]';
            case 'Cukup Padat': return 'bg-[#f59e0b]';
            default: return 'bg-[#22c55e]';
        }
    };

    return (
        <div className="grid grid-cols-2 gap-6">
            {jalurList.map((j) => {
                const dataJalur = dataSimpang?.jalur?.[j.arah] || {};
                const jarak = dataJalur.realtime_antrean || 0;
                const status = dataJalur.status_kepadatan || 'Menunggu';
                const lampu = dataJalur.status_lampu || 'MATI';

                const barPercentage = Math.min((jarak / 150) * 100, 100);

                return (
                    <div key={j.arah} className="bg-bg-card rounded-custom p-6 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-[16px] font-semibold text-text-main m-0">{j.nama}</h3>
                                <p className="text-[12px] text-text-secondary mt-1">ID Sensor: {j.sensorId}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-[20px] text-[12px] font-semibold ${getStatusStyle(status)}`}>
                                {status}
                            </div>
                        </div>
                        <div className="flex items-start gap-8">
                            <div className="bg-[#1e293b] w-12 rounded-[24px] py-[10px] flex flex-col items-center gap-2">
                                <div className={`w-6 h-6 rounded-full ${lampu === 'MERAH' ? 'opacity-100 shadow-[0_0_10px_currentColor] bg-[#ef4444]' : 'opacity-20 bg-[#ef4444]'}`}></div>
                                <div className={`w-6 h-6 rounded-full ${lampu === 'KUNING' ? 'opacity-100 shadow-[0_0_10px_currentColor] bg-[#eab308]' : 'opacity-20 bg-[#eab308]'}`}></div>
                                <div className={`w-6 h-6 rounded-full ${lampu === 'HIJAU' ? 'opacity-100 shadow-[0_0_10px_currentColor] bg-[#22c55e]' : 'opacity-20 bg-[#22c55e]'}`}></div>
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-[0.5px]">JARAK ANTREAN</div>
                                <div className="text-[28px] font-bold text-text-main mt-1 mb-4">{jarak}<small className="text-[14px] text-[#94a3b8] font-medium ml-1">CM</small></div>
                                <div className="h-1.5 bg-bg-card-alt rounded-[3px] overflow-hidden">
                                    <div className={`h-full rounded-[3px] ${getBarColor(status)}`} style={{ width: `${barPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}