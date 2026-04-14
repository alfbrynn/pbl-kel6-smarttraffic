/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': 'var(--bg-main)',
        'bg-card': 'var(--bg-card)',
        'bg-card-alt': 'var(--bg-card-alt)',
        'bg-hover': 'var(--bg-hover)',
        'text-main': 'var(--text-main)',
        'text-secondary': 'var(--text-secondary)',
        'accent-cyan': 'var(--accent-cyan)',
        'accent-cyan-hover': 'var(--accent-cyan-hover)',
        'accent-green': 'var(--accent-green)',
        'accent-green-bg': 'var(--accent-green-bg)',
        'accent-red': 'var(--accent-red)',
        'accent-red-bg': 'var(--accent-red-bg)',
        'accent-orange': 'var(--accent-orange)',
        'accent-orange-bg': 'var(--accent-orange-bg)',
        'border-color': 'var(--border-color)',
      },
      borderRadius: {
        'custom': 'var(--border-radius)',
      },
    },
  },
  plugins: [],
}
