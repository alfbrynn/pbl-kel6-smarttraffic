import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface BigDataJob {
  status: 'idle' | 'requested' | 'ingesting' | 'analyzing' | 'completed' | 'failed';
  error?: string | null;
  triggered_at?: any;
  finished_at?: any;
  results?: {
    total_records: number;
    avg_vehicles: Record<string, number>;
    avg_queue_cm: Record<string, number>;
    peak_lane: string;
    congestion_stats?: Record<string, Record<string, number>>;
    last_run: string;
    ai_recommendation?: string;
  } | null;
}

export default function BigDataSection() {
  const [jobState, setJobState] = useState<BigDataJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const docRef = doc(db, 'system', 'bigdata');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setJobState(docSnap.data() as BigDataJob);
      } else {
        // Jika dokumen belum ada, inisialisasi default
        setDoc(docRef, {
          status: 'idle',
          error: null,
          results: null,
          triggered_at: null,
          finished_at: null
        });
      }
      setLoading(false);
      setActionLoading(false);
    }, (error) => {
      console.error("Gagal mendengarkan status Big Data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const triggerAnalysis = async () => {
    setActionLoading(true);
    try {
      const docRef = doc(db, 'system', 'bigdata');
      await updateDoc(docRef, {
        status: 'requested',
        error: null,
        triggered_at: serverTimestamp()
      });
    } catch (error) {
      console.error("Gagal memicu analisis Big Data:", error);
      alert("Gagal menghubungi server database. Periksa koneksi Anda.");
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-card p-8 rounded-[28px] border border-border/10 shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4 mb-4"></div>
        <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded-md w-2/3"></div>
      </div>
    );
  }

  const { status, error, results } = jobState || { status: 'idle', error: null, results: null };

  // Helper untuk menentukan deskripsi status
  const getStatusMessage = () => {
    switch (status) {
      case 'requested':
        return 'Menghubungi VM GCP...';
      case 'ingesting':
        return 'Mengambil data dari Firestore & Mengunggah ke Hadoop HDFS...';
      case 'analyzing':
        return 'Mengeksekusi analisis PySpark & Menghitung rekomendasi Groq AI...';
      case 'completed':
        return 'Analisis Hadoop HDFS & Spark berhasil diselesaikan!';
      case 'failed':
        return 'Analisis gagal dijalankan.';
      default:
        return 'Sistem siap melakukan sinkronisasi & analisis.';
    }
  };

  const isProcessing = ['requested', 'ingesting', 'analyzing'].includes(status);

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* CARD KONTROL & STATUS UTAMA */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-[28px] p-6 sm:p-8 shadow-xl shadow-slate-900/10 border border-slate-800">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl translate-y-10 -translate-x-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-blue-400 border border-blue-900 bg-blue-950/50 px-3.5 py-1.5 mb-4 rounded-full">
              <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-500 animate-ping' : status === 'completed' ? 'bg-emerald-400' : 'bg-slate-400'}`} />
              Integrasi Big Data (HDFS & PySpark)
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tight">Otomatisasi Hadoop HDFS & Spark Analyst</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Sinkronisasikan data log Firestore ke kluster HDFS VM GCP dan picu analisis terdistribusi Apache Spark secara instan. Hasil analisis diolah menggunakan Groq AI untuk rekomendasi optimasi lampu lalu lintas adaptif.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={triggerAnalysis}
              disabled={isProcessing || actionLoading}
              className={`px-6 py-4 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer shadow-lg
                ${isProcessing 
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20'}`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                  </svg>
                  Sinkronisasi & Analisis
                </>
              )}
            </button>
          </div>
        </div>

        {/* STATUS BAR */}
        <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center
              ${status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                isProcessing ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700/50'}`}
            >
              {status.toUpperCase()}
            </div>
            <span className="text-xs text-slate-300 font-semibold">{getStatusMessage()}</span>
          </div>
          
          {results?.last_run && (
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
              Terakhir Dijalankan: {results.last_run}
            </span>
          )}
        </div>

        {/* ERROR BOX */}
        {status === 'failed' && error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl flex flex-col gap-1.5 text-xs text-red-300">
            <span className="font-bold uppercase tracking-wider text-[10px] text-red-400">Log Kesalahan Server:</span>
            <pre className="font-mono whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed bg-black/30 p-3 rounded-xl">{error}</pre>
          </div>
        )}
      </div>

      {/* HASIL ANALISIS PYSPARK (Hanya muncul jika status completed dan ada data) */}
      {status === 'completed' && results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* STATS 1: Total Data */}
          <div className="bg-card p-6 rounded-[24px] shadow-sm border border-border/10 flex flex-col justify-center min-h-[140px]">
            <span className="text-xs font-semibold text-muted mb-1.5 block">HDFS Logs Teranalisis</span>
            <p className="text-3xl font-black text-foreground dark:text-black truncate">
              {results.total_records.toLocaleString('id-ID')}
            </p>
            <span className="text-[10px] font-bold mt-3 text-slate-400 uppercase tracking-widest">
              Total Baris di Hadoop
            </span>
          </div>

          {/* STATS 2: Jalur Terpadat Spark */}
          <div className="bg-card p-6 rounded-[24px] shadow-sm border border-border/10 flex flex-col justify-center min-h-[140px]">
            <span className="text-xs font-semibold text-muted mb-1.5 block">Jalur Terpadat (PySpark)</span>
            <p className="text-3xl font-black text-red-500 truncate capitalize">
              Jalur {results.peak_lane || 'N/A'}
            </p>
            <span className="text-[10px] font-bold mt-3 text-slate-400 uppercase tracking-widest">
              Beban Rata-rata Tertinggi
            </span>
          </div>

          {/* STATS 3: Rata-rata Kendaraan per Jalur */}
          <div className="bg-card p-6 rounded-[24px] shadow-sm border border-border/10 flex flex-col justify-center min-h-[140px]">
            <span className="text-xs font-semibold text-muted mb-3 block font-bold">Rata-rata Volume (Spark)</span>
            <div className="space-y-2">
              {Object.entries(results.avg_vehicles || {}).map(([lane, val]) => (
                <div key={lane} className="flex justify-between items-center text-xs">
                  <span className="capitalize font-semibold text-slate-500">{lane}</span>
                  <span className="font-extrabold text-foreground">{val} unit/mnt</span>
                </div>
              ))}
            </div>
          </div>

          {/* LARGE CARD: AI Traffic Recommendation (Span 3 Columns) - Dark Theme Premium */}
          {results.ai_recommendation && (
            <div className="md:col-span-3 bg-slate-900 text-white border border-slate-800 rounded-[28px] p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row gap-6 items-start md:items-center shadow-lg shadow-slate-950/20">
              {/* Glowing decorative left border */}
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue-500 rounded-l-full shadow-[0_0_12px_#3b82f6]" />
              
              {/* Subtle background glow */}
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="w-12 h-12 rounded-2xl bg-blue-950/50 border border-blue-900/40 flex items-center justify-center text-blue-400 shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>

              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                  <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">
                    Rekomendasi Optimasi Lampu - Groq AI
                  </h4>
                  <span className="text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    Aktif
                  </span>
                </div>
                <p className="text-slate-100 text-sm sm:text-base font-semibold leading-relaxed italic">
                  "{results.ai_recommendation}"
                </p>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
