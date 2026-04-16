import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export default function StatsRow() {
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

    const hitungRataRataAntrean = () => {
        if (!dataSimpang || !dataSimpang.jalur) return 0;

        const jalurKeys = Object.keys(dataSimpang.jalur);
        if (jalurKeys.length === 0) return 0;

        let totalJarak = 0;
        let count = 0;

        jalurKeys.forEach(key => {
            const jarak = dataSimpang.jalur[key]?.realtime_antrean;
            if (typeof jarak === 'number') {
                totalJarak += jarak;
                count++;
            }
        });

        return count > 0 ? (totalJarak / count).toFixed(1) : 0;
    };

    const getSensorAktif = () => {
        if (!dataSimpang || !dataSimpang.jalur) return 0;
        return Object.keys(dataSimpang.jalur).length;
    };

    const getStatusSistem = () => {
        if (!dataSimpang) return 'Menunggu';
        const rataRata = Number(hitungRataRataAntrean());
        if (rataRata > 100) return 'Kritis';
        if (rataRata > 50) return 'Siaga';
        return 'Optimal';
    };

    const rataRataAntrean = hitungRataRataAntrean();
    const sensorAktif = getSensorAktif();
    const statusSistem = getStatusSistem();

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="bg-bg-card rounded-custom p-[20px_24px] flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-[#798393] uppercase mb-2">STATUS KEPADATAN</span>
                    <span className={`text-[24px] font-bold ${statusSistem === 'Optimal' ? 'text-[#059669]' : statusSistem === 'Kritis' ? 'text-[#ef4444]' : 'text-[#d97706]'}`}>
                        {statusSistem}
                    </span>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusSistem === 'Optimal' ? 'bg-[#e6f7ef] text-[#059669]' : statusSistem === 'Kritis' ? 'bg-[#fee2e2] text-[#ef4444]' : 'bg-[#fef3c7] text-[#d97706]'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
            </div>

            <div className="bg-bg-card rounded-custom p-[20px_24px] flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-[#798393] uppercase mb-2">RATA-RATA ANTREAN</span>
                    <span className="text-[24px] font-bold text-text-main">{rataRataAntrean}<small className="text-[12px] text-text-secondary font-medium ml-1">CM</small></span>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e0f2fe] text-[#2563eb]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3v18h18"></path>
                        <path d="M18 17V9"></path>
                        <path d="M13 17V5"></path>
                        <path d="M8 17v-3"></path>
                    </svg>
                </div>
            </div>

            <div className="bg-bg-card rounded-custom p-[20px_24px] flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-[#798393] uppercase mb-2">SENSOR AKTIF</span>
                    <span className="text-[24px] font-bold text-text-main">{sensorAktif} / 4</span>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#fef3c7] text-[#d97706]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                        <path d="M12 12v9"></path>
                        <path d="m8 17 4 4 4-4"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}