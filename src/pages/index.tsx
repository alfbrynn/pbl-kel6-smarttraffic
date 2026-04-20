"use client";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { label: "Monitoring", href: "monitoring" },
  { label: "AI Analytics", href: "ai-analytics" },
  { label: "Infrastructure", href: "infrastructure" },
  { label: "Data Profile", href: "data-profile" },
];

function useCounter(target: number, duration = 1800, start = false) {
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
  const nodesCount = useCounter(1284, 1600, statsReveal.visible);
  const uptimeCount = useCounter(99, 1200, statsReveal.visible);
  const citiesCount = useCounter(47, 1400, statsReveal.visible);
  const alertsCount = useCounter(3, 800, statsReveal.visible);

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
        <title>SMARTRAF – Smart Traffic Monitoring System</title>
        <meta name="description" content="Smart Traffic Monitoring System berbasis IoT." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">

        {/* ── NAVBAR ── */}
        <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-1.5 transition-all duration-500 ${
          scrolled ? "bg-[#0a1628]/95 backdrop-blur shadow-lg" : "bg-transparent"
        }`}>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="SMARTRAF" className="h-14 w-auto object-contain" />
            <span className="text-sm font-black tracking-widest uppercase text-white">SMARTRAF</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            {NAV_ITEMS.map(({ label, href }) => (
              <a key={href} href={`#${href}`}
                className={`transition-all duration-300 pb-0.5 ${
                  activeSection === href
                    ? "text-white font-semibold border-b border-white/60"
                    : "text-white/50 hover:text-white"
                }`}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm text-white/50 hover:text-white transition-colors">Login</a>
            <a href="#" className="text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 font-semibold transition-colors rounded-lg">
              Get Started
            </a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-[#0a1628]">
          <div className="absolute inset-0">
            <img
              src="/city-traffic.jpg"
              alt="City Traffic"
              className="w-full h-full object-cover object-center opacity-60 will-change-transform"
            />
            <div className="absolute inset-0" style={{background:'linear-gradient(to right, rgba(10,22,40,0.97) 0%, rgba(10,22,40,0.8) 40%, rgba(10,22,40,0.3) 70%, rgba(10,22,40,0.1) 100%)'}} />
          </div>
          <div className="relative z-10 w-full px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-white/40 border border-white/10 px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                Smart Traffic Monitoring System
              </div>
              <h1 className="text-[5.5rem] font-black leading-[0.95] text-white mb-6 tracking-tight">
                Kinetic<br />
                <span className="text-cyan-400">Intelligence</span><br />
                for Urban Flow.
              </h1>
              <p className="text-white/40 text-lg leading-relaxed mb-10 max-w-md">
                Sistem monitoring lalu lintas berbasis IoT secara real-time untuk pengelolaan kota yang lebih cerdas.
              </p>
              <div className="flex gap-4">
                <a href="/beranda" className="bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-bold px-8 py-4 transition-all hover:-translate-y-0.5 tracking-widest active:scale-[0.97]">
                  BUKA DASBOR
                </a>
                <a href="#monitoring" className="border border-white/20 text-white/60 text-sm font-bold px-8 py-4 hover:bg-white/5 hover:text-white hover:-translate-y-0.5 transition-all tracking-widest active:scale-[0.97]">
                  PELAJARI LEBIH
                </a>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
            <span className="text-[10px] tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="bg-[#0d1b2a] py-14 border-t border-white/5" ref={statsReveal.ref}>
          <div className="w-full px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
              {[
                { value: nodesCount, suffix: "", label: "Active Nodes", color: "text-cyan-400" },
                { value: uptimeCount, suffix: "%", label: "System Uptime", color: "text-white" },
                { value: citiesCount, suffix: "+", label: "Cities Connected", color: "text-cyan-400" },
                { value: alertsCount, suffix: "", label: "Active Alerts", color: "text-red-400" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center py-8 px-6">
                  <div className={`text-5xl font-black ${stat.color} mb-2`}>
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-xs text-white/30 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MONITORING ── */}
        <section id="monitoring" className="py-20 bg-white">
          <div className="w-full px-8">
            <div className="text-center mb-12">
              <div className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">CONNECTED CITIES</div>
              <h2 className="text-4xl font-black text-[#0a1628]">Curated Clarity for Complex Data</h2>
            </div>
            <div className="flex rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <div className="w-[260px] shrink-0 bg-white p-8 flex flex-col gap-8 border-r border-gray-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Active Nodes</div>
                  <div className="text-4xl font-black text-[#0a1628]">1,284</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2">System Load</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: "67%" }} />
                    </div>
                    <span className="text-xs text-gray-400">67%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Alerts</div>
                  <div className="text-4xl font-black text-gray-700">03</div>
                </div>
              </div>
              <div className="flex-1 bg-[#0d1b2a] relative overflow-hidden min-h-[420px]">
                <div className="absolute top-5 left-6 text-[10px] text-white/30 uppercase tracking-widest">Live Traffic Index</div>
                <div className="absolute top-4 right-6 w-28 h-28">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3.5" strokeDasharray="78 22" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/60 text-sm font-bold">78%</span>
                  </div>
                </div>
                <div className="absolute left-0 right-0 flex items-end gap-2 px-6 pb-10" style={{ bottom: 32, top: 48 }}>
                  {[28,42,35,55,38,62,45,52,36,58,48,65,44,55,38,48,32,42,52,36].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm" style={{
                      height: `${h}%`,
                      background: i===12 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)",
                    }} />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#0a1520] flex items-center px-6 gap-4">
                  <div className="h-2 w-16 bg-white/20 rounded-full" />
                  {["0/0","1:1.0","D:0","0:0.1","0:0.2","0:0.3"].map((t) => (
                    <span key={t} className="text-[9px] text-white/20">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="ai-analytics" className="py-20 bg-[#0a1628]">
          <div className="w-full px-8">
            <div className="text-center mb-14">
              <div className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-3">AI ANALYTICS</div>
              <h2 className="text-4xl font-black text-white">Built for Urban Intelligence</h2>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                {[r1, r2].map((rv, idx) => {
                  const cards = [
                    {
                      flex: "flex-[2]", borderColor: "border-l-cyan-500",
                      icon: <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                      title: "Predictive Analytics",
                      desc: "Model AI memproses jutaan titik data untuk memprediksi kemacetan sebelum terjadi.",
                      extra: <div className="flex gap-8 mt-6"><div><div className="text-3xl font-black text-cyan-400">98.4%</div><div className="text-xs text-white/30 tracking-widest mt-1">ACCURACY</div></div><div><div className="text-3xl font-black text-cyan-400">&lt;2ms</div><div className="text-xs text-white/30 tracking-widest mt-1">LATENCY</div></div></div>,
                    },
                    {
                      flex: "flex-1", borderColor: "border-l-slate-500",
                      icon: <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>,
                      title: "Eco Optimization",
                      desc: "Kurangi emisi karbon kota dengan mengoptimalkan arus kendaraan di area padat.",
                      extra: null,
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
                      {c.extra}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-5">
                {[r3, r4].map((rv, idx) => {
                  const cards = [
                    {
                      flex: "flex-1", borderColor: "border-l-blue-500",
                      icon: <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                      title: "Hardened Security",
                      desc: "Enkripsi tingkat tinggi untuk semua aliran data dan node pemrosesan.",
                      extra: null,
                    },
                    {
                      flex: "flex-[2]", borderColor: "border-l-cyan-500",
                      icon: <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                      title: "Unified Integration",
                      desc: "Terhubung dengan hardware lama dan sensor IoT modern melalui API universal.",
                      extra: null,
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
                      {c.extra}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUSTED BY ── */}
        <section id="infrastructure" className="py-16 bg-white">
          <div className="w-full px-8">
            <div className="text-center text-xs font-semibold tracking-widest uppercase text-gray-300 mb-12">
              TRUSTED BY GLOBAL SMART CITY LEADERS
            </div>
            <div className="flex items-center justify-center gap-10 flex-wrap">
              {["SEGCORE","VOLT-X","METRA","SYNAPSE","AERIS"].map((name) => (
                <div key={name} className="opacity-30 hover:opacity-60 transition-opacity duration-300 cursor-pointer">
                  <span className="text-sm font-black tracking-widest text-gray-400">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL ── */}
        <section id="data-profile" className="py-24 bg-white">
          <div className="w-full px-8 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="text-6xl text-gray-100 font-serif leading-none mb-4">"</div>
              <p className="text-2xl text-gray-600 leading-relaxed mb-8 font-light">
                SMARTRAF telah mengubah cara kami mengelola infrastruktur kota. Data yang kompleks menjadi lebih mudah dipahami oleh para pengambil keputusan.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-sm font-bold text-cyan-600">SV</div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Dr. Steve Vance</div>
                  <div className="text-xs text-gray-400 mt-0.5">Director of Infrastructure, Metropolis City</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-8 min-w-[280px] rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-gray-700">Efficiency Score</span>
                <span className="text-sm font-bold text-cyan-500">+302%</span>
              </div>
              <div className="space-y-4">
                {[{label:"Traffic Flow",val:92},{label:"Energy Use",val:74},{label:"Response Time",val:88}].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>{item.label}</span><span>{item.val}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-28 bg-[#0a1628] text-center relative overflow-hidden">
          <div className="relative z-10 w-full px-8">
            <h2 className="text-5xl font-black text-white mb-4">Siap mengelola kota lebih cerdas?</h2>
            <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto">
              Bergabung dengan generasi berikutnya pengelola kota pintar menggunakan SMARTRAF.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/login" className="bg-white text-[#0a1628] font-bold px-10 py-4 hover:bg-white/90 transition-colors text-sm tracking-widest">
                MULAI SEKARANG
              </a>
              <a href="#monitoring" className="border border-white/20 text-white/60 font-bold px-10 py-4 hover:bg-white/5 hover:text-white transition-colors text-sm tracking-widest">
                PELAJARI PLATFORM
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-[#060e1a] py-12">
          <div className="w-full px-8 flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="SMARTRAF" className="h-10 w-auto object-contain" />
              <div>
                <div className="text-sm font-black tracking-widest uppercase text-white">SMARTRAF</div>
                <p className="text-xs text-white/30 mt-0.5">© 2024. Integrated Urban Traffic Management System.</p>
              </div>
            </div>
            <div className="flex gap-10 text-xs text-white/30">
              <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
              <a href="#" className="hover:text-white/60 transition-colors">API Documentation</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
