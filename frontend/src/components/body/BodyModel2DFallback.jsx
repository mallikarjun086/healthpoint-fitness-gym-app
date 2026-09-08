import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MUSCLE_GROUPS, heatColor } from './muscleData';

/**
 * 2D SVG Fallback — shown when WebGL is unavailable.
 * Renders a labeled front/back body silhouette with clickable hotspot circles.
 * Matches the same onMuscleClick / selectedGroups API as BodyScene.
 */
export default function BodyModel2DFallback({
  side = 'front',
  selectedGroups = new Set(),
  mode = 'select',
  heatData = {},
  onMuscleClick,
  onMuscleHover,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  const visibleMuscles = MUSCLE_GROUPS.filter((m) => {
    if (side === 'front') return !m.backFacing || m.hotspot2D?.front;
    return m.backFacing || m.hotspot2D?.back;
  });

  const getHotspot = (m) => side === 'front' ? m.hotspot2D?.front : m.hotspot2D?.back;

  const getDotColor = (m) => {
    if (mode === 'heatmap') {
      return heatColor(heatData[m.id] ?? null);
    }
    if (selectedGroups.has(m.id)) return '#6366F1';
    if (hoveredId === m.id) return '#4F46E5';
    return '#2A2D3A';
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* SVG silhouette */}
      <svg
        viewBox="0 0 200 500"
        className="h-full max-h-[500px] w-auto"
        aria-label={`Body diagram – ${side} view`}
      >
        {/* ── Body silhouette paths ──────────────────────────── */}
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D1F26" />
            <stop offset="100%" stopColor="#111216" />
          </linearGradient>
        </defs>

        {/* Head */}
        <ellipse cx="100" cy="42" rx="24" ry="28" fill="url(#bodyGrad)" stroke="#2A2D3A" strokeWidth="1.5" />

        {/* Neck */}
        <rect x="89" y="68" width="22" height="18" rx="5" fill="url(#bodyGrad)" stroke="#2A2D3A" strokeWidth="1.5" />

        {/* Torso */}
        <path
          d={side === 'front'
            ? 'M68,86 Q58,110 60,160 Q62,185 100,188 Q138,185 140,160 Q142,110 132,86 Q118,82 100,82 Q82,82 68,86Z'
            : 'M66,86 Q56,112 58,162 Q60,186 100,189 Q140,186 142,162 Q144,112 134,86 Q120,82 100,82 Q80,82 66,86Z'
          }
          fill="url(#bodyGrad)" stroke="#2A2D3A" strokeWidth="1.5"
        />

        {/* Hips */}
        <path
          d="M65,186 Q55,205 58,225 Q62,242 100,244 Q138,242 142,225 Q145,205 135,186Z"
          fill="url(#bodyGrad)" stroke="#2A2D3A" strokeWidth="1.5"
        />

        {/* Left arm */}
        <path
          d="M68,90 Q50,100 44,130 Q40,155 46,178 Q52,178 54,155 Q56,132 68,108Z"
          fill="url(#bodyGrad)" stroke="#2A2D3A" strokeWidth="1.5"
        />
        {/* Right arm */}
        <path
          d="M132,90 Q150,100 156,130 Q160,155 154,178 Q148,178 146,155 Q144,132 132,108Z"
          fill="url(#bodyGrad)" stroke="#2A2D3A" strokeWidth="1.5"
        />

        {/* Left leg */}
        <path
          d="M70,244 Q62,290 62,345 Q62,390 68,420 Q80,422 82,390 Q82,345 84,290 Q88,268 100,252Z"
          fill="url(#bodyGrad)" stroke="#2A2D3A" strokeWidth="1.5"
        />
        {/* Right leg */}
        <path
          d="M130,244 Q138,290 138,345 Q138,390 132,420 Q120,422 118,390 Q118,345 116,290 Q112,268 100,252Z"
          fill="url(#bodyGrad)" stroke="#2A2D3A" strokeWidth="1.5"
        />

        {/* ── Muscle Hotspot dots ────────────────────────────── */}
        {visibleMuscles.map((m) => {
          const hs = getHotspot(m);
          if (!hs) return null;
          const cx = (hs.x / 100) * 200;
          const cy = (hs.y / 100) * 500;
          const isHov = hoveredId === m.id;
          const isSel = selectedGroups.has(m.id);
          const dotColor = getDotColor(m);

          return (
            <g
              key={m.id}
              style={{ cursor: 'pointer' }}
              onClick={() => onMuscleClick?.(m.id)}
              onMouseEnter={() => { setHoveredId(m.id); onMuscleHover?.(m.id); }}
              onMouseLeave={() => { setHoveredId(null); onMuscleHover?.(null); }}
              role="button"
              aria-label={`Select ${m.label}`}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onMuscleClick?.(m.id)}
            >
              {/* Glow ring */}
              {(isHov || isSel) && (
                <circle cx={cx} cy={cy} r={12} fill={dotColor} opacity={0.18} />
              )}
              {/* Main dot */}
              <circle cx={cx} cy={cy} r={isHov ? 8 : 6} fill={dotColor} opacity={0.9} />
              {/* Inner highlight */}
              <circle cx={cx - 1.5} cy={cy - 1.5} r={2} fill="rgba(255,255,255,0.25)" />

              {/* Label on hover */}
              {isHov && (
                <text
                  x={cx + 12}
                  y={cy + 4}
                  fill="#F4F4F6"
                  fontSize={9}
                  fontFamily="Inter,system-ui,sans-serif"
                  fontWeight="600"
                  style={{ pointerEvents: 'none' }}
                >
                  {m.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Fallback notice */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-[10px] text-text-muted">
          2D view — WebGL not available
        </span>
      </div>
    </div>
  );
}
