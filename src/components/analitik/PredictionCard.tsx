import React from 'react';

export default function PredictionCard() {
    return (
        <div className="bg-bg-card border-l-4 border-accent-cyan rounded-lg p-[20px_24px] flex justify-between items-center shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bg-card-alt rounded-full flex items-center justify-center text-accent-cyan">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v4"></path>
                        <path d="M12 18v4"></path>
                        <path d="M4.93 4.93l2.83 2.83"></path>
                        <path d="M16.24 16.24l2.83 2.83"></path>
                        <path d="M2 12h4"></path>
                        <path d="M18 12h4"></path>
                        <path d="M4.93 19.07l2.83-2.83"></path>
                        <path d="M16.24 7.76l2.83-2.83"></path>
                    </svg>
                </div>
                <div>
                    <span className="text-[11px] font-extrabold text-text-secondary uppercase mb-[6px] block tracking-[0.5px]">PREDIKSI KEPADATAN AI</span>
                    <p className="text-[15px] text-text-secondary m-0">
                        "Berdasarkan data historis, <span className="font-bold text-accent-cyan">Jalur Selatan</span> berpotensi padat pada <span className="font-bold text-accent-cyan">16:00 WIB</span>"
                    </p>
                </div>
            </div>
            <button className="bg-accent-cyan text-white border-none rounded-[6px] p-[10px_24px] text-[13px] font-semibold cursor-pointer transition-colors duration-200 hover:bg-accent-cyan-hover">Detail Analisis</button>
        </div>
    )
}