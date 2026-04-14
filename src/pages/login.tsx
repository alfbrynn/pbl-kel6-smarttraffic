"use client"

import type { NextPage } from "next"
import Head from "next/head"
import { useState, FormEvent } from "react"
import { useRouter } from "next/router"

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
    // dummy auth — accept any email & password
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    router.push("/dashboard")
  }

  return (
    <>
      <Head>
        <title>Login — SMARTRAF IoT Controller</title>
        <meta name="description" content="Masuk ke Pusat Kontrol SMARTRAF" />
      </Head>

      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm">
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-10">
              {/* Logo & Title */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mb-4 overflow-hidden">
                  <img src="/Background.png" alt="SMARTRAF Logo" className="w-10 h-10 object-contain" />
                </div>
                <h1 className="text-lg font-bold tracking-widest text-gray-900 uppercase">
                  SMARTRAF
                </h1>
                <p className="text-sm text-gray-500 mt-1">Masuk ke Pusat Kontrol SMARTRAF</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                    Email Operator
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@smartraf.id"
                      required
                      disabled={false}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                      Kata Sandi
                    </label>
                    <button
                      type="button"
                      className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Lupa?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={false}
                      className="input-field pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

                {/* Error message */}
                {error && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-2">
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Status */}
              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-mono text-gray-500 tracking-wider uppercase">
                    System Online: V2.4.0
                  </span>
                </div>
              </div>
            </div>

            {/* City photo below card */}
            <div className="mt-4 overflow-hidden rounded-xl">
              <img
                src="/city-traffic.jpg"
                alt="Smart city traffic"
                className="w-full h-28 object-cover object-center opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-700 tracking-wider uppercase text-xs">SMARTRAF</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-600 transition-colors">Bantuan</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Privasi</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Syarat & Ketentuan</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Kontak Admin
            </a>
            <span>© 2024 SMARTRAF IoT Traffic System.</span>
          </div>
        </footer>
      </div>
    </>
  )
}

export default LoginPage
