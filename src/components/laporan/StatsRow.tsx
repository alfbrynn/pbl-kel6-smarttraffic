import React from 'react';

export default function StatsRow() {
    return (
        <div className="grid grid-cols-4 gap-6">
            {/* STAT 1: TOTAL DETEKSI */}
            <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col justify-center">
                <div className="text-[11px] font-bold text-text-secondary tracking-[0.5px] uppercase mb-3">TOTAL DETEKSI</div>
                <div className="flex items-baseline gap-2">
                    <div className="text-[28px] font-bold text-text-main">1,284</div>
                    <div className="text-[12px] font-bold text-accent-green">+12%</div>
                </div>
            </div>

            {/* STAT 2: RATA-RATA JARAK */}
            <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col justify-center">
                <div className="text-[11px] font-bold text-text-secondary tracking-[0.5px] uppercase mb-3">RATA-RATA JARAK</div>
                <div className="flex items-baseline gap-2">
                    <div className="text-[28px] font-bold text-text-main">82</div>
                    <div className="text-[16px] text-text-secondary font-semibold">cm</div>
                </div>
            </div>

            {/* STAT 3: STATUS NORMAL */}
            <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col justify-center">
                <div className="text-[11px] font-bold text-text-secondary tracking-[0.5px] uppercase mb-3">STATUS NORMAL</div>
                <div className="flex items-baseline gap-2">
                    <div className="text-[28px] font-bold text-text-main">94.2</div>
                    <div className="text-[16px] text-text-secondary font-semibold">%</div>
                </div>
            </div>

            {/* STAT 4: ALERT SISTEM */}
            <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col justify-center">
                <div className="text-[11px] font-bold text-text-secondary tracking-[0.5px] uppercase mb-3">ALERT SISTEM</div>
                <div className="flex items-baseline gap-2">
                    <div className="text-accent-red text-[28px] font-bold">03</div>
                    <div className="text-accent-red">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
