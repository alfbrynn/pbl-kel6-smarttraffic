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

// Animated counter hook
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

// Scroll reveal hook
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
  const reveals = [r1, r2, r3, r4];

  return (
    <>
      <Head>
        <title>SMARTRAF – Kinetic Intelligence for Urban Flow</title>
        <meta name="description" content="A living infrastructure operating system designed for the speed of light." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">

        {/* ── NAVBAR ── */}
        <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500 ${
          scrolled ? "bg-[#0a1628]/95 backdrop-blur shadow-lg" : "bg-transparent"
        }`}>
          <img src="/logo.png" alt="SMARTRAF" className="h-10 w-auto object-contain" />
          <div className="hidden md:flex items-center gap-8 text-sm">
            {NAV_ITEMS.map(({ label, href }) => (
              <a key={href} href={`#${href}`}
                className={`transition-all duration-300 pb-0.5 ${
                  activeSection === href
                    ? "text-emerald-400 font-semibold border-b-2 border-emerald-400"
                    : "text-white/70 hover:text-white"
                }`}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm text-white/70 hover:text-white transition-colors">Login</a>
            <a href="#" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 font-semibold transition-colors">
              Get Started
            </a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-[#0a1628]" data-parallax>
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-parallax-img
              src="/city-traffic.jpg"
              alt="City Traffic"
              className="w-full h-full object-cover object-center opacity-70 will-change-transform"
            />
            <div className="absolute inset-0" style={{background:'linear-gradient(135deg, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.4) 50%, rgba(10,22,40,0.15) 100%)'}} />
          </div>
          <div className="relative z-10 w-full px-8 flex items-center justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 mb-8"
                data-reveal data-reveal-delay="1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                NEXT-GEN TELEMETRY
              </div>
              <h1 className="text-[5.5rem] font-black leading-[0.95] text-white mb-6 tracking-tight"
                data-reveal data-reveal-delay="2">
                Kinetic<br />
                <span className="text-emerald-400">Intelligence</span><br />
                for Urban Flow.
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-md"
                data-reveal data-reveal-delay="3">
                A living infrastructure operating system designed for the speed of light. Real-time city-scale data transformed into actionable precision.
              </p>
              <div className="flex gap-4" data-reveal data-reveal-delay="4">
                <a href="/beranda" className="ripple bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold px-8 py-4 transition-all hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 tracking-widest active:scale-[0.97]">
                  LAUNCH DASHBOARD
                </a>
                <a href="#monitoring" className="ripple border border-white/30 text-white text-sm font-bold px-8 py-4 hover:bg-white/10 hover:-translate-y-0.5 transition-all tracking-widest active:scale-[0.97]">
                  EXPLORE PLATFORM
                </a>
              </div>
            </div>

            {/* Glassmorphism metric card */}
            <div className="hidden lg:block bg-white/5 backdrop-blur-xl border border-white/10 p-7 w-[280px] mr-12">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Current Velocity</span>
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-4xl font-black text-emerald-400 mb-4 pb-4 border-b border-white/10">842.5 MB/s</div>
              <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest">
                <span>Network Load</span>
                <span>67% Optimum</span>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
            <span className="text-[10px] tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
          </div>
        </section>

        {/* ── STATS COUNTER — dark navy (Pertamina style) ── */}
        <section className="bg-[#0a1628] py-16 border-t border-white/5" ref={statsReveal.ref}>
          <div className="w-full px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
              {[
                { value: nodesCount, suffix: "", label: "Active Nodes", color: "text-emerald-400" },
                { value: uptimeCount, suffix: "%", label: "System Uptime", color: "text-blue-400" },
                { value: citiesCount, suffix: "+", label: "Cities Connected", color: "text-emerald-400" },
                { value: alertsCount, suffix: "", label: "Active Alerts", color: "text-red-400" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center py-8 px-6">
                  <div className={`text-5xl font-black ${stat.color} mb-2`}>
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MONITORING DASHBOARD ── */}
        <section id="monitoring" className="py-20 bg-white">
          <div className="w-full px-8">
            <div className="text-center mb-12">
              <div className="text-xs font-semibold tracking-widest uppercase text-emerald-500 mb-3">CONNECTED CITIES</div>
              <h2 className="text-4xl font-black text-[#0a1628]">Curated Clarity for Complex Data</h2>
            </div>
            <div className="flex rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <div className="w-[260px] shrink-0 bg-white p-8 flex flex-col gap-8 border-r border-gray-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Active Nodes</div>
                  <div className="text-4xl font-black text-[#0a1628]">1,284</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2">System Load</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: "67%" }} />
                    </div>
                    <span className="text-xs text-gray-400">67%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Alerts</div>
                  <div className="text-4xl font-black text-red-500">03</div>
                </div>
              </div>
              <div className="flex-1 bg-[#0d1b2a] relative overflow-hidden min-h-[420px]">
                <div className="absolute top-5 left-6 text-[10px] text-white/30 uppercase tracking-widest">Live Traffic Index</div>
                <div className="absolute top-4 right-6 w-28 h-28">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="78 22" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm font-bold">78%</span>
                  </div>
                </div>
                <div className="absolute left-0 right-0 flex items-end gap-2 px-6 pb-10" style={{ bottom: 32, top: 48 }}>
                  {[28,42,35,55,38,62,45,52,36,58,48,65,44,55,38,48,32,42,52,36].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm" style={{
                      height: `${h}%`,
                      background: i===12 ? "#10b981" : i>12 ? `rgba(45,212,191,${0.25+(i-12)*0.05})` : "rgba(255,255,255,0.1)",
                    }} />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#0a1520] flex items-center px-6 gap-4">
                  <div className="h-2 w-16 bg-emerald-400 rounded-full" />
                  {["0/0","1:1.0","D:0","0:0.1","0:0.2","0:0.3"].map((t) => (
                    <span key={t} className="text-[9px] text-white/20">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES — dark bg like Pertamina alternating ── */}
        <section id="ai-analytics" className="py-20 bg-[#0a1628]">
          <div className="w-full px-8">
            <div className="text-center mb-14">
              <div className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-3">AI ANALYTICS</div>
              <h2 className="text-4xl font-black text-white">Built for Urban Intelligence</h2>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                {[r1, r2].map((rv, idx) => {
                  const cards = [
                    {
                      flex: "flex-[2]", border: "border-emerald-400",
                      icon: <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                      iconBg: "bg-emerald-500/10",
                      title: "Predictive Analytics",
                      desc: "Our proprietary AI models process millions of data points to forecast traffic congestion before it happens, allowing for proactive urban management.",
                      extra: <div className="flex gap-8 mt-6"><div><div className="text-3xl font-black text-emerald-400">98.4%</div><div className="text-xs text-white/40 tracking-widest mt-1">ACCURACY</div></div><div><div className="text-3xl font-black text-emerald-400">&lt;2ms</div><div className="text-xs text-white/40 tracking-widest mt-1">LATENCY</div></div></div>,
                    },
                    {
                      flex: "flex-1", border: "border-green-400",
                      icon: <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>,
                      iconBg: "bg-green-500/10",
                      title: "Eco Optimization",
                      desc: "Reduce urban carbon footprint by streamlining vehicle throughput in high-density areas.",
                      extra: <a href="#" className="inline-block mt-6 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">Sustainability Report ↗</a>,
                    },
                  ];
                  const c = cards[idx];
                  return (
                    <div key={idx} ref={rv.ref}
                      className={`${c.flex} bg-white/5 border-l-4 ${c.border} p-8 transition-all duration-700 ${rv.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                      style={{ transitionDelay: `${idx * 150}ms` }}>
                      <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center mb-5`}>{c.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed">{c.desc}</p>
                      {c.extra}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-5">
                {[r3, r4].map((rv, idx) => {
                  const cards = [
                    {
                      flex: "flex-1", border: "border-blue-400",
                      icon: <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                      iconBg: "bg-blue-500/10",
                      title: "Hardened Security",
                      desc: "Military-grade encryption for all municipal data streams and edge processing nodes.",
                      extra: null,
                    },
                    {
                      flex: "flex-[2]", border: "border-cyan-400",
                      icon: <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                      iconBg: "bg-cyan-500/10",
                      title: "Unified Integration",
                      desc: "Seamlessly connects with existing legacy hardware and modern IoT sensors via our universal API.",
                      extra: null,
                    },
                  ];
                  const c = cards[idx];
                  return (
                    <div key={idx} ref={rv.ref}
                      className={`${c.flex} bg-white/5 border-l-4 ${c.border} p-8 transition-all duration-700 ${rv.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                      style={{ transitionDelay: `${(idx + 2) * 150}ms` }}>
                      <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center mb-5`}>{c.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed">{c.desc}</p>
                      {c.extra}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUSTED BY — white bg ── */}
        <section id="infrastructure" className="py-16 bg-white">
          <div className="w-full px-8">
            <div className="text-center text-xs font-semibold tracking-widest uppercase text-gray-400 mb-12">
              TRUSTED BY GLOBAL SMART CITY LEADERS
            </div>
            <div className="flex items-center justify-center gap-10 flex-wrap">
              {[
                {
                  name: "SEGCORE",
                  logo: (
                    <svg viewBox="0 0 120 40" className="h-8 w-auto" fill="none">
                      <rect x="2" y="8" width="24" height="24" rx="4" fill="#CBD5E1"/>
                      <rect x="6" y="12" width="7" height="7" rx="1" fill="#94A3B8"/>
                      <rect x="15" y="12" width="7" height="7" rx="1" fill="#94A3B8"/>
                      <rect x="6" y="21" width="7" height="7" rx="1" fill="#94A3B8"/>
                      <rect x="15" y="21" width="7" height="7" rx="1" fill="#64748B"/>
                      <text x="32" y="26" fontFamily="system-ui" fontWeight="700" fontSize="14" fill="#94A3B8" letterSpacing="1">SEGCORE</text>
                    </svg>
                  ),
                },
                {
                  name: "VOLT-X",
                  logo: (
                    <svg viewBox="0 0 100 40" className="h-8 w-auto" fill="none">
                      <polygon points="18,4 28,20 20,20 26,36 10,16 18,16" fill="#CBD5E1"/>
                      <text x="34" y="26" fontFamily="system-ui" fontWeight="800" fontSize="14" fill="#94A3B8" letterSpacing="1">VOLT-X</text>
                    </svg>
                  ),
                },
                {
                  name: "METRA",
                  logo: (
                    <svg viewBox="0 0 100 40" className="h-8 w-auto" fill="none">
                      <circle cx="20" cy="20" r="14" stroke="#CBD5E1" strokeWidth="3"/>
                      <circle cx="20" cy="20" r="6" fill="#CBD5E1"/>
                      <line x1="20" y1="6" x2="20" y2="14" stroke="#CBD5E1" strokeWidth="2.5"/>
                      <line x1="20" y1="26" x2="20" y2="34" stroke="#CBD5E1" strokeWidth="2.5"/>
                      <line x1="6" y1="20" x2="14" y2="20" stroke="#CBD5E1" strokeWidth="2.5"/>
                      <line x1="26" y1="20" x2="34" y2="20" stroke="#CBD5E1" strokeWidth="2.5"/>
                      <text x="40" y="26" fontFamily="system-ui" fontWeight="700" fontSize="14" fill="#94A3B8" letterSpacing="1">METRA</text>
                    </svg>
                  ),
                },
                {
                  name: "SYNAPSE",
                  logo: (
                    <svg viewBox="0 0 120 40" className="h-8 w-auto" fill="none">
                      <circle cx="10" cy="20" r="4" fill="#CBD5E1"/>
                      <circle cx="22" cy="12" r="4" fill="#CBD5E1"/>
                      <circle cx="22" cy="28" r="4" fill="#CBD5E1"/>
                      <circle cx="34" cy="20" r="4" fill="#94A3B8"/>
                      <line x1="14" y1="20" x2="18" y2="14" stroke="#CBD5E1" strokeWidth="1.5"/>
                      <line x1="14" y1="20" x2="18" y2="26" stroke="#CBD5E1" strokeWidth="1.5"/>
                      <line x1="26" y1="12" x2="30" y2="18" stroke="#CBD5E1" strokeWidth="1.5"/>
                      <line x1="26" y1="28" x2="30" y2="22" stroke="#CBD5E1" strokeWidth="1.5"/>
                      <text x="44" y="26" fontFamily="system-ui" fontWeight="700" fontSize="14" fill="#94A3B8" letterSpacing="1">SYNAPSE</text>
                    </svg>
                  ),
                },
                {
                  name: "AERIS",
                  logo: (
                    <svg viewBox="0 0 100 40" className="h-8 w-auto" fill="none">
                      <path d="M20 8 L32 32 H8 Z" stroke="#CBD5E1" strokeWidth="2.5" fill="none"/>
                      <path d="M20 14 L28 30 H12 Z" fill="#CBD5E1"/>
                      <text x="38" y="26" fontFamily="system-ui" fontWeight="700" fontSize="14" fill="#94A3B8" letterSpacing="1">AERIS</text>
                    </svg>
                  ),
                },
              ].map((brand) => (
                <div
                  key={brand.name}
                  className="opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer grayscale hover:grayscale-0"
                >
                  {brand.logo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL — white bg ── */}
        <section id="data-profile" className="py-24 bg-white">
          <div className="w-full px-8 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="text-6xl text-gray-200 font-serif leading-none mb-4">"</div>
              <p className="text-2xl text-gray-700 leading-relaxed mb-8 font-light">
                SMARTRAF has completely transformed how we view municipal management. The interface doesn't just look good — it fundamentally makes complex data more digestible for our decision-makers.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-sm font-bold text-emerald-600">SV</div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Dr. Steve Vance</div>
                  <div className="text-xs text-gray-400 mt-0.5">Director of Infrastructure, Metropolis City</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-8 min-w-[280px] rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-gray-800">Efficiency Score</span>
                <span className="text-sm font-bold text-emerald-500">+302%</span>
              </div>
              <div className="space-y-4">
                {[{label:"Traffic Flow",val:92},{label:"Energy Use",val:74},{label:"Response Time",val:88}].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>{item.label}</span><span>{item.val}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA — teal accent ── */}
        <section className="py-28 bg-emerald-500 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 50%, white 0%, transparent 50%)'}} />
          <div className="relative z-10 w-full px-8">
            <h2 className="text-5xl font-black text-white mb-4">Ready to curate your city?</h2>
            <p className="text-white/80 text-lg mb-12 max-w-xl mx-auto">
              Join the next generation of smart city managers using SMARTRAF to build safer, more efficient urban environments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="bg-white text-emerald-600 font-bold px-10 py-4 hover:bg-gray-100 transition-colors text-sm tracking-widest">
                START YOUR FREE PILOT
              </a>
              <a href="#" className="border-2 border-white text-white font-bold px-10 py-4 hover:bg-white/10 transition-colors text-sm tracking-widest">
                SCHEDULE A CONSULTATION
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER — dark ── */}
        <footer className="bg-[#060e1a] py-12">
          <div className="w-full px-8 flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <img src="/logo.png" alt="SMARTRAF" className="h-8 w-auto object-contain" />
              <span className="text-sm font-black tracking-widest uppercase text-white">SMARTRAF</span>
              <p className="text-xs text-white/30 max-w-xs leading-relaxed">
                © 2024 SMARTRAF. All rights reserved.<br />Integrated Urban Traffic Management System.
              </p>
            </div>
            <div className="flex gap-10 text-xs text-white/30">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">API Documentation</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
