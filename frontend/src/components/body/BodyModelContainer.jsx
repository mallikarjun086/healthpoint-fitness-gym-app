import { useState, useCallback, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw, RotateCw, Flame, Target, User, Users,
  Eye, TrendingUp, ChevronDown, ChevronUp, Loader2, RefreshCw
} from 'lucide-react';
import { MUSCLE_GROUPS } from './muscleData';
import MuscleGroupPanel from './MuscleGroupPanel';
import BodyModel2DFallback from './BodyModel2DFallback';
import api from '../../api';

// ── Lazy load the heavy 3D canvas (never blocks initial page) ──────────────
const BodyScene = lazy(() => import('./BodyScene'));

// ── WebGL detection ─────────────────────────────────────────────────────────
function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// ── Shimmer loading skeleton while Three.js chunks load ────────────────────
function BodySceneSkeleton() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Pulsing body silhouette placeholder */}
        <div className="w-28 h-48 rounded-[40px] bg-surface-elevated animate-pulse" />
        <div className="absolute -left-8 top-6 w-8 h-28 rounded-full bg-surface-elevated animate-pulse" />
        <div className="absolute -right-8 top-6 w-8 h-28 rounded-full bg-surface-elevated animate-pulse" />
        <div className="absolute left-5 bottom-0 w-8 h-20 rounded-full bg-surface-elevated animate-pulse" />
        <div className="absolute right-5 bottom-0 w-8 h-20 rounded-full bg-surface-elevated animate-pulse" />
      </div>
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <Loader2 size={14} className="animate-spin" />
        Loading 3D Model…
      </div>
    </div>
  );
}

