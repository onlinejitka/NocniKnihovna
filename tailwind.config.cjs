/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      colors: {
        // Vaše nová paleta
        ink: '#1A1D2F',       // Půlnoční inkoust (60 % - Dominantní základ)
        cream: '#F8F6F0',     // Jemný krém (30 % - Sekundární text/pozadí)
        amber: {
          accent: '#FFB703',  // Elektrická ambra (5 % - Tlačítka, dopaminové akcenty)
        },
        teal: {
          sage: '#2EC4B6',    // Svěží šalvěj / Teal (5 % - Edukační prvky, klid)
        },
      },
    },
  },
  plugins: [],
}
