/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dce6ff",
          200: "#b9ccff",
          300: "#82a6ff",
          400: "#4d7eff",
          500: "#1a54ff",
          600: "#0038e6",
          700: "#002bb8",
          800: "#002094",
          900: "#001878",
          950: "#000d4a",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
