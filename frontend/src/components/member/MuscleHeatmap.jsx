import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Rotate3d, ChevronRight, Dumbbell, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const muscleData = [
  // Anterior (Front)
  { id: 'chest_upper',   name: 'Upper Chest',        category: 'CHEST',     view: 'front', cx: 200, cy: 142, r: 28, activation: 94,  status: 'Optimal Hypertrophy',      fill: '#5B6EFF' },
  { id: 'chest_mid',     name: 'Mid Chest',           category: 'CHEST',     view: 'front', cx: 200, cy: 168, r: 24, activation: 88,  status: 'Active',                   fill: '#5B6EFF' },
  { id: 'delts_l',       name: 'Front Deltoid (L)',   category: 'SHOULDERS', view: 'front', cx: 142, cy: 138, r: 18, activation: 82,  status: 'Active',                   fill: '#A855F7' },
  { id: 'delts_r',       name: 'Front Deltoid (R)',   category: 'SHOULDERS', view: 'front', cx: 258, cy: 138, r: 18, activation: 82,  status: 'Active',                   fill: '#A855F7' },
  { id: 'biceps_l',      name: 'Biceps (L)',          category: 'ARMS',      view: 'front', cx: 118, cy: 185, r: 14, activation: 86,  status: 'Target Fiber Recruited',   fill: '#5B6EFF' },
  { id: 'biceps_r',      name: 'Biceps (R)',          category: 'ARMS',      view: 'front', cx: 282, cy: 185, r: 14, activation: 86,  status: 'Target Fiber Recruited',   fill: '#5B6EFF' },
  { id: 'forearm_l',     name: 'Forearm (L)',         category: 'ARMS',      view: 'front', cx: 106, cy: 230, r: 10, activation: 60,  status: 'Auxiliary',                fill: '#3B4BC4' },
  { id: 'forearm_r',     name: 'Forearm (R)',         category: 'ARMS',      view: 'front', cx: 294, cy: 230, r: 10, activation: 60,  status: 'Auxiliary',                fill: '#3B4BC4' },
  { id: 'abs_upper',     name: 'Upper Abs',           category: 'CORE',      view: 'front', cx: 200, cy: 196, r: 16, activation: 74,  status: 'Recovered',                fill: '#7E8EFF' },
  { id: 'abs_lower',     name: 'Lower Abs',           category: 'CORE',      view: 'front', cx: 200, cy: 224, r: 14, activation: 68,  status: 'Recovered',                fill: '#7E8EFF' },
  { id: 'obliques_l',    name: 'Obliques (L)',        category: 'CORE',      view: 'front', cx: 166, cy: 208, r: 12, activation: 55,  status: 'Rest Period',              fill: '#3B4BC4' },
  { id: 'obliques_r',    name: 'Obliques (R)',        category: 'CORE',      view: 'front', cx: 234, cy: 208, r: 12, activation: 55,  status: 'Rest Period',              fill: '#3B4BC4' },
  { id: 'quads_l',       name: 'Quadriceps (L)',      category: 'LEGS',      view: 'front', cx: 174, cy: 306, r: 22, activation: 92,  status: 'Peak Hypertrophy',         fill: '#5B6EFF' },
  { id: 'quads_r',       name: 'Quadriceps (R)',      category: 'LEGS',      view: 'front', cx: 226, cy: 306, r: 22, activation: 92,  status: 'Peak Hypertrophy',         fill: '#5B6EFF' },
  { id: 'calves_l',      name: 'Calves (L)',          category: 'LEGS',      view: 'front', cx: 172, cy: 390, r: 14, activation: 65,  status: 'Rest Period',              fill: '#3B4BC4' },
  { id: 'calves_r',      name: 'Calves (R)',          category: 'LEGS',      view: 'front', cx: 228, cy: 390, r: 14, activation: 65,  status: 'Rest Period',              fill: '#3B4BC4' },

  // Posterior (Back)
  { id: 'traps',         name: 'Trapezius',           category: 'BACK',      view: 'back',  cx: 200, cy: 130, r: 28, activation: 78,  status: 'Active',                   fill: '#A855F7' },
  { id: 'rear_delts_l',  name: 'Rear Deltoid (L)',    category: 'SHOULDERS', view: 'back',  cx: 142, cy: 140, r: 16, activation: 75,  status: 'Active',                   fill: '#A855F7' },
  { id: 'rear_delts_r',  name: 'Rear Deltoid (R)',    category: 'SHOULDERS', view: 'back',  cx: 258, cy: 140, r: 16, activation: 75,  status: 'Active',                   fill: '#A855F7' },
  { id: 'lats_l',        name: 'Lats (L)',            category: 'BACK',      view: 'back',  cx: 162, cy: 180, r: 22, activation: 85,  status: 'Active Volume',            fill: '#5B6EFF' },
  { id: 'lats_r',        name: 'Lats (R)',            category: 'BACK',      view: 'back',  cx: 238, cy: 180, r: 22, activation: 85,  status: 'Active Volume',            fill: '#5B6EFF' },
  { id: 'rhomboids',     name: 'Rhomboids',           category: 'BACK',      view: 'back',  cx: 200, cy: 162, r: 14, activation: 70,  status: 'Active',                   fill: '#7E8EFF' },
  { id: 'triceps_l',     name: 'Triceps (L)',         category: 'ARMS',      view: 'back',  cx: 118, cy: 188, r: 14, activation: 80,  status: 'Recovered',                fill: '#7E8EFF' },
  { id: 'triceps_r',     name: 'Triceps (R)',         category: 'ARMS',      view: 'back',  cx: 282, cy: 188, r: 14, activation: 80,  status: 'Recovered',                fill: '#7E8EFF' },
  { id: 'lower_back',    name: 'Spinal Erectors',     category: 'BACK',      view: 'back',  cx: 200, cy: 218, r: 16, activation: 72,  status: 'Recovered',                fill: '#7E8EFF' },
  { id: 'glutes',        name: 'Glutes',              category: 'LEGS',      view: 'back',  cx: 200, cy: 262, r: 28, activation: 89,  status: 'Active Volume',            fill: '#5B6EFF' },
  { id: 'hamstrings_l',  name: 'Hamstrings (L)',      category: 'LEGS',      view: 'back',  cx: 174, cy: 316, r: 20, activation: 81,  status: 'Active',                   fill: '#5B6EFF' },
  { id: 'hamstrings_r',  name: 'Hamstrings (R)',      category: 'LEGS',      view: 'back',  cx: 226, cy: 316, r: 20, activation: 81,  status: 'Active',                   fill: '#5B6EFF' },
  { id: 'calves_back_l', name: 'Gastrocnemius (L)',   category: 'LEGS',      view: 'back',  cx: 172, cy: 388, r: 14, activation: 65,  status: 'Rest Period',              fill: '#3B4BC4' },
  { id: 'calves_back_r', name: 'Gastrocnemius (R)',   category: 'LEGS',      view: 'back',  cx: 228, cy: 388, r: 14, activation: 65,  status: 'Rest Period',              fill: '#3B4BC4' },
];

