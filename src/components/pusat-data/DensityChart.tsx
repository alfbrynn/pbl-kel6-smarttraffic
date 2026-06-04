import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  time: string;
  kendaraan: number;
}

interface DensityChartProps {
  showDropdown?: boolean;
}

export default function DensityChart({ showDropdown = true }: DensityChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('Terbaru');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setLoading(true);

    // Menghitung filter waktu
    const now = new Date();
    let startTime = 0;

    if (timeRange === 'Hari Ini') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startTime = startOfDay.getTime();
    } else if (timeRange === 'Minggu Ini') {
      const startOfWeek = new Date(now.setDate(now.getDate() - 7));
      startTime = startOfWeek.getTime();
    }

    // Membangun Query Firestore
    let q;
    const colRef = collection(db, 'kepadatan_jalan');

    if (timeRange === 'Terbaru') {
      // Real-time: Ambil 30 data terakhir tanpa batas waktu
      q = query(
        colRef,
        orderBy('timestamp_ms', 'desc'),
        limit(30)
      );
    } else {
      // Filter Berdasarkan Waktu
      q = query(
        colRef,
        where('timestamp_ms', '>=', startTime),
        orderBy('timestamp_ms', 'desc'),
        limit(100) // Batasi agar grafik tidak terlalu padat
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chartData: ChartData[] = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();

        let timeStr = "N/A";
        if (docData.timestamp_ms) {
          const date = new Date(docData.timestamp_ms);

          if (timeRange === 'Terbaru') {
            // Detik untuk view terbaru
            timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          } else if (timeRange === 'Hari Ini') {
            // Jam:Menit untuk view hari ini
            timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          } else {
            // Tgl/Bln untuk view mingguan
            timeStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' });
          }
        }

        chartData.push({
          time: timeStr,
          kendaraan: docData.jumlah_kendaraan || 0,
        });
      });

      // Urutkan dari kiri ke kanan (waktu lama ke baru)
      setData(chartData.reverse());
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chart data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [timeRange]);

  return (
    <div className="h-full flex flex-col bg-card p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300 border border-border/10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-foreground">Pola Kepadatan Lalu Lintas</h3>
          <p className="text-xs text-muted font-semibold mt-1">
            Tampilan: {timeRange}
          </p>
        </div>
        {showDropdown ? (
          <div className="flex items-center">
            <label htmlFor="timeRangeSelect" className="sr-only">Pilih Rentang Waktu</label>
            <select
              id="timeRangeSelect"
              name="timeRangeSelect"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-secondary-light border border-border text-xs font-bold text-muted rounded-xl px-4 py-2 focus:outline-none focus:border-primary cursor-pointer hover:border-primary/50 transition-colors"
            >
              <option value="Terbaru">Terbaru (Real-time)</option>
              <option value="Hari Ini">Hari Ini</option>
              <option value="Minggu Ini">Minggu Ini</option>
            </select>
          </div>

        ) : (
          <Link href="/data-center" className="text-xs font-black text-primary hover:text-primary-hover flex items-center gap-1 transition-colors hover:underline">
            Lihat Selengkapnya
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

        )}
      </div>

      {/* Area Render Grafik */}
      <div className="w-full h-80 mt-4">
        {!isMounted || loading ? (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-border rounded-2xl bg-card/50">
            <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            <span className="ml-3 text-sm text-muted font-bold tracking-wide">Menyesuaikan Data...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-border rounded-2xl bg-card/50">
            <div className="text-center">
              <p className="text-muted text-sm italic">Belum ada data untuk periode ini</p>
              <button
                onClick={() => setTimeRange('Terbaru')}
                className="text-primary text-[11px] mt-2 underline font-extrabold"
              >
                Kembali ke tampilan real-time
              </button>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250} minWidth={0}>
            <AreaChart
              data={data}
              margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorKendaraan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis
                dataKey="time"
                stroke="#64748B"
                fontSize={10}
                fontWeight="semibold"
                tickMargin={10}
                axisLine={false}
                tickLine={false}
                minTickGap={25}
              />
              <YAxis
                stroke="#64748B"
                fontSize={10}
                fontWeight="semibold"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: 'var(--foreground)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}
                itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="kendaraan"
                name="Jumlah Kendaraan"
                stroke="var(--primary)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorKendaraan)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}