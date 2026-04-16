export default function ActivityLog() {
    return (
        <div className="bg-bg-card rounded-custom shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col h-full">
            <div className="px-6 py-5 flex justify-between items-center border-b border-border-color">
                <h3 className="text-[15px] font-semibold text-text-main">Log Aktivitas</h3>
            </div>
            <div className="p-[20px_24px] flex flex-col gap-5 flex-1">
                <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-[#22c55e]"></div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[13px] text-text-main font-medium">Jalur Utara beralih ke HIJAU</span>
                        <span className="text-[11px] text-text-secondary">14:02:45</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-[#f59e0b]"></div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[13px] text-text-main font-medium">Kepadatan terdeteksi di Timur</span>
                        <span className="text-[11px] text-text-secondary">14:01:22</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-[#94a3b8]"></div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[13px] text-text-main font-medium">Sensor SN-SELATAN-02 Sinkronisasi</span>
                        <span className="text-[11px] text-text-secondary">13:58:10</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 bg-[#ef4444]"></div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[13px] text-text-main font-medium">Peringatan: Antrean Barat meningkat</span>
                        <span className="text-[11px] text-text-secondary">13:55:04</span>
                    </div>
                </div>
            </div>
            <button className="mx-6 mb-5 py-2.5 text-center border border-border-color rounded-[6px] text-[12px] font-semibold text-text-secondary cursor-pointer bg-transparent transition-all duration-200 hover:bg-bg-hover hover:text-text-main">LIHAT SEMUA LOG SENSOR</button>
        </div>
    )
}