// Activation → opacity
const actOpacity = (act) => 0.25 + (act / 100) * 0.75;

// Body silhouette paths — proper anatomical fill shapes for each view
const FrontSilhouette = () => (
  <g>
    {/* Head */}
    <ellipse cx="200" cy="80" rx="30" ry="36" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1.5" />
    {/* Neck */}
    <rect x="188" y="113" width="24" height="18" rx="4" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1" />
    {/* Torso */}
    <path d="M148 128 C136 132 124 145 122 165 L118 240 C116 248 120 255 128 256 L140 256 L140 248 L156 248 L158 260 L242 260 L244 248 L260 248 L260 256 L272 256 C280 255 284 248 282 240 L278 165 C276 145 264 132 252 128 Z" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1.5" />
    {/* Left Arm */}
    <path d="M124 132 C112 140 106 160 104 180 L100 220 C98 232 100 242 108 244 L118 244 L120 232 L124 232 L128 220 L130 175 L140 145 Z" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1.5" />
    {/* Right Arm */}
    <path d="M276 132 C288 140 294 160 296 180 L300 220 C302 232 300 242 292 244 L282 244 L280 232 L276 232 L272 220 L270 175 L260 145 Z" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1.5" />
    {/* Left Leg */}
    <path d="M152 258 C146 270 142 295 140 320 C138 345 138 368 140 388 C142 404 146 412 154 414 C162 416 170 410 172 398 C174 388 174 368 174 348 C174 328 174 308 172 288 Z" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1.5" />
    {/* Right Leg */}
    <path d="M248 258 C254 270 258 295 260 320 C262 345 262 368 260 388 C258 404 254 412 246 414 C238 416 230 410 228 398 C226 388 226 368 226 348 C226 328 226 308 228 288 Z" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1.5" />
  </g>
);

