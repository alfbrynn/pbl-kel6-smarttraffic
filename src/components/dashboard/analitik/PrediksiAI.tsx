export default function PrediksiAI() {
  return (
    <div className="bg-[#0f1f35] rounded-xl p-4 flex items-center justify-between border border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-0.5">
            PREDIKSI KEPADATAN AI
          </div>
          <p className="text-sm text-white/90">
            &ldquo;Berdasarkan data historis, Jalur Selatan berpotensi padat pada{" "}
            <span className="font-bold text-white">16:00 WIB</span>&rdquo;
          </p>
        </div>
      </div>
      <button className="shrink-0 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors ml-6">
        Detail Analisis
      </button>
    </div>
  );
}
