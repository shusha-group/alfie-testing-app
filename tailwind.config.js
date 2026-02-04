/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'score': ['6rem', { lineHeight: '1' }],
        'score-sm': ['4rem', { lineHeight: '1' }],
      }
    },
  },
  plugins: [],
}