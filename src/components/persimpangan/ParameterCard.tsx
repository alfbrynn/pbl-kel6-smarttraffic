import react from 'react';

export default function ParameterCard() {
    return (
        <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
            <div className="flex gap-4 items-start mb-6">
                <div className="w-10 h-10 bg-[#f1f5f9] rounded-lg flex items-center justify-center text-[#475569]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                </div>
                <div>
                    <h2 className="text-[18px] font-bold text-text-main m-0">Pengaturan Parameter</h2>
                    <p className="text-[13px] text-text-secondary mt-1 mb-0">Konfigurasi ambang batas sensor dan waktu siklus</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-text-main">Batas Jarak Kepadatan (cm)</label>
                    <div className="relative flex items-center">
                        <input type="text" className="w-full h-12 bg-bg-card-alt border border-border-color rounded-lg px-4 text-[14px] text-text-main outline-none font-sans placeholder:text-text-secondary" placeholder="Contoh: 150" />
                        <span className="absolute right-4 text-[10px] font-bold bg-border-color text-text-main px-2 py-1 rounded-[12px]">CM</span>
                    </div>
                    <span className="text-[11px] text-[#64748b] italic">Jarak minimum kendaraan terdeteksi padat oleh sensor ultrasonik.</span>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-text-main">Durasi Lampu Hijau Maksimal (detik)</label>
                    <div className="relative flex items-center">
                        <input type="text" className="w-full h-12 bg-bg-card-alt border border-border-color rounded-lg px-4 text-[14px] text-text-main outline-none font-sans placeholder:text-text-secondary" placeholder="Contoh: 60" />
                        <span className="absolute right-4 text-[10px] font-bold bg-border-color text-text-main px-2 py-1 rounded-[12px]">DET</span>
                    </div>
                    <span className="text-[11px] text-[#64748b] italic">Waktu maksimal fase hijau untuk menghindari antrian panjang di jalur lain.</span>
                </div>
            </div>

            <div className="flex justify-end">
                <button className="bg-accent-cyan text-white border-none rounded-lg px-6 py-3 text-[13px] font-semibold cursor-pointer flex items-center gap-2 transition-colors duration-200 hover:bg-accent-cyan-hover">
                    Simpan Pengaturan
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    )
}