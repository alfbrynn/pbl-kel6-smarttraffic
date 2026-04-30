import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
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

export default function DensityChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('Terbaru'); // Mock filter

  useEffect(() => {
    // Mengambil 50 data terbaru dari firestore untuk chart
    const q = query(
      collection(db, 'kepadatan_jalan'),
      orderBy('timestamp_ms', 'desc'),
      limit(30) // Ambil 30 titik data terakhir untuk chart agar tidak terlalu padat
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chartData: ChartData[] = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();
        // Format waktu singkat untuk X-Axis chart (misal: "17:05:56")
        let timeStr = "N/A";
        if (docData.timestamp_ms) {
           const date = new Date(docData.timestamp_ms);
           timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } else if (typeof docData.waktu === 'string') {
           const parts = docData.waktu.split('at');
           if (parts.length > 1) {
             timeStr = parts[1].trim().split(' ')[0];
           } else {
             timeStr = docData.waktu;
           }
        }

        chartData.push({
          time: timeStr || "N/A",
          kendaraan: docData.jumlah_kendaraan || 0,
        });
      });
      // Reverse array agar waktu berjalan dari kiri (lama) ke kanan (baru)
      setData(chartData.reverse());
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chart data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="h-full flex flex-col bg-bg-card p-6 rounded-xl shadow-sm border border-border-color">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text-main">Pola Kepadatan Lalu Lintas</h3>
        <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-bg-hover border border-border-color text-sm text-text-secondary rounded px-3 py-1.5 focus:outline-none focus:border-accent-cyan"
        >
          <option>Terbaru</option>
          <option>Hari Ini</option>
          <option>Minggu Ini</option>
        </select>
      </div>

      {/* Area Render Grafik */}
      <div className="flex-1 w-full min-h-[250px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-border-color rounded-lg bg-bg-card/50">
            <span className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin"></span>
            <span className="ml-3 text-sm text-text-secondary font-medium tracking-wide">Memuat Data Grafik...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-border-color rounded-lg bg-bg-card/50">
             <p className="text-text-secondary text-sm italic">Belum ada data untuk ditampilkan</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorKendaraan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280" 
                fontSize={11} 
                tickMargin={10} 
                axisLine={false} 
                tickLine={false}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={11} 
                axisLine={false} 
                tickLine={false} 
                tickMargin={10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#131314', borderColor: '#2a2a2a', borderRadius: '8px' }}
                itemStyle={{ color: '#06b6d4' }}
              />
              <Area 
                type="monotone" 
                dataKey="kendaraan" 
                name="Jumlah Kendaraan"
                stroke="#06b6d4" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorKendaraan)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}