import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

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

  return <Component {...pageProps} />
}
