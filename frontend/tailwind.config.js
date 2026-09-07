/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0C0C0E", // Warm near-black
        surface: "#18181B", // Matte dark surface
        "surface-elevated": "#202024",
        "surface-hover": "#27272D",
        border: "#27272A", // Subtle hairline divider
        "border-light": "#3F3F46",
        primary: "#5B6EFF", // Functional cobalt blue
        "primary-dark": "#4755E8",
        "accent-violet": "#A855F7", // Signature hero accent
        "text-primary": "#F2F2F0", // Warm off-white
        "text-secondary": "#8C8C91", // Slate secondary
        "text-muted": "#52525B",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #5B6EFF 0%, #A855F7 100%)',
        'gradient-hero-subtle': 'linear-gradient(135deg, rgba(91, 110, 255, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
        'gradient-surface': 'linear-gradient(180deg, #18181B 0%, #111113 100%)',
        'gradient-pass': 'linear-gradient(135deg, #222228 0%, #16161A 50%, #241C30 100%)',
      },
      boxShadow: {
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'hero': '0 10px 30px -5px rgba(91, 110, 255, 0.25)',
        'pass': '0 20px 40px -10px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
}
