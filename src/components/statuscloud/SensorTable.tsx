import React from 'react';

export default function SensorTable() {
    const sensorData = [
        { id: 'PBL-MLG-01', location: 'Utara', status: 'Aktif', update: 'Baru saja' },
        { id: 'PBL-MLG-02', location: 'Barat', status: 'Aktif', update: '1m yang lalu' },
        { id: 'PBL-MLG-03', location: 'Timur', status: 'Aktif', update: '3m yang lalu' },
        { id: 'PBL-MLG-04', location: 'Selatan', status: 'Aktif', update: '3m yang lalu' },
    ];

    return (
        <div className="bg-bg-card rounded-custom shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden">
            <div className="p-6 flex justify-between items-center">
                <h3 className="text-[16px] font-bold text-text-main m-0">Daftar Sensor Lapangan</h3>
                <div className="bg-accent-green-bg text-accent-green px-3 py-1 rounded-[4px] text-[10px] font-extrabold tracking-[0.5px] uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse"></span>
                    STATUS: SINKRON
                </div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] border-t border-b border-border-color bg-bg-card-alt">ID PERANGKAT</th>
                        <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] border-t border-b border-border-color bg-bg-card-alt">LOKASI</th>
                        <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] border-t border-b border-border-color bg-bg-card-alt">STATUS DATA</th>
                        <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] border-t border-b border-border-color bg-bg-card-alt">TERAKHIR UPDATE</th>
                        <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] border-t border-b border-border-color bg-bg-card-alt">AKSI</th>
                    </tr>
                </thead>
                <tbody>
                    {sensorData.map((s, idx) => (
                        <tr key={idx} className="hover:bg-bg-hover transition-colors">
                            <td className="px-6 py-4 text-[12px] font-mono font-semibold text-text-main border-b border-border-color">{s.id}</td>
                            <td className="px-6 py-4 text-[13px] text-text-secondary font-medium border-b border-border-color">{s.location}</td>
                            <td className="px-6 py-4 text-[13px] text-text-secondary font-medium border-b border-border-color">
                                <span className="flex items-center gap-1.5 text-accent-green font-semibold">
                                    <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></span> {s.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-[13px] text-text-secondary font-medium border-b border-border-color">{s.update}</td>
                            <td className="px-6 py-4 text-[13px] text-text-secondary font-medium border-b border-border-color">
                                <span className="text-accent-cyan font-bold text-[12px] cursor-pointer hover:underline">Detail</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="w-full p-4 bg-transparent border-none text-[10px] font-bold text-text-secondary tracking-[1px] uppercase cursor-pointer flex justify-center items-center gap-1 transition-colors duration-200 hover:bg-bg-hover">
                LIHAT SEMUA PERANGKAT 
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
        </div>
    );
}
