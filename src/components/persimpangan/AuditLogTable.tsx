"use client";

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface AuditLog {
  id: string;
  operator: string;
  aksi: string;
  tipe: 'EMERGENCY' | 'PARAMETER' | 'SYSTEM';
  timestamp: any;
}

export default function AuditLogTable() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'audit_logs'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: AuditLog[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as AuditLog);
      });
      setLogs(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching audit logs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getTipeBadge = (tipe: string) => {
    switch (tipe) {
      case 'EMERGENCY':
        return 'bg-red-500/20 text-red-500 border border-red-500/10';
      case 'PARAMETER':
        return 'bg-amber-500/20 text-amber-500 border border-amber-500/10';
      default:
        return 'bg-blue-500/20 text-blue-500 border border-blue-500/10';
    }
  };

  const formatTime = (ts: any) => {
    if (!ts) return '...';
    if (typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    if (ts.seconds) {
      return new Date(ts.seconds * 1000).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    return String(ts);
  };

  return (
    <div className="bg-card border border-border/10 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-muted shadow-sm">
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground leading-tight">Log Audit Aktivitas Operator</h2>
          <p className="text-[11px] text-muted">Riwayat penyesuaian parameter dan override darurat</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-1.5">
          <thead>
            <tr className="text-xs font-semibold text-slate-500">
              <th className="pb-2 px-4">Waktu</th>
              <th className="pb-2 px-4">Operator</th>
              <th className="pb-2 px-4">Tipe Aksi</th>
              <th className="pb-2 px-4">Detail Perubahan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-muted text-xs font-semibold">Memuat log audit...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-muted text-xs font-semibold">Belum ada aktivitas tercatat</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="text-xs text-foreground group">
                  <td className="py-3 px-4 font-mono text-muted rounded-l-xl bg-card/45 border-y border-l border-border/5 group-hover:bg-background transition-colors">
                    {formatTime(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 font-semibold bg-card/45 border-y border-border/5 group-hover:bg-background transition-colors">
                    {log.operator}
                  </td>
                  <td className="py-3 px-4 bg-card/45 border-y border-border/5 group-hover:bg-background transition-colors">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${getTipeBadge(log.tipe)}`}>
                      {log.tipe}
                    </span>
                  </td>
                  <td className="py-3 px-4 rounded-r-xl font-medium text-slate-600 dark:text-slate-400 bg-card/45 border-y border-r border-border/5 group-hover:bg-background transition-colors">
                    {log.aksi}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
