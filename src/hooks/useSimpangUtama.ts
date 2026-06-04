import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { DataSimpang } from '@/types';

export default function useSimpangUtama() {
    const [dataSimpang, setDataSimpang] = useState<DataSimpang | null>(null);
    const [statusKoneksi, setStatusKoneksi] = useState('Menghubungkan...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const docRef = doc(db, 'persimpangan', 'simpang-utama');

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setDataSimpang(docSnap.data() as DataSimpang);
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
