"use client";
import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";

interface SensorData {
  id: string;
  jalur: string;
  sensorId: string;
  jarakAntrean: number;
  status: "Padat" | "Sedang" | "Lancar" | "Menunggu";
  lampu: "merah" | "kuning" | "hijau";
}

const defaultSensors: SensorData[] = [
  { id: "utara",   jalur: "Jalur Utara",   sensorId: "SN-UTARA-01",   jarakAntrean: 0, status: "Menunggu", lampu: "merah" },
  { id: "selatan", jalur: "Jalur Selatan", sensorId: "SN-SELATAN-02", jarakAntrean: 0, status: "Menunggu", lampu: "merah" },
  { id: "timur",   jalur: "Jalur Timur",   sensorId: "SN-TIMUR-03",   jarakAntrean: 0, status: "Menunggu", lampu: "merah" },
  { id: "barat",   jalur: "Jalur Barat",   sensorId: "SN-BARAT-04",   jarakAntrean: 0, status: "Menunggu", lampu: "merah" },
];

function statusColor(status: SensorData["status"]) {
  switch (status) {
    case "Padat":    return "bg-red-100 text-red-600";
    case "Sedang":   return "bg-yellow-100 text-yellow-600";
    case "Lancar":   return "bg-green-100 text-green-600";
    default:         return "bg-gray-100 text-gray-500";
  }
}

function TrafficLight({ lampu }: { lampu: SensorData["lampu"] }) {
  return (
    <div className="w-12 h-[72px] bg-[#1a2535] rounded-xl flex flex-col items-center justify-around py-2 px-1.5">
      <div className={`w-7 h-7 rounded-full ${lampu === "merah"  ? "bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]"  : "bg-red-900/40"}`} />
      <div className={`w-7 h-7 rounded-full ${lampu === "kuning" ? "bg-yellow-400 shadow-[0_0_8px_2px_rgba(250,204,21,0.6)]" : "bg-yellow-900/40"}`} />
      <div className={`w-7 h-7 rounded-full ${lampu === "hijau"  ? "bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]"  : "bg-green-900/40"}`} />
    </div>
  );
}

export default function BerandaContent() {
  const [sensors, setSensors] = useState<SensorData[]>(defaultSensors);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "sensors"), (snap) => {
      if (snap.empty) return;
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SensorData));
      setSensors(data.length === 4 ? data : defaultSensors.map((d) => {
        const found = data.find((x) => x.id === d.id);
        return found ?? d;
      }));
    });
    return () => unsub();
  }, []);

  const aktivCount  = sensors.filter((s) => s.status !== "Menunggu").length;
  const rataAntrean = sensors.reduce((a, s) => a + s.jarakAntrean, 0) / sensors.length;
  const statusUtama = sensors.find((s) => s.status === "Padat")?.status
    ?? sensors.find((s) => s.status === "Sedang")?.status
    ?? "Menunggu";

  return (
    <div className="flex flex-col gap-4">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Status Kepadatan */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">STATUS KEPADATAN</div>
            <div className={`text-xl font-black ${statusUtama === "Padat" ? "text-red-500" : statusUtama === "Sedang" ? "text-yellow-500" : "text-gray-400"}`}>
              {statusUtama}
            </div>
          </div>
          <div className="w-11 h-11 rounded-full bg-yellow-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Rata-rata Antrean */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">RATA-RATA ANTREAN</div>
            <div className="flex items-end gap-1">
              <span className="text-xl font-black text-gray-900">{rataAntrean.toFixed(0)}</span>
              <span className="text-xs text-gray-400 mb-0.5">CM</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        {/* Sensor Aktif */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">SENSOR AKTIF</div>
            <div className="text-xl font-black text-gray-900">{aktivCount} / 4</div>
          </div>
          <div className="w-11 h-11 rounded-full bg-yellow-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Monitoring header ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800">Monitoring Persimpangan Utama</h2>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live Update
        </div>
      </div>

      {/* ── Sensor cards grid ── */}
      <div className="grid grid-cols-2 gap-4">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="bg-white rounded-xl border border-gray-100 p-5">
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-bold text-gray-900">{sensor.jalur}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">ID Sensor: {sensor.sensorId}</div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColor(sensor.status)}`}>
                {sensor.status}
              </span>
            </div>

            {/* Traffic light + data */}
            <div className="flex items-center gap-5">
              <TrafficLight lampu={sensor.lampu} />
              <div className="flex-1">
                <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                  JARAK ANTREAN
                </div>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-3xl font-black text-gray-900 leading-none">{sensor.jarakAntrean}</span>
                  <span className="text-xs text-gray-400 mb-0.5">CM</span>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sensor.jarakAntrean > 150 ? "bg-red-400" :
                      sensor.jarakAntrean > 80  ? "bg-yellow-400" : "bg-green-400"
                    }`}
                    style={{ width: `${Math.min((sensor.jarakAntrean / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
