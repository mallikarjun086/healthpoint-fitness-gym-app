/**
 * HealthPoint — Muscle Group Data
 * Each entry describes a selectable body region for the 3D body model.
 *
 * geometry:
 *   type: 'capsule' | 'sphere' | 'box'
 *   args: constructor args (radiusTop, radiusBottom, height, segs) for capsule
 *         or [rx, ry, rz] scale for sphere
 *   position: [x, y, z]
 *   rotation: [rx, ry, rz] in radians
 *   scale: [sx, sy, sz] — allows squashing/stretching primitive into muscle shape
 *
 * backFacing: true = primarily visible from back view
 * apiKey: maps to backend muscleGroup filter value
 * color: base tint (overridden by hover/select/heatmap)
 * hotspot2D: { front: {x,y}, back: {x,y} } — % positions on 2D SVG diagram
 */

export const MUSCLE_GROUPS = [
  // ── HEAD / NECK ─────────────────────────────────────────────
  {
    id: 'neck',
    label: 'Neck',
    apiKey: 'NECK',
    backFacing: false,
    geometry: {
      type: 'capsule',
      args: [0.065, 0.065, 0.14, 8],
      position: [0, 1.595, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    hotspot2D: { front: { x: 50, y: 11 }, back: { x: 50, y: 11 } },
  },

  // ── CHEST ────────────────────────────────────────────────────
  {
    id: 'chest',
    label: 'Chest',
    apiKey: 'CHEST',
    backFacing: false,
    geometry: {
      type: 'capsule',
      args: [0.18, 0.18, 0.18, 12],
      position: [0, 1.28, 0.05],
      rotation: [Math.PI / 2, 0, 0],
      scale: [1.6, 1, 0.55],
    },
    hotspot2D: { front: { x: 50, y: 21 }, back: null },
  },

  // ── SHOULDERS ────────────────────────────────────────────────
  {
    id: 'left-shoulder',
    label: 'Left Shoulder',
    apiKey: 'SHOULDERS',
    backFacing: false,
    geometry: {
      type: 'sphere',
      args: [0.145, 14, 14],
      position: [-0.38, 1.35, 0],
      rotation: [0, 0, 0],
      scale: [1, 0.85, 0.9],
    },
    hotspot2D: { front: { x: 25, y: 18 }, back: { x: 25, y: 18 } },
  },
  {
    id: 'right-shoulder',
    label: 'Right Shoulder',
    apiKey: 'SHOULDERS',
    backFacing: false,
    geometry: {
      type: 'sphere',
      args: [0.145, 14, 14],
      position: [0.38, 1.35, 0],
      rotation: [0, 0, 0],
      scale: [1, 0.85, 0.9],
    },
    hotspot2D: { front: { x: 75, y: 18 }, back: { x: 75, y: 18 } },
  },

  // ── BICEPS ───────────────────────────────────────────────────
  {
    id: 'left-bicep',
    label: 'Left Bicep',
    apiKey: 'BICEPS',
    backFacing: false,
    geometry: {
      type: 'capsule',
      args: [0.075, 0.075, 0.22, 10],
      position: [-0.46, 1.12, 0.03],
      rotation: [0.15, 0, 0],
      scale: [1, 1, 0.85],
    },
    hotspot2D: { front: { x: 20, y: 30 }, back: null },
  },
  {
    id: 'right-bicep',
    label: 'Right Bicep',
    apiKey: 'BICEPS',
    backFacing: false,
    geometry: {
      type: 'capsule',
      args: [0.075, 0.075, 0.22, 10],
      position: [0.46, 1.12, 0.03],
      rotation: [0.15, 0, 0],
      scale: [1, 1, 0.85],
    },
    hotspot2D: { front: { x: 80, y: 30 }, back: null },
  },

  // ── TRICEPS ──────────────────────────────────────────────────
  {
    id: 'left-tricep',
    label: 'Left Tricep',
    apiKey: 'TRICEPS',
    backFacing: true,
    geometry: {
      type: 'capsule',
      args: [0.068, 0.068, 0.22, 10],
      position: [-0.46, 1.12, -0.05],
      rotation: [0.15, 0, 0],
      scale: [1, 1, 0.8],
    },
    hotspot2D: { front: null, back: { x: 20, y: 30 } },
  },
  {
    id: 'right-tricep',
    label: 'Right Tricep',
    apiKey: 'TRICEPS',
    backFacing: true,
    geometry: {
      type: 'capsule',
      args: [0.068, 0.068, 0.22, 10],
      position: [0.46, 1.12, -0.05],
      rotation: [0.15, 0, 0],
      scale: [1, 1, 0.8],
    },
    hotspot2D: { front: null, back: { x: 80, y: 30 } },
  },

  // ── FOREARMS ─────────────────────────────────────────────────
  {
    id: 'left-forearm',
    label: 'Left Forearm',
    apiKey: 'FOREARMS',
    backFacing: false,
    geometry: {
      type: 'capsule',
      args: [0.055, 0.04, 0.22, 8],
      position: [-0.49, 0.86, 0.02],
      rotation: [0.1, 0, 0],
      scale: [1, 1, 1],
    },
    hotspot2D: { front: { x: 17, y: 42 }, back: { x: 17, y: 42 } },
  },
  {
    id: 'right-forearm',
    label: 'Right Forearm',
    apiKey: 'FOREARMS',
    backFacing: false,
    geometry: {
      type: 'capsule',
      args: [0.055, 0.04, 0.22, 8],
      position: [0.49, 0.86, 0.02],
      rotation: [0.1, 0, 0],
      scale: [1, 1, 1],
    },
    hotspot2D: { front: { x: 83, y: 42 }, back: { x: 83, y: 42 } },
  },

  // ── UPPER BACK / LATS ────────────────────────────────────────
  {
    id: 'left-lat',
    label: 'Left Lat',
    apiKey: 'BACK',
    backFacing: true,
    geometry: {
      type: 'capsule',
      args: [0.1, 0.08, 0.28, 10],
      position: [-0.22, 1.2, -0.07],
      rotation: [0, 0, Math.PI * 0.12],
      scale: [1, 1, 0.6],
    },
    hotspot2D: { front: null, back: { x: 35, y: 26 } },
  },
  {
    id: 'right-lat',
    label: 'Right Lat',
    apiKey: 'BACK',
    backFacing: true,
    geometry: {
      type: 'capsule',
      args: [0.1, 0.08, 0.28, 10],
      position: [0.22, 1.2, -0.07],
      rotation: [0, 0, -Math.PI * 0.12],
      scale: [1, 1, 0.6],
    },
    hotspot2D: { front: null, back: { x: 65, y: 26 } },
  },

  // ── CORE / ABS ───────────────────────────────────────────────
  {
    id: 'abs',
    label: 'Core / Abs',
    apiKey: 'CORE',
    backFacing: false,
    geometry: {
      type: 'capsule',
      args: [0.14, 0.12, 0.26, 12],
      position: [0, 1.06, 0.05],
      rotation: [0, 0, 0],
      scale: [1.1, 1, 0.5],
    },
    hotspot2D: { front: { x: 50, y: 33 }, back: null },
  },

  // ── LOWER BACK ───────────────────────────────────────────────
  {
    id: 'lower-back',
    label: 'Lower Back',
    apiKey: 'BACK',
    backFacing: true,
    geometry: {
      type: 'capsule',
      args: [0.13, 0.11, 0.2, 10],
      position: [0, 1.05, -0.08],
      rotation: [0, 0, 0],
      scale: [1.3, 1, 0.5],
    },
    hotspot2D: { front: null, back: { x: 50, y: 36 } },
  },

  // ── GLUTES ───────────────────────────────────────────────────
  {
    id: 'left-glute',
    label: 'Left Glute',
    apiKey: 'GLUTES',
    backFacing: true,
    geometry: {
      type: 'sphere',
      args: [0.145, 12, 12],
      position: [-0.145, 0.78, -0.08],
      rotation: [0, 0, 0],
      scale: [1, 0.85, 0.9],
    },
    hotspot2D: { front: null, back: { x: 38, y: 50 } },
  },
  {
    id: 'right-glute',
    label: 'Right Glute',
    apiKey: 'GLUTES',
    backFacing: true,
    geometry: {
      type: 'sphere',
      args: [0.145, 12, 12],
      position: [0.145, 0.78, -0.08],
      rotation: [0, 0, 0],
      scale: [1, 0.85, 0.9],
    },
    hotspot2D: { front: null, back: { x: 62, y: 50 } },
  },

  // ── QUADS ────────────────────────────────────────────────────
  {
    id: 'left-quad',
    label: 'Left Quad',
    apiKey: 'QUADS',
    backFacing: false,
    geometry: {
      type: 'capsule',
      args: [0.105, 0.085, 0.32, 10],
      position: [-0.155, 0.52, 0.03],
      rotation: [0.05, 0, 0],
      scale: [1, 1, 0.75],
    },
    hotspot2D: { front: { x: 37, y: 60 }, back: null },
  },
  {
    id: 'right-quad',
    label: 'Right Quad',
    apiKey: 'QUADS',
    backFacing: false,
    geometry: {
      type: 'capsule',
      args: [0.105, 0.085, 0.32, 10],
      position: [0.155, 0.52, 0.03],
      rotation: [0.05, 0, 0],
      scale: [1, 1, 0.75],
    },
    hotspot2D: { front: { x: 63, y: 60 }, back: null },
  },

  // ── HAMSTRINGS ───────────────────────────────────────────────
  {
    id: 'left-hamstring',
    label: 'Left Hamstring',
    apiKey: 'HAMSTRINGS',
    backFacing: true,
    geometry: {
      type: 'capsule',
      args: [0.1, 0.08, 0.3, 10],
      position: [-0.155, 0.52, -0.07],
      rotation: [0.05, 0, 0],
      scale: [1, 1, 0.7],
    },
    hotspot2D: { front: null, back: { x: 37, y: 62 } },
  },
  {
    id: 'right-hamstring',
    label: 'Right Hamstring',
    apiKey: 'HAMSTRINGS',
    backFacing: true,
    geometry: {
      type: 'capsule',
      args: [0.1, 0.08, 0.3, 10],
      position: [0.155, 0.52, -0.07],
      rotation: [0.05, 0, 0],
      scale: [1, 1, 0.7],
    },
    hotspot2D: { front: null, back: { x: 63, y: 62 } },
  },

  // ── CALVES ───────────────────────────────────────────────────
  {
    id: 'left-calf',
    label: 'Left Calf',
    apiKey: 'CALVES',
    backFacing: true,
    geometry: {
      type: 'capsule',
      args: [0.072, 0.05, 0.25, 8],
      position: [-0.155, 0.19, -0.02],
      rotation: [0.03, 0, 0],
      scale: [1, 1, 0.8],
    },
    hotspot2D: { front: null, back: { x: 37, y: 80 } },
  },
  {
    id: 'right-calf',
    label: 'Right Calf',
    apiKey: 'CALVES',
    backFacing: true,
    geometry: {
      type: 'capsule',
      args: [0.072, 0.05, 0.25, 8],
      position: [0.155, 0.19, -0.02],
      rotation: [0.03, 0, 0],
      scale: [1, 1, 0.8],
    },
    hotspot2D: { front: null, back: { x: 63, y: 80 } },
  },
];

/** Unique API keys for filter UI */
export const MUSCLE_API_KEYS = [...new Set(MUSCLE_GROUPS.map((m) => m.apiKey))];

/**
 * Compute a heatmap color based on days since the muscle was last trained.
 * Returns a hex string.
 */
export function heatColor(daysSince) {
  if (daysSince === null || daysSince === undefined || daysSince > 21) return '#3B3B45'; // never / very cold
  if (daysSince <= 2) return '#EF4444'; // fresh — hot red
  if (daysSince <= 5) return '#F59E0B'; // optimal — amber
  if (daysSince <= 7) return '#10B981'; // needs work — green
  if (daysSince <= 14) return '#3B82F6'; // undertrained — blue
  return '#3B3B45'; // cold
}

/** Base (resting) color for all muscles in selection mode */
export const BASE_MUSCLE_COLOR = '#2A2D3A';
/** Hover emissive color (matches primary accent) */
export const HOVER_EMISSIVE = '#4F46E5';
/** Selected emissive color */
export const SELECT_EMISSIVE = '#6366F1';
