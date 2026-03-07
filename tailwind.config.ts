/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        bg: '#080810',
        surface: '#0e0e1a',
        surface2: '#141428',
        accent: '#4a9eff',
        accent2: '#ff6b35',
      },
    },
  },
  plugins: [],
}
