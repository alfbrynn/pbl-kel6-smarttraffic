// components/pusat-data/CSVEksportButton.tsx
import React, { useState } from 'react';
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import CSVFilterModal from './CSVFilterModal';
import { formatToDateTime } from '@/utils/date';
import { downloadCSVFile } from '@/utils/csv';

export default function ButtonUnduhCSV() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    /**
     * Fungsi untuk mengunduh data log dari Firestore dalam format CSV dengan filter rentang waktu dan lajur
     */
    const handleDownloadCSV = async (startDate: string, endDate: string, selectedLanes: string[]) => {
        setIsDownloading(true);
        try {
            const startOfDay = new Date(startDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);

            const startTimestamp = Timestamp.fromDate(startOfDay);
            const endTimestamp = Timestamp.fromDate(endOfDay);

            // Query Firestore dengan filter
            const q = query(
                collection(db, 'kepadatan_jalan'),
                where('jalur_arah', 'in', selectedLanes),
                where('waktu', '>=', startTimestamp),
                where('waktu', '<=', endTimestamp),
                orderBy('waktu', 'asc'),
                limit(5000)
            );

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => doc.data());

            if (data.length === 0) {
                alert("Tidak ada data untuk diunduh pada filter yang dipilih.");
                setIsDownloading(false);
                return;
            }

            // Membangun baris CSV
            const headers = ["ID Persimpangan", "Jalur", "Jarak (cm)", "Jumlah Kendaraan", "Waktu", "Status Lampu", "Status Kepadatan"];
            const rows = data.map(item => {
                const formattedTime = formatToDateTime(item.timestamp_ms || item.waktu);

                return [
                    `"${item.pers_id || ''}"`,
                    `"${item.jalur_arah || ''}"`,
                    item.jarak_cm !== undefined ? item.jarak_cm : 0,
                    item.sisa_antrian !== undefined ? item.sisa_antrian : (item.jumlah_kendaraan !== undefined ? item.jumlah_kendaraan : 0),
                    `"${formattedTime}"`,
                    `"${item.status_lampu || ''}"`,
                    `"${item.status_kepadatan || ''}"`
                ];
            });

            // Membuat nama berkas terformat: smartraf_[jalur]_[start]_[end].csv
            const lanesString = selectedLanes.join("-");
            const fileName = `smartraf_${lanesString}_${startDate}_${endDate}.csv`;

            // Unduh file CSV
            downloadCSVFile(headers, rows, fileName);

            console.log("CSV berhasil diunduh.");
            setIsOpen(false); // Tutup modal setelah sukses
        } catch (error) {
            console.error("Gagal mengunduh CSV:", error);
            alert("Gagal mengunduh data. Periksa indeks Firestore Anda jika terjadi kegagalan query.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            {/* Tombol Utama */}
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center gap-2 text-sm font-semibold shadow-md shadow-blue-500/10 duration-200 active:scale-95 cursor-pointer"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Ekspor CSV
            </button>

            {/* Modal Dialog */}
            <CSVFilterModal 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                isDownloading={isDownloading} 
                onDownload={handleDownloadCSV} 
            />
        </>
    );
}
