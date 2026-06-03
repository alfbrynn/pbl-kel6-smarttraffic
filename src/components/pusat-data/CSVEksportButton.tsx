// components/pusat-data/ButtonUnduhCSV.tsx
import React, { useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export default function ButtonUnduhCSV() {
    const [isDownloading, setIsDownloading] = useState(false);

    /**
     * Fungsi untuk mengunduh data log dari Firestore dalam format CSV
     */
    const handleDownloadCSV = async () => {
        setIsDownloading(true);
        try {
            // Mengambil 100 data terbaru untuk tim Big Data
            const q = query(
                collection(db, 'kepadatan_jalan'), 
                orderBy('timestamp_ms', 'desc'), 
                limit(100)
            );
            
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => doc.data());

            if (data.length === 0) {
                alert("Tidak ada data untuk diunduh.");
                setIsDownloading(false);
                return;
            }

            // Membangun baris CSV
            const headers = ["ID Sensor", "Nama Jalan", "Kepadatan (%)", "Jumlah Kendaraan", "Waktu", "Status"];
            const rows = data.map(item => {
                // Konversi timestamp ke format waktu lokal yang human-readable
                let formattedTime = "";
                if (item.timestamp_ms) {
                    formattedTime = new Date(item.timestamp_ms).toLocaleString('id-ID');
                } else if (item.timestamp) {
                    formattedTime = new Date(item.timestamp.seconds * 1000).toLocaleString('id-ID');
                }
                
                return [
                    `"${item.sensorId || ''}"`,
                    `"${item.roadName || ''}"`,
                    item.density !== undefined ? item.density : 0,
                    item.vehicleCount !== undefined ? item.vehicleCount : 0,
                    `"${formattedTime}"`,
                    `"${item.status || ''}"`
                ];
            });

            // Menggabungkan headers dan rows
            const csvContent = [
                headers.join(","),
                ...rows.map(e => e.join(","))
            ].join("\n");

            // Membuat blob file CSV dan mengunduhnya ke komputer client
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `log_kepadatan_${new Date().toISOString().slice(0,10)}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log("CSV berhasil diunduh.");
        } catch (error) {
            console.error("Gagal mengunduh CSV:", error);
            alert("Gagal mengunduh data. Periksa koneksi atau database Anda.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button 
            onClick={handleDownloadCSV}
            disabled={isDownloading}
            className={`px-4 py-2 bg-card border border-border/10 rounded-xl hover:bg-secondary-light hover:border-primary/30 transition-all flex items-center gap-2 text-sm font-semibold shadow-sm duration-200
            ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
        >
            {isDownloading ? (
                <>
                    <span className="w-3 h-3 border-2 border-muted border-t-transparent rounded-full animate-spin"></span>
                    Mengunduh...
                </>
            ) : (
                <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Unduh CSV
                </>
            )}
        </button>
    );
}
