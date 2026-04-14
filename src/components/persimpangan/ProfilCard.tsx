import React from 'react';

export default function ProfileCard() {
    return (
        <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col relative">
            <div className="text-[11px] font-bold text-[#94a3b8] tracking-[0.5px] uppercase mb-2">IDENTITY PANEL</div>
            <h2 className="text-[20px] font-bold text-text-main m-0 mb-6">Profil Lokasi</h2>

            <div className="absolute top-6 right-6 text-[#cbd5e1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                    <div className="text-[12px] text-text-secondary font-medium">Nama Persimpangan</div>
                    <div className="text-[15px] font-semibold text-text-main flex items-center gap-1.5">Simpang Polinema</div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <div className="text-[12px] text-text-secondary font-medium">Koordinat GPS</div>
                    <div className="text-[15px] font-semibold text-text-main flex items-center gap-1.5">-7.9468, 112.6157</div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <div className="text-[12px] text-text-secondary font-medium">Jam Operasional</div>
                    <div className="text-[15px] font-semibold text-text-main flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-[#10b981] rounded-full"></span>
                        24 Jam
                    </div>
                </div>
            </div>
        </div>
    );
}