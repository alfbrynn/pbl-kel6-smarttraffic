import { useEffect, useState, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { DataSimpang } from '@/types';

export default function useSimpangUtama() {
    const [dataSimpang, setDataSimpang] = useState<DataSimpang | null>(null);
    const [statusKoneksi, setStatusKoneksi] = useState('Menghubungkan...');
    const [loading, setLoading] = useState(true);
    const lastSyncTimeRef = useRef<number>(0);

    // Monitor keaktifan IoT secara heuristik (jika tidak ada update > 15 detik = offline)
    useEffect(() => {
        const timer = setInterval(() => {
            if (lastSyncTimeRef.current === 0) {
                setStatusKoneksi('Menghubungkan...');
                return;
            }
            const isOnline = Date.now() - lastSyncTimeRef.current < 15000;
            if (!isOnline) {
                setStatusKoneksi('IoT Terputus');
            } else {
                setStatusKoneksi('Sinkronisasi Aktif');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const docRef = doc(db, 'persimpangan', 'simpang-utama');

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setDataSimpang(docSnap.data() as DataSimpang);
                lastSyncTimeRef.current = Date.now();
                setStatusKoneksi('Sinkronisasi Aktif');
            } else {
                setStatusKoneksi('Menunggu Data...');
            }
            setLoading(false);
        }, (error) => {
            console.error("Firebase Error:", error);
            setStatusKoneksi('Gagal Sinkron');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { dataSimpang, statusKoneksi, loading };
}
