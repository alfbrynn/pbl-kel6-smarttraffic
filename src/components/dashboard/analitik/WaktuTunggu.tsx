"use client";
import { useState } from "react";

const W = 600;
const H = 200;
const PAD_L = 40;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 30;

const chartW = W - PAD_L - PAD_R;
const chartH = H - PAD_T - PAD_B;

const data = [15,12,10,8,10,18,35,65,80,70,55,50,52,48,55,70,90,142,110,80,60,45,35,28];
const maxVal = 160;

// Peak at index 17 (value 142)
const PEAK_IDX = 17;

function toX(i: number) {
  return PAD_L + (i / (data.length - 1)) * chartW;
}
function toY(v: number) {
  return PAD_T + chartH - (v / maxVal) * chartH;
}

function buildPath(): string {
  return data.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");
}

function buildArea(): string {
  const line = data.map((v, i) => `${toX(i)},${toY(v)}`).join(" L");
  const bottom = `${toX(data.length - 1)},${PAD_T + chartH} L${toX(0)},${PAD_T + chartH}`;
  return `M${line} L${bottom} Z`;
}

const xLabels = [0, 4, 8, 12, 16, 20, 23];

export default function WaktuTunggu() {
  const [active, setActive] = useState<"hari-ini" | "kemarin">("hari-ini");

  const peakX = toX(PEAK_IDX);
  const peakY = toY(data[PEAK_IDX]);

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">
            WAKTU TUNGGU
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Rata-rata Waktu Tunggu Kendaraan</h2>
        </div>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActive("hari-ini")}
            className={`px-3 py-1.5 transition-colors ${
              active === "hari-ini" ? "bg-gray-900 text-white" : "bg-white text-gray-400 hover:bg-gray-50"
            }`}
          >
            HARI INI
          </button>
          <button
            onClick={() => setActive("kemarin")}
            className={`px-3 py-1.5 transition-colors ${
              active === "kemarin" ? "bg-gray-900 text-white" : "bg-white text-gray-400 hover:bg-gray-50"
            }`}
          >
            KEMARIN
          </button>
        </div>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b7280" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6b7280" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[40, 80, 120, 160].map((v) => {
          const y = PAD_T + chartH - (v / maxVal) * chartH;
          return (
            <g key={v}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#f3f4f6" strokeWidth={1} />
              <text x={PAD_L - 5} y={y + 4} textAnchor="end" fontSize={9} fill="#d1d5db">{v}s</text>
            </g>
          );
        })}

        {/* Baseline */}
        <line x1={PAD_L} y1={PAD_T + chartH} x2={W - PAD_R} y2={PAD_T + chartH} stroke="#e5e7eb" strokeWidth={1} />

        {/* X labels */}
        {xLabels.map((h) => {
          const idx = h === 23 ? data.length - 1 : Math.round((h / 23) * (data.length - 1));
          const x = toX(idx);
          return (
            <text key={h} x={x} y={H - 6} textAnchor="middle" fontSize={9} fill="#9ca3af">
              {`${String(h).padStart(2, "0")}:00`}
            </text>
          );
        })}

        {/* Area fill */}
        <path d={buildArea()} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={buildPath()} fill="none" stroke="#374151" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* Peak dot */}
        <circle cx={peakX} cy={peakY} r={4} fill="#374151" />

        {/* Tooltip */}
        <g>
          <rect
            x={peakX - 38}
            y={peakY - 32}
            width={76}
            height={22}
            rx={5}
            fill="#1f2937"
          />
          <text x={peakX} y={peakY - 17} textAnchor="middle" fontSize={10} fill="white" fontWeight="600">
            16:45 : 142s
          </text>
          {/* Tooltip arrow */}
          <polygon
            points={`${peakX - 5},${peakY - 10} ${peakX + 5},${peakY - 10} ${peakX},${peakY - 4}`}
            fill="#1f2937"
          />
        </g>
      </svg>
    </div>
  );
}
