"use client";
import React, { useEffect, useRef, useState } from 'react';

const lines = [
  {
    label: "Jalur Utara",
    color: "#1e293b",
    dot: "#1e293b",
    path: "M50 250 L150 230 L250 210 L350 100 L450 150 L550 200 L650 90 L750 160 L800 180",
    peakCx: 650, peakCy: 90,
  },
  {
    label: "Jalur Selatan",
    color: "#10b981",
    dot: "#10b981",
    path: "M50 260 L150 250 L250 200 L350 80 L450 160 L550 180 L650 130 L750 200 L800 240",
    peakCx: 350, peakCy: 80,
  },
  {
    label: "Jalur Timur",
    color: "#f59e0b",
    dot: "#f59e0b",
    path: "M50 270 L150 260 L250 240 L350 140 L450 200 L550 230 L650 120 L750 230 L800 250",
    peakCx: 650, peakCy: 120,
  },
  {
    label: "Jalur Barat",
    color: "#ef4444",
    dot: "#ef4444",
    path: "M50 265 L150 240 L250 160 L350 110 L450 155 L550 140 L650 100 L750 200 L800 230",
    peakCx: 650, peakCy: 100,
  },
];

export default function MainChartCard() {
  const [visible, setVisible] = useState(false);
  const [lengths, setLengths] = useState<number[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hitung panjang path setelah mount
  useEffect(() => {
    const lens = pathRefs.current.map((p) => p?.getTotalLength() ?? 800);
    setLengths(lens);
  }, []);

  // Trigger saat masuk viewport
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-bg-card rounded-custom p-6 shadow-[0_1px_3px_rgba(0,0,0,0.2)]" ref={containerRef}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[18px] font-bold text-text-main m-0">Pola Kepadatan Mingguan</h2>
          <p className="text-[13px] text-text-secondary mt-1">Distribusi intensitas volume kendaraan per jam</p>
        </div>
        <div className="inline-flex items-center bg-bg-card-alt px-4 py-1.5 rounded-[20px] text-[10px] font-bold text-text-secondary tracking-[0.5px] gap-2.5">
          RENDAH
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 bg-[#e2e8f0] rounded-[2px]" />
            <div className="w-2.5 h-2.5 bg-[#cbd5e1] rounded-[2px]" />
            <div className="w-2.5 h-2.5 bg-[#ef4444] rounded-[2px]" />
          </div>
          TINGGI
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-6">
        {lines.map((l) => (
          <div key={l.label} className="flex items-center gap-2 text-[12px] text-text-secondary font-medium">
            <div className="w-6 h-[2.5px] rounded-full" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] relative">
        <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
          <defs>
            {lines.map((l, i) => (
              <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={l.color} stopOpacity="0.12" />
                <stop offset="100%" stopColor={l.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines */}
          {[40, 100, 160, 220, 280].map((y) => (
            <line key={y} x1="50" y1={y} x2="800" y2={y}
              stroke={y === 40 || y === 280 ? "#f1f5f9" : "#e2e8f0"}
              strokeWidth="1"
              strokeDasharray={y === 40 || y === 280 ? "0" : "4 4"}
            />
          ))}

          {/* Y labels */}
          {[["100%", 44], ["75%", 104], ["50%", 164], ["25%", 224], ["0%", 280]].map(([label, y]) => (
            <text key={y} x="40" y={y} fontSize="10" fill="#94a3b8" textAnchor="end">{label}</text>
          ))}

          {/* X labels */}
          {[["00:00", 50], ["06:00", 200], ["12:00", 425], ["18:00", 650], ["23:00", 800]].map(([label, x]) => (
            <text key={x} x={x} y="295" fontSize="10" fill="#94a3b8" textAnchor="middle">{label}</text>
          ))}

          {/* Lines — draw animation via strokeDashoffset */}
          {lines.map((l, i) => {
            const len = lengths[i] ?? 800;
            return (
              <path
                key={i}
                ref={(el) => { pathRefs.current[i] = el; }}
                d={l.path}
                fill="none"
                stroke={l.color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{
                  strokeDasharray: len,
                  strokeDashoffset: visible ? 0 : len,
                  transition: `stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 150}ms`,
                }}
              />
            );
          })}

          {/* Peak dots — fade in setelah line selesai */}
          {lines.map((l, i) => (
            <circle
              key={i}
              cx={l.peakCx}
              cy={l.peakCy}
              r="4"
              fill={l.dot}
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 0.3s ease-out ${i * 150 + 1000}ms`,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
