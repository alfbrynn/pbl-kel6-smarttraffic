import React from 'react';

export default function Emergency() {
    return (
        <div className="bg-bg-card-alt border border-accent-orange rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-[#fef3c7] rounded-lg flex items-center justify-center text-[#d97706]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-[18px] font-bold text-text-main m-0">Kendali Darurat</h2>
                        <p className="text-[13px] text-accent-orange mt-1 mb-0 font-medium">Otomasi Override Prioritas (Ambulans/Pemadam)</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-bg-card border border-accent-red text-accent-red text-[11px] font-bold px-4 py-2 rounded-[20px] tracking-[0.5px]">
                    <span className="w-1.5 h-1.5 bg-[#ef4444] rounded-full"></span>
                    SIAGA KENDALI MANUAL
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-6">
                {/* UTARA */}
                <div className="bg-bg-card border border-border-color rounded-custom px-4 py-6 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 hover:border-[#fcd34d] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                    <div className="w-12 h-12 bg-[#f8fafc] rounded-full flex items-center justify-center text-[#475569]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="19" x2="12" y2="5"></line>
                            <polyline points="5 12 12 5 19 12"></polyline>
                        </svg>
                    </div>
                    <div className="text-[13px] font-semibold text-text-main">Jalur Utara</div>
                    <div className="text-[10px] font-bold text-[#f59e0b] uppercase">PAKSA HIJAU DARURAT</div>
                </div>

                {/* SELATAN */}
                <div className="bg-bg-card border border-border-color rounded-custom px-4 py-6 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 hover:border-[#fcd34d] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                    <div className="w-12 h-12 bg-[#f8fafc] rounded-full flex items-center justify-center text-[#475569]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                    </div>
                    <div className="text-[13px] font-semibold text-text-main">Jalur Selatan</div>
                    <div className="text-[10px] font-bold text-[#f59e0b] uppercase">PAKSA HIJAU DARURAT</div>
                </div>

                {/* TIMUR */}
                <div className="bg-bg-card border border-border-color rounded-custom px-4 py-6 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 hover:border-[#fcd34d] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                    <div className="w-12 h-12 bg-[#f8fafc] rounded-full flex items-center justify-center text-[#475569]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                    <div className="text-[13px] font-semibold text-text-main">Jalur Timur</div>
                    <div className="text-[10px] font-bold text-[#f59e0b] uppercase">PAKSA HIJAU DARURAT</div>
                </div>

                {/* BARAT */}
                <div className="bg-bg-card border border-border-color rounded-custom px-4 py-6 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 hover:border-[#fcd34d] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                    <div className="w-12 h-12 bg-[#f8fafc] rounded-full flex items-center justify-center text-[#475569]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </div>
                    <div className="text-[13px] font-semibold text-text-main">Jalur Barat</div>
                    <div className="text-[10px] font-bold text-[#f59e0b] uppercase">PAKSA HIJAU DARURAT</div>
                </div>
            </div>

            <div className="bg-bg-card border border-border-color rounded-lg p-4 flex gap-3 items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p className="m-0 text-[12px] text-text-secondary leading-normal font-semibold">Peringatan: Menekan tombol paksa hijau akan mereset siklus normal lampu lalu lintas. Gunakan hanya saat kendaraan prioritas terdeteksi atau dalam koordinasi dengan petugas lapangan.</p>
            </div>
        </div>
    )
}
