import { useState } from "react";

const jalurs = [
  { label: "Jalur Utara", icon: "↑", key: "utara" },
  { label: "Jalur Selatan", icon: "↓", key: "selatan" },
  { label: "Jalur Timur", icon: "→", key: "timur" },
  { label: "Jalur Barat", icon: "←", key: "barat" },
];

export default function KendaliDarurat() {
  const [active, setActive] = useState<string | null>(null);

  const handlePress = (key: string) => {
    setActive(key);
    setTimeout(() => setActive(null), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
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

      {/* Active override banner */}
      {active && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
          <span className="text-xs font-semibold text-green-700">
            Override aktif: {jalurs.find(j => j.key === active)?.label} — Fase hijau dipaksakan
          </span>
        </div>
      )}

      {/* Direction buttons */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {jalurs.map((jalur) => {
          const isActive = active === jalur.key;
          return (
            <button
              key={jalur.key}
              onClick={() => handlePress(jalur.key)}
              className={`flex flex-col items-center gap-2 border rounded-xl py-5 px-3 transition-all ${
                isActive
                  ? "border-green-400 bg-green-50 shadow-sm"
                  : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
              }`}
            >
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                isActive ? "border-green-400 bg-green-100" : "border-gray-200"
              }`}>
                <span className={`text-sm transition-colors ${isActive ? "text-green-600" : "text-gray-500"}`}>
                  {jalur.icon}
                </span>
              </div>
              <span className="text-xs text-gray-600 font-medium">{jalur.label}</span>
              <span className={`text-[9px] font-bold tracking-widest uppercase text-center leading-tight transition-colors ${
                isActive ? "text-green-600" : "text-orange-400"
              }`}>
                {isActive ? "Aktif ✓" : "Paksa Hijau Darurat"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Warning note */}
      <div className="flex items-start gap-3 bg-gray-50 border-l-4 border-gray-300 px-4 py-3 rounded-r-lg">
        <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
