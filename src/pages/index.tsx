import type { NextPage } from "next"
import Head from "next/head"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useCounter(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / duration, 1)
      setValue(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return value
}

const features = [
  {
    icon: "📊",
    title: "Predictive Analytics",
    desc: "Our snap-plan AI monitors billions of data points to forecast urban congestion before it happens, allowing for proactive urban management.",
    stats: [{ val: "98.4%", label: "Accuracy" }, { val: "<2ms", label: "Latency" }],
    accent: "teal",
    link: null,
    image: false,
  },
  {
    icon: "🌿",
    title: "Eco Optimization",
    desc: "Reduce urban carbon footprint by optimizing vehicle flow through dense areas. Smart green systems that adapt automatically to improve sustainability.",
    stats: [],
    accent: "green",
    link: "Sustainability Report →",
    image: false,
  },
  {
    icon: "🔒",
    title: "Hardened Security",
    desc: "Military-grade encryption for all city data streams and edge processing nodes. Critical infrastructure data is fully protected at all times.",
    stats: [],
    accent: "blue",
    link: null,
    image: false,
  },
  {
    icon: "🔗",
    title: "Unified Integration",
    desc: "Seamlessly connects with both legacy and modern IoT hardware via universal API. No need to replace existing infrastructure at all.",
    stats: [],
    accent: "indigo",
    link: null,
    image: true,
  },
]

const trustedBy = ["BECORE", "VOLT-X", "METRA", "SYNAPSE", "AERIS"]

