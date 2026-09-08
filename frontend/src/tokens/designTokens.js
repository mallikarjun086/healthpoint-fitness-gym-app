/**
 * HealthPoint Fitness Design Tokens
 * Single Source of Truth for Cinematic iPhone-Grade Aesthetic
 * Consumed by Tailwind configuration and UI components.
 */

export const colors = {
  // Base Obsidian Canvas (Pure, deep, low-luminance titanium)
  background: '#08090B',
  'background-subtle': '#0D0E12',

  // Matte Surface Tiers with hairline depth separation
  surface: '#111216',
  'surface-card': '#131419',
  'surface-elevated': '#17191F',
  'surface-hover': '#1D1F26',
  'surface-active': '#22252E',

  // Frosted Glass (Used SPARINGLY for hero navbars, floating pills, and modal sheets)
  'surface-glass': 'rgba(17, 18, 22, 0.75)',
  'surface-glass-border': 'rgba(255, 255, 255, 0.1)',

  // Hairline Borders & Dividers
  border: 'rgba(255, 255, 255, 0.08)',
  'border-light': 'rgba(255, 255, 255, 0.14)',
  'border-subtle': 'rgba(255, 255, 255, 0.04)',
  'border-focus': 'rgba(79, 70, 229, 0.65)',

  // Single Confident Athletic Accent: Royal Indigo / Deep Cobalt
  primary: '#4F46E5', // Crisp Royal Indigo
  'primary-hover': '#4338CA',
  'primary-dark': '#3730A3',
  'primary-subtle': 'rgba(79, 70, 229, 0.12)',
  'primary-glow': 'rgba(79, 70, 229, 0.25)',

  // Neutral Typography Hierarchy
  'text-primary': '#F4F4F6', // High-contrast crisp off-white
  'text-secondary': '#8F9098', // Balanced neutral slate
  'text-muted': '#56575E', // Low-emphasis caption text
  'text-inverse': '#08090B', // Dark on bright badges

  // Semantic Status Colors (Restrained, not saturated neon)
  status: {
    success: '#10B981',
    'success-subtle': 'rgba(16, 185, 129, 0.12)',
    'success-border': 'rgba(16, 185, 129, 0.25)',
    warning: '#F59E0B',
    'warning-subtle': 'rgba(245, 158, 11, 0.12)',
    'warning-border': 'rgba(245, 158, 11, 0.25)',
    danger: '#EF4444',
    'danger-subtle': 'rgba(239, 68, 68, 0.12)',
    'danger-border': 'rgba(239, 68, 68, 0.25)',
    info: '#3B82F6',
    'info-subtle': 'rgba(59, 130, 246, 0.12)',
    'info-border': 'rgba(59, 130, 246, 0.25)',
  }
};

export const shadows = {
  // Multi-tiered layered shadows with ambient occlusion + key light
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
  card: '0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  elevated: '0 12px 32px -4px rgba(0, 0, 0, 0.65), 0 4px 12px -2px rgba(0, 0, 0, 0.4)',
  modal: '0 24px 64px -12px rgba(0, 0, 0, 0.85), 0 8px 24px -4px rgba(0, 0, 0, 0.5)',
  accent: '0 8px 24px -4px rgba(79, 70, 229, 0.35)',
  glow: '0 0 28px -4px rgba(79, 70, 229, 0.22)',
  inner: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
};

export const radii = {
  xs: '6px',
  sm: '10px',
  md: '14px',
  lg: '18px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
  },
  letterSpacing: {
    tighter: '-0.04em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
  },
};

export const motionTokens = {
  // Physical spring easing definitions for Framer Motion
  spring: {
    default: { type: 'spring', stiffness: 380, damping: 28 },
    stiff: { type: 'spring', stiffness: 500, damping: 32 },
    gentle: { type: 'spring', stiffness: 260, damping: 24 },
    bouncy: { type: 'spring', stiffness: 420, damping: 18 },
  },
  transition: {
    smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
    swift: 'cubic-bezier(0.2, 0, 0, 1)',
  },
};

export default {
  colors,
  shadows,
  radii,
  typography,
  motionTokens,
};
