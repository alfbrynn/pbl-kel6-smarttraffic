import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MainLayout from '@/components/layouts/MainLayout'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/utils/firebase'

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
  )
  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
  return () => observer.disconnect()
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  // Efek untuk Scroll Reveal
  useEffect(() => {
    let cleanReveal: (() => void) | undefined

    const run = () => {
      setTimeout(() => {
        cleanReveal?.()
        cleanReveal = initScrollReveal()
      }, 60)
    }

    run()
    router.events.on('routeChangeComplete', run)
    return () => {
      router.events.off('routeChangeComplete', run)
      cleanReveal?.()
    }
  }, [router])

  // Efek untuk Proteksi Rute (Route Guard)
  useEffect(() => {
    const publicPages = ['/login', '/'];
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !publicPages.includes(router.pathname)) {
        // Jika TIDAK ADA user dan mencoba mengakses halaman private -> Redirect ke Login
        router.replace('/login').then(() => setIsAuthChecking(false));
      } else if (user && router.pathname === '/login') {
        // Jika ADA user tapi mencoba mengakses halaman Login -> Redirect ke Beranda
        router.replace('/beranda').then(() => setIsAuthChecking(false));
      } else {
        // Akses diizinkan
        setIsAuthChecking(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener saat komponen unmount
  }, [router.pathname]);

  // Tampilkan loading spinner selama Firebase memverifikasi status sesi pengguna
  if (isAuthChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-main">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-border-color border-t-accent-cyan rounded-full animate-spin"></div>
          <span className="text-[10px] font-black text-text-secondary tracking-[0.2em] uppercase animate-pulse">Memverifikasi Sesi...</span>
        </div>
      </div>
    );
  }

  // PERBAIKAN: Jangan bungkus halaman login dan landing page ('/') dengan MainLayout
  const noLayoutPages = ['/login', '/'];
  if (noLayoutPages.includes(router.pathname)) {
    return <Component {...pageProps} />
  }

  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  )
}