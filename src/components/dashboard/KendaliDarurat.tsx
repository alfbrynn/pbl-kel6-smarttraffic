const jalurs = [
  { label: "Jalur Utara", icon: "↑" },
  { label: "Jalur Selatan", icon: "↓" },
  { label: "Jalur Timur", icon: "→" },
  { label: "Jalur Barat", icon: "←" },
];

export default function KendaliDarurat() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            {/* Asterisk / snowflake icon */}
            <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 2h2v4.586l3.293-3.293 1.414 1.414L14.414 8H19v2h-4.586l3.293 3.293-1.414 1.414L13 11.414V16h-2v-4.586l-3.293 3.293-1.414-1.414L9.586 10H5V8h4.586L6.293 4.707l1.414-1.414L11 6.586V2z"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Kendali Darurat</div>
            <div className="text-xs text-orange-400 font-medium mt-0.5">
              Otomasi Override Prioritas (Ambulans/Pemadam)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase">
            Siaga Kendali Manual
          </span>
        </div>
      </div>

      {/* Direction buttons */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {jalurs.map((jalur) => (
          <button
            key={jalur.label}
            className="flex flex-col items-center gap-2 border border-gray-200 rounded-xl py-5 px-3 hover:border-orange-300 hover:bg-orange-50/50 transition-all group"
          >
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-orange-200 transition-colors">
              <span className="text-sm text-gray-500 group-hover:text-orange-400 transition-colors">
                {jalur.icon}
              </span>
            </div>
            <span className="text-xs text-gray-600 font-medium">{jalur.label}</span>
            <span className="text-[9px] font-bold text-orange-400 tracking-widest uppercase text-center leading-tight">
              Paksa Hijau Darurat
            </span>
          </button>
        ))}
      </div>

      {/* Warning note */}
      <div className="flex items-start gap-3 bg-gray-50 border-l-4 border-gray-400 px-4 py-3 rounded-r-lg">
        <svg className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-gray-500 leading-relaxed">
          Peringatan: Menekan tombol paksa hijau akan mereset siklus normal lampu lalu lintas.
          Gunakan hanya saat kendaraan prioritas terdeteksi atau dalam koordinasi dengan petugas lapangan.
        </p>
      </div>
    </div>
  );
}
