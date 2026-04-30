// components/pusat-data/HeaderPusatData.tsx
import React, { useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export default function HeaderPusatData() {
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
                alert("Tidak ada data yang tersedia untuk diunduh.");
                setIsDownloading(false);
                return;
            }

            // Menyiapkan Header CSV
            const headers = ["Waktu", "Jalur", "Jarak_CM", "Jumlah_Kendaraan", "Status_Kepadatan", "Status_Lampu"];
            
            // Menyusun Baris Data
            const rows = data.map(item => {
                // Konversi waktu agar terbaca manusia dan mudah dianalisis (YYYY-MM-DD HH:mm:ss)
                let readableTime = item.waktu;
                
                // Prioritaskan penggunaan timestamp_ms untuk akurasi tinggi
                if (item.timestamp_ms) {
                    const d = new Date(item.timestamp_ms);
                    readableTime = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
                } 
                // Jika tidak ada ms, cek apakah itu objek Timestamp Firestore
                else if (item.waktu && typeof item.waktu.toDate === 'function') {
                    const d = item.waktu.toDate();
                    readableTime = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
                }

                return [
                    `"${readableTime}"`,
                    `"${item.jalur_arah}"`,
                    item.jarak_cm,
                    item.jumlah_kendaraan,
                    `"${item.status_kepadatan}"`,
                    `"${item.status_lampu}"`
                ];
            });

            // Menggabungkan Header dan Baris
            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.join(","))
            ].join("\n");

            // Proses Pengunduhan File di Browser
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            
            const fileName = `log_traffic_smartraf_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.csv`;
            
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-border-color gap-4">
            <div>
                <h1 className="text-2xl font-black text-text-main uppercase tracking-wide">Pusat Data Lalu Lintas</h1>
                <p className="text-sm text-text-secondary mt-1">
                    Analisis kepadatan lalu lintas dan log sensor secara waktu nyata untuk Tim Analisis.
                </p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={handleDownloadCSV}
                    disabled={isDownloading}
                    className={`px-4 py-2 border border-border-color rounded-lg hover:bg-bg-card transition-all flex items-center gap-2 text-sm font-semibold
                    ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                >
                    {isDownloading ? (
                        <>
                            <span className="w-3 h-3 border-2 border-text-secondary border-t-transparent rounded-full animate-spin"></span>
                            Mengunduh...
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Unduh CSV
                        </>
                    )}
                </button>
                <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan-hover transition-all text-sm font-semibold active:scale-95 flex items-center gap-2"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                        <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    Cetak PDF
                </button>
            </div>
        </header>
    );
}