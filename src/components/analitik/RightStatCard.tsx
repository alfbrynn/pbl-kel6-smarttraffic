import React from 'react';

export default function RightStatCard() {
    return (
        <div className="flex flex-col gap-6">
            <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex-1 flex flex-col justify-center">
                <div className="text-[11px] font-bold text-text-secondary tracking-[0.5px] uppercase mb-3">EFISIENSI RATA-RATA</div>
                <div className="flex items-baseline gap-2 mb-2">
                    <div className="text-[32px] font-bold text-text-main">84.2%</div>
                    <div className="flex items-center text-[13px] font-bold text-accent-green">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                        12%
                    </div>
                </div>
                <div className="text-[12px] text-text-secondary leading-normal">Peningkatan arus lalu lintas dibandingkan pekan lalu.</div>
            </div>

            <div className="bg-[#0f172a] text-[#f8fafc] rounded-custom p-6 shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex-1 flex flex-col justify-center">
                <div className="text-[11px] font-semibold tracking-[0.5px] text-[#94a3b8] mb-2">TOTAL KENDARAAN TERDETEKSI</div>
                <div className="text-[32px] font-bold text-white mb-4">42, 891</div>
                <div className="w-full h-1.5 bg-[#334155] rounded-[4px] overflow-hidden mb-2">
                    <div className="h-full w-[68%] bg-[#06b6d4] rounded-[4px]"></div>
                </div>
                <div className="text-[11px] text-[#94a3b8]">68% dari kapasitas maksimal.</div>
            </div>
        </div>
    )
}