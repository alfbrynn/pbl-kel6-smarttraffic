/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.css",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'bg-main':        'var(--bg-main)',
        'bg-card':        'var(--bg-card)',
        'bg-card-alt':    'var(--bg-card-alt)',
        'bg-hover':       'var(--bg-hover)',
        'text-main':      'var(--text-main)',
        'text-secondary': 'var(--text-secondary)',
        'accent-cyan':        'var(--accent-cyan)',
        'accent-cyan-hover':  'var(--accent-cyan-hover)',
        'accent-green':       'var(--accent-green)',
        'accent-green-bg':    'var(--accent-green-bg)',
        'accent-red':         'var(--accent-red)',
        'accent-red-bg':      'var(--accent-red-bg)',
        'accent-orange':      'var(--accent-orange)',
        'accent-orange-bg':   'var(--accent-orange-bg)',
        'border-color':       'var(--border-color)',
      },
      borderRadius: {
        'custom': 'var(--border-radius)',
      },
      keyframes: {
        fadeIn:        { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeSlideUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeSlideDown: { from: { opacity: '0', transform: 'translateY(-12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeSlideLeft: { from: { opacity: '0', transform: 'translateX(20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:       { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        shimmer:       { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        pulseGlow:     { '0%,100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(16,185,129,0)' } },
        slideInSidebar:{ from: { opacity: '0', transform: 'translateX(-16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
      animation: {
        'fade-in':        'fadeIn 0.4s ease-out both',
        'fade-up':        'fadeSlideUp 0.5s ease-out both',
        'fade-down':      'fadeSlideDown 0.4s ease-out both',
        'fade-left':      'fadeSlideLeft 0.4s ease-out both',
        'scale-in':       'scaleIn 0.3s ease-out both',
        'shimmer':        'shimmer 1.5s infinite',
        'pulse-glow':     'pulseGlow 2s ease-in-out infinite',
        'slide-sidebar':  'slideInSidebar 0.3s ease-out both',
        // Stagger delays via compound classes
        'fade-up-1':      'fadeSlideUp 0.5s ease-out 0ms both',
        'fade-up-2':      'fadeSlideUp 0.5s ease-out 80ms both',
        'fade-up-3':      'fadeSlideUp 0.5s ease-out 160ms both',
        'fade-up-4':      'fadeSlideUp 0.5s ease-out 240ms both',
        'fade-up-5':      'fadeSlideUp 0.5s ease-out 320ms both',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
