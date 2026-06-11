import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface BigDataJob {
  status: string;
  results?: {
    last_run: string;
    ai_recommendation?: string;
  } | null;
}

export default function AIDashboardBanner() {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const docRef = doc(db, 'system', 'bigdata');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as BigDataJob;
        if (data.status === 'completed' && data.results?.ai_recommendation) {
          const recText = data.results.ai_recommendation;
          const runId = data.results.last_run;
          
          setRecommendation(recText);
          setLastRun(runId);
          
          // Cek apakah user pernah menyembunyikan rekomendasi dengan ID run ini
          const dismissedRun = localStorage.getItem('dismissed_ai_rec');
          if (dismissedRun === runId) {
            setIsDismissed(true);
          } else {
            setIsDismissed(false);
          }
        } else {
          setRecommendation(null);
        }
      }
    }, (error) => {
      console.error("Gagal membaca rekomendasi AI untuk dashboard:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleDismiss = () => {
    if (lastRun) {
      localStorage.setItem('dismissed_ai_rec', lastRun);
      setIsDismissed(true);
    }
  };

  if (!isMounted || isDismissed || !recommendation) return null;

  return (
    <div className="w-full bg-slate-900 text-white border border-slate-800 rounded-[24px] p-5 relative overflow-hidden flex flex-col md:flex-row gap-4 items-start md:items-center shadow-lg shadow-slate-950/20 animate-fade-in mb-6">
      {/* Decorative glowing left border */}
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue-500 rounded-l-full shadow-[0_0_12px_#3b82f6]" />

      {/* Robot icon */}
      <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-900/40 flex items-center justify-center text-blue-400 shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      </div>

      {/* Main Text Content */}
      <div className="flex-1 pr-6 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
            AI Traffic Advisor
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <p className="text-slate-100 text-xs sm:text-sm font-semibold leading-relaxed">
          "{recommendation}"
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors duration-150 p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
        aria-label="Sembunyikan Rekomendasi"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
