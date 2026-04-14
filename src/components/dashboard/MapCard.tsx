export default function MapCard() {
    return (
        <div className="grid grid-cols-[2fr_1fr] gap-6">
            {/* MAP CARD */}
            <div className="bg-bg-card rounded-custom shadow-[0_1px_3px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden">
                <div className="px-6 py-5 flex justify-between items-center border-b border-border-color">
                    <h3 className="text-[15px] font-semibold text-text-main">Peta Lokasi Persimpangan</h3>
                    <span className="text-[12px] text-text-secondary font-semibold flex items-center gap-1 cursor-pointer uppercase hover:text-text-main">
                        PERBESAR
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                    </span>
                </div>
                <div className="w-full h-[250px] bg-[#e2e8f0] relative">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src="https://www.openstreetmap.org/export/embed.html?bbox=112.61,-7.95,112.62,-7.94&layer=mapnik"
                        style={{ border: 0 }}>
                    </iframe>
                    <div className="absolute top-4 left-4 bg-bg-card shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] p-[10px_14px] rounded-custom">
                        <div className="text-[10px] font-semibold text-text-secondary">KOORDINAT PUSAT</div>
                        <div className="text-[12px] font-bold mt-1 text-text-main">-6.2088° S, 106.8456° E</div>
                    </div>
                </div>
            </div>
        </div>
    )
}