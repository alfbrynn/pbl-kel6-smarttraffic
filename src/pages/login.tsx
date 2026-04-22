"use client"

import type { NextPage } from "next"
import Head from "next/head"
import { useState, FormEvent } from "react"
import { useRouter } from "next/router"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/utils/firebase"

const LoginPage: NextPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/beranda")
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Email atau kata sandi salah.")
      } else if (code === "auth/invalid-email") {
        setError("Format email tidak valid.")
      } else if (code === "auth/too-many-requests") {
        setError("Terlalu banyak percobaan. Coba lagi beberapa saat.")
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login — SMARTRAF</title>
        <meta name="description" content="Masuk ke Pusat Kontrol SMARTRAF" />
      </Head>

      {/* Full screen background */}
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0e2040 50%, #0a1628 100%)",
        }}
      >
        {/* Blob dekoratif background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #0891b2, transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }} />
        </div>

        {/* Card utama */}
        <div
          className="relative w-full max-w-[900px] rounded-3xl overflow-hidden flex shadow-2xl"
          style={{ minHeight: "520px" }}
        >
          {/* ── KIRI: Welcome panel ── */}
          <div
            className="hidden md:flex w-[45%] flex-col justify-between p-10 relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, #0e7490 0%, #0a1628 100%)" }}
          >
            {/* Blob dekoratif dalam card */}
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-30"
              style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }} />
            <div className="absolute top-10 -right-10 w-48 h-48 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
            <div className="absolute bottom-32 right-8 w-32 h-32 rounded-full opacity-25"
              style={{ background: "radial-gradient(circle, #0891b2, transparent 70%)" }} />

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-2.5">
              <img src="/logo.png" alt="SMARTRAF" className="h-12 w-auto object-contain" />
              <span className="text-white font-black tracking-widest text-sm uppercase">SMARTRAF</span>
            </div>

            {/* Text */}
            <div className="relative z-10">
              <h1 className="text-4xl font-black text-white leading-tight mb-3">
                Selamat<br />Datang!
              </h1>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(186,230,253,0.8)" }}>
                Platform monitoring lalu lintas berbasis IoT. Pantau dan kendalikan jaringan kota secara real-time.
              </p>
              {/* Status */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#bae6fd" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Sistem Online · v2.4.0
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10">
              <p className="text-xs" style={{ color: "rgba(186,230,253,0.4)" }}>© 2024 SMARTRAF IoT Traffic System</p>
            </div>
          </div>

          {/* ── KANAN: Form panel ── */}
          <div className="flex-1 flex flex-col justify-center p-10" style={{ backgroundColor: "#ffffff" }}>

            {/* Mobile logo */}
            <div className="md:hidden flex items-center gap-2 mb-8">
              <img src="/logo.png" alt="SMARTRAF" className="h-10 w-auto object-contain" />
              <span className="font-black tracking-widest text-sm uppercase text-gray-800">SMARTRAF</span>
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-1">Masuk</h2>
            <p className="text-sm text-gray-400 mb-8">Masukkan kredensial operator Anda</p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@smartraf.id"
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-300"
                    style={{ backgroundColor: "#f1f5f9", border: "1.5px solid #e2e8f0" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#0891b2"; e.currentTarget.style.backgroundColor = "#fff" }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "#f1f5f9" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  <button type="button" className="text-xs font-semibold transition-colors" style={{ color: "#0891b2" }}>
                    Lupa?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-300"
                    style={{ backgroundColor: "#f1f5f9", border: "1.5px solid #e2e8f0" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#0891b2"; e.currentTarget.style.backgroundColor = "#fff" }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "#f1f5f9" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
                  style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{ background: "linear-gradient(135deg, #0891b2, #0e7490)" }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "linear-gradient(135deg, #0e7490, #0a5f73)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #0891b2, #0e7490)" }}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    Masuk
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="flex items-center justify-center gap-5 mt-8">
              {["Bantuan", "Privasi", "Syarat & Ketentuan"].map((l) => (
                <a key={l} href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
