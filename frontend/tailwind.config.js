/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C9FF00", // Electric Lime
        "primary-glow": "rgba(201, 255, 0, 0.4)",
        secondary: "#00F0FF", // Cyber Blue
        background: "#09090B", // Obsidian Black
        surface: "#121215", // Dark Surface Card
        border: "#222228", // Surface Border
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #C9FF00 0%, #00F0FF 100%)',
        'gradient-dark': 'linear-gradient(180deg, rgba(18,18,21,0.8) 0%, rgba(9,9,11,0.95) 100%)',
        'gradient-glow': 'radial-gradient(circle at center, rgba(201,255,0,0.15) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(201, 255, 0, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(201, 255, 0, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
