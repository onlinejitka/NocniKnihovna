/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#0a0c0e',
          900: '#0f1115', // Hlavní pozadí
          800: '#161922', // Karty a sekce
          700: '#232836', // Ohraničení / linky
        },
        parchment: {
          100: '#ffffff',
          200: '#f5f0e6',
          300: '#e8e2d5', // Hlavní text
          400: '#d5cdbf', // Tlumený text
          600: '#9b9487',
        },
        amber: {
          candle: '#d49a45', // Vosk svíce / primární akcent
          brass: '#b87333',  // Mosaz / sekundární akcent
          glow: 'rgba(212, 154, 69, 0.15)',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
