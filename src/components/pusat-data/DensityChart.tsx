import React from 'react';

export default function DensityChart() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm lg:col-span-2 min-h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-200">Pola Kepadatan Mingguan</h3>
        <select className="bg-[#0a1628] border border-white/10 text-sm text-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-cyan-500">
          <option>Minggu Ini</option>
          <option>Bulan Ini</option>
        </select>
      </div>

      {/* Area Render Grafik */}
      <div className="flex-1 flex items-center justify-center border border-dashed border-white/20 rounded bg-white/5">
        <p className="text-gray-500 text-sm italic">[ Komponen Grafik Anda Masuk Di Sini ]</p>
      </div>
    </div>
  );
}