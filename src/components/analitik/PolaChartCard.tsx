import React from 'react';

export default function MainChartCard() {
    return (
        <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-[18px] font-bold text-text-main m-0">Pola Kepadatan Mingguan</h2>
                    <p className="text-[13px] text-text-secondary mt-1">Distribusi intensitas volume kendaraan per jam</p>
                </div>
                <div className="inline-flex items-center bg-bg-card-alt px-4 py-1.5 rounded-[20px] text-[10px] font-bold text-text-secondary tracking-[0.5px] gap-2.5">
                    RENDAH
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 bg-[#e2e8f0] rounded-[2px]"></div>
                        <div className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-[2px]"></div>
                        <div className="w-2.5 h-2.5 bg-[#ef4444] rounded-[2px]"></div>
                    </div>
                    TINGGI
                </div>
            </div>

            <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-2 text-[12px] text-text-secondary font-medium">
                    <div className="w-2 h-2 rounded-full bg-[#1e293b]"></div> Jalur Utara
                </div>
                <div className="flex items-center gap-2 text-[12px] text-text-secondary font-medium">
                    <div className="w-2 h-2 rounded-full bg-[#10b981]"></div> Jalur Selatan
                </div>
                <div className="flex items-center gap-2 text-[12px] text-text-secondary font-medium">
                    <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div> Jalur Timur
                </div>
                <div className="flex items-center gap-2 text-[12px] text-text-secondary font-medium">
                    <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div> Jalur Barat
                </div>
            </div>

            {/* Mocking SVG Chart for Visual Aesthetics */}
            <div className="w-full h-[300px] relative">
                <svg className="w-full h-full" viewBox="0 0 800 280" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <path d="M50 40 L800 40" stroke="#f1f5f9" strokeWidth="1" />
                    <path d="M50 100 L800 100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                    <path d="M50 160 L800 160" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                    <path d="M50 220 L800 220" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                    <path d="M50 280 L800 280" stroke="#f1f5f9" strokeWidth="1" />

                    {/* Labels Y */}
                    <text x="40" y="44" fontSize="10" fill="#94a3b8" textAnchor="end">100%</text>
                    <text x="40" y="104" fontSize="10" fill="#94a3b8" textAnchor="end">75%</text>
                    <text x="40" y="164" fontSize="10" fill="#94a3b8" textAnchor="end">50%</text>
                    <text x="40" y="224" fontSize="10" fill="#94a3b8" textAnchor="end">25%</text>
                    <text x="40" y="280" fontSize="10" fill="#94a3b8" textAnchor="end">0%</text>

                    {/* Labels X */}
                    <text x="50" y="295" fontSize="10" fill="#94a3b8" textAnchor="middle">00:00</text>
                    <text x="200" y="295" fontSize="10" fill="#94a3b8" textAnchor="middle">06:00</text>
                    <text x="425" y="295" fontSize="10" fill="#94a3b8" textAnchor="middle">12:00</text>
                    <text x="650" y="295" fontSize="10" fill="#94a3b8" textAnchor="middle">18:00</text>
                    <text x="800" y="295" fontSize="10" fill="#94a3b8" textAnchor="middle">23:00</text>

                    {/* Graph Lines (Utara: Dark, Selatan: Green, Timur: Orange, Barat: Red) */}
                    <path d="M50 250 L150 230 L250 210 L350 100 L450 150 L550 200 L650 90 L750 160 L800 180" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M50 260 L150 250 L250 200 L350 80 L450 160 L550 180 L650 130 L750 200 L800 240" fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M50 270 L150 260 L250 240 L350 140 L450 200 L550 230 L650 120 L750 230 L800 250" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M50 265 L150 240 L250 160 L350 110 L450 155 L550 140 L650 100 L750 200 L800 230" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />

                    {/* Dots on peaks */}
                    <circle cx="350" cy="80" r="3" fill="#10b981" />
                    <circle cx="650" cy="90" r="3" fill="#1e293b" />
                </svg>
            </div>
        </div>
    )
}