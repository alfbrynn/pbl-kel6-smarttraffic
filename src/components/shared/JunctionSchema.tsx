import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useSimpangUtama from '@/hooks/useSimpangUtama';

const LiveSchema: React.FC = () => {
    const { dataSimpang, statusKoneksi } = useSimpangUtama();
    const isConnected = statusKoneksi === 'Sinkronisasi Aktif';

    const [isExpanded, setIsExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // State untuk animasi trigger sensor IR (flash/kedip)
    // Depan (D) dekat lampu stopline, Belakang (B) di ujung jalan masuk
    const [flashIRBaratD, setFlashIRBaratD] = useState(false);
    const [flashIRBaratB, setFlashIRBaratB] = useState(false);
    const [flashIRTimurD, setFlashIRTimurD] = useState(false);
    const [flashIRTimurB, setFlashIRTimurB] = useState(false);
    const [flashIRSelatanD, setFlashIRSelatanD] = useState(false);
    const [flashIRSelatanB, setFlashIRSelatanB] = useState(false);

    // Track data lama untuk mendeteksi perubahan/kendaraan lewat
    const [prevMasukBarat, setPrevMasukBarat] = useState(0);
    const [prevLewatBarat, setPrevLewatBarat] = useState(0);
    const [prevMasukTimur, setPrevMasukTimur] = useState(0);
    const [prevLewatTimur, setPrevLewatTimur] = useState(0);
    const [prevMasukSelatan, setPrevMasukSelatan] = useState(0);
    const [prevLewatSelatan, setPrevLewatSelatan] = useState(0);

    const lampuBarat = dataSimpang?.jalur?.barat?.status_lampu ?? 'MERAH';
    const lampuTimur = dataSimpang?.jalur?.timur?.status_lampu ?? 'MERAH';
    const lampuSelatan = dataSimpang?.jalur?.selatan?.status_lampu ?? 'MERAH';

    const jmlBarat = dataSimpang?.jalur?.barat?.jumlah_kendaraan ?? 0;
    const jmlTimur = dataSimpang?.jalur?.timur?.jumlah_kendaraan ?? 0;
    const jmlSelatan = dataSimpang?.jalur?.selatan?.jumlah_kendaraan ?? 0;

    const jarakBarat = dataSimpang?.jalur?.barat?.jarak_cm ?? 0;
    const jarakTimur = dataSimpang?.jalur?.timur?.jarak_cm ?? 0;
    const jarakSelatan = dataSimpang?.jalur?.selatan?.jarak_cm ?? 0;

    // Untuk melacak jumlah kendaraan masuk (accumulated IR-B) dan keluar (accumulated IR-D)
    const masukBarat = (dataSimpang?.jalur?.barat as any)?.jumlah_masuk ?? jmlBarat;
    const lewatBarat = (dataSimpang?.jalur?.barat as any)?.sudah_lewat ?? 0;
    
    const masukTimur = (dataSimpang?.jalur?.timur as any)?.jumlah_masuk ?? jmlTimur;
    const lewatTimur = (dataSimpang?.jalur?.timur as any)?.sudah_lewat ?? 0;
    
    const masukSelatan = (dataSimpang?.jalur?.selatan as any)?.jumlah_masuk ?? jmlSelatan;
    const lewatSelatan = (dataSimpang?.jalur?.selatan as any)?.sudah_lewat ?? 0;

    // Trigger visual sensor IR ketika data counter berubah (ada mobil lewat)
    useEffect(() => {
        if (masukBarat !== prevMasukBarat && prevMasukBarat !== 0) {
            setFlashIRBaratB(true);
            const t = setTimeout(() => setFlashIRBaratB(false), 500);
            return () => clearTimeout(t);
        }
        setPrevMasukBarat(masukBarat);
    }, [masukBarat, prevMasukBarat]);

    useEffect(() => {
        if (lewatBarat !== prevLewatBarat && prevLewatBarat !== 0) {
            setFlashIRBaratD(true);
            const t = setTimeout(() => setFlashIRBaratD(false), 500);
            return () => clearTimeout(t);
        }
        setPrevLewatBarat(lewatBarat);
    }, [lewatBarat, prevLewatBarat]);

    useEffect(() => {
        if (masukTimur !== prevMasukTimur && prevMasukTimur !== 0) {
            setFlashIRTimurB(true);
            const t = setTimeout(() => setFlashIRTimurB(false), 500);
            return () => clearTimeout(t);
        }
        setPrevMasukTimur(masukTimur);
    }, [masukTimur, prevMasukTimur]);

    useEffect(() => {
        if (lewatTimur !== prevLewatTimur && prevLewatTimur !== 0) {
            setFlashIRTimurD(true);
            const t = setTimeout(() => setFlashIRTimurD(false), 500);
            return () => clearTimeout(t);
        }
        setPrevLewatTimur(lewatTimur);
    }, [lewatTimur, prevLewatTimur]);

    useEffect(() => {
        if (masukSelatan !== prevMasukSelatan && prevMasukSelatan !== 0) {
            setFlashIRSelatanB(true);
            const t = setTimeout(() => setFlashIRSelatanB(false), 500);
            return () => clearTimeout(t);
        }
        setPrevMasukSelatan(masukSelatan);
    }, [masukSelatan, prevMasukSelatan]);

    useEffect(() => {
        if (lewatSelatan !== prevLewatSelatan && prevLewatSelatan !== 0) {
            setFlashIRSelatanD(true);
            const t = setTimeout(() => setFlashIRSelatanD(false), 500);
            return () => clearTimeout(t);
        }
        setPrevLewatSelatan(lewatSelatan);
    }, [lewatSelatan, prevLewatSelatan]);

    // Simulasi visual idle tambahan (kedipan berkala jika hijau & ada mobil)
    useEffect(() => {
        let timer: any;
        if (lampuBarat === 'HIJAU' && jmlBarat > 0) {
            timer = setInterval(() => {
                setFlashIRBaratD(true);
                setTimeout(() => setFlashIRBaratD(false), 300);
            }, 2000);
        }
        return () => clearInterval(timer);
    }, [lampuBarat, jmlBarat]);

    useEffect(() => {
        let timer: any;
        if (lampuTimur === 'HIJAU' && jmlTimur > 0) {
            timer = setInterval(() => {
                setFlashIRTimurD(true);
                setTimeout(() => setFlashIRTimurD(false), 300);
            }, 2000);
        }
        return () => clearInterval(timer);
    }, [lampuTimur, jmlTimur]);

    useEffect(() => {
        let timer: any;
        if (lampuSelatan === 'HIJAU' && jmlSelatan > 0) {
            timer = setInterval(() => {
                setFlashIRSelatanD(true);
                setTimeout(() => setFlashIRSelatanD(false), 300);
            }, 2000);
        }
        return () => clearInterval(timer);
    }, [lampuSelatan, jmlSelatan]);

    // Helper warna lampu lalu lintas
    const getLampuClass = (status: string | undefined): string => {
        switch (status) {
            case 'HIJAU': return 'bg-emerald-500 shadow-[0_0_12px_#10b981]';
            case 'KUNING': return 'bg-amber-500 shadow-[0_0_12px_#f59e0b]';
            case 'MERAH': return 'bg-red-500 shadow-[0_0_12px_#ef4444]';
            default: return 'bg-slate-500';
        }
    };

    const getWaveWidth = (jarak: number) => {
        if (jarak <= 0) return 140; // Default ke jangkauan maksimal (140px/200cm)
        // Map 0 - 200cm ke 15px - 140px (jarak jangkauan visual disesuaikan panjang jalan)
        return Math.max(15, Math.min(140, Math.round((jarak / 200) * 140)));
    };

    const renderCanvas = (extraClasses: string = "flex-1 min-h-[380px]") => {
        return (
            <div className={`relative rounded-[18px] overflow-hidden bg-background border border-slate-200/80 flex items-center justify-center ${extraClasses}`}>
                
                {/* ── JALAN HORIZONTAL (BARAT - TIMUR) ── */}
                <div className="absolute left-0 right-0 h-28 bg-[#1e1e24] border-y-[3px] border-slate-700/80 shadow-2xl flex items-center justify-between">
                    {/* Marka Jalan Putus-putus */}
                    <div className="absolute left-0 right-0 h-0 border-t-2 border-dashed border-amber-400 opacity-60 z-0"></div>
                </div>

                {/* ── JALAN VERTIKAL (SELATAN) ── */}
                <div className="absolute bottom-0 w-28 bg-[#1e1e24] border-x-[3px] border-slate-700/80 shadow-2xl z-0" style={{ top: '50%', left: 'calc(50% - 56px)' }}>
                    {/* Marka Jalan Putus-putus */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l-2 border-dashed border-amber-400 opacity-60 z-0"></div>
                </div>

                {/* ── AREA PERSIMPANGAN TENGAH (BOX KOTAK) ── */}
                <div className="absolute w-28 h-28 bg-[#23232b] z-0 shadow-inner" style={{ left: 'calc(50% - 56px)', top: 'calc(50% - 56px)' }}>
                    {/* Stop Lines */}
                    {/* Stop Line Barat */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white opacity-95"></div>
                    {/* Stop Line Timur */}
                    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white opacity-95"></div>
                    {/* Stop Line Selatan */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white opacity-95"></div>
                </div>

                {/* ── JALUR BARAT (Kiri -> Tengah) ── */}
                {/* HC-SR04 Ultrasonic (Di kiri stopline, menghadap ke kiri/belakang searah jalan) */}
                <div className="absolute left-[calc(50%-68px)] top-[calc(50%-28px-15px)] z-20">
                    {/* HC-SR04 Hardware Icon */}
                    <div 
                      className="w-3 h-7 bg-blue-900 border border-blue-400 rounded-sm flex flex-col justify-around py-0.5 items-center shadow-lg" 
                      title="HC-SR04 Ultrasonic (Barat)"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-400 shadow-inner"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-400 shadow-inner"></div>
                    </div>
                    {/* Soundwave Cone (Pulsing wave animation memancar ke kiri) */}
                    {isConnected && (
                        <div 
                          className="absolute right-[calc(100%+2px)] top-1/2 -translate-y-1/2 h-8 bg-blue-500/10 border-y border-l border-blue-400/40 rounded-l-full overflow-hidden opacity-90"
                          style={{ 
                            width: `${getWaveWidth(jarakBarat)}px`,
                            clipPath: 'polygon(0 0, 100% 30%, 100% 70%, 0 100%)' 
                          }}
                        >
                            {/* Animated ripples */}
                            <div 
                              className="absolute right-0 top-1/2 rounded-full border-l-2 border-blue-400/70 pointer-events-none" 
                              style={{ 
                                width: `${getWaveWidth(jarakBarat) * 2}px`, 
                                height: `${getWaveWidth(jarakBarat) * 2}px`, 
                                transform: 'translate(50%, -50%)', 
                                animation: 'waveRippleLeft 1.5s infinite linear' 
                              }} 
                            />
                            <div 
                              className="absolute right-0 top-1/2 rounded-full border-l-2 border-blue-400/50 pointer-events-none" 
                              style={{ 
                                width: `${getWaveWidth(jarakBarat) * 2}px`, 
                                height: `${getWaveWidth(jarakBarat) * 2}px`, 
                                transform: 'translate(50%, -50%)', 
                                animation: 'waveRippleLeft 1.5s infinite linear',
                                animationDelay: '0.5s'
                              }} 
                            />
                            <div 
                              className="absolute right-0 top-1/2 rounded-full border-l-2 border-blue-400/30 pointer-events-none" 
                              style={{ 
                                width: `${getWaveWidth(jarakBarat) * 2}px`, 
                                height: `${getWaveWidth(jarakBarat) * 2}px`, 
                                transform: 'translate(50%, -50%)', 
                                animation: 'waveRippleLeft 1.5s infinite linear',
                                animationDelay: '1s'
                              }} 
                            />
                            
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[7px] font-bold text-blue-300 font-mono tracking-tighter z-10">{jarakBarat}cm</span>
                        </div>
                    )}
                </div>

                {/* IR Sensor Belakang (Laser Vertikal memotong 2 JALUR horizontal) */}
                {isConnected && (
                    <div className={`absolute left-[40px] top-[calc(50%-56px)] w-[2px] h-[112px] z-10 transition-all duration-300 ${
                        flashIRBaratB 
                          ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]' 
                          : 'bg-red-500/40 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                    }`} />
                )}
                {/* Modul IR Belakang di sisi jalan */}
                <div className={`absolute left-[38px] top-[calc(50%-56px-3px)] w-1.5 h-1.5 rounded-full z-20 border transition-all duration-300 ${flashIRBaratB ? 'bg-emerald-400 border-emerald-300' : 'bg-slate-700 border-slate-500'}`} />
                <div className={`absolute left-[38px] top-[calc(50%+56px-3px)] w-1.5 h-1.5 rounded-full z-20 border transition-all duration-300 ${flashIRBaratB ? 'bg-emerald-400 border-emerald-300' : 'bg-slate-700 border-slate-500'}`} />
                 <span className="absolute left-[32px] top-[calc(50%-56px-15px)] text-[7px] text-slate-400 font-bold font-mono">IR Obstacle B</span>

                {/* IR Sensor Depan (Laser Vertikal memotong 2 JALUR horizontal tepat di bawah lampu lalu lintas Barat - Sejajar) */}
                {isConnected && (
                    <div className={`absolute left-[calc(50%-64px)] top-[calc(50%-56px)] w-[2px] h-[112px] z-10 transition-all duration-300 ${
                        flashIRBaratD 
                          ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]' 
                          : 'bg-red-500/40 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                    }`} />
                )}
                {/* Modul IR Depan di sisi jalan */}
                <div className={`absolute left-[calc(50%-66px)] top-[calc(50%-56px-3px)] w-1.5 h-1.5 rounded-full z-20 border transition-all duration-300 ${flashIRBaratD ? 'bg-emerald-400 border-emerald-300' : 'bg-slate-700 border-slate-500'}`} />
                <div className={`absolute left-[calc(50%-66px)] top-[calc(50%+56px-3px)] w-1.5 h-1.5 rounded-full z-20 border transition-all duration-300 ${flashIRBaratD ? 'bg-emerald-400 border-emerald-300' : 'bg-slate-700 border-slate-500'}`} />
                 <span className="absolute left-[calc(50%-73px)] top-[calc(50%-56px-15px)] text-[7px] text-slate-400 font-bold font-mono">IR Obstacle D</span>

                {/* Mobil-mobil Barat */}
                {Array.from({ length: Math.min(jmlBarat, 6) }).map((_, idx) => {
                    const isGreen = lampuBarat === 'HIJAU';
                    const col = Math.floor(idx / 2);
                    const row = idx % 2;
                    return (
                        <div 
                          key={idx}
                          className="absolute w-8 h-4 rounded-sm bg-blue-600 border border-blue-400 shadow-md transition-all duration-1000 z-15 flex items-center justify-center"
                          style={{
                            left: isGreen ? 'calc(50% + 150px)' : `calc(50% - 56px - 36px - ${col * 34}px)`,
                            top: row === 0 ? 'calc(50% - 46px)' : 'calc(50% - 22px)',
                            animation: 'driveInBarat 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                            transitionProperty: 'left',
                            transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
                            transitionDelay: isGreen ? `${col * 150 + row * 75}ms` : '0ms'
                          }}
                        >
                            {/* Cabin/Roof */}
                            <div className="absolute w-4 h-2.5 bg-blue-500 rounded-xs left-1 top-0.5 opacity-90" />
                            {/* Windshield */}
                            <div className="absolute w-1 h-2 bg-slate-900/80 rounded-xs left-5 top-1" />
                            {/* Rear Window */}
                            <div className="absolute w-1 h-2 bg-slate-900/80 rounded-xs left-0.5 top-1" />
                            
                            {/* Headlights (Green/Driving) atau Brake Lights (Red/Braking) */}
                            {isGreen ? (
                                <>
                                    <div className="absolute right-0 top-0.5 w-0.5 h-0.5 bg-yellow-200 rounded-full shadow-[0_0_6px_#fef08a]" />
                                    <div className="absolute right-0 bottom-0.5 w-0.5 h-0.5 bg-yellow-200 rounded-full shadow-[0_0_6px_#fef08a]" />
                                </>
                            ) : (
                                <>
                                    <div className="absolute left-0 top-0.5 w-0.5 h-0.5 bg-red-500 rounded-full shadow-[0_0_6px_#ef4444] animate-pulse" />
                                    <div className="absolute left-0 bottom-0.5 w-0.5 h-0.5 bg-red-500 rounded-full shadow-[0_0_6px_#ef4444] animate-pulse" />
                                </>
                            )}
                        </div>
                    );
                })}


                {/* ── JALUR TIMUR (Kanan -> Tengah) ── */}
                {/* HC-SR04 Ultrasonic (Di stopline, menghadap ke kanan/belakang searah jalan) */}
                <div className="absolute left-[calc(50%+56px)] top-[calc(50%+28px-15px)] z-20">
                    {/* HC-SR04 Hardware Icon */}
                    <div 
                      className="w-3 h-7 bg-blue-900 border border-blue-400 rounded-sm flex flex-col justify-around py-0.5 items-center shadow-lg" 
                      title="HC-SR04 Ultrasonic (Timur)"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-400 shadow-inner"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-400 shadow-inner"></div>
                    </div>
                    {/* Soundwave Cone (Pulsing wave animation memancar ke kanan) */}
                    {isConnected && (
                        <div 
                          className="absolute left-[calc(100%+2px)] top-1/2 -translate-y-1/2 h-8 bg-blue-500/10 border-y border-r border-blue-400/40 rounded-r-full overflow-hidden opacity-90"
                          style={{ 
                            width: `${getWaveWidth(jarakTimur)}px`,
                            clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 70%)' 
                          }}
                        >
                            {/* Animated ripples */}
                            <div 
                              className="absolute left-0 top-1/2 rounded-full border-r-2 border-blue-400/70 pointer-events-none" 
                              style={{ 
                                width: `${getWaveWidth(jarakTimur) * 2}px`, 
                                height: `${getWaveWidth(jarakTimur) * 2}px`, 
                                transform: 'translate(-50%, -50%)', 
                                animation: 'waveRippleRight 1.5s infinite linear' 
                              }} 
                            />
                            <div 
                              className="absolute left-0 top-1/2 rounded-full border-r-2 border-blue-400/50 pointer-events-none" 
                              style={{ 
                                width: `${getWaveWidth(jarakTimur) * 2}px`, 
                                height: `${getWaveWidth(jarakTimur) * 2}px`, 
                                transform: 'translate(-50%, -50%)', 
                                animation: 'waveRippleRight 1.5s infinite linear',
                                animationDelay: '0.5s'
                              }} 
                            />
                            <div 
                              className="absolute left-0 top-1/2 rounded-full border-r-2 border-blue-400/30 pointer-events-none" 
                              style={{ 
                                width: `${getWaveWidth(jarakTimur) * 2}px`, 
                                height: `${getWaveWidth(jarakTimur) * 2}px`, 
                                transform: 'translate(-50%, -50%)', 
                                animation: 'waveRippleRight 1.5s infinite linear',
                                animationDelay: '1s'
                              }} 
                            />
                            
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[7px] font-bold text-blue-300 font-mono tracking-tighter z-10">{jarakTimur}cm</span>
                        </div>
                    )}
                </div>

                {/* IR Sensor Belakang (Laser Vertikal memotong 2 JALUR horizontal) */}
                {isConnected && (
                    <div className={`absolute right-[40px] top-[calc(50%-56px)] w-[2px] h-[112px] z-10 transition-all duration-300 ${
                        flashIRTimurB 
                          ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]' 
                          : 'bg-red-500/40 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                    }`} />
                )}
                {/* Modul IR Belakang di sisi jalan */}
                <div className={`absolute right-[38px] top-[calc(50%-56px-3px)] w-1.5 h-1.5 rounded-full z-20 border transition-all duration-300 ${flashIRTimurB ? 'bg-emerald-400 border-emerald-300' : 'bg-slate-700 border-slate-500'}`} />
                <div className={`absolute right-[38px] top-[calc(50%+56px-3px)] w-1.5 h-1.5 rounded-full z-20 border transition-all duration-300 ${flashIRTimurB ? 'bg-emerald-400 border-emerald-300' : 'bg-slate-700 border-slate-500'}`} />
                 <span className="absolute right-[32px] top-[calc(50%+56px+4px)] text-[7px] text-slate-400 font-bold font-mono">IR Obstacle B</span>

                {/* IR Sensor Depan (Laser Vertikal memotong 2 JALUR horizontal tepat di bawah lampu lalu lintas Timur - Sejajar) */}
                {isConnected && (
                    <div className={`absolute right-[calc(50%-64px)] top-[calc(50%-56px)] w-[2px] h-[112px] z-10 transition-all duration-300 ${
                        flashIRTimurD 
                          ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]' 
                          : 'bg-red-500/40 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                    }`} />
                )}
                {/* Modul IR Depan di sisi jalan */}
                <div className={`absolute right-[calc(50%-66px)] top-[calc(50%-56px-3px)] w-1.5 h-1.5 rounded-full z-20 border transition-all duration-300 ${flashIRTimurD ? 'bg-emerald-400 border-emerald-300' : 'bg-slate-700 border-slate-500'}`} />
                <div className={`absolute right-[calc(50%-66px)] top-[calc(50%+56px-3px)] w-1.5 h-1.5 rounded-full z-20 border transition-all duration-300 ${flashIRTimurD ? 'bg-emerald-400 border-emerald-300' : 'bg-slate-700 border-slate-500'}`} />
                 <span className="absolute right-[calc(50%-73px)] top-[calc(50%+56px+4px)] text-[7px] text-slate-400 font-bold font-mono">IR Obstacle D</span>

                {/* Mobil-mobil Timur */}
                {Array.from({ length: Math.min(jmlTimur, 6) }).map((_, idx) => {
                    const isGreen = lampuTimur === 'HIJAU';
                    const col = Math.floor(idx / 2);
                    const row = idx % 2;
                    return (
                        <div 
                          key={idx}
                          className="absolute w-8 h-4 rounded-sm bg-red-600 border border-red-400 shadow-md transition-all duration-1000 z-15 flex items-center justify-center"
                          style={{
                            right: isGreen ? 'calc(50% + 150px)' : `calc(50% - 56px - 36px - ${col * 34}px)`,
                            top: row === 0 ? 'calc(50% + 6px)' : 'calc(50% + 30px)',
                            animation: 'driveInTimur 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                            transitionProperty: 'right',
                            transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
                            transitionDelay: isGreen ? `${col * 150 + row * 75}ms` : '0ms'
                          }}
                        >
                            {/* Cabin/Roof */}
                            <div className="absolute w-4 h-2.5 bg-red-500 rounded-xs right-1 top-0.5 opacity-90" />
                            {/* Windshield */}
                            <div className="absolute w-1 h-2 bg-slate-900/80 rounded-xs right-5 top-1" />
                            {/* Rear Window */}
                            <div className="absolute w-1 h-2 bg-slate-900/80 rounded-xs right-0.5 top-1" />
                            
                            {/* Headlights (Green/Driving) atau Brake Lights (Red/Braking) */}
                            {isGreen ? (
                                <>
                                    <div className="absolute left-0 top-0.5 w-0.5 h-0.5 bg-yellow-200 rounded-full shadow-[0_0_6px_#fef08a]" />
                                    <div className="absolute left-0 bottom-0.5 w-0.5 h-0.5 bg-yellow-200 rounded-full shadow-[0_0_6px_#fef08a]" />
                                </>
                            ) : (
                                <>
                                    <div className="absolute right-0 top-0.5 w-0.5 h-0.5 bg-red-500 rounded-full shadow-[0_0_6px_#ef4444] animate-pulse" />
                                    <div className="absolute right-0 bottom-0.5 w-0.5 h-0.5 bg-red-500 rounded-full shadow-[0_0_6px_#ef4444] animate-pulse" />
                                </>
                            )}
                        </div>
                    );
                })}


                {/* ── JALUR SELATAN (Bawah -> Tengah) ── */}
                {/* HC-SR04 Ultrasonic (Di stopline, menghadap ke bawah/belakang searah jalan) */}
                <div className="absolute left-[calc(50%-28px-15px)] top-[calc(50%+56px)] z-20">
                    {/* HC-SR04 Hardware Icon */}
                    <div 
                      className="w-7 h-3 bg-blue-900 border border-blue-400 rounded-sm flex justify-around px-0.5 items-center shadow-lg transform translate-y-1" 
                      title="HC-SR04 Ultrasonic (Selatan)"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-400 shadow-inner"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-400 shadow-inner"></div>
                    </div>
                    {/* Soundwave Cone (Pulsing wave animation memancar ke bawah) */}
                    {isConnected && (
                        <div 
                          className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-8 bg-blue-500/10 border-x border-b border-blue-400/40 rounded-b-full overflow-hidden opacity-90"
                          style={{ 
                            height: `${getWaveWidth(jarakSelatan)}px`,
                            clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0 100%)' 
                          }}
                        >
                            {/* Animated ripples */}
                            <div 
                              className="absolute top-0 left-1/2 rounded-full border-b-2 border-blue-400/70 pointer-events-none" 
                              style={{ 
                                width: `${getWaveWidth(jarakSelatan) * 2}px`, 
                                height: `${getWaveWidth(jarakSelatan) * 2}px`, 
                                transform: 'translate(-50%, -50%)', 
                                animation: 'waveRippleDown 1.5s infinite linear' 
                              }} 
                            />
                            <div 
                              className="absolute top-0 left-1/2 rounded-full border-b-2 border-blue-400/50 pointer-events-none" 
                              style={{ 
                                width: `${getWaveWidth(jarakSelatan) * 2}px`, 
                                height: `${getWaveWidth(jarakSelatan) * 2}px`, 
                                transform: 'translate(-50%, -50%)', 
                                animation: 'waveRippleDown 1.5s infinite linear',
                                animationDelay: '0.5s'
                              }} 
                            />
                            <div 
                              className="absolute top-0 left-1/2 rounded-full border-b-2 border-blue-400/30 pointer-events-none" 
                              style={{ 
                                width: `${getWaveWidth(jarakSelatan) * 2}px`, 
                                height: `${getWaveWidth(jarakSelatan) * 2}px`, 
                                transform: 'translate(-50%, -50%)', 
                                animation: 'waveRippleDown 1.5s infinite linear',
                                animationDelay: '1s'
                              }} 
                            />
                            
                            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[7px] font-bold text-blue-300 font-mono tracking-tighter block rotate-90 z-10">{jarakSelatan}cm</span>
                        </div>
                    )}
                </div>

                {/* IR Sensor Belakang (Laser Horizontal memotong 2 JALUR vertikal) */}
                {isConnected && (
                    <div className={`absolute left-[calc(50%-56px)] bottom-[25px] w-[112px] h-[2px] z-10 transition-all duration-300 ${
                        flashIRSelatanB 
                          ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]' 
                          : 'bg-red-500/40 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                    }`} />
                )}
                {/* Modul IR Belakang di sisi jalan */}
                <div className={`absolute left-[calc(50%-56px-3px)] bottom-[23px] w-1.5 h-1.5 rounded-full z-20 border transition-all duration-300 ${flashIRSelatanB ? 'bg-emerald-400 border-emerald-300' : 'bg-slate-700 border-slate-500'}`} />
                <div className={`absolute left-[calc(50%+56px-3px)] bottom-[23px] w-1.5 h-1.5 rounded-full z-20 border transition-all duration-300 ${flashIRSelatanB ? 'bg-emerald-400 border-emerald-300' : 'bg-slate-700 border-slate-500'}`} />
                 <span className="absolute right-[calc(50%+56px+8px)] bottom-[21px] text-[7px] text-slate-400 font-bold font-mono text-right">IR Obstacle B</span>

                {/* IR Sensor Depan (Laser Horizontal memotong 2 JALUR vertikal tepat di stop line) */}
                {isConnected && (
                    <div className={`absolute left-[calc(50%-56px)] bottom-[calc(50%-58px)] w-[112px] h-[2px] z-10 transition-all duration-300 ${
                        flashIRSelatanD 
                          ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]' 
                          : 'bg-red-500/40 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                    }`} />
                )}
                {/* Modul IR Depan di sisi jalan */}
                <div className={`absolute left-[calc(50%-56px-3px)] bottom-[calc(50%-60px)] w-1.5 h-1.5 rounded-full z-20 border transition-all duration-300 ${flashIRSelatanD ? 'bg-emerald-400 border-emerald-300' : 'bg-slate-700 border-slate-500'}`} />
                <div className={`absolute left-[calc(50%+56px-3px)] bottom-[calc(50%-60px)] w-1.5 h-1.5 rounded-full z-20 border transition-all duration-300 ${flashIRSelatanD ? 'bg-emerald-400 border-emerald-300' : 'bg-slate-700 border-slate-500'}`} />
                 <span className="absolute right-[calc(50%+56px+8px)] bottom-[calc(50%-63px)] text-[7px] text-slate-400 font-bold font-mono text-right">IR Obstacle D</span>

                {/* Mobil-mobil Selatan */}
                {Array.from({ length: Math.min(jmlSelatan, 6) }).map((_, idx) => {
                    const isGreen = lampuSelatan === 'HIJAU';
                    const col = Math.floor(idx / 2);
                    const row = idx % 2;
                    return (
                        <div 
                          key={idx}
                          className="absolute w-4 h-8 rounded-sm bg-amber-600 border border-amber-400 shadow-md transition-all duration-1000 z-15 flex items-center justify-center"
                          style={{
                            bottom: isGreen ? 'calc(50% + 150px)' : `calc(50% - 56px - 36px - ${col * 34}px)`,
                            left: row === 0 ? 'calc(50% - 46px)' : 'calc(50% - 22px)',
                            animation: 'driveInSelatan 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                            transitionProperty: 'bottom',
                            transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
                            transitionDelay: isGreen ? `${col * 150 + row * 75}ms` : '0ms'
                          }}
                        >
                            {/* Cabin/Roof */}
                            <div className="absolute w-2.5 h-4 bg-amber-500 rounded-xs top-1 left-0.5 opacity-90" />
                            {/* Windshield */}
                            <div className="absolute w-2 h-1 bg-slate-900/80 rounded-xs top-5 left-1" />
                            {/* Rear Window */}
                            <div className="absolute w-2 h-1 bg-slate-900/80 rounded-xs top-0.5 left-1" />
                            
                            {/* Headlights (Green/Driving) atau Brake Lights (Red/Braking) */}
                            {isGreen ? (
                                <>
                                    <div className="absolute top-0 left-0.5 w-0.5 h-0.5 bg-yellow-200 rounded-full shadow-[0_0_6px_#fef08a]" />
                                    <div className="absolute top-0 right-0.5 w-0.5 h-0.5 bg-yellow-200 rounded-full shadow-[0_0_6px_#fef08a]" />
                                </>
                            ) : (
                                <>
                                    <div className="absolute bottom-0 left-0.5 w-0.5 h-0.5 bg-red-500 rounded-full shadow-[0_0_6px_#ef4444] animate-pulse" />
                                    <div className="absolute bottom-0 right-0.5 w-0.5 h-0.5 bg-red-500 rounded-full shadow-[0_0_6px_#ef4444] animate-pulse" />
                                </>
                            )}
                        </div>
                    );
                })}


                {/* ── TRAFFIC LIGHTS VISUALS (LAMPU PERSIMPANGAN) ── */}
                {/* Lampu Barat (Di kiri jalan, pepet dengan jalur/border) */}
                <div className="absolute left-[calc(50%-72px)] top-[calc(50%-56px-17px)] z-30">
                    <div className={`w-4 h-4 rounded-full border border-white/30 flex items-center justify-center ${getLampuClass(lampuBarat)}`}>
                        <span className="text-[6px] font-black text-white">{lampuBarat === 'HIJAU' ? 'G' : lampuBarat === 'KUNING' ? 'Y' : 'R'}</span>
                    </div>
                </div>

                {/* Lampu Timur (Di kiri jalan, pepet dengan jalur/border) */}
                <div className="absolute left-[calc(50%+56px)] top-[calc(50%+56px+1px)] z-30">
                    <div className={`w-4 h-4 rounded-full border border-white/30 flex items-center justify-center ${getLampuClass(lampuTimur)}`}>
                        <span className="text-[6px] font-black text-white">{lampuTimur === 'HIJAU' ? 'G' : lampuTimur === 'KUNING' ? 'Y' : 'R'}</span>
                    </div>
                </div>

                {/* Lampu Selatan (Di kiri jalan, pepet dengan jalur/border) */}
                <div className="absolute left-[calc(50%-72px)] top-[calc(50%+56px+1px)] z-30">
                    <div className={`w-4 h-4 rounded-full border border-white/30 flex items-center justify-center ${getLampuClass(lampuSelatan)}`}>
                        <span className="text-[6px] font-black text-white">{lampuSelatan === 'HIJAU' ? 'G' : lampuSelatan === 'KUNING' ? 'Y' : 'R'}</span>
                    </div>
                </div>

                {/* Info Text Overlay */}
                <div className="absolute top-2 left-2 z-30 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-700/50 backdrop-blur-xs flex flex-col gap-0.5 shadow-md">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        Simulasi Sensor Aktif
                    </span>
                    <span className="text-[7px] text-slate-400 font-semibold">HC-SR04 = Gelombang Biru (Parallel Jalan)</span>
                    <span className="text-[7px] text-slate-400 font-semibold">IR Obstacle = Laser Transversal (Memotong Jalan)</span>
                </div>

            </div>
        );
    };

    return (
        <>
            <div className="bg-card rounded-[24px] shadow-sm flex flex-col h-full overflow-hidden border border-border/10 p-6 gap-4">
                
                {/* CSS Keyframes untuk Spawning Kendaraan & Animasi Gelombang Ultrasonik */}
                <style>{`
                    @keyframes driveInBarat {
                        0% { left: -60px; opacity: 0; }
                        100% { opacity: 1; }
                    }
                    @keyframes driveInTimur {
                        0% { right: -60px; opacity: 0; }
                        100% { opacity: 1; }
                    }
                    @keyframes driveInSelatan {
                        0% { bottom: -60px; opacity: 0; }
                        100% { opacity: 1; }
                    }
                    @keyframes waveRippleLeft {
                        0% { transform: translate(50%, -50%) scale(0.01); opacity: 0.95; }
                        100% { transform: translate(50%, -50%) scale(1); opacity: 0; }
                    }
                    @keyframes waveRippleRight {
                        0% { transform: translate(-50%, -50%) scale(0.01); opacity: 0.95; }
                        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
                    }
                    @keyframes waveRippleDown {
                        0% { transform: translate(-50%, -50%) scale(0.01); opacity: 0.95; }
                        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
                    }
                `}</style>

                {/* Header */}
                <div className="flex justify-between items-center relative z-30 bg-transparent">
                    <h3 className="text-[16px] font-black text-foreground">Skema Persimpangan</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                            <span className="text-xs font-semibold text-muted">{statusKoneksi}</span>
                        </div>
                        {/* Expand Button */}
                        <button 
                          onClick={() => setIsExpanded(true)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-foreground transition-colors cursor-pointer"
                          title="Perbesar Tampilan"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Canvas Jalan */}
                {renderCanvas("flex-1 min-h-[380px]")}
            </div>

            {/* Modal Overlay untuk Tampilan Penuh (Fullscreen Mode) */}
            {isExpanded && mounted && createPortal(
                <div 
                  onClick={() => setIsExpanded(false)}
                  className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200 cursor-pointer"
                >
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="relative w-[85vw] max-w-6xl h-[80vh] rounded-[24px] overflow-hidden shadow-2xl border border-slate-200 bg-background flex flex-col animate-in zoom-in-95 duration-200 cursor-default"
                    >
                        {/* Floating Controls Overlay (Top Right of the full screen canvas) */}
                        <div className="absolute top-4 right-4 z-40 bg-slate-900/85 hover:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/50 flex items-center gap-3 shadow-lg transition-all">
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                                <span className="text-[10px] font-semibold text-slate-200">{statusKoneksi}</span>
                            </div>
                            <div className="w-px h-3 bg-slate-700/60" />
                            {/* Close / Shrink Button */}
                            <button 
                              onClick={() => setIsExpanded(false)}
                              className="p-0.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                              title="Perkecil Tampilan"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
                                </svg>
                            </button>
                        </div>

                        {/* Canvas Jalan (Stretched to fill the modal container) */}
                        <div className="flex-1 w-full h-full relative overflow-hidden">
                            {renderCanvas("w-full h-full rounded-none border-none")}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default LiveSchema;