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
                <svg className="w-full h-full" viewBox="0 0 520 180" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <path d="M40 20 L520 20" stroke="#f1f5f9" strokeWidth="1" />
                    <path d="M40 60 L520 60" stroke="#f1f5f9" strokeWidth="1" />
                    <path d="M40 100 L520 100" stroke="#f1f5f9" strokeWidth="1" />
                    <path d="M40 140 L520 140" stroke="#f1f5f9" strokeWidth="1" />

                    {/* Label sumbu Y */}
                    <text x="0" y="24" fontSize="9" fill="#94a3b8">180s</text>
                    <text x="0" y="64" fontSize="9" fill="#94a3b8">120s</text>
                    <text x="0" y="104" fontSize="9" fill="#94a3b8">60s</text>
                    <text x="8" y="144" fontSize="9" fill="#94a3b8">0s</text>

                    {/* Labels X */}
                    <text x="40" y="170" fontSize="9" fill="#94a3b8">00:00</text>
                    <text x="140" y="170" fontSize="9" fill="#94a3b8">06:00</text>
                    <text x="260" y="170" fontSize="9" fill="#94a3b8">12:00</text>
                    <text x="380" y="170" fontSize="9" fill="#94a3b8">18:00</text>
                    <text x="470" y="170" fontSize="9" fill="#94a3b8">23:59</text>

                    {/* Area Chart Path */}
                    <path d="M40 140 L80 130 L120 140 L180 100 L240 80 L320 110 L380 80 L440 55 L520 70 L520 155 L40 155 Z" fill="#f1f5f9" />
                    <path d="M40 140 L80 130 L120 140 L180 100 L240 80 L320 110 L380 80 L440 55 L520 70" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />

                    {/* Tooltip */}
                    <circle cx="440" cy="55" r="4" fill="#1e293b" />
                    <rect x="380" y="20" width="65" height="20" rx="4" fill="#1e293b" />
                    <text x="412" y="34" fontSize="9" fill="#ffffff" textAnchor="middle">16:45: 142s</text>
                </svg>
            </div>
        </div>
    )
}