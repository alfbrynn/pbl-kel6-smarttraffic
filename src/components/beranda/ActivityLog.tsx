"use client";
import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface LogItem {
  id: string;
  pesan: string;
  tipe: 'hijau' | 'kuning' | 'merah' | 'info';
  waktu: string;
  timestamp_ms: number;
}

function dotColor(tipe: LogItem['tipe']) {
  switch (tipe) {
    case 'hijau':  return 'bg-[#22c55e]';
    case 'kuning': return 'bg-[#f59e0b]';
    case 'merah':  return 'bg-[#ef4444]';
    default:       return 'bg-[#94a3b8]';
  }
}

// Generate log dari data kepadatan
function generateLogs(docs: any[]): LogItem[] {
  return docs.slice(0, 8).map((doc) => {
    const d = doc.data();
    const waktu = d.timestamp_ms
      ? new Date(d.timestamp_ms).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      : '--:--:--';

    let pesan = '';
    let tipe: LogItem['tipe'] = 'info';

    if (d.status_lampu === 'HIJAU') {
      pesan = `${d.jalur_arah?.charAt(0).toUpperCase() + d.jalur_arah?.slice(1) || 'Jalur'} beralih ke HIJAU`;
      tipe = 'hijau';
    } else if (d.status_kepadatan === 'Padat') {
      pesan = `Kepadatan tinggi terdeteksi di ${d.jalur_arah || 'jalur'}`;
      tipe = 'merah';
    } else if (d.status_kepadatan === 'Cukup Padat') {
      pesan = `Kepadatan sedang di ${d.jalur_arah || 'jalur'} (${d.jarak_cm}cm)`;
      tipe = 'kuning';
    } else {
      pesan = `Sensor ${d.sensor_id || 'unknown'} sinkronisasi`;
      tipe = 'info';
    }

    return { id: doc.id, pesan, tipe, waktu, timestamp_ms: d.timestamp_ms ?? 0 };
  });
}

export default function ActivityLog() {
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'kepadatan_jalan'), orderBy('timestamp_ms', 'desc'), limit(8)),
      (snap) => {
        if (!snap.empty) setLogs(generateLogs(snap.docs));
      }
    );
    return () => unsub();
  }, []);

  // Fallback jika Firestore belum ada data
  const displayLogs = logs.length > 0 ? logs : [
    { id: '1', pesan: 'Jalur Utara beralih ke HIJAU',         tipe: 'hijau'  as const, waktu: '14:02:45', timestamp_ms: 0 },
    { id: '2', pesan: 'Kepadatan terdeteksi di Timur',        tipe: 'kuning' as const, waktu: '14:01:22', timestamp_ms: 0 },
    { id: '3', pesan: 'Sensor SN-SELATAN-02 Sinkronisasi',    tipe: 'info'   as const, waktu: '13:58:10', timestamp_ms: 0 },
    { id: '4', pesan: 'Peringatan: Antrean Barat meningkat',  tipe: 'merah'  as const, waktu: '13:55:04', timestamp_ms: 0 },
  ];

  return (
    <div className="bg-bg-card rounded-custom shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col h-full">
      <div className="px-6 py-5 flex justify-between items-center border-b border-border-color">
        <h3 className="text-[15px] font-semibold text-text-main">Log Aktivitas</h3>
        <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
          Realtime
        </div>
      </div>

      <div className="p-[16px_24px] flex flex-col gap-4 flex-1 overflow-y-auto">
        {displayLogs.map((log) => (
          <div key={log.id} className="flex gap-3">
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor(log.tipe)}`}/>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] text-text-main font-medium">{log.pesan}</span>
              <span className="text-[11px] text-text-secondary">{log.waktu}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-secondary mx-6 mb-5 w-[calc(100%-48px)]">LIHAT SEMUA LOG SENSOR</button>
    </div>
  );
}
