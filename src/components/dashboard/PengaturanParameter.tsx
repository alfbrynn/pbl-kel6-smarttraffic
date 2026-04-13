import { useState } from "react";

export default function PengaturanParameter() {
  const [jarakKepadatan, setJarakKepadatan] = useState("");
  const [durasiLampu, setDurasiLampu] = useState("");

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900">Pengaturan Parameter</div>
          <div className="text-xs text-gray-400 mt-0.5">Konfigurasi ambang batas sensor dan waktu siklus</div>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Batas Jarak Kepadatan */}
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-2">
            Batas Jarak Kepadatan (cm)
          </label>
          <div className="relative flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-gray-400 transition">
            <input
              type="number"
              value={jarakKepadatan}
              onChange={(e) => setJarakKepadatan(e.target.value)}
              placeholder="Contoh: 150"
              className="flex-1 px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none bg-white"
            />
            <span className="bg-gray-900 text-white text-[10px] font-bold px-3 py-3 shrink-0 tracking-wider">
              CM
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5 italic">
            Jarak minimum kendaraan terdeteksi padat oleh sensor ultrasonik.
          </p>
        </div>

        {/* Durasi Lampu Hijau */}
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-2">
            Durasi Lampu Hijau Maksimal (detik)
          </label>
          <div className="relative flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-gray-400 transition">
            <input
              type="number"
              value={durasiLampu}
              onChange={(e) => setDurasiLampu(e.target.value)}
              placeholder="Contoh: 60"
              className="flex-1 px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none bg-white"
            />
            <span className="bg-gray-900 text-white text-[10px] font-bold px-3 py-3 shrink-0 tracking-wider">
              DET
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5 italic">
            Waktu maksimal fase hijau untuk menghindari antrian panjang di jalur lain.
          </p>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
          Simpan Pengaturan
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
