/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cozy: {
          paper: '#d7c0ae',
          dark: '#1e1b18',
        },
      },
    },
  },
  plugins: [],
};
