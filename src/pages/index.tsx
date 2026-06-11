"use client";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { label: "Pemantauan Langsung", href: "monitoring" },
  { label: "Arsitektur Sistem", href: "architecture" },
  { label: "Teknologi", href: "tech-stack" },
  { label: "Tentang Proyek", href: "about-project" },
];

function useCounter(target: number, duration = 1800, start = false, suffix = "") {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("monitoring");

  const statsReveal = useReveal();
  // Angka disesuaikan dengan realitas arsitektur PBL
  const nodesCount = useCounter(2, 1000, statsReveal.visible); // 2 ESP32
  const jalurCount = useCounter(3, 1000, statsReveal.visible); // 3 Jalur (T-Junction)
  const latencyCount = useCounter(120, 1400, statsReveal.visible); // Latency MQTT ~120ms
  const uptimeCount = useCounter(99, 1200, statsReveal.visible); // 99% GCP Uptime

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const offsets = NAV_ITEMS.map(({ href }) => {
        const el = document.getElementById(href);
        return { href, top: el ? el.getBoundingClientRect().top : Infinity };
      });
      const current = offsets.filter((o) => o.top <= 120).at(-1);
      if (current) setActiveSection(current.href);
      else setActiveSection("monitoring");
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal();

  // State Simulasi Real-Time pada Landing Page
  const [simMemory, setSimMemory] = useState(24.2);
  const [simTotalData, setSimTotalData] = useState(8421);
  const [simBarat, setSimBarat] = useState({ jarak: 140, mobil: 0 });
  const [simTimur, setSimTimur] = useState({ jarak: 80, mobil: 4 });
  const [simSelatan, setSimSelatan] = useState({ jarak: 15, mobil: 9 });
  const [simActiveLane, setSimActiveLane] = useState("SELATAN");
  const [simCountdown, setSimCountdown] = useState(28);

  useEffect(() => {
    // 1. Simulasikan memori Node.js & total data masuk
    const dataTimer = setInterval(() => {
      setSimMemory(Number((22.0 + Math.random() * 6).toFixed(1)));
      setSimTotalData((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);

    // 2. Simulasikan countdown lampu hijau
    const countdownTimer = setInterval(() => {
      setSimCountdown((prev) => {
        if (prev <= 1) {
          const lanes = ["BARAT", "TIMUR", "SELATAN"];
          const currentIdx = lanes.indexOf(simActiveLane);
          const nextLane = lanes[(currentIdx + 1) % lanes.length];
          setSimActiveLane(nextLane);
          return Math.floor(Math.random() * 15) + 15; // 15 - 30 detik
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(dataTimer);
      clearInterval(countdownTimer);
    };
  }, [simActiveLane]);

  // 3. Simulasikan nilai sensor berdasarkan lane aktif
  useEffect(() => {
    const sensorTimer = setInterval(() => {
      if (simActiveLane === "BARAT") {
        setSimBarat((prev) => ({
          jarak: Math.min(prev.jarak + 8, 180),
          mobil: Math.max(prev.mobil - 1, 0),
        }));
        setSimTimur((prev) => ({
          jarak: Math.max(prev.jarak - 4, 15),
          mobil: Math.min(prev.mobil + (Math.random() > 0.5 ? 1 : 0), 10),
        }));
        setSimSelatan((prev) => ({
          jarak: Math.max(prev.jarak - 4, 15),
          mobil: Math.min(prev.mobil + (Math.random() > 0.5 ? 1 : 0), 10),
        }));
      } else if (simActiveLane === "TIMUR") {
        setSimTimur((prev) => ({
          jarak: Math.min(prev.jarak + 8, 180),
          mobil: Math.max(prev.mobil - 1, 0),
        }));
        setSimBarat((prev) => ({
          jarak: Math.max(prev.jarak - 4, 15),
          mobil: Math.min(prev.mobil + (Math.random() > 0.5 ? 1 : 0), 10),
        }));
        setSimSelatan((prev) => ({
          jarak: Math.max(prev.jarak - 4, 15),
          mobil: Math.min(prev.mobil + (Math.random() > 0.5 ? 1 : 0), 10),
        }));
      } else {
        setSimSelatan((prev) => ({
          jarak: Math.min(prev.jarak + 8, 180),
          mobil: Math.max(prev.mobil - 1, 0),
        }));
        setSimBarat((prev) => ({
          jarak: Math.max(prev.jarak - 4, 15),
          mobil: Math.min(prev.mobil + (Math.random() > 0.5 ? 1 : 0), 10),
        }));
        setSimTimur((prev) => ({
          jarak: Math.max(prev.jarak - 4, 15),
          mobil: Math.min(prev.mobil + (Math.random() > 0.5 ? 1 : 0), 10),
        }));
      }
    }, 2000);

    return () => clearInterval(sensorTimer);
  }, [simActiveLane]);

  return (
    <>
      <Head>
        <title>SMARTRAF – Adaptive Smart Traffic Light</title>
        <meta name="description" content="Sistem Pemantauan Lalu Lintas Adaptif untuk Pertigaan (T-Junction)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#F5F7FB] font-sans text-slate-900 overflow-x-hidden">

        {/* ── NAVBAR ── */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-[#F5F7FB]/85 backdrop-blur-lg border-b border-slate-200/60 py-3 shadow-[0_4px_30px_rgba(15,23,42,0.05)]"
          : "bg-transparent py-5"
          }`}>
          <div className="w-full max-w-7xl mx-auto px-8 flex items-center justify-between">
            <div className="flex items-center select-none group cursor-pointer">
              <h1 className="text-[20px] font-black text-slate-900 leading-none m-0 tracking-tighter uppercase transition-transform group-hover:scale-105">
                Smart<span className="text-secondary font-black">raf</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold">
              {NAV_ITEMS.map(({ label, href }) => (
                <a key={href} href={`#${href}`}
                  className={`relative transition-all duration-300 py-1.5 group ${activeSection === href
                    ? "text-secondary font-bold"
                    : "text-slate-500 hover:text-slate-900"
                    }`}>
                  {label}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-secondary transition-transform duration-300 origin-left ${activeSection === href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`} />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href="/login" className="text-xs sm:text-[13px] bg-secondary/10 hover:bg-secondary border border-secondary/20 hover:border-secondary text-secondary hover:text-white px-5 py-2 font-extrabold transition-all duration-300 rounded-xl tracking-wider uppercase hover:-translate-y-0.5 active:scale-95 shadow-sm">
                Masuk
              </a>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative h-screen min-h-[650px] flex items-center overflow-hidden bg-transparent">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop"
              alt="City Traffic"
              className="w-full h-full object-cover object-center opacity-10 will-change-transform"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#F5F7FB] via-[#F5F7FB]/90 to-transparent" />
          </div>
          <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-widest uppercase text-secondary border border-secondary/25 bg-secondary/5 backdrop-blur-md px-4 py-2 mb-8 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Adaptive Smart Traffic Light
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black leading-[0.95] text-slate-900 mb-6 tracking-tight">
                Sistem<br />
                <span className="text-secondary">Lalu Lintas</span><br />
                Berbasis IOT
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-12 max-w-md font-semibold">
                Sistem pengatur lampu lalu lintas adaptif untuk pertigaan berbasis IoT (Edge-Cloud Computing). Merespons antrean kendaraan secara dinamis melalui protokol MQTT.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/login" className="bg-secondary hover:bg-secondary-hover text-white text-xs sm:text-sm font-extrabold px-7 py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 tracking-wider uppercase shadow-lg shadow-secondary/20 hover:shadow-secondary/30 active:scale-[0.97]">
                  BUKA DASBOR
                </a>
                <a href="#architecture" className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-extrabold px-7 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all duration-300 tracking-wider uppercase active:scale-[0.97] shadow-sm">
                  LIHAT ARSITEKTUR
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
            <div className="w-px h-8 bg-linear-to-b from-secondary to-transparent animate-pulse" />
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-8" ref={statsReveal.ref}>
          <div className="max-w-7xl mx-auto px-8">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.03)] rounded-[28px] p-6 sm:p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {[
                  { value: nodesCount, suffix: "", label: "Node ESP32 Aktif", color: "text-secondary" },
                  { value: jalurCount, suffix: "", label: "Jalur T-Junction", color: "text-slate-900" },
                  { value: latencyCount, suffix: "ms", label: "Latensi Sinkronisasi", color: "text-secondary" },
                  { value: uptimeCount, suffix: "%", label: "Uptime Server GCP", color: "text-slate-900" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center py-6 px-4 transition-transform hover:scale-[1.03] duration-300">
                    <div className={`text-4xl sm:text-5xl font-black ${stat.color} mb-2 tracking-tighter`}>
                      {stat.value.toLocaleString()}{stat.suffix}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] text-center">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MONITORING PREVIEW ── */}
        <section id="monitoring" className="py-24 bg-transparent">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-550 mb-3">PEMANTAUAN KENDALI</div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Kontrol Persimpangan Interaktif</h2>
            </div>
            <div className="flex flex-col lg:flex-row rounded-[28px] overflow-hidden shadow-[0_16px_48px_rgba(15,23,42,0.04)] border border-slate-200 bg-white/85 backdrop-blur-md">
              <div className="w-full lg:w-[300px] shrink-0 bg-slate-50 backdrop-blur-sm p-8 flex flex-col gap-8 border-b lg:border-b-0 lg:border-r border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-300" />
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-300" />
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-300" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Status Komunikasi Broker</div>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3.5 py-1.5 rounded-full text-xs font-black border border-emerald-250 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    CONNECTED
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2.5">Penggunaan Memori Node.js</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300/30">
                      <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${(simMemory / 50) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-slate-600">{simMemory}MB</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Total Data Diterima</div>
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">{simTotalData.toLocaleString('id-ID')}</div>
                </div>
              </div>
              <div className="flex-1 bg-slate-100/30 relative overflow-hidden min-h-[440px] flex items-center justify-center p-6 sm:p-8">
                {/* Visualisasi Mockup T-Junction */}
                <div className="w-full max-w-md border border-slate-850 rounded-[24px] p-6 bg-slate-900 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-5 right-5 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Live Sync</span>
                  </div>
                  <h3 className="text-slate-200 font-black text-xs mb-6 tracking-wider uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    Simulasi Data Masuk (MQTT)
                  </h3>
                  <div className="space-y-3.5 font-mono text-[11px] text-slate-300">
                    <div className="flex justify-between items-center py-2 px-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                      <span className="text-slate-400">smartraf/sensor/barat</span>
                      <span className="text-emerald-400 font-bold">"{`{ jarak: ${simBarat.jarak}, mobil: ${simBarat.mobil} }`}"</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                      <span className="text-slate-400">smartraf/sensor/timur</span>
                      <span className="text-amber-400 font-bold">"{`{ jarak: ${simTimur.jarak}, mobil: ${simTimur.mobil} }`}"</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                      <span className="text-slate-400">smartraf/sensor/selatan</span>
                      <span className="text-red-400 font-bold">"{`{ jarak: ${simSelatan.jarak}, mobil: ${simSelatan.mobil} }`}"</span>
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-800/60 flex justify-between items-center text-slate-200">
                      <span className="font-extrabold uppercase tracking-widest text-[10px] text-slate-400">Kontrol</span>
                      <span className="text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[10px]">
                        Update Hijau: {simActiveLane} ({simCountdown}s)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ARCHITECTURE ── */}
        <section id="architecture" className="py-24 bg-transparent">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500 mb-3">METODOLOGI SISTEM</div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Arsitektur Edge-Cloud Computing</h2>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex gap-6 flex-col md:flex-row">
                {[r1, r2].map((rv, idx) => {
                  const cards = [
                    {
                      flex: "flex-[2]",
                      bgIcon: "bg-secondary/10 text-secondary border border-secondary/20",
                      icon: <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
                      title: "Logika Server (Node.js)",
                      desc: "Perhitungan durasi lampu dilakukan pada server terpusat untuk meminimalkan beban komputasi mikrokontroler serta memudahkan pembaruan parameter.",
                    },
                    {
                      flex: "flex-1",
                      bgIcon: "bg-slate-100 text-slate-600 border border-slate-200",
                      icon: <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                      title: "Kendali Edge (ESP32)",
                      desc: "Waktu hitung mundur dan transisi warna lampu dikontrol secara lokal oleh ESP32 untuk menjaga stabilitas persimpangan apabila terjadi kendala jaringan.",
                    },
                  ];
                  const c = cards[idx];
                  return (
                    <div key={idx} ref={rv.ref}
                      className={`${c.flex} bg-white border border-slate-200/70 p-8 rounded-[28px] shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.05)] hover:border-slate-350 hover:-translate-y-1.5 transition-all duration-500 ease-spring ${rv.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                      style={{ transitionDelay: `${idx * 150}ms` }}>
                      <div className={`w-11 h-11 ${c.bgIcon} rounded-2xl flex items-center justify-center mb-6`}>{c.icon}</div>
                      <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{c.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-semibold">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-6 flex-col md:flex-row">
                {[r3, r4].map((rv, idx) => {
                  const cards = [
                    {
                      flex: "flex-1",
                      bgIcon: "bg-emerald-50 text-emerald-600 border border-emerald-200",
                      icon: <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
                      title: "Protokol MQTT",
                      desc: "Menggunakan broker Mosquitto untuk pertukaran data sensor dan parameter kendali secara cepat antara perangkat IoT dan server backend.",
                    },
                    {
                      flex: "flex-[2]",
                      bgIcon: "bg-secondary/10 text-secondary border border-secondary/20",
                      icon: <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                      title: "Visualisasi Real-Time",
                      desc: "Dashboard berbasis web menampilkan grafik volume lalu lintas dan visualisasi hitung mundur secara langsung untuk memudahkan monitoring.",
                    },
                  ];
                  const c = cards[idx];
                  return (
                    <div key={idx} ref={rv.ref}
                      className={`${c.flex} bg-white border border-slate-200/70 p-8 rounded-[28px] shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.05)] hover:border-slate-350 hover:-translate-y-1.5 transition-all duration-500 ease-spring ${rv.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                      style={{ transitionDelay: `${(idx + 2) * 150}ms` }}>
                      <div className={`w-11 h-11 ${c.bgIcon} rounded-2xl flex items-center justify-center mb-6`}>{c.icon}</div>
                      <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{c.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-semibold">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section id="tech-stack" className="py-16 bg-transparent">
          <div className="max-w-7xl mx-auto px-8 border-b border-slate-200 pb-16">
            <div className="text-center text-[10px] font-black tracking-[0.3em] uppercase text-slate-500 mb-12">
              DIBANGUN DENGAN TEKNOLOGI MODERN
            </div>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {["ESP32 & C++", "MQTT MOSQUITTO", "NODE.JS", "NEXT.JS & REACT", "FIREBASE CLOUD", "GCP VM", "HADOOP HDFS", "APACHE SPARK", "GROQ AI"].map((name) => (
                <div key={name} className="bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl shadow-[0_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_16px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 cursor-default group">
                  <span className="text-[11px] font-black tracking-[0.15em] text-slate-500 group-hover:text-secondary transition-colors uppercase">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT PROJECT ── */}
        <section id="about-project" className="py-24 bg-transparent">
          <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="text-7xl text-secondary/20 font-serif leading-none mb-2 select-none">“</div>
              <p className="text-2xl text-slate-900 leading-relaxed mb-8 font-extrabold tracking-tight">
                Misi utama kami adalah merancang sistem kontrol yang efisien untuk mengatasi antrean asimetris pada model pertigaan. SMARTRAF membuktikan bahwa IoT dan infrastruktur *cloud* dapat dikolaborasikan untuk tata kelola jalan yang lebih cerdas.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-secondary flex items-center justify-center text-sm font-black">K6</div>
                <div>
                  <div className="text-xs font-black text-slate-900 uppercase tracking-widest">Tim Pengembang (PBL)</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest">Kelompok 6 • Politeknik Negeri Malang</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-8 min-w-[300px] w-full lg:w-auto rounded-[28px] shadow-[0_12px_36px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Fokus Penyelesaian</span>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Pembagian Beban Asimetris", val: 100 },
                  { label: "Stabilitas Komunikasi MQTT", val: 95 },
                  { label: "Sinkronisasi Dashboard UI", val: 90 }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                      <span>{item.label}</span><span>{item.val}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div className="h-full bg-linear-to-r from-secondary to-secondary-hover rounded-full transition-all duration-1000" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="bg-[#0F172A] text-white rounded-[32px] p-12 sm:p-16 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-800">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-12 -translate-x-12 pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">Uji Coba Sistem Secara Langsung</h2>
                <p className="text-slate-350 text-base sm:text-lg mb-10 max-w-xl mx-auto font-medium">
                  Masuk ke dasbor kontrol untuk memantau simulasi antrean sensor, status lampu T-Junction, dan melakukan intervensi darurat (Override Manual).
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="/login" className="bg-secondary hover:bg-secondary-hover text-white font-extrabold px-8 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-black/10 active:scale-95">
                    MASUK KE DASBOR
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}