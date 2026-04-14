import React from 'react';

export default function MeanChartCard() {
    return (
        <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-[18px] font-bold text-text-main m-0">Rata-rata Waktu Tunggu Kendaraan</h2>
                    <p className="text-[13px] text-text-secondary mt-1">Tren efisiensi lampu lalu lintas dalam 24 jam terakhir</p>
                </div>
                <div className="flex bg-bg-card border border-border-color rounded-[6px] overflow-hidden">
                    <button className="px-4 py-1.5 text-[10px] font-bold text-text-main cursor-pointer border-none bg-transparent border-r border-border-color">HARI INI</button>
                    <button className="px-4 py-1.5 text-[10px] font-bold text-text-secondary cursor-pointer border-none bg-transparent">KEMARIN</button>
                </div>
            </div>
            <div className="flex-1 min-h-[180px] relative">
                <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <path d="M10 40 L500 40" stroke="#f1f5f9" strokeWidth="1" />
                    <path d="M10 90 L500 90" stroke="#f1f5f9" strokeWidth="1" />
                    <path d="M10 140 L500 140" stroke="#f1f5f9" strokeWidth="1" />

                    {/* Labels X */}
                    <text x="20" y="170" fontSize="9" fill="#94a3b8">00:00</text>
                    <text x="120" y="170" fontSize="9" fill="#94a3b8">06:00</text>
                    <text x="240" y="170" fontSize="9" fill="#94a3b8">12:00</text>
                    <text x="360" y="170" fontSize="9" fill="#94a3b8">18:00</text>
                    <text x="460" y="170" fontSize="9" fill="#94a3b8">23:59</text>

                    {/* Area Chart Path */}
                    <path d="M10 140 L50 130 L100 140 L160 100 L220 80 L300 110 L360 80 L420 55 L500 70 L500 180 L10 180 Z" fill="#f1f5f9" />
                    <path d="M10 140 L50 130 L100 140 L160 100 L220 80 L300 110 L360 80 L420 55 L500 70" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />

                    {/* Tooltip Simulation */}
                    <circle cx="420" cy="55" r="4" fill="#1e293b" />
                    <rect x="360" y="20" width="60" height="20" rx="4" fill="#1e293b" />
                    <text x="390" y="34" fontSize="9" fill="#ffffff" textAnchor="middle">16:45: 142s</text>
                </svg>
            </div>
        </div>
    )
}