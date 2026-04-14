export default function StatCards() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Card 1 – Efisiensi Rata-rata (white) */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">
            EFISIENSI RATA-RATA
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-gray-900 leading-none">84.2%</span>
            <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full mb-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
              +12%
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
          Peningkatan arus lalu lintas dibandingkan pekan lalu.
        </p>
      </div>

      {/* Card 2 – Total Kendaraan (dark) */}
      <div className="bg-[#0f1f35] rounded-xl p-5 flex-1 flex flex-col justify-between border border-white/5">
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-3">
            TOTAL KENDARAAN TERDETEKSI
          </div>
          <span className="text-4xl font-black text-white leading-none">42,891</span>
        </div>
        <div className="mt-4">
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: "68%" }} />
          </div>
          <p className="text-[10px] text-white/30 mt-2">68% dari kapasitas maksimal.</p>
        </div>
      </div>
    </div>
  );
}
