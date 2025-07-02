/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'tektur': ['Tektur', 'monospace'],
        'lexend': ['Lexend', 'sans-serif'],
      },
      colors: {
        'crash-red': '#e12726',
        'crash-red-bright': '#ff0000',
      },
    },
  },
  plugins: [],
} 