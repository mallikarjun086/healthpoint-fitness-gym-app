/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00FF9D",
        background: "#0A0A0A",
        surface: "#141414",
        border: "#262626",
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #00FF9D 0%, #00A3FF 100%)',
      },
    },
  },
  plugins: [],
}
