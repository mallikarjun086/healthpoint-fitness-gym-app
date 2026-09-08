/** @type {import('tailwindcss').Config} */
import { colors, shadows, radii, typography } from './src/tokens/designTokens.js';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: colors.background,
        'background-subtle': colors['background-subtle'],
        surface: colors.surface,
        'surface-card': colors['surface-card'],
        'surface-elevated': colors['surface-elevated'],
        'surface-hover': colors['surface-hover'],
        'surface-active': colors['surface-active'],
        'surface-glass': colors['surface-glass'],
        'surface-glass-border': colors['surface-glass-border'],
        border: colors.border,
        'border-light': colors['border-light'],
        'border-subtle': colors['border-subtle'],
        'border-focus': colors['border-focus'],
        primary: colors.primary,
        'primary-hover': colors['primary-hover'],
        'primary-dark': colors['primary-dark'],
        'primary-subtle': colors['primary-subtle'],
        'primary-glow': colors['primary-glow'],
        'text-primary': colors['text-primary'],
        'text-secondary': colors['text-secondary'],
        'text-muted': colors['text-muted'],
        'text-inverse': colors['text-inverse'],
        ...colors.status,
      },
      fontFamily: typography.fontFamily,
      letterSpacing: typography.letterSpacing,
      borderRadius: radii,
      boxShadow: {
        sm: shadows.sm,
        card: shadows.card,
        elevated: shadows.elevated,
        modal: shadows.modal,
        accent: shadows.accent,
        glow: shadows.glow,
        inner: shadows.inner,
        panel: shadows.card,
        hero: shadows.accent,
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
        'gradient-surface': 'linear-gradient(180deg, #14151B 0%, #0F1014 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
    },
  },
  plugins: [],
}
