const sensors = [
  { id: "U", pos: "top-[12%] left-1/2 -translate-x-1/2", status: "online" },
  { id: "S", pos: "bottom-[12%] left-1/2 -translate-x-1/2", status: "online" },
  { id: "B", pos: "left-[14%] top-1/2 -translate-y-1/2", status: "online" },
  { id: "T", pos: "right-[14%] top-1/2 -translate-y-1/2", status: "warning" },
];

const statusColor: Record<string, string> = {
  online: "bg-green-400",
  warning: "bg-yellow-400",
  offline: "bg-red-400",
};

export default function ProfilLokasi() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex gap-6">
      {/* Left — info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
            Identity Panel
          </div>
          {/* Status badge */}
          <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Aktif
          </span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-6">Profil Lokasi</h2>

        <div className="flex gap-10 flex-wrap">
          <div>
            <div className="text-[11px] text-gray-400 mb-1">Nama Persimpangan</div>
            <div className="text-sm font-bold text-gray-900">Simpang Polinema</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 mb-1">Koordinat GPS</div>
            <div className="text-sm font-bold text-gray-900 leading-snug">
              –7.9468 ,<br />112.6157
            </div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 mb-1">Jam Operasional</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-sm font-bold text-gray-900">24 Jam</span>
            </div>
          </div>
        </div>

        {/* Sensor summary */}
        <div className="flex gap-3 mt-6">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-400" />3 Online
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />1 Warning
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-red-400" />0 Offline
          </div>
        </div>
      </div>

      {/* Right — sensor map */}
      <div className="w-[200px] shrink-0">
        <div className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-2 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Skema Tata Letak Sensor
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg relative h-[150px] overflow-hidden">
          <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[8px] text-gray-400 font-medium tracking-wider z-20">UTARA</span>
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] text-gray-400 font-medium tracking-wider z-20">SELATAN</span>
          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[8px] text-gray-400 font-medium tracking-wider z-20">BARAT</span>
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] text-gray-400 font-medium tracking-wider z-20">TIMUR</span>

          <div className="absolute left-1/2 top-0 bottom-0 w-7 -translate-x-1/2 bg-gray-200" />
          <div className="absolute top-1/2 left-0 right-0 h-7 -translate-y-1/2 bg-gray-200" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-gray-300 z-10" />

          {sensors.map((s) => (
            <div
              key={s.id}
              className={`absolute ${s.pos} w-3.5 h-3.5 rounded-full z-10 ${statusColor[s.status]} ring-2 ring-white`}
              title={`Sensor ${s.id} — ${s.status}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
