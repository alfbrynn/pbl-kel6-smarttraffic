"use client";
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>SMARTRAF – Kinetic Intelligence for Urban Flow</title>
        <meta name="description" content="A living infrastructure operating system designed for the speed of light." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white font-sans text-gray-900">
        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur border-b border-gray-100">
          <span className="text-sm font-bold tracking-widest uppercase text-gray-900">SMARTRAF</span>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#monitoring" className="hover:text-gray-900 transition-colors">Monitoring</a>
            <a href="#ai-analytics" className="hover:text-gray-900 transition-colors">AI Analytics</a>
            <a href="#infrastructure" className="hover:text-gray-900 transition-colors">Infrastructure</a>
            <a href="#data-profile" className="hover:text-gray-900 transition-colors">Data Profile</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Login</a>
            <a href="#" className="text-sm bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium transition-colors">Get Started</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative pt-16 h-screen min-h-[600px] flex items-center overflow-hidden bg-gray-50">
          <div className="absolute inset-0">
            <Image src="/city-traffic.png" alt="City Traffic" fill className="object-cover object-center opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10" />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-8 w-full flex items-center justify-between">
            <div className="max-w-lg">
              <div className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-600 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-6">
                NEXT GEN PLATFORM
              </div>
              <h1 className="text-5xl font-black leading-tight text-gray-900 mb-4">
                Kinetic<br />
                <span className="text-teal-500">Intelligence</span><br />
                for Urban Flow.
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
                A living infrastructure operating system designed for the speed of light. Real-time city-scale data transformed into actionable precision.
              </p>
              <div className="flex gap-3">
                <a href="#" className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-gray-800 transition-colors">
                  LAUNCH DASHBOARD
                </a>
                <a href="#" className="border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-gray-50 transition-colors">
                  VIEW NETWORK
                </a>
              </div>
            </div>

            {/* Live metric card */}
            <div className="hidden lg:block bg-white/90 backdrop-blur border border-gray-200 rounded-xl p-5 shadow-lg min-w-[200px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 uppercase tracking-wide">Efficiency Rate</span>
                <span className="text-teal-500 text-xs">↗</span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">842.5 MB/s</div>
              <div className="text-xs text-gray-400">Uptime: 99.98%</div>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-teal-400 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* CONNECTED CITIES */}
        <section id="monitoring" className="py-20 bg-white">
          <div className="w-full px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">CONNECTED CITIES</div>
              <h2 className="text-3xl font-bold text-gray-900">Curated Clarity for Complex Data</h2>
            </div>

            {/* Dashboard mockup */}
            <div className="flex gap-6 items-stretch">
              {/* Left sidebar stats */}
              <div className="hidden md:flex flex-col gap-4 w-[160px] shrink-0">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <div className="text-xs text-gray-400 mb-1">ACTIVE NODES</div>
                  <div className="text-3xl font-black text-gray-900">1,294</div>
                  <div className="text-xs text-teal-500 mt-1">+2.4%</div>
                  <div className="mt-3 h-1.5 bg-gray-200 rounded-full">
                    <div className="h-full w-3/4 bg-teal-400 rounded-full" />
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex-1">
                  <div className="text-xs text-gray-400 mb-1">LATENCY</div>
                  <div className="text-3xl font-black text-gray-900">0.5</div>
                  <div className="text-xs text-gray-400">ms avg</div>
                </div>
              </div>

              {/* Main dashboard visual */}
              <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden min-h-[420px] relative flex items-end p-8">
                <div className="absolute inset-0">
                  <div className="absolute top-6 right-6 w-40 h-40 rounded-full border border-teal-400/20" />
                  <div className="absolute top-12 right-12 w-24 h-24 rounded-full border border-teal-400/10" />
                  {/* Grid lines */}
                  {[25, 50, 75].map((pct) => (
                    <div
                      key={pct}
                      className="absolute left-8 right-8 border-t border-white/5"
                      style={{ bottom: `${pct}%` }}
                    />
                  ))}
                </div>
                {/* Bar chart simulation */}
                <div className="flex items-end gap-2 w-full h-[320px]">
                  {[40, 65, 45, 80, 55, 90, 60, 75, 50, 85, 70, 95, 65, 80, 55, 70, 45, 60, 75, 50].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-all"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 12
                            ? "#2dd4bf"
                            : i > 12
                            ? "rgba(45,212,191,0.35)"
                            : "rgba(255,255,255,0.12)",
                      }}
                    />
                  ))}
                </div>
                {/* Donut chart */}
                <div className="absolute top-8 right-8 w-24 h-24 rounded-full border-[6px] border-teal-400/70 flex items-center justify-center">
                  <span className="text-teal-400 text-sm font-bold">78%</span>
                </div>
                {/* Label */}
                <div className="absolute top-8 left-8 text-xs text-white/40 uppercase tracking-widest">Live Traffic Index</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="ai-analytics" className="py-16 bg-blue-50/60">
          <div className="w-full px-4 md:px-6 flex flex-col gap-4">

            {/* Row 1: Predictive Analytics (large) + Eco Optimization (small) */}
            <div className="flex gap-4">
              {/* Predictive Analytics — large card */}
              <div className="flex-[2] bg-white rounded-2xl p-8 border-l-4 border-teal-400 shadow-sm">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Predictive Analytics</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-8">
                  Our proprietary AI models process millions of data points to forecast traffic congestion before it happens, allowing for proactive urban management.
                </p>
                <div className="flex gap-8">
                  <div>
                    <div className="text-2xl font-black text-teal-500">98.4%</div>
                    <div className="text-xs text-gray-400 tracking-widest mt-0.5">ACCURACY</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-teal-500">&lt;2ms</div>
                    <div className="text-xs text-gray-400 tracking-widest mt-0.5">LATENCY</div>
                  </div>
                </div>
              </div>

              {/* Eco Optimization — small card */}
              <div className="flex-1 bg-white rounded-2xl p-8 border-l-4 border-green-500 shadow-sm">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Eco Optimization</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Reduce urban carbon footprint by streamlining vehicle throughput in high-density areas.
                </p>
                <a href="#" className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                  Sustainability Report ↗
                </a>
              </div>
            </div>

            {/* Row 2: Hardened Security + Unified Integration (with image) */}
            <div className="flex gap-4">
              {/* Hardened Security */}
              <div className="flex-1 bg-white rounded-2xl p-8 border-l-4 border-blue-400 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Hardened Security</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Military-grade encryption for all municipal data streams and edge processing nodes.
                </p>
              </div>

              {/* Unified Integration — with image */}
              <div className="flex-[2] bg-white rounded-2xl p-8 border-l-4 border-cyan-400 shadow-sm flex items-start gap-6">
                <div className="flex-1">
                  <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center mb-5">
                    <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Unified Integration</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Seamlessly connects with existing legacy hardware and modern IoT sensors via our universal API.
                  </p>
                </div>
                {/* Image placeholder */}
                <div className="hidden md:block w-36 h-28 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                  <Image
                    src="/city-traffic.png"
                    alt="Integration"
                    width={144}
                    height={112}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* TRUSTED BY */}
        <section id="infrastructure" className="py-12 bg-white border-y border-gray-100">
          <div className="w-full px-4 md:px-6">
            <div className="text-center text-xs font-semibold tracking-widest uppercase text-gray-400 mb-8">
              TRUSTED BY GLOBAL SMART CITY LEADERS
            </div>
            <div className="flex items-center justify-center gap-12 flex-wrap">
              {["SEGCORE", "VOLT-X", "METRA", "SYNAPSE", "AERIS"].map((brand) => (
                <span key={brand} className="text-sm font-bold tracking-widest text-gray-300 hover:text-gray-500 transition-colors cursor-pointer">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section id="data-profile" className="py-20 bg-white">
          <div className="w-full px-4 md:px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="text-4xl text-gray-200 font-serif mb-4">"</div>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                SMARTRAF has completely transformed how we view municipal management. The "Airy" Interface doesn't just look good—it fundamentally makes complex data more digestible for our decision-makers.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">SV</div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Dr. Steve Vance</div>
                  <div className="text-xs text-gray-400">Director of Infrastructure, Metropolis City</div>
                </div>
              </div>
            </div>

            {/* Efficiency score card */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 min-w-[240px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">Efficiency Score</span>
                <span className="text-sm font-bold text-teal-500">+302%</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Traffic Flow", val: 92 },
                  { label: "Energy Use", val: 74 },
                  { label: "Response Time", val: 88 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{item.label}</span>
                      <span>{item.val}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 rounded-full" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gray-50 text-center">
          <div className="max-w-2xl mx-auto px-8">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Ready to curate your city?</h2>
            <p className="text-gray-500 mb-10">
              Join the next generation of smart city managers using SMARTRAF to build safer, more efficient urban environments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                Start Your Free Pilot
              </a>
              <a href="#" className="border border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg hover:bg-white transition-colors">
                Schedule a Consultation
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white border-t border-gray-100 py-10">
          <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-start justify-between gap-6">
            <div>
              <div className="text-sm font-bold tracking-widest uppercase text-gray-900 mb-2">SMARTRAF</div>
              <p className="text-xs text-gray-400 max-w-xs">
                © 2024 SMARTRAF. All rights reserved. A living infrastructure operating system for the modern city.
              </p>
            </div>
            <div className="flex gap-8 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Contact</a>
              <a href="#" className="hover:text-gray-700 transition-colors">API Documentation</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
