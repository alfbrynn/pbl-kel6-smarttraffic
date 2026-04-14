import React from 'react';

export default function StatusCards() {
    const sensorData = [
        { id: 'PBL-MLG-01', location: 'Utara', status: 'Aktif', update: 'Baru saja' },
        { id: 'PBL-MLG-02', location: 'Barat', status: 'Aktif', update: '1m yang lalu' },
        { id: 'PBL-MLG-03', location: 'Timur', status: 'Aktif', update: '3m yang lalu' },
        { id: 'PBL-MLG-04', location: 'Selatan', status: 'Aktif', update: '3m yang lalu' },
    ];

    // Helper to simulate the bar chart distribution
    const bars = [40, 60, 80, 50, 100, 70, 80, 50, 40, 90, 60, 50, 80];
    return (
        <div className="grid grid-cols-3 gap-6">
            {/* GCP */}
            <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col">
                <div className="flex justify-between items-start mb-8">
                    <div className="scTitleBox">
                        <span className="text-[10px] font-bold text-text-secondary tracking-[0.5px] uppercase mb-1 block">INFRASTRUKTUR</span>
                        <h3 className="text-[16px] font-bold text-text-main m-0">GCP Virtual Machine</h3>
                    </div>
                    <div className="w-7 h-7 bg-accent-green-bg text-accent-green rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-accent-green">
                        <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></span> Online
                    </div>
                    <div className="text-[11px] text-text-secondary font-mono">IP: 34.120.45.xx</div>
                </div>
                <div className="w-full h-1 bg-accent-green rounded-[2px]"></div>
            </div>

            {/* MQTT */}
            <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col">
                <div className="flex justify-between items-start mb-8">
                    <div className="scTitleBox">
                        <span className="text-[10px] font-bold text-text-secondary tracking-[0.5px] uppercase mb-1 block">PROTOKOL</span>
                        <h3 className="text-[16px] font-bold text-text-main m-0">Mosquitto MQTT Broker</h3>
                    </div>
                    <div className="w-7 h-7 bg-accent-green-bg text-accent-green rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-accent-green">
                        <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></span> Connected
                    </div>
                    <div className="text-[11px] text-text-secondary font-mono">Port: 1883</div>
                </div>
                <div className="w-full h-1 bg-accent-green rounded-[2px]"></div>
            </div>

            {/* FIREBASE */}
            <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col">
                <div className="flex justify-between items-start mb-8">
                    <div className="scTitleBox">
                        <span className="text-[10px] font-bold text-text-secondary tracking-[0.5px] uppercase mb-1 block">DATABASE</span>
                        <h3 className="text-[16px] font-bold text-text-main m-0">Firebase Firestore</h3>
                    </div>
                    <div className="w-7 h-7 bg-accent-green-bg text-accent-green rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-accent-green">
                        <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></span> Synced
                    </div>
                    <div className="text-[11px] text-text-secondary font-mono">Region: asia-southeast1</div>
                </div>
                <div className="w-full h-1 bg-accent-green rounded-[2px]"></div>
            </div>
        </div>
    )
}