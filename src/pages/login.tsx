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
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
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
        <title>Login — SMARTRAF IoT Controller</title>
        <meta name="description" content="Masuk ke Pusat Kontrol SMARTRAF" />
      </Head>

      {/* Full-screen background */}
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{ backgroundColor: "#0B1120" }}
      >
        {/* Background city image */}
        <div className="absolute inset-0">
          <img
            src="/city-traffic.jpg"
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ opacity: 0.12 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, rgba(11,17,32,0.85) 100%)",
            }}
          />
        </div>

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Glow accent top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(6,182,212,0.12) 0%, transparent 70%)",
          }}
        />

        {/* ── Card ── */}
        <div
          className="relative z-10 w-full max-w-[420px] rounded-2xl p-8 animate-fade-up"
          style={{
            backgroundColor: "rgba(15,23,42,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(6,182,212,0.06)",
          }}
        >
          {/* Logo & title */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 overflow-hidden"
              style={{
                backgroundColor: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.25)",
              }}
            >
              <img
                src="/Background.png"
                alt="SMARTRAF"
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-base font-bold tracking-widest text-white uppercase">
              SMARTRAF
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Masuk ke Pusat Kontrol
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Email Operator
              </label>
              <div className="relative">
                <span
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
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
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#f8fafc",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(6,182,212,0.6)"
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(6,182,212,0.1)"
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.07)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)"
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.05)"
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Kata Sandi
                </label>
                <button
                  type="button"
                  className="text-xs font-medium transition-opacity duration-150"
                  style={{ color: "var(--accent-cyan)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.opacity = "0.7")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.opacity = "1")
                  }
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <span
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
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
                  className="w-full rounded-xl pl-10 pr-11 py-3 text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#f8fafc",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(6,182,212,0.6)"
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(6,182,212,0.1)"
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.07)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)"
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.05)"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#f8fafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-secondary)")
                  }
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm animate-scale-in"
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#f87171",
                }}
              >
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 mt-2"
              style={{
                backgroundColor: loading
                  ? "rgba(6,182,212,0.5)"
                  : "var(--accent-cyan)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor =
                    "var(--accent-cyan-hover)"
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(6,182,212,0.35)"
                  e.currentTarget.style.transform = "translateY(-1px)"
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = loading
                  ? "rgba(6,182,212,0.5)"
                  : "var(--accent-cyan)"
                e.currentTarget.style.boxShadow = "none"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk ke Dasbor
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* System status */}
          <div
            className="flex items-center justify-between mt-6 rounded-xl px-4 py-2.5"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <span
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Status Sistem
              </span>
            </div>
            <span
              className="text-xs font-semibold font-mono"
              style={{ color: "#10b981" }}
            >
              ONLINE · v2.4.0
            </span>
          </div>
        </div>

        {/* Footer links */}
        <div
          className="relative z-10 flex items-center gap-5 mt-8 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          {["Bantuan", "Privasi", "Syarat & Ketentuan"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs transition-colors duration-150"
              style={{ color: "rgba(148,163,184,0.5)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(148,163,184,0.9)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(148,163,184,0.5)")
              }
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

export default LoginPage
