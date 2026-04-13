const jalurs = [
  { label: "Jalur Utara", icon: "↑" },
  { label: "Jalur Selatan", icon: "↓" },
  { label: "Jalur Timur", icon: "→" },
  { label: "Jalur Barat", icon: "←" },
];

export default function KendaliDarurat() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <div>
            <div className="text-base font-bold text-gray-900">Kendali Darurat</div>
            <div className="text-xs text-orange-400 font-medium">
              Otomasi Override Prioritas (Ambulans/Pemadam)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-red-500 tracking-widest uppercase">
            Siaga Kendali Manual
          </span>
        </div>
      </div>

      {/* Direction buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {jalurs.map((jalur) => (
          <button
            key={jalur.label}
            className="flex flex-col items-center gap-2 border border-gray-200 rounded-xl py-5 px-3 hover:border-orange-300 hover:bg-orange-50 transition-all group"
          >
            <span className="text-xl text-gray-400 group-hover:text-orange-400 transition-colors">
              {jalur.icon}
            </span>
            <span className="text-xs text-gray-600 font-medium">{jalur.label}</span>
            <span className="text-[10px] font-bold text-orange-400 tracking-widest uppercase">
              Paksa Hijau Darurat
            </span>
          </button>
        ))}
      </div>

      {/* Warning note */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