const BackSilhouette = () => (
  <g>
    {/* Head */}
    <ellipse cx="200" cy="80" rx="30" ry="36" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1.5" />
    {/* Neck */}
    <rect x="188" y="113" width="24" height="18" rx="4" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1" />
    {/* Torso */}
    <path d="M148 128 C136 132 124 148 122 168 L118 240 C116 248 120 256 128 257 L140 257 L140 250 L156 250 L158 262 L242 262 L244 250 L260 250 L260 257 L272 257 C280 256 284 248 282 240 L278 168 C276 148 264 132 252 128 Z" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1.5" />
    {/* Left Arm */}
    <path d="M124 132 C112 140 106 160 104 180 L100 220 C98 232 100 242 108 244 L118 244 L120 232 L124 232 L128 220 L130 175 L140 145 Z" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1.5" />
    {/* Right Arm */}
    <path d="M276 132 C288 140 294 160 296 180 L300 220 C302 232 300 242 292 244 L282 244 L280 232 L276 232 L272 220 L270 175 L260 145 Z" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1.5" />
    {/* Left Leg */}
    <path d="M152 260 C146 272 142 297 140 322 C138 347 138 370 140 390 C142 406 146 414 154 416 C162 418 170 412 172 400 C174 390 174 370 174 350 C174 330 174 310 172 290 Z" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1.5" />
    {/* Right Leg */}
    <path d="M248 260 C254 272 258 297 260 322 C262 347 262 370 260 390 C258 406 254 414 246 416 C238 418 230 412 228 400 C226 390 226 370 226 350 C226 330 226 310 228 290 Z" fill="#1e1e2a" stroke="#2d2d3a" strokeWidth="1.5" />
  </g>
);

