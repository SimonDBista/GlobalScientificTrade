/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7f9',
          100: '#dbeff3',
          200: '#bce0e9',
          300: '#8ec7d7',
          400: '#58a5c0',
          500: '#3288a7',
          600: '#236b87',
          700: '#1d546b',
          800: '#1b4759',
          900: '#0b394a', // Primary Official Logo Teal
          950: '#072430'
        },
        gold: {
          50: '#fffbf0',
          100: '#fef5d6',
          200: '#fde9aa',
          300: '#fbd773',
          400: '#f7c03c',
          500: '#f3a417', // Secondary Official Logo Gold
          600: '#d7810e',
          700: '#b25e0e',
          800: '#904913',
          900: '#763c13'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
