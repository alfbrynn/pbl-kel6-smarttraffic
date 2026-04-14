import React from 'react';

export default function DataTable() {
    const tableData = [
        { time: '08:30', location: 'Jalur Utara', distance: 15, status: 'PADAT' },
        { time: '08:32', location: 'Jalur Selatan', distance: 120, status: 'LANCAR' },
        { time: '08:35', location: 'Jalur Timur', distance: 45, status: 'CUKUP PADAT' },
        { time: '08:38', location: 'Jalur Barat', distance: 200, status: 'LANCAR' },
        { time: '08:40', location: 'Jalur Utara', distance: 25, status: 'PADAT' },
    ];

    return (
        <div className="bg-bg-card rounded-custom shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] border-b border-border-color bg-bg-card-alt">WAKTU (WIB)</th>
                        <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] border-b border-border-color bg-bg-card-alt">LOKASI JALUR</th>
                        <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] border-b border-border-color bg-bg-card-alt">JARAK DETEKSI (CM)</th>
                        <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] border-b border-border-color bg-bg-card-alt">STATUS</th>
                        <th className="text-left px-6 py-4 text-[11px] font-bold text-text-secondary uppercase tracking-[0.5px] border-b border-border-color bg-bg-card-alt">AKSI</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, idx) => {
                        let statusClass = '';
                        if (row.status === 'PADAT') statusClass = 'bg-accent-red-bg text-accent-red';
                        else if (row.status === 'LANCAR') statusClass = 'bg-accent-green-bg text-accent-green';
                        else if (row.status === 'CUKUP PADAT') statusClass = 'bg-accent-orange-bg text-accent-orange';

                        return (
                            <tr key={idx}>
                                <td className="px-6 py-4 text-[13px] text-text-main font-semibold border-b border-border-color">{row.time}</td>
                                <td className="px-6 py-4 text-[13px] text-text-main font-semibold border-b border-border-color">{row.location}</td>
                                <td className="px-6 py-4 text-[13px] text-text-main font-semibold border-b border-border-color">{row.distance}</td>
                                <td className="px-6 py-4 text-[13px] text-text-main font-semibold border-b border-border-color">
                                    <span className={`inline-flex px-3 py-1 rounded-[20px] text-[10px] font-extrabold tracking-[0.5px] uppercase ${statusClass}`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-[13px] text-text-main font-semibold border-b border-border-color">
                                    <button className="bg-none border-none cursor-pointer text-text-secondary p-1 hover:text-text-main">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="12" cy="5" r="1"></circle>
                                            <circle cx="12" cy="19" r="1"></circle>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex justify-between items-center px-6 py-4 text-[12px] text-text-secondary">
                <span>Menampilkan <strong className="text-text-main">1-5</strong> dari <strong className="text-text-main">100</strong> data</span>
                <div className="flex items-center gap-2">
                    <button className="bg-none border-none cursor-pointer text-text-secondary flex items-center justify-center p-1 hover:text-text-main">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-[4px] text-[12px] font-semibold cursor-pointer border-none bg-bg-hover text-text-main">1</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-[4px] text-[12px] font-semibold cursor-pointer border-none bg-transparent text-text-secondary hover:bg-bg-hover">2</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-[4px] text-[12px] font-semibold cursor-pointer border-none bg-transparent text-text-secondary hover:bg-bg-hover">3</button>
                    <span className="text-[12px] text-text-secondary mx-1">...</span>
                    <button className="w-7 h-7 flex items-center justify-center rounded-[4px] text-[12px] font-semibold cursor-pointer border-none bg-transparent text-text-secondary hover:bg-bg-hover">20</button>
                    <button className="bg-none border-none cursor-pointer text-text-secondary flex items-center justify-center p-1 hover:text-text-main">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}