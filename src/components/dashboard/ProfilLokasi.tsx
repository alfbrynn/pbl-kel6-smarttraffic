export default function ProfilLokasi() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-6">
      {/* Left — info */}
      <div className="flex-1">
        <div className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">
          Identity Panel
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">Profil Lokasi</h2>

        <div className="flex gap-10">
          <div>
            <div className="text-xs text-gray-400 mb-1">Nama Persimpangan</div>
            <div className="text-base font-bold text-gray-900">Simpang Polinema</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Koordinat GPS</div>
            <div className="text-base font-bold text-gray-900 leading-snug">
              –7.9468 ,<br />112.6157
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Jam Operasional</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              <span className="text-base font-bold text-gray-900">24 Jam</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right — sensor map */}
      <div className="w-[220px] shrink-0">
        <div className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-2 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Skema Tata Letak Sensor
        </div>

        {/* Intersection diagram */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 relative h-[160px]">
          {/* Direction labels */}
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-gray-400">UTARA</span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-gray-400">SELATAN</span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">BARAT</span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">TIMUR</span>

          {/* Roads */}
          <div className="absolute left-1/2 top-0 bottom-0 w-6 -translate-x-1/2 bg-gray-200 rounded" />
          <div className="absolute top-1/2 left-0 right-0 h-6 -translate-y-1/2 bg-gray-200 rounded" />

          {/* Center circle */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-gray-300" />

          {/* Sensor dots */}
          <div className="absolute left-1/2 top-[18%] -translate-x-1/2 w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-300" />
          <div className="absolute left-1/2 bottom-[18%] -translate-x-1/2 w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-300" />
          <div className="absolute left-[22%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-300" />
          <div className="absolute right-[22%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-300" />
        </div>
      </div>
    </div>
  );
}
