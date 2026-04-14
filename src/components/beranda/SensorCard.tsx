import React from 'react';

export default function LiveSchema() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md flex flex-col h-full overflow-hidden border border-slate-200 dark:border-slate-700">

            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 relative z-30 bg-white dark:bg-slate-800">
                <h3 className="text-[15px] font-semibold text-slate-800 dark:text-white">Live Skema Persimpangan</h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sync Active</span>
                </div>
            </div>

            <div className="flex-1 relative min-h-[320px] overflow-hidden bg-slate-50 dark:bg-slate-900 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px]">

                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-28 bg-slate-300 dark:bg-slate-700 shadow-lg">
                    <div className="absolute w-1 h-full left-1/2 -translate-x-1/2 border-l-4 border-dashed border-white dark:border-slate-500 opacity-70"></div>
                </div>

                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-28 bg-slate-300 dark:bg-slate-700 shadow-lg">
                    <div className="absolute h-1 w-full top-1/2 -translate-y-1/2 border-t-4 border-dashed border-white dark:border-slate-500 opacity-70"></div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-slate-400 dark:bg-slate-600 z-10 flex items-center justify-center">
                    <div className="w-20 h-20 border-2 border-yellow-400/50 dark:border-yellow-500/50"></div>
                </div>

                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 mb-2 bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-600">UTARA</span>
                    <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] border-2 border-white dark:border-slate-800 relative flex justify-center items-center"></div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] border-2 border-white dark:border-slate-800 relative flex justify-center items-center"></div>
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 mt-2 bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-600">SELATAN</span>
                </div>

                <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex items-center">
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 mr-3 bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-600">TIMUR</span>
                    <div className="w-5 h-5 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] border-2 border-white dark:border-slate-800 relative flex justify-center items-center">
                        <div className="absolute w-10 h-10 rounded-full border-2 border-red-500 opacity-40 animate-ping"></div>
                    </div>
                </div>

                <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex items-center">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] border-2 border-white dark:border-slate-800 relative flex justify-center items-center"></div>
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 ml-3 bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-600">BARAT</span>
                </div>

            </div>
        </div>
    );
}