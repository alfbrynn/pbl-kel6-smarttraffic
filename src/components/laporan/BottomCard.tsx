import React from 'react';

export default function BottomCards() {
    return (
        <div className="grid grid-cols-2 gap-6">

            {/* ANALYSIS CARD */}
            <div className="bg-bg-card rounded-custom p-8 shadow-[0_1px_3px_rgba(0,0,0,0.2)] relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute right-0 top-[10px] z-[1] text-border-color opacity-80">
                    <svg width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 100 L60 40 L100 80 L140 20 L180 60" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="140" cy="80" r="28" stroke="currentColor" strokeWidth="16" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-[60%]">
                    <h3 className="text-[18px] font-bold text-text-main m-0 mb-3">Analisis Kecepatan Arus</h3>
                    <p className="text-[13px] text-text-secondary leading-normal mb-6">
                        Visualisasi rata-rata kecepatan kendaraan berdasarkan data sensor hari ini di seluruh persimpangan.
                    </p>
                    <div className="flex gap-8">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-text-secondary tracking-[0.5px] uppercase mb-1">EFISIENSI JALUR</span>
                            <span className="text-[24px] font-bold text-text-main tracking-tight">82%</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-text-secondary tracking-[0.5px] uppercase mb-1">WAKTU TEMPUH</span>
                            <span className="text-[24px] font-bold text-text-main tracking-tight">-4.2<small style={{ fontSize: '14px', letterSpacing: '0' }}>m</small></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SUMMARY CARD */}
            <div className="bg-[#0f172a] rounded-custom p-8 shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex justify-between items-center text-[#f8fafc]">
                <div className="max-w-[75%]">
                    <h3 className="text-[18px] font-bold m-0 mb-3">Ringkasan Puncak Kepadatan</h3>
                    <p className="text-[13px] text-[#94a3b8] leading-normal">
                        Puncak kemacetan hari ini terjadi pada pukul 08:00 WIB di jalur utara.
                    </p>
                </div>
                <div className="text-[#334155]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a8 8 0 0 0-8 8v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a8 8 0 0 0-8-8z"></path>
                        <circle cx="9" cy="13" r="2"></circle>
                        <circle cx="15" cy="13" r="2"></circle>
                        <path d="M10 17h4"></path>
                        <path d="M22 13v8a2 2 0 0 1-2 2H16"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}