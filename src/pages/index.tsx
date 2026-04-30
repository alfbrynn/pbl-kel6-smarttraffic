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

  return (
    <>
      <Head>
        <title>SMARTRAF – Adaptive Smart Traffic Light</title>
        <meta name="description" content="Sistem Pemantauan Lalu Lintas Adaptif untuk Pertigaan (T-Junction)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">

        {/* ── NAVBAR ── */}
        <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-1 transition-all duration-500 ${scrolled ? "bg-[#0a1628]/95 backdrop-blur-md shadow-lg border-b border-white/5" : "bg-transparent"
          }`}>
          <div className="flex items-center select-none group cursor-pointer">
            <h1 className="text-[20px] font-black text-white leading-none m-0 tracking-tighter uppercase transition-transform group-hover:scale-105">
              Smart<span className="text-accent-cyan">raf</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px]">
            {NAV_ITEMS.map(({ label, href }) => (
              <a key={href} href={`#${href}`}
                className={`relative transition-all duration-300 py-1 group ${activeSection === href
                  ? "text-white font-bold"
                  : "text-white/50 hover:text-white"
                  }`}>
                {label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-accent-cyan transition-transform duration-300 origin-left ${activeSection === href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-[11px] bg-white/10 hover:bg-accent-cyan border border-white/20 hover:border-accent-cyan text-white px-5 py-1.5 font-black transition-all rounded-md tracking-widest uppercase hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 active:scale-95">
              Masuk
            </a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-[#0a1628]">
          <div className="absolute inset-0">
            {/* Ganti src dengan gambar perempatan/pertigaan atau biarkan default */}
            <img
              src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop"
              alt="City Traffic"
              className="w-full h-full object-cover object-center opacity-40 will-change-transform"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,22,40,0.97) 0%, rgba(10,22,40,0.8) 40%, rgba(10,22,40,0.3) 70%, rgba(10,22,40,0.1) 100%)' }} />
          </div>
          <div className="relative z-10 w-full px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-white/40 border border-white/10 px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                Adaptive Smart Traffic Light
              </div>
              <h1 className="text-[5.5rem] font-black leading-[0.95] text-white mb-6 tracking-tight">
                Sinkronisasi<br />
                <span className="text-accent-cyan">Real-time</span><br />
                T-Junction.
              </h1>
              <p className="text-white/40 text-lg leading-relaxed mb-10 max-w-md">
                Sistem pengatur lampu lalu lintas adaptif untuk pertigaan berbasis IoT (Edge-Cloud Computing). Merespons antrean kendaraan secara dinamis melalui protokol MQTT.
              </p>
              <div className="flex gap-4">
                <a href="/beranda" className="bg-accent-cyan hover:bg-accent-cyan-hover text-white text-sm font-bold px-8 py-4 transition-all hover:-translate-y-0.5 tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-[0.97]">
                  BUKA DASBOR
                </a>
                <a href="#architecture" className="border border-white/20 text-white/60 text-sm font-bold px-8 py-4 hover:bg-white/5 hover:text-white hover:-translate-y-0.5 transition-all tracking-widest active:scale-[0.97]">
                  LIHAT ARSITEKTUR
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
            <span className="text-[10px] tracking-widest uppercase">Gulir ke Bawah</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
          </div>
        </section>

        {/* ── STATS (REALISTIS) ── */}
        <section className="bg-[#0d1b2a] py-14 border-t border-white/5" ref={statsReveal.ref}>
          <div className="w-full px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
              {[
                { value: nodesCount, suffix: "", label: "Node ESP32 Aktif", color: "text-accent-cyan" },
                { value: jalurCount, suffix: "", label: "Jalur T-Junction", color: "text-white" },
                { value: latencyCount, suffix: "ms", label: "Latensi Sinkronisasi", color: "text-accent-cyan" },
                { value: uptimeCount, suffix: "%", label: "Uptime Server GCP", color: "text-white" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center py-8 px-6">
                  <div className={`text-5xl font-black ${stat.color} mb-2`}>
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-xs text-white/30 uppercase tracking-widest text-center">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MONITORING PREVIEW ── */}
        <section id="monitoring" className="py-20 bg-bg-main">
          <div className="w-full px-8">
            <div className="text-center mb-12">
              <div className="text-xs font-semibold tracking-widest uppercase text-text-secondary mb-3">PEMANTAUAN KENDALI</div>
              <h2 className="text-4xl font-black text-text-main">Kontrol Persimpangan Interaktif</h2>
            </div>
            <div className="flex rounded-2xl overflow-hidden shadow-xl border border-border-color">
              <div className="w-[260px] shrink-0 bg-bg-card p-8 flex flex-col gap-8 border-r border-border-color">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-border-color" />
                  <div className="w-3 h-3 rounded-full bg-border-color" />
                  <div className="w-3 h-3 rounded-full bg-border-color" />
                </div>
                <div>
                  <div className="text-xs text-text-secondary mb-1">Status Komunikasi Broker</div>
                  <div className="text-2xl font-black text-green-500">CONNECTED</div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary mb-2">Beban Memori Node.js</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-bg-main rounded-full overflow-hidden">
                      <div className="h-full bg-accent-cyan/80 rounded-full" style={{ width: "24%" }} />
                    </div>
                    <span className="text-xs text-text-secondary">24MB</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary mb-1">Total Data Masuk (Hari Ini)</div>
                  <div className="text-3xl font-black text-text-main/70">8,421</div>
                </div>
              </div>
              <div className="flex-1 bg-[#0d1b2a] relative overflow-hidden min-h-[420px] flex items-center justify-center p-8">
                {/* Visualisasi Mockup T-Junction sederhana */}
                <div className="w-full max-w-md border-2 border-slate-700 rounded-lg p-6 bg-slate-900/50 relative">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs text-slate-400 font-mono">Live Sync</span>
                  </div>
                  <h3 className="text-white font-bold mb-6">Simulasi Data Masuk (MQTT)</h3>
                  <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>smartraf/sensor/barat</span>
                      <span className="text-emerald-400">"{'{'} jarak: 140, mobil: 0 {'}'}"</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>smartraf/sensor/timur</span>
                      <span className="text-yellow-400">"{'{'} jarak: 80, mobil: 4 {'}'}"</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>smartraf/sensor/selatan</span>
                      <span className="text-red-400">"{'{'} jarak: 15, mobil: 9 {'}'}"</span>
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-700 flex justify-between items-center text-slate-300">
                      <span>smartraf/kontrol</span>
                      <span className="text-accent-cyan text-xs bg-accent-cyan/10 px-2 py-1 rounded">Update Hijau: SELATAN (28s)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ARCHITECTURE ── */}
        <section id="architecture" className="py-20 bg-[#0a1628]">
          <div className="w-full px-8">
            <div className="text-center mb-14">
              <div className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-3">METODOLOGI SISTEM</div>
              <h2 className="text-4xl font-black text-white">Arsitektur Edge-Cloud Computing</h2>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex gap-5 flex-col md:flex-row">
                {[r1, r2].map((rv, idx) => {
                  const cards = [
                    {
                      flex: "flex-[2]", borderColor: "border-l-accent-cyan",
                      icon: <svg className="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
                      title: "Logika Adaptif Server (Node.js)",
                      desc: "Perhitungan beban antrean dan keputusan durasi lampu dieksekusi di server terpusat. Mengurangi beban komputasi pada mikrokontroler dan memungkinkan penyesuaian parameter dari jarak jauh.",
                    },
                    {
                      flex: "flex-1", borderColor: "border-l-slate-500",
                      icon: <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                      title: "Otonomi Edge (ESP32)",
                      desc: "Hitung mundur presisi dan pergantian warna lampu dikontrol langsung oleh ESP32 di lapangan, mencegah lag visual akibat latensi jaringan internet.",
                    },
                  ];
                  const c = cards[idx];
                  return (
                    <div key={idx} ref={rv.ref}
                      className={`${c.flex} bg-white/5 border border-white/8 border-l-4 ${c.borderColor} p-8 transition-all duration-700 ${rv.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                      style={{ transitionDelay: `${idx * 150}ms` }}>
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-5">{c.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-5 flex-col md:flex-row">
                {[r3, r4].map((rv, idx) => {
                  const cards = [
                    {
                      flex: "flex-1", borderColor: "border-l-blue-500",
                      icon: <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
                      title: "Komunikasi MQTT Asinkron",
                      desc: "Menggunakan Mosquitto Broker untuk pertukaran data dua arah yang ringan dan instan antara perangkat IoT dan Cloud Backend.",
                    },
                    {
                      flex: "flex-[2]", borderColor: "border-l-accent-cyan",
                      icon: <svg className="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                      title: "Interpolasi UI Real-Time",
                      desc: "Dashboard Next.js menggunakan teknik estimasi sisi klien (client-side prediction) agar visualisasi hitung mundur dan progress bar antrean terlihat mulus tanpa delay.",
                    },
                  ];
                  const c = cards[idx];
                  return (
                    <div key={idx} ref={rv.ref}
                      className={`${c.flex} bg-white/5 border border-white/8 border-l-4 ${c.borderColor} p-8 transition-all duration-700 ${rv.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                      style={{ transitionDelay: `${(idx + 2) * 150}ms` }}>
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-5">{c.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section id="tech-stack" className="py-16 bg-bg-main border-b border-border-color">
          <div className="w-full px-8">
            <div className="text-center text-xs font-semibold tracking-widest uppercase text-text-secondary mb-12">
              DIBANGUN DENGAN TEKNOLOGI MODERN
            </div>
            <div className="flex items-center justify-center gap-12 flex-wrap">
              {["ESP32 & C++", "MQTT MOSQUITTO", "NODE.JS", "NEXT.JS & REACT", "FIREBASE CLOUD", "GCP VM"].map((name) => (
                <div key={name} className="opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-default">
                  <span className="text-sm font-black tracking-widest text-slate-500">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT PROJECT ── */}
        <section id="about-project" className="py-24 bg-bg-main">
          <div className="w-full px-8 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="text-6xl text-bg-card-alt font-serif leading-none mb-4">"</div>
              <p className="text-2xl text-text-main/80 leading-relaxed mb-8 font-light">
                Misi utama kami adalah merancang sistem kontrol yang efisien untuk mengatasi antrean asimetris pada model pertigaan. SMARTRAF membuktikan bahwa IoT dan infrastruktur *cloud* dapat dikolaborasikan untuk tata kelola jalan yang lebih cerdas.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-sm font-bold text-accent-cyan">K6</div>
                <div>
                  <div className="text-sm font-semibold text-text-main">Tim Pengembang (PBL)</div>
                  <div className="text-xs text-text-secondary mt-0.5">Kelompok 6 • Politeknik Negeri Malang</div>
                </div>
              </div>
            </div>
            <div className="bg-bg-card border border-border-color p-8 min-w-[280px] rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-text-main">Fokus Penyelesaian</span>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Pembagian Beban Asimetris (3 Jalur)", val: 100 },
                  { label: "Stabilitas Komunikasi MQTT", val: 95 },
                  { label: "Sinkronisasi Dashboard UI", val: 90 }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-text-secondary mb-2">
                      <span>{item.label}</span><span>{item.val}%</span>
                    </div>
                    <div className="h-1.5 bg-bg-main rounded-full overflow-hidden">
                      <div className="h-full bg-accent-cyan rounded-full transition-all duration-1000" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-28 bg-[#0a1628] text-center relative overflow-hidden border-t border-white/5">
          <div className="relative z-10 w-full px-8">
            <h2 className="text-5xl font-black text-white mb-4">Uji Coba Sistem Secara Langsung</h2>
            <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto">
              Masuk ke dasbor kontrol untuk memantau simulasi antrean sensor, status lampu T-Junction, dan melakukan intervensi darurat (Override Manual).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/beranda" className="bg-accent-cyan text-white font-bold px-10 py-4 hover:bg-accent-cyan-hover transition-colors text-sm tracking-widest rounded-sm">
                MASUK KE DASBOR
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-[#060e1a] py-12">
          <div className="w-full px-8 flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="flex items-center gap-3 select-none">
              <div>
                <div className="text-[18px] font-bold tracking-wide uppercase text-white">Smartraf</div>
                <p className="text-xs text-white/30 mt-0.5">© 2026 PBL Kelompok 6. Teknologi Informasi Polinema.</p>
              </div>
            </div>
            <div className="flex gap-10 text-xs text-white/30">
              <span className="hover:text-white/60 transition-colors cursor-pointer">Dokumentasi API</span>
              <span className="hover:text-white/60 transition-colors cursor-pointer">Skema Rangkaian ESP32</span>
              <span className="hover:text-white/60 transition-colors cursor-pointer">Repositori Git</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}