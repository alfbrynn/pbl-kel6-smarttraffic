import React from 'react';

export default function SensorCard() {
    return (
        <div className="bg-bg-card rounded-custom shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col">
            <div className="px-4 py-3 text-[11px] font-bold text-text-main tracking-[0.5px] flex items-center gap-2 border-b border-border-color">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20"></path>
                    <path d="M2 12h20"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                SKEMA TATA LETAK SENSOR
            </div>
            <div className="flex-1 bg-bg-card-alt relative min-h-[150px] flex items-center justify-center">
                <div className="w-[140px] h-[140px] relative">
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-[#e2e8f0]"></div>
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 bg-[#e2e8f0]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] border-2 border-border-color rounded-full bg-bg-card-alt z-[2]"></div>

                    {/* Sensor Dots */}
                    <div className="absolute w-2 h-2 bg-[#10b981] rounded-full z-[3] top-[30%] left-[calc(50%-12px)]"></div>
                    <div className="absolute w-2 h-2 bg-[#10b981] rounded-full z-[3] bottom-[30%] left-[calc(50%+2px)]"></div>
                    <div className="absolute w-2 h-2 bg-[#10b981] rounded-full z-[3] top-[calc(50%-10px)] right-[30%]"></div>
                    <div className="absolute w-2 h-2 bg-[#10b981] rounded-full z-[3] bottom-[calc(50%-2px)] left-[30%]"></div>

                    {/* Labels */}
                    <div className="absolute text-[8px] font-semibold text-[#64748b] uppercase top-2 left-1/2 -translate-x-1/2">UTARA</div>
                    <div className="absolute text-[8px] font-semibold text-[#64748b] uppercase bottom-2 left-1/2 -translate-x-1/2">SELATAN</div>
                    <div className="absolute text-[8px] font-semibold text-[#64748b] uppercase right-2 top-1/2 -translate-y-1/2 rotate-90">TIMUR</div>
                    <div className="absolute text-[8px] font-semibold text-[#64748b] uppercase left-2 top-1/2 -translate-y-1/2 -rotate-90">BARAT</div>
                </div>
            </div>
        </div>
    )
}