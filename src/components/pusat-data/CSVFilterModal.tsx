import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CSVFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDownloading: boolean;
    onDownload: (startDate: string, endDate: string, selectedLanes: string[]) => Promise<void>;
}

export default function CSVFilterModal({ isOpen, onClose, isDownloading, onDownload }: CSVFilterModalProps) {
    const [isMounted, setIsMounted] = useState(false);

    // Filter states
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
    const [selectedLanes, setSelectedLanes] = useState<string[]>(['barat', 'timur', 'selatan']);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isOpen || !isMounted) return null;

    const lanes = [
        { id: 'barat', label: 'Barat' },
        { id: 'timur', label: 'Timur' },
        { id: 'selatan', label: 'Selatan' }
    ];

    const toggleLane = (laneId: string) => {
        if (selectedLanes.includes(laneId)) {
            setSelectedLanes(selectedLanes.filter(l => l !== laneId));
        } else {
            setSelectedLanes([...selectedLanes, laneId]);
        }
    };

    // Estimasi jumlah baris: 1 menit = 1 data per lajur = 60 * 24 = 1440 baris per hari per lajur
    const getEstimatedRows = () => {
        if (selectedLanes.length === 0) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        if (diffTime < 0) return 0;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays * 1440 * selectedLanes.length;
    };

    const isDateInvalid = new Date(startDate) > new Date(endDate);

    const handleSubmit = async () => {
        await onDownload(startDate, endDate, selectedLanes);
    };

    return createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-9999 flex items-center justify-center p-4 transition-all duration-300 animate-fade-in">
            <div className="bg-card border border-border rounded-[28px] p-6 max-w-md w-full shadow-2xl transform transition-all scale-100 flex flex-col gap-5 text-foreground animate-zoom-in">

                {/* Header Modal */}
                <div className="flex items-center gap-3 border-b border-border pb-4">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-black text-foreground">Ekspor Data CSV</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Filter data lalu lintas sebelum mengunduh</p>
                    </div>
                </div>

                {/* Input Tanggal */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="startDate" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dari</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="endDate" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">s/d</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900"
                        />
                    </div>
                </div>


                {/* Error Tanggal */}
                {isDateInvalid && (
                    <p className="text-xs text-red-500 font-semibold -mt-2">
                        Tanggal mulai tidak boleh melebihi tanggal selesai.
                    </p>
                )}

                {/* Pilihan Jalur */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jalur / Lajur</label>
                    <div className="flex gap-2 flex-wrap">
                        {lanes.map((lane) => {
                            const isSelected = selectedLanes.includes(lane.id);
                            return (
                                <button
                                    key={lane.id}
                                    type="button"
                                    onClick={() => toggleLane(lane.id)}
                                    className={`border px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1.5
                                        ${isSelected
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                                            : 'bg-slate-50 text-slate-600 border-border hover:bg-slate-100'
                                        }`}
                                >
                                    {isSelected && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                    {lane.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Estimasi data */}
                <div className="bg-slate-50 border border-border rounded-2xl p-4 flex flex-col gap-1 text-center">
                    <span className="text-xs text-slate-400 font-semibold">Estimasi Jumlah Baris Data</span>
                    <span className="text-lg font-black text-slate-900">
                        {isDateInvalid ? '-' : `~${getEstimatedRows().toLocaleString('id-ID')} baris`}
                    </span>
                    <span className="text-[10px] text-slate-400 italic">
                        *Batas unduhan maksimal 5.000 baris demi performa
                    </span>
                </div>

                {/* Aksi / Footer */}
                <div className="flex justify-end gap-3 mt-2 border-t border-border pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-border hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all active:scale-95"
                    >
                        Batalkan
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isDownloading || selectedLanes.length === 0 || isDateInvalid}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? (
                            <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Mengunduh...
                            </>
                        ) : (
                            <>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Download CSV
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
}
