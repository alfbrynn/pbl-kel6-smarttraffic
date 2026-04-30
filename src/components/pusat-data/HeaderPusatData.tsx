// components/pusat-data/HeaderPusatData.tsx
import React from 'react';

export default function HeaderPusatData() {
    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-text-main">Pusat Data Traffic</h1>
                <p className="text-sm text-text-secondary mt-1">
                    Analisis kepadatan lalu lintas dan log sensor secara real-time untuk tim Big Data.
                </p>
            </div>
            <div className="flex gap-3">
                {/* Sesuaikan styling tombol dengan tema Anda */}
                <button className="px-4 py-2 border border-border-color rounded-lg hover:bg-bg-card transition-colors">
                    Unduh CSV
                </button>
                <button className="px-4 py-2 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan-hover transition-colors">
                    Cetak PDF
                </button>
            </div>
        </header>
    );
}