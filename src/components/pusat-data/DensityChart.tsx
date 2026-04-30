import React, { useEffect, useState } from 'react';
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

export default function DensityChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('Terbaru');

  useEffect(() => {
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
    <div className="h-full flex flex-col bg-bg-card p-6 rounded-xl shadow-sm border border-border-color">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h3 className="text-lg font-semibold text-text-main">Pola Kepadatan Lalu Lintas</h3>
           <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-1">
             Tampilan: {timeRange}
           </p>
        </div>
        <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-bg-hover border border-border-color text-sm text-text-secondary rounded px-3 py-1.5 focus:outline-none focus:border-accent-cyan cursor-pointer hover:border-accent-cyan/50 transition-colors"
        >
          <option value="Terbaru">Terbaru (Real-time)</option>
          <option value="Hari Ini">Hari Ini</option>
          <option value="Minggu Ini">Minggu Ini</option>
        </select>
      </div>

      {/* Area Render Grafik */}
      <div className="flex-1 w-full min-h-[250px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-border-color rounded-lg bg-bg-card/50">
            <span className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin"></span>
            <span className="ml-3 text-sm text-text-secondary font-medium tracking-wide">Menyesuaikan Data...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-border-color rounded-lg bg-bg-card/50">
             <div className="text-center">
                <p className="text-text-secondary text-sm italic">Belum ada data untuk periode ini</p>
                <button 
                  onClick={() => setTimeRange('Terbaru')}
                  className="text-accent-cyan text-[11px] mt-2 underline font-bold"
                >
                  Kembali ke tampilan real-time
                </button>
             </div>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} opacity={0.5} />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280" 
                fontSize={10} 
                tickMargin={10} 
                axisLine={false} 
                tickLine={false}
                minTickGap={20}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
                tickMargin={10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#131314', borderColor: '#2a2a2a', borderRadius: '8px', fontSize: '12px' }}
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
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}