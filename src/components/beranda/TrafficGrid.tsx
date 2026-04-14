export default function TrafficGrid() {
    return (
        <div className="grid grid-cols-2 gap-6">
            {/* UTARA */}
            <div className="bg-bg-card rounded-custom p-6 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-[16px] font-semibold text-text-main m-0">Jalur Utara</h3>
                        <p className="text-[12px] text-text-secondary mt-1">ID Sensor: SN-UTARA-01</p>
                    </div>
                    <div className="px-3 py-1 rounded-[20px] text-[12px] font-semibold bg-[#dcfce7] text-[#166534]">Lancar</div>
                </div>
                <div className="flex items-start gap-8">
                    <div className="bg-[#1e293b] w-12 rounded-[24px] py-[10px] flex flex-col items-center gap-2">
                        <div className="w-6 h-6 rounded-full opacity-20 bg-[#ef4444]"></div>
                        <div className="w-6 h-6 rounded-full opacity-20 bg-[#eab308]"></div>
                        <div className="w-6 h-6 rounded-full opacity-100 shadow-[0_0_10px_currentColor] bg-[#22c55e]"></div>
                    </div>
                    <div className="flex-1">
                        <div className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-[0.5px]">JARAK ANTREAN</div>
                        <div className="text-[28px] font-bold text-text-main mt-1 mb-4">24<small className="text-[14px] text-[#94a3b8] font-medium ml-1">CM</small></div>
                        <div className="h-1.5 bg-bg-card-alt rounded-[3px] overflow-hidden">
                            <div className="h-full rounded-[3px] bg-[#22c55e]" style={{ width: '15%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SELATAN */}
            <div className="bg-bg-card rounded-custom p-6 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-[16px] font-semibold text-text-main m-0">Jalur Selatan</h3>
                        <p className="text-[12px] text-text-secondary mt-1">ID Sensor: SN-SELATAN-02</p>
                    </div>
                    <div className="px-3 py-1 rounded-[20px] text-[12px] font-semibold bg-[#fef3c7] text-[#92400e]">Cukup Padat</div>
                </div>
                <div className="flex items-start gap-8">
                    <div className="bg-[#1e293b] w-12 rounded-[24px] py-[10px] flex flex-col items-center gap-2">
                        <div className="w-6 h-6 rounded-full opacity-20 bg-[#ef4444]"></div>
                        <div className="w-6 h-6 rounded-full opacity-100 shadow-[0_0_10px_currentColor] bg-[#eab308]"></div>
                        <div className="w-6 h-6 rounded-full opacity-20 bg-[#22c55e]"></div>
                    </div>
                    <div className="flex-1">
                        <div className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-[0.5px]">JARAK ANTREAN</div>
                        <div className="text-[28px] font-bold text-text-main mt-1 mb-4">142<small className="text-[14px] text-[#94a3b8] font-medium ml-1">CM</small></div>
                        <div className="h-1.5 bg-bg-card-alt rounded-[3px] overflow-hidden">
                            <div className="h-full rounded-[3px] bg-[#f59e0b]" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TIMUR */}
            <div className="bg-bg-card rounded-custom p-6 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-[16px] font-semibold text-text-main m-0">Jalur Timur</h3>
                        <p className="text-[12px] text-text-secondary mt-1">ID Sensor: SN-TIMUR-03</p>
                    </div>
                    <div className="px-3 py-1 rounded-[20px] text-[12px] font-semibold bg-[#fee2e2] text-[#991b1b]">Padat</div>
                </div>
                <div className="flex items-start gap-8">
                    <div className="bg-[#1e293b] w-12 rounded-[24px] py-[10px] flex flex-col items-center gap-2">
                        <div className="w-6 h-6 rounded-full opacity-100 shadow-[0_0_10px_currentColor] bg-[#ef4444]"></div>
                        <div className="w-6 h-6 rounded-full opacity-20 bg-[#eab308]"></div>
                        <div className="w-6 h-6 rounded-full opacity-20 bg-[#22c55e]"></div>
                    </div>
                    <div className="flex-1">
                        <div className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-[0.5px]">JARAK ANTREAN</div>
                        <div className="text-[28px] font-bold text-text-main mt-1 mb-4">482<small className="text-[14px] text-[#94a3b8] font-medium ml-1">CM</small></div>
                        <div className="h-1.5 bg-bg-card-alt rounded-[3px] overflow-hidden">
                            <div className="h-full rounded-[3px] bg-[#ef4444]" style={{ width: '90%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BARAT */}
            <div className="bg-bg-card rounded-custom p-6 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-[16px] font-semibold text-text-main m-0">Jalur Barat</h3>
                        <p className="text-[12px] text-text-secondary mt-1">ID Sensor: SN-BARAT-04</p>
                    </div>
                    <div className="px-3 py-1 rounded-[20px] text-[12px] font-semibold bg-[#dcfce7] text-[#166534]">Lancar</div>
                </div>
                <div className="flex items-start gap-8">
                    <div className="bg-[#1e293b] w-12 rounded-[24px] py-[10px] flex flex-col items-center gap-2">
                        <div className="w-6 h-6 rounded-full opacity-20 bg-[#ef4444]"></div>
                        <div className="w-6 h-6 rounded-full opacity-20 bg-[#eab308]"></div>
                        <div className="w-6 h-6 rounded-full opacity-100 shadow-[0_0_10px_currentColor] bg-[#22c55e]"></div>
                    </div>
                    <div className="flex-1">
                        <div className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-[0.5px]">JARAK ANTREAN</div>
                        <div className="text-[28px] font-bold text-text-main mt-1 mb-4">12<small className="text-[14px] text-[#94a3b8] font-medium ml-1">CM</small></div>
                        <div className="h-1.5 bg-bg-card-alt rounded-[3px] overflow-hidden">
                            <div className="h-full rounded-[3px] bg-[#22c55e]" style={{ width: '8%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}