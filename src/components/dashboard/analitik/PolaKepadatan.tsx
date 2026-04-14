const W = 800;
const H = 300;
const PAD_L = 50;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 40;

const chartW = W - PAD_L - PAD_R;
const chartH = H - PAD_T - PAD_B;

const lines = [
  {
    label: "Jalur Utara",
    color: "#1f2937",
    data: [10,8,7,6,8,15,35,65,75,60,45,40,42,38,45,55,70,78,65,50,40,35,30,28],
  },
  {
    label: "Jalur Selatan",
    color: "#10b981",
    data: [8,7,6,5,7,20,40,70,85,65,50,45,48,42,50,60,75,82,70,55,42,38,32,25],
  },
  {
    label: "Jalur Timur",
    color: "#f59e0b",
    data: [12,10,8,7,10,18,30,55,65,55,42,38,40,35,42,52,62,68,58,45,38,32,28,22],
  },
  {
    label: "Jalur Barat",
    color: "#ef4444",
    data: [9,8,7,6,9,16,32,60,70,58,44,40,43,38,46,56,68,72,62,48,40,34,29,24],
  },
];

function toPoints(data: number[]): string {
  return data
    .map((v, i) => {
      const x = PAD_L + (i / 23) * chartW;
      const y = PAD_T + chartH - (v / 100) * chartH;
      return `${x},${y}`;
    })
    .join(" ");
}

const xLabels = [0, 3, 6, 9, 12, 15, 18, 21, 23];
const yGridLines = [25, 50, 75, 100];

export default function PolaKepadatan() {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">
            ANALITIK LALU LINTAS
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Pola Kepadatan Mingguan</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase mr-1">RENDAH</span>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {lines.map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <span
                  className="inline-block w-5 h-0.5 rounded"
                  style={{ backgroundColor: l.color }}
                />
                <span className="text-[10px] text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
          <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase ml-1">TINGGI</span>
        </div>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
        {/* Grid lines */}
        {yGridLines.map((v) => {
          const y = PAD_T + chartH - (v / 100) * chartH;
          return (
            <g key={v}>
              <line
                x1={PAD_L} y1={y} x2={W - PAD_R} y2={y}
                stroke="#f3f4f6" strokeWidth={1}
              />
              <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#9ca3af">
                {v}
              </text>
            </g>
          );
        })}
        {/* y=0 label */}
        <text x={PAD_L - 6} y={PAD_T + chartH + 4} textAnchor="end" fontSize={10} fill="#9ca3af">0</text>

        {/* X-axis labels */}
        {xLabels.map((h) => {
          const x = PAD_L + (h / 23) * chartW;
          const label = `${String(h).padStart(2, "0")}:00`;
          return (
            <text key={h} x={x} y={H - 8} textAnchor="middle" fontSize={10} fill="#9ca3af">
              {label}
            </text>
          );
        })}

        {/* Baseline */}
        <line
          x1={PAD_L} y1={PAD_T + chartH} x2={W - PAD_R} y2={PAD_T + chartH}
          stroke="#e5e7eb" strokeWidth={1}
        />

        {/* Lines */}
        {lines.map((l) => (
          <polyline
            key={l.label}
            points={toPoints(l.data)}
            fill="none"
            stroke={l.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}