const MuscleHeatmap = () => {
  const navigate = useNavigate();
  const [selectedMuscle, setSelectedMuscle] = useState(muscleData[0]);
  const [currentView, setCurrentView] = useState('front');

  const visibleMuscles = muscleData.filter(m => m.view === currentView);

  return (
    <div className="panel p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-accent">3D Biomechanics</span>
            <span className="text-[11px] text-text-secondary font-medium">Full Body Anatomical Map</span>
          </div>
          <h3 className="text-lg font-bold text-text-primary mt-1">Interactive Muscle Fiber Activation</h3>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-surface-elevated rounded-xl border border-border self-start">
          <button
            onClick={() => { setCurrentView('front'); setSelectedMuscle(muscleData.find(m => m.view === 'front')); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${currentView === 'front' ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Anterior (Front)
          </button>
          <button
            onClick={() => { setCurrentView('back'); setSelectedMuscle(muscleData.find(m => m.view === 'back')); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${currentView === 'back' ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Posterior (Back)
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Anatomical Body Map */}
        <div className="lg:col-span-6 relative bg-surface-elevated/40 rounded-2xl border border-border overflow-hidden flex items-center justify-center" style={{ minHeight: 440 }}>
          <AnimatePresence mode="wait">
            <motion.svg
              key={currentView}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              viewBox="0 0 400 440"
              className="w-full max-w-[280px]"
            >
              {/* Defs for glow filter */}
              <defs>
                <filter id="muscleGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="selectGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#5B6EFF" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#0D0D12" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background ambient */}
              <rect x="0" y="0" width="400" height="440" fill="url(#bgGlow)" />

              {/* Body silhouette */}
              {currentView === 'front' ? <FrontSilhouette /> : <BackSilhouette />}

              {/* Muscle heat blobs */}
              {visibleMuscles.map(m => {
                const isSelected = selectedMuscle?.id === m.id;
                const opacity = actOpacity(m.activation);
                return (
                  <g key={m.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedMuscle(m)}>
                    {/* Outer glow for selected */}
                    {isSelected && (
                      <circle cx={m.cx} cy={m.cy} r={m.r + 10} fill={m.fill} opacity={0.18} filter="url(#selectGlow)" />
                    )}
                    {/* Muscle blob */}
                    <circle
                      cx={m.cx} cy={m.cy} r={m.r}
                      fill={m.fill}
                      opacity={isSelected ? 0.95 : opacity}
                      filter={isSelected ? 'url(#muscleGlow)' : undefined}
                    />
                    {/* Inner specular sheen */}
                    <ellipse
                      cx={m.cx - m.r * 0.25} cy={m.cy - m.r * 0.28}
                      rx={m.r * 0.38} ry={m.r * 0.22}
                      fill="#ffffff" opacity={isSelected ? 0.55 : 0.25}
                      transform={`rotate(-25 ${m.cx} ${m.cy})`}
                    />
                    {/* Selection ring */}
                    {isSelected && (
                      <circle cx={m.cx} cy={m.cy} r={m.r + 5} fill="none" stroke="#ffffff" strokeWidth="1.5" opacity={0.7} />
                    )}
                  </g>
                );
              })}

              {/* Pedestal shadow */}
              <ellipse cx="200" cy="430" rx="60" ry="8" fill="#5B6EFF" opacity="0.08" />
            </motion.svg>
          </AnimatePresence>

          {/* View label */}
          <div className="absolute top-3 right-3 text-[10px] text-text-secondary bg-surface/90 px-2.5 py-1 rounded-lg border border-border">
            View: <strong className="text-text-primary uppercase">{currentView}</strong>
          </div>

          {/* Rotate hint */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] text-text-secondary bg-surface/90 px-2.5 py-1 rounded-lg border border-border pointer-events-none">
            <RotateCcw className="w-3 h-3 text-primary" />
            <span>Click muscle to inspect</span>
          </div>
        </div>

        {/* Inspector Panel */}
        <div className="lg:col-span-6 space-y-4">
          {/* Selected Focus Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMuscle?.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-text-secondary tracking-wider">Target Muscle Group</span>
                  <h4 className="text-base font-bold text-text-primary mt-0.5">{selectedMuscle.name}</h4>
                  <p className="text-xs text-text-secondary font-medium">
                    Region: {selectedMuscle.category} · View: {selectedMuscle.view}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl stat-number text-primary">{selectedMuscle.activation}%</span>
                  <div className="text-[10px] text-emerald-400 font-medium mt-0.5">{selectedMuscle.status}</div>
                </div>
              </div>

              {/* Activation bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-text-secondary">
                  <span>Fiber Recruitment Load</span>
                  <span>Optimal (RPE 8.5)</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(to right, #5B6EFF, #A855F7)` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedMuscle.activation}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              <button
                onClick={() => navigate(`/member/videos?category=${selectedMuscle.category}`)}
                className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-1.5 mt-2"
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Explore {selectedMuscle.name} Exercises in Vault</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Quick Muscle Selector */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-text-secondary">Quick Anatomical Hotspots:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {visibleMuscles.slice(0, 6).map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMuscle(m)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    selectedMuscle?.id === m.id
                      ? 'bg-primary/10 border-primary text-text-primary font-semibold'
                      : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary hover:border-border-light'
                  }`}
                >
                  <div className="truncate font-medium">{m.name}</div>
                  <div className="text-[10px] text-text-muted font-mono">{m.activation}% load</div>
                </button>
              ))}
            </div>
          </div>

          {/* Activation Legend */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-text-muted">Low</span>
            <div className="flex-1 h-1.5 rounded-full" style={{ background: 'linear-gradient(to right, #3B4BC4, #5B6EFF, #A855F7)' }} />
            <span className="text-[10px] text-text-muted">Peak</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuscleHeatmap;
