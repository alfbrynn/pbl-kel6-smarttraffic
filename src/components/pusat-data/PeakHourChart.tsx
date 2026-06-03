"use client";

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface HourlyData {
  hourStr: string;
  avgVehicles: number;
  hourVal: number;
}

export default function PeakHourChart() {
  const [data, setData] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [peakHourStr, setPeakHourStr] = useState<string>('Memuat...');
  const [peakHourAvg, setPeakHourAvg] = useState<number>(0);

  useEffect(() => {
    // Ambil 300 data log sensor terbaru untuk analisis
    const q = query(
      collection(db, 'kepadatan_jalan'),
      orderBy('waktu', 'desc'),
      limit(300)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hourGroups: Record<number, { hour: number; totalVehicles: number; count: number }> = {};

      // Inisialisasi 24 jam
      for (let h = 0; h < 24; h++) {
        hourGroups[h] = { hour: h, totalVehicles: 0, count: 0 };
      }

      snapshot.forEach((doc) => {
        const docData = doc.data();
        let date: Date | null = null;
        if (docData.timestamp_ms) {
          date = new Date(docData.timestamp_ms);
        } else if (docData.waktu && typeof docData.waktu.toDate === 'function') {
          date = docData.waktu.toDate();
        } else if (docData.waktu && docData.waktu.seconds) {
          date = new Date(docData.waktu.seconds * 1000);
        }

        if (date) {
          const hr = date.getHours();
          hourGroups[hr].totalVehicles += docData.jumlah_kendaraan || 0;
          hourGroups[hr].count += 1;
        }
      });

      // Cari Jam Sibuk Utama (Beban Tertinggi)
      let maxAvg = 0;
      let busiestHour = -1;

      const formattedData: HourlyData[] = Object.values(hourGroups).map((g) => {
        const avg = g.count > 0 ? Number((g.totalVehicles / g.count).toFixed(1)) : 0;
        if (avg > maxAvg) {
          maxAvg = avg;
          busiestHour = g.hour;
        }
        return {
          hourStr: `${String(g.hour).padStart(2, '0')}:00`,
          avgVehicles: avg,
          hourVal: g.hour
        };
      });

      // Filter hanya untuk menampilkan rentang waktu produktif lalu lintas (06:00 - 22:00) agar grafik informatif
      // atau jam-jam yang memiliki data riil
      const activeData = formattedData.filter(item => item.hourVal >= 6 && item.hourVal <= 22);

      setData(activeData);
      setPeakHourAvg(maxAvg);

      if (busiestHour !== -1 && maxAvg > 0) {
        const nextHour = (busiestHour + 1) % 24;
        setPeakHourStr(`Pukul ${String(busiestHour).padStart(2, '0')}:00 - ${String(nextHour).padStart(2, '0')}:00`);
      } else {
        setPeakHourStr("Tidak ada aktivitas antrean");
      }

      setLoading(false);
    }, (error) => {
      console.error("Error loading peak hours data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="h-full flex flex-col bg-card p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300 border border-border/10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-foreground">Jam Sibuk Utama</h3>
          <p className="text-xs text-muted font-semibold mt-1">Rata-rata kendaraan per jam</p>
        </div>
        {peakHourAvg > 0 && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-2xl px-4 py-2 flex flex-col items-start w-fit">
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Jam Sibuk</span>
            <span className="text-sm font-black text-foreground">{peakHourStr}</span>
            <span className="text-[9px] font-semibold text-muted">Rata-rata: {peakHourAvg} Unit</span>
          </div>
        )}
      </div>

      <div className="flex-1 w-full h-[220px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-border rounded-2xl bg-card/50">
            <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            <span className="ml-3 text-sm text-muted font-bold tracking-wide">Menganalisis Pola Lalu Lintas...</span>
          </div>
        ) : data.length === 0 || peakHourAvg === 0 ? (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-border rounded-2xl bg-card/50">
            <p className="text-muted text-sm italic">Belum ada data historis yang terkumpul.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis
                dataKey="hourStr"
                stroke="#64748B"
                fontSize={9}
                fontWeight="semibold"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748B"
                fontSize={9}
                fontWeight="semibold"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: 'var(--foreground)',
                }}
                labelStyle={{ fontWeight: 'bold' }}
                itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                cursor={{ fill: '#334155', opacity: 0.15 }}
              />
              <Bar dataKey="avgVehicles" name="Rata-rata Kendaraan">
                {data.map((entry, index) => {
                  // Warnai bar tertinggi dengan warna merah menyala, lainnya dengan warna default primer (yellow/blue)
                  const isMax = entry.avgVehicles === peakHourAvg;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isMax ? '#EF4444' : 'var(--primary)'}
                      opacity={isMax ? 1 : 0.8}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
