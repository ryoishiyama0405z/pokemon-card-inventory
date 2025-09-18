/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          red: '#ef4444',
          blue: '#3b82f6',
          yellow: '#eab308',
          green: '#22c55e',
        }
      }
    },
  },
  plugins: [],
}
