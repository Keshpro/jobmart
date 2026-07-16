/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colours: {
        'brand-green': '#4A7c59',
      }
    },
  },
  plugins: [],
}