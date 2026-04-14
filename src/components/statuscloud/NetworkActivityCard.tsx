import React from 'react';

export default function NetworkActivityCard() {
    const bars = [40, 60, 80, 50, 100, 70, 80, 50, 40, 90, 60, 50, 80];
    
    return (
        <div className="bg-bg-card rounded-custom p-8 shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[16px] font-bold text-text-main m-0">Aktivitas Jaringan Real-time</h3>
                <span className="text-[10px] font-bold text-text-secondary tracking-[0.5px] uppercase">LATENCY: 42ms</span>
            </div>
            <div className="w-full h-[180px] bg-bg-card-alt rounded-lg flex items-end justify-center px-5 gap-1.5">
                {bars.map((h, i) => (
                    <div 
                        key={i} 
                        className={`w-3.5 rounded-t-[2px] ${h > 80 ? 'bg-accent-cyan' : 'bg-border-color'}`} 
                        style={{ height: `${h}%` }}>
                    </div>
                ))}
            </div>
        </div>
    );
}
