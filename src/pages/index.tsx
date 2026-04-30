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

      <div className="min-h-screen bg-bg-main font-sans text-text-main overflow-x-hidden">

        {/* ── NAVBAR ── */}
        <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-500 ${scrolled ? "bg-bg-main/95 backdrop-blur-md shadow-lg border-b border-border-color py-3" : "bg-transparent"
          }`}>
          <div className="flex items-center select-none group cursor-pointer">
            <h1 className="text-[20px] font-black text-text-main leading-none m-0 tracking-tighter uppercase transition-transform group-hover:scale-105">
              Smart<span className="text-accent-cyan">raf</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px]">
            {NAV_ITEMS.map(({ label, href }) => (
              <a key={href} href={`#${href}`}
                className={`relative transition-all duration-300 py-1 group ${activeSection === href
                  ? "text-text-main font-bold"
                  : "text-text-secondary hover:text-text-main"
                  }`}>
                {label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-accent-cyan transition-transform duration-300 origin-left ${activeSection === href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-[11px] bg-bg-card hover:bg-accent-cyan border border-border-color hover:border-accent-cyan text-text-main hover:text-white px-5 py-1.5 font-black transition-all rounded-md tracking-widest uppercase hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 active:scale-95">
              Masuk
            </a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-bg-main">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop"
              alt="City Traffic"
              className="w-full h-full object-cover object-center opacity-40 will-change-transform dark:opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/80 to-transparent" />
          </div>
          <div className="relative z-10 w-full px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-text-secondary border border-border-color bg-bg-card/50 px-4 py-1.5 mb-8 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                Adaptive Smart Traffic Light
              </div>
              <h1 className="text-[5.5rem] font-black leading-[0.95] text-text-main mb-6 tracking-tight">
                Sinkronisasi<br />
                <span className="text-accent-cyan">Real-time</span><br />
                T-Junction.
              </h1>
              <p className="text-text-secondary text-lg leading-relaxed mb-16 max-w-md font-medium">
                Sistem pengatur lampu lalu lintas adaptif untuk pertigaan berbasis IoT (Edge-Cloud Computing). Merespons antrean kendaraan secara dinamis melalui protokol MQTT.
              </p>
              <div className="flex gap-4">
                <a href="/login" className="bg-accent-cyan hover:bg-accent-cyan-hover text-white text-[12px] font-black px-8 py-4 transition-all hover:-translate-y-0.5 tracking-[0.2em] uppercase shadow-lg shadow-accent-cyan/30 active:scale-[0.97]">
                  BUKA DASBOR
                </a>
                <a href="#architecture" className="bg-bg-card border border-border-color text-text-secondary text-[12px] font-black px-8 py-4 hover:bg-bg-hover hover:text-text-main hover:-translate-y-0.5 transition-all tracking-[0.2em] uppercase active:scale-[0.97]">
                  LIHAT ARSITEKTUR
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary/40">
            <div className="w-px h-8 bg-gradient-to-b from-border-color to-transparent animate-pulse" />
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="bg-bg-card py-14 border-y border-border-color" ref={statsReveal.ref}>
          <div className="w-full px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border-color">
              {[
                { value: nodesCount, suffix: "", label: "Node ESP32 Aktif", color: "text-accent-cyan" },
                { value: jalurCount, suffix: "", label: "Jalur T-Junction", color: "text-text-main" },
                { value: latencyCount, suffix: "ms", label: "Latensi Sinkronisasi", color: "text-accent-cyan" },
                { value: uptimeCount, suffix: "%", label: "Uptime Server GCP", color: "text-text-main" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center py-8 px-6 transition-transform hover:scale-105 duration-500">
                  <div className={`text-5xl font-black ${stat.color} mb-2 tracking-tighter`}>
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-[10px] text-text-secondary uppercase font-black tracking-[0.2em] text-center">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MONITORING PREVIEW ── */}
        <section id="monitoring" className="py-20 bg-bg-main">
          <div className="w-full px-8">
            <div className="text-center mb-12">
              <div className="text-[10px] font-black tracking-[0.2em] uppercase text-text-secondary mb-3">PEMANTAUAN KENDALI</div>
              <h2 className="text-4xl font-black text-text-main tracking-tight">Kontrol Persimpangan Interaktif</h2>
            </div>
            <div className="flex rounded-2xl overflow-hidden shadow-2xl border border-border-color">
              <div className="w-[260px] shrink-0 bg-bg-card p-8 flex flex-col gap-8 border-r border-border-color">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-border-color" />
                  <div className="w-3 h-3 rounded-full bg-border-color" />
                  <div className="w-3 h-3 rounded-full bg-border-color" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Status Komunikasi Broker</div>
                  <div className="text-2xl font-black text-accent-green">CONNECTED</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2">Beban Memori Node.js</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-bg-main rounded-full overflow-hidden">
                      <div className="h-full bg-accent-cyan/80 rounded-full" style={{ width: "24%" }} />
                    </div>
                    <span className="text-[10px] font-bold text-text-secondary">24MB</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Total Data Masuk</div>
                  <div className="text-3xl font-black text-text-main/70 tracking-tighter">8,421</div>
                </div>
              </div>
              <div className="flex-1 bg-bg-card-alt relative overflow-hidden min-h-[420px] flex items-center justify-center p-8">
                {/* Visualisasi Mockup T-Junction */}
                <div className="w-full max-w-md border border-border-color rounded-xl p-6 bg-bg-card shadow-sm relative">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-red animate-ping" />
                    <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Live Sync</span>
                  </div>
                  <h3 className="text-text-main font-black text-sm mb-6 tracking-tight uppercase">Simulasi Data Masuk (MQTT)</h3>
                  <div className="space-y-4 font-mono text-[11px] font-medium">
                    <div className="flex justify-between items-center text-text-secondary">
                      <span>smartraf/sensor/barat</span>
                      <span className="text-accent-green">"{'{'} jarak: 140, mobil: 0 {'}'}"</span>
                    </div>
                    <div className="flex justify-between items-center text-text-secondary">
                      <span>smartraf/sensor/timur</span>
                      <span className="text-accent-orange">"{'{'} jarak: 80, mobil: 4 {'}'}"</span>
                    </div>
                    <div className="flex justify-between items-center text-text-secondary">
                      <span>smartraf/sensor/selatan</span>
                      <span className="text-accent-red">"{'{'} jarak: 15, mobil: 9 {'}'}"</span>
                    </div>
                    <div className="mt-8 pt-4 border-t border-border-color flex justify-between items-center text-text-main">
                      <span className="font-bold uppercase tracking-widest">Kontrol</span>
                      <span className="text-accent-cyan bg-accent-cyan/10 px-2 py-1 rounded font-bold uppercase tracking-widest">Update Hijau: SELATAN (28s)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ARCHITECTURE ── */}
        <section id="architecture" className="py-20 bg-bg-card border-y border-border-color">
          <div className="w-full px-8">
            <div className="text-center mb-14">
              <div className="text-[10px] font-black tracking-[0.2em] uppercase text-text-secondary mb-3">METODOLOGI SISTEM</div>
              <h2 className="text-4xl font-black text-text-main tracking-tight">Arsitektur Edge-Cloud Computing</h2>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex gap-5 flex-col md:flex-row">
                {[r1, r2].map((rv, idx) => {
                  const cards = [
                    {
                      flex: "flex-[2]", borderColor: "border-l-accent-cyan",
                      icon: <svg className="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
                      title: "Logika Adaptif Server (Node.js)",
                      desc: "Perhitungan beban antrean dan keputusan durasi lampu dieksekusi di server terpusat. Mengurangi beban komputasi pada mikrokontroler dan memungkinkan penyesuaian parameter dari jarak jauh.",
                    },
                    {
                      flex: "flex-1", borderColor: "border-l-text-secondary",
                      icon: <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                      title: "Otonomi Edge (ESP32)",
                      desc: "Hitung mundur presisi dan pergantian warna lampu dikontrol langsung oleh ESP32 di lapangan, mencegah lag visual akibat latensi jaringan internet.",
                    },
                  ];
                  const c = cards[idx];
                  return (
                    <div key={idx} ref={rv.ref}
                      className={`${c.flex} bg-bg-card border border-border-color border-l-4 ${c.borderColor} p-8 transition-all duration-700 shadow-sm ${rv.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                      style={{ transitionDelay: `${idx * 150}ms` }}>
                      <div className="w-10 h-10 bg-bg-main rounded-xl flex items-center justify-center mb-5">{c.icon}</div>
                      <h3 className="text-xl font-black text-text-main mb-3 tracking-tight">{c.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed font-medium">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-5 flex-col md:flex-row">
                {[r3, r4].map((rv, idx) => {
                  const cards = [
                    {
                      flex: "flex-1", borderColor: "border-l-accent-green",
                      icon: <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
                      title: "Komunikasi MQTT Asinkron",
                      desc: "Menggunakan Mosquitto Broker untuk pertukaran data dua arah yang ringan dan instan antara perangkat IoT dan Cloud Backend.",
                    },
                    {
                      flex: "flex-[2]", borderColor: "border-l-accent-cyan",
                      icon: <svg className="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                      title: "Interpolasi UI Real-Time",
                      desc: "Dashboard Next.js menggunakan teknik estimasi sisi klien (client-side prediction) agar visualisasi hitung mundur dan progress bar antrean terlihat mulus tanpa delay.",
                    },
                  ];
                  const c = cards[idx];
                  return (
                    <div key={idx} ref={rv.ref}
                      className={`${c.flex} bg-bg-card border border-border-color border-l-4 ${c.borderColor} p-8 transition-all duration-700 shadow-sm ${rv.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                      style={{ transitionDelay: `${(idx + 2) * 150}ms` }}>
                      <div className="w-10 h-10 bg-bg-main rounded-xl flex items-center justify-center mb-5">{c.icon}</div>
                      <h3 className="text-xl font-black text-text-main mb-3 tracking-tight">{c.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed font-medium">{c.desc}</p>
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
            <div className="text-center text-[10px] font-black tracking-[0.3em] uppercase text-text-secondary mb-12">
              DIBANGUN DENGAN TEKNOLOGI MODERN
            </div>
            <div className="flex items-center justify-center gap-12 flex-wrap">
              {["ESP32 & C++", "MQTT MOSQUITTO", "NODE.JS", "NEXT.JS & REACT", "FIREBASE CLOUD", "GCP VM"].map((name) => (
                <div key={name} className="opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-default">
                  <span className="text-[12px] font-black tracking-[0.2em] text-text-secondary uppercase">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT PROJECT ── */}
        <section id="about-project" className="py-24 bg-bg-main">
          <div className="w-full px-8 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="text-6xl text-accent-cyan font-serif leading-none mb-4 opacity-50">"</div>
              <p className="text-2xl text-text-main leading-relaxed mb-8 font-medium tracking-tight">
                Misi utama kami adalah merancang sistem kontrol yang efisien untuk mengatasi antrean asimetris pada model pertigaan. SMARTRAF membuktikan bahwa IoT dan infrastruktur *cloud* dapat dikolaborasikan untuk tata kelola jalan yang lebih cerdas.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-sm font-black text-accent-cyan">K6</div>
                <div>
                  <div className="text-sm font-black text-text-main uppercase tracking-widest">Tim Pengembang (PBL)</div>
                  <div className="text-[10px] text-text-secondary mt-0.5 font-bold uppercase tracking-widest">Kelompok 6 • Politeknik Negeri Malang</div>
                </div>
              </div>
            </div>
            <div className="bg-bg-card border border-border-color p-8 min-w-[280px] rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-black text-text-main uppercase tracking-widest">Fokus Penyelesaian</span>
              </div>
              <div className="space-y-5">
                {[
                  { label: "Pembagian Beban Asimetris", val: 100 },
                  { label: "Stabilitas Komunikasi MQTT", val: 95 },
                  { label: "Sinkronisasi Dashboard UI", val: 90 }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2.5">
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
        <section className="py-28 bg-bg-main text-center relative overflow-hidden border-t border-border-color">
          <div className="relative z-10 w-full px-8">
            <h2 className="text-5xl font-black text-text-main mb-4 tracking-tighter">Uji Coba Sistem Secara Langsung</h2>
            <p className="text-text-secondary text-lg mb-12 max-w-xl mx-auto font-medium">
              Masuk ke dasbor kontrol untuk memantau simulasi antrean sensor, status lampu T-Junction, dan melakukan intervensi darurat (Override Manual).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/login" className="bg-accent-cyan text-white font-black px-10 py-4 hover:bg-accent-cyan-hover transition-all hover:-translate-y-0.5 text-[12px] tracking-[0.2em] uppercase shadow-lg shadow-accent-cyan/20 active:scale-95">
                MASUK KE DASBOR
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-bg-card py-12 border-t border-border-color">
          <div className="w-full px-8 flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="flex items-center gap-3 select-none">
              <div>
                <div className="text-[18px] font-black tracking-[0.2em] uppercase text-text-main">Smartraf</div>
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">© 2026 PBL Kelompok 6. Politeknik Negeri Malang.</p>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}