// ── Toolbar button ──────────────────────────────────────────────────────────
function ToolbarBtn({ onClick, active, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
        ${active
          ? 'bg-primary/20 text-primary border border-primary/35'
          : 'bg-surface-elevated text-text-secondary border border-border hover:border-border-light hover:text-text-primary'}
      `}
    >
      {children}
    </button>
  );
}

// ── Main container ──────────────────────────────────────────────────────────
/**
 * BodyModelContainer — the top-level orchestrator for the 3D body map experience.
 *
 * Props:
 *  - onBuildWorkout : (selectedMuscleIds: string[]) => void
 *  - className      : string
 */
export default function BodyModelContainer({ onBuildWorkout, className = '' }) {
  // ── State ──────────────────────────────────────────────────
  const [selectedGroups, setSelectedGroups] = useState(new Set());
  const [hoveredGroup, setHoveredGroup]     = useState(null);
  const [mode, setMode]                     = useState('select');      // 'select' | 'heatmap'
  const [gender, setGender]                 = useState('male');        // 'male' | 'female'
  const [side, setSide]                     = useState('front');       // 'front' | 'back'
  const [autoRotate, setAutoRotate]         = useState(true);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [heatData, setHeatData]             = useState({});
  const [heatLoading, setHeatLoading]       = useState(false);
  const [webglAvailable]                    = useState(() => detectWebGL());
  const idleTimer                           = useRef(null);

  // ── Camera focus: which 3D position to frame ─────────────
  const [cameraFocusTarget, setCameraFocusTarget] = useState(null);

  // ── Heatmap data fetch ────────────────────────────────────
  const fetchHeatData = useCallback(async () => {
    setHeatLoading(true);
    try {
      const res = await api.get('/workouts/muscle-recency');
      // Expected: { "CHEST": 3, "BACK": 7, ... } (days since last trained)
      // Map API keys to muscle IDs
      const rawMap = res.data ?? {};
      const mapped = {};
      MUSCLE_GROUPS.forEach((m) => {
        if (rawMap[m.apiKey] !== undefined) {
          mapped[m.id] = rawMap[m.apiKey];
        }
      });
      setHeatData(mapped);
    } catch {
      // Fallback: build demo data from workout history if endpoint not available
      try {
        const histRes = await api.get('/workouts/my?size=30');
        const workouts = Array.isArray(histRes.data)
          ? histRes.data
          : histRes.data?.content ?? [];

        const recencyMap = {};
        const now = Date.now();

        workouts.forEach((w) => {
          const muscleGroup = w.muscleGroup ?? w.targetMuscleGroup;
          if (!muscleGroup) return;
          const ts = new Date(w.date ?? w.createdAt ?? 0).getTime();
          const days = Math.floor((now - ts) / 86400000);
          MUSCLE_GROUPS.forEach((m) => {
            if (m.apiKey === muscleGroup.toUpperCase()) {
              if (recencyMap[m.id] === undefined || days < recencyMap[m.id]) {
                recencyMap[m.id] = days;
              }
            }
          });
        });
        setHeatData(recencyMap);
      } catch {
        // No data at all — leave empty
      }
    }
    setHeatLoading(false);
  }, []);

  useEffect(() => {
    if (mode === 'heatmap') fetchHeatData();
  }, [mode, fetchHeatData]);

  // ── Muscle click handler ──────────────────────────────────
  const handleMuscleClick = useCallback((id) => {
    setAutoRotate(false);
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setCameraFocusTarget(null);
      } else {
        next.add(id);
        // Focus camera on this muscle's position
        const muscle = MUSCLE_GROUPS.find((m) => m.id === id);
        if (muscle) {
          const [x, y, z] = muscle.geometry.position;
          setCameraFocusTarget([x * 0.5, y - 0.9, z * 0.5]);
        }
      }
      return next;
    });
  }, []);

  // ── Hover ─────────────────────────────────────────────────
  const handleMuscleHover = useCallback((id) => {
    setHoveredGroup(id);
    if (id) {
      // Pause auto-rotate on interaction
      clearTimeout(idleTimer.current);
      setAutoRotate(false);
    }
  }, []);

  // Resume auto-rotate after 3s of no interaction
  const handlePointerLeave = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (selectedGroups.size === 0) setAutoRotate(true);
    }, 3000);
  }, [selectedGroups.size]);

  // ── Front/back flip (180° animated) ──────────────────────
  const handleFlip = useCallback(() => {
    setSide((s) => (s === 'front' ? 'back' : 'front'));
    // For 3D: we nudge the camera azimuth 180°
    // This is handled by the scene via the side → targetAzimuth approach
    setAutoRotate(false);
  }, []);

  // ── Remove muscle ─────────────────────────────────────────
  const handleRemoveMuscle = useCallback((id) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      next.delete(id);
      if (next.size === 0) setCameraFocusTarget(null);
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedGroups(new Set());
    setCameraFocusTarget(null);
    setAutoRotate(true);
  }, []);

  const handleBuildWorkout = useCallback(() => {
    onBuildWorkout?.([...selectedGroups]);
  }, [selectedGroups, onBuildWorkout]);

  // ── Keyboard shortcut: F = flip, M = mode toggle ─────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'f' || e.key === 'F') handleFlip();
      if (e.key === 'm' || e.key === 'M') setMode((m) => m === 'select' ? 'heatmap' : 'select');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleFlip]);

  return (
    <div className={`flex flex-col lg:flex-row gap-4 w-full min-h-[560px] ${className}`}>

      {/* ── Left: 3D / 2D Body Model ──────────────────────── */}
      <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-[560px]">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          {/* Left controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mode toggle */}
            <ToolbarBtn
              active={mode === 'select'}
              onClick={() => setMode('select')}
              title="Selection mode (M)"
            >
              <Target size={13} />
              <span className="hidden sm:inline">Select</span>
            </ToolbarBtn>
            <ToolbarBtn
              active={mode === 'heatmap'}
              onClick={() => setMode('heatmap')}
              title="Progress heatmap (M)"
            >
              <Flame size={13} />
              <span className="hidden sm:inline">Progress</span>
              {heatLoading && <Loader2 size={10} className="animate-spin ml-1" />}
            </ToolbarBtn>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Gender toggle */}
            <ToolbarBtn
              active={gender === 'male'}
              onClick={() => setGender(gender === 'male' ? 'female' : 'male')}
              title="Toggle gender"
            >
              <User size={13} />
              <span className="hidden sm:inline capitalize">{gender}</span>
            </ToolbarBtn>

            {/* Front/Back flip */}
            <ToolbarBtn onClick={handleFlip} title="Flip front/back (F)">
              {side === 'front' ? <RotateCw size={13} /> : <RotateCcw size={13} />}
              <span className="hidden sm:inline">{side === 'front' ? 'Back' : 'Front'}</span>
            </ToolbarBtn>

            {/* Heatmap refresh */}
            {mode === 'heatmap' && (
              <ToolbarBtn onClick={fetchHeatData} title="Refresh heatmap">
                <RefreshCw size={13} className={heatLoading ? 'animate-spin' : ''} />
              </ToolbarBtn>
            )}
          </div>
        </div>

        {/* 3D Canvas area */}
        <div
          className="relative flex-1 rounded-2xl overflow-hidden border border-border bg-gradient-to-b from-surface to-background"
          onPointerLeave={handlePointerLeave}
          onPointerDown={() => {
            setAutoRotate(false);
            clearTimeout(idleTimer.current);
          }}
        >
          {/* Radial glow behind the model */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(79,70,229,0.08) 0%, transparent 70%)',
            }}
          />

          {webglAvailable ? (
            <Suspense fallback={<BodySceneSkeleton />}>
              <BodyScene
                gender={gender}
                selectedGroups={selectedGroups}
                hoveredGroup={hoveredGroup}
                mode={mode}
                heatData={heatData}
                onMuscleClick={handleMuscleClick}
                onMuscleHover={handleMuscleHover}
                autoRotate={autoRotate}
                cameraFocusTarget={cameraFocusTarget}
                side={side}
              />
            </Suspense>
          ) : (
            <BodyModel2DFallback
              side={side}
              selectedGroups={selectedGroups}
              mode={mode}
              heatData={heatData}
              onMuscleClick={handleMuscleClick}
              onMuscleHover={handleMuscleHover}
            />
          )}

          {/* Hovered muscle label overlay (for 3D, the Html component handles it; for 2D it's inline) */}

          {/* Bottom hint */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
            <AnimatePresence>
              {selectedGroups.size === 0 && !hoveredGroup && (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="glass-pill px-3 py-1 rounded-full text-[11px] text-text-muted"
                >
                  {webglAvailable ? 'Drag to rotate · Click a muscle to select' : 'Click a muscle group to select'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Multi-select count badge */}
          <AnimatePresence>
            {selectedGroups.size > 0 && (
              <motion.div
                key="count"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                className="absolute top-3 left-3 badge-accent"
              >
                {selectedGroups.size} selected
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard shortcuts hint */}
          <div className="absolute top-3 right-3 text-[10px] text-text-muted hidden lg:flex flex-col items-end gap-0.5 pointer-events-none">
            <span><kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[9px] mr-1">F</kbd>Flip</span>
            <span><kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[9px] mr-1">M</kbd>Mode</span>
          </div>
        </div>
      </div>

      {/* ── Right: Muscle Group Panel ──────────────────────── */}
      <div className="w-full lg:w-72 flex flex-col">
        {/* Panel header (collapsible on mobile) */}
        <button
          onClick={() => setIsPanelExpanded((p) => !p)}
          className="flex items-center justify-between w-full lg:hidden mb-2 py-2 px-3 rounded-xl bg-surface-card border border-border"
        >
          <span className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" />
            {mode === 'heatmap' ? 'Training Heatmap' : 'Muscle Selection'}
          </span>
          {isPanelExpanded ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
        </button>

        <AnimatePresence>
          {(isPanelExpanded) && (
            <motion.div
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:!h-auto lg:!opacity-100 overflow-hidden"
            >
              <div className="panel-card p-4 lg:sticky lg:top-4 flex flex-col h-full max-h-[500px] lg:max-h-none overflow-y-auto">
                <div className="hidden lg:flex items-center gap-2 mb-4">
                  <TrendingUp size={15} className="text-primary" />
                  <span className="heading-sm">
                    {mode === 'heatmap' ? 'Training Heatmap' : 'Muscle Selection'}
                  </span>
                </div>
                <MuscleGroupPanel
                  selectedGroups={selectedGroups}
                  mode={mode}
                  heatData={heatData}
                  onRemoveMuscle={handleRemoveMuscle}
                  onClearAll={handleClearAll}
                  onBuildWorkout={handleBuildWorkout}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