const Home: NextPage = () => {
  const statsRef = useInView()
  const nodes = useCounter(1284, 2000, statsRef.inView)
  const uptime = useCounter(99, 1500, statsRef.inView)

  return (
    <>
      <Head>
        <title>SPECTRA — Kinetic Intelligence for Urban Flow</title>
        <meta name="description" content="A living infrastructure operating system designed for the speed of light." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="bg-white text-gray-900 overflow-x-hidden">

        {/* NAV */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <span style={{ fontFamily: "'Syne', sans-serif" }} className="font-extrabold text-sm tracking-widest uppercase text-gray-900">SPECTRA</span>
            <div className="hidden md:flex items-center gap-7 text-sm text-gray-500">
              {["Monitoring", "AI Analytics", "Infrastructure", "Data Profile"].map((item) => (
                <a key={item} href="#" className="hover:text-gray-900 transition-colors">{item}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Login</Link>
              <Link href="/login" className="text-sm bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-950 pt-14">
          <div className="absolute inset-0">
            <img src="/city-traffic.png" alt="city" className="w-full h-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/75 to-gray-950/30" />
          </div>
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "60px 60px"
          }} />

          <div className="relative max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div style={{ animation: "fadeUp .7s ease both" }}>
              <div className="inline-flex items-center gap-2 border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-7 tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Next-Gen IoT Telemetry
              </div>

              <h1 style={{ fontFamily: "'Syne', sans-serif", lineHeight: 1.05 }} className="text-5xl md:text-6xl font-extrabold text-white mb-5">
                Kinetic
                <br />
                <span className="text-teal-400">Intelligence</span>
                <br />
                for Urban Flow.
              </h1>

              <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-sm">
                A living infrastructure operating system designed for the speed of light. Real-time city-scale data transformed into actionable precision.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/login" className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all uppercase tracking-wide">
                  Launch Dashboard
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <a href="#features" className="flex items-center gap-2 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all uppercase tracking-wide">
                  View Network
                </a>
              </div>
            </div>

            {/* Right — stat card */}
            <div style={{ animation: "fadeUp .7s ease .2s both" }} className="hidden md:block">
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">System Status</span>
                  <span className="flex items-center gap-1.5 text-xs text-teal-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />Live
                  </span>
                </div>

                <div>
                  <p className="text-4xl font-bold text-teal-400" style={{ fontFamily: "'Syne', sans-serif" }}>842.5 MB/s</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                    </svg>
                    <p className="text-xs text-teal-400 font-medium">+12.4% from last hour</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Efficiency Rate</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{nodes.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Active Nodes</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xl font-bold text-teal-400" style={{ fontFamily: "'Syne', sans-serif" }}>{uptime}%</p>
                    <p className="text-xs text-gray-500 mt-0.5">Uptime</p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Recent Activity</p>
                  {[
                    { dot: "bg-teal-400", text: "North corridor switched to GREEN" },
                    { dot: "bg-yellow-400", text: "Density detected in East zone" },
                    { dot: "bg-red-400", text: "Alert: West queue increasing" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 py-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.dot} shrink-0`} />
                      <span className="text-xs text-gray-400">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMMAND CENTER */}
        <section ref={statsRef.ref} className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-xs text-teal-600 font-bold uppercase tracking-widest mb-2">Command Center</p>
              <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-3xl md:text-4xl font-bold text-gray-900">
                Curated Clarity for Complex Data
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="grid md:grid-cols-[220px_1fr]">
                {/* Sidebar */}
                <div className="border-r border-gray-100 p-6 space-y-6">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Active Nodes</p>
                    <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-3xl font-bold">{nodes.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">System Load</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full transition-all duration-1000" style={{ width: statsRef.inView ? "67%" : "0%" }} />
                      </div>
                      <span className="text-sm font-semibold">67%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Alerts</p>
                    <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-3xl font-bold text-red-500">03</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Uptime</p>
                    <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-3xl font-bold text-teal-600">{uptime}%</p>
                  </div>
                </div>

                {/* Dashboard preview */}
                <div className="relative bg-gray-900 min-h-72 flex items-center justify-center overflow-hidden">
                  <img
                    src="/smartraf-dashboard.png"
                    alt="Dashboard"
                    className="w-full h-full object-cover object-top opacity-80"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                  />
                  {/* Fallback chart visualization */}
                  <div className="absolute inset-0 flex items-end justify-around px-8 pb-8 gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-teal-500/30 border-t border-teal-400/50 transition-all duration-700"
                        style={{ height: statsRef.inView ? `${h}%` : "0%", transitionDelay: `${i * 60}ms` }} />
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs text-white/50 font-mono">SPECTRA V2.4.0 — INTEGRATED URBAN INTELLIGENCE</span>
                    <Link href="/login" className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-500 transition-colors">
                      Open Dashboard →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  style={{ animation: `fadeUp .5s ease ${i * 0.1}s both` }}
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg mb-4 ${
                    f.accent === "teal" ? "bg-teal-50" :
                    f.accent === "green" ? "bg-green-50" :
                    f.accent === "blue" ? "bg-blue-50" : "bg-indigo-50"
                  }`}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>

                  {f.stats.length > 0 && (
                    <div className="flex gap-8 mt-5">
                      {f.stats.map((s) => (
                        <div key={s.label}>
                          <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-2xl font-bold text-gray-900">{s.val}</p>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {f.link && (
                    <a href="#" className="inline-block mt-4 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors">{f.link}</a>
                  )}

                  {f.image && (
                    <div className="mt-4 h-20 bg-gray-100 rounded-xl overflow-hidden">
                      <img src="/city-traffic.png" alt="integration" className="w-full h-full object-cover opacity-40" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUSTED BY */}
        <section className="py-12 bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold mb-8">
              Trusted by Global Smart City Partners
            </p>
            <div className="flex flex-wrap justify-center gap-12 items-center">
              {trustedBy.map((name) => (
                <span key={name} style={{ fontFamily: "'Syne', sans-serif" }} className="text-gray-300 font-bold text-sm tracking-widest hover:text-gray-500 transition-colors cursor-default">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-6xl text-teal-100 font-serif leading-none mb-2">"</div>
              <blockquote style={{ fontFamily: "'Syne', sans-serif" }} className="text-2xl font-bold leading-snug text-gray-900 mb-6">
                SPECTRA has completely transformed how we view municipal management. The "Airy" Interface doesn't just look good — it fundamentally makes complex data more digestible for our decision-makers.
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">SV</div>
                <div>
                  <p className="text-sm font-semibold">Dr. Steve Vance</p>
                  <p className="text-xs text-gray-400">Director of Infrastructure, Metropolis City</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-semibold">Efficiency Score</p>
                <span className="text-sm font-bold text-teal-600">+26%</span>
              </div>
              {[
                { label: "Data Throughput", val: 92, color: "bg-teal-500" },
                { label: "System Response", val: 85, color: "bg-blue-400" },
                { label: "Energy Efficiency", val: 78, color: "bg-green-400" },
              ].map((bar) => (
                <div key={bar.label} className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>{bar.label}</span>
                    <span>{bar.val}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${bar.color} rounded-full transition-all duration-1000`} style={{ width: `${bar.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gray-950 text-white text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Ready to curate your city?
            </h2>
            <p className="text-gray-400 mb-10 leading-relaxed">
              Join the next generation of smart city managers using SPECTRA to build safer, more efficient urban environments.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/login" className="bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-8 py-3.5 rounded-xl transition-all tracking-wide">
                Start Your Free Pilot
              </Link>
              <a href="#" className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white text-sm font-semibold px-8 py-3.5 rounded-xl transition-all">
                Schedule a Consultation
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-950 border-t border-white/10 px-6 py-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <span style={{ fontFamily: "'Syne', sans-serif" }} className="font-extrabold text-gray-400 tracking-widest uppercase">SPECTRA</span>
            <p>© 2026 SPECTRA Urban Systems. All rights reserved.</p>
            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Service", "Contact", "API Documentation"].map((item) => (
                <a key={item} href="#" className="hover:text-gray-300 transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </footer>

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}

export default Home
