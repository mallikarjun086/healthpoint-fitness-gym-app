import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Gauge, 
  Zap, 
  Eye, 
  Layers, 
  ShieldCheck, 
  Activity,
  CheckCircle2
} from 'lucide-react';

/**
 * AnimatedExerciseDemo Component
 * Lightweight, offline-first vector SVG & CSS skeletal animation rig.
 * Displays biomechanical movement loops, phase indicators, safe joint-angle arcs,
 * and muscle activation heatmaps.
 */
const AnimatedExerciseDemo = ({ 
  exerciseName = 'Exercise',
  rigType = 'bench-press',
  primaryMuscle = 'CHEST',
  safeAngleRanges = null,
  tempo = '3-0-1-0',
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5, 1, 1.5
  const [showAngles, setShowAngles] = useState(true);
  const [showMuscles, setShowMuscles] = useState(true);
  const [currentPhase, setCurrentPhase] = useState('CONCENTRIC'); // CONCENTRIC, PEAK, ECCENTRIC, HOLD
  const [progress, setProgress] = useState(0); // 0 to 100

  // Parse safe angles JSON if string
  const angleData = typeof safeAngleRanges === 'string' 
    ? (() => { try { return JSON.parse(safeAngleRanges); } catch { return null; } })() 
    : safeAngleRanges;

  // Animation cycle loop
  useEffect(() => {
    if (!isPlaying) return;

    const durationMs = 4000 / playbackSpeed;
    const intervalTime = 40;
    const step = (intervalTime / durationMs) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = (prev + step) % 100;
        if (next < 25) {
          setCurrentPhase('ECCENTRIC'); // Lowering / loading phase
        } else if (next < 45) {
          setCurrentPhase('STRETCH / INFLECTION'); // Bottom transition
        } else if (next < 80) {
          setCurrentPhase('CONCENTRIC'); // Explosive drive / lifting
        } else {
          setCurrentPhase('PEAK CONTRACTION'); // Lockout / squeeze
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Normalized sin value for smooth harmonic oscillation [0, 1]
  const cycleVal = (Math.sin((progress / 100) * Math.PI * 2 - Math.PI / 2) + 1) / 2;

  // Normalized archetype kinematics renderer
  const renderSkeletalRig = () => {
    switch (rigType) {
      case 'bench-press': {
        // Horizontal press: Barbell moving vertically down to chest and up
        const barY = 110 + cycleVal * 75; // 110 (top) to 185 (chest)
        const elbowX_L = 100 - (1 - cycleVal) * 28;
        const elbowY_L = 135 + cycleVal * 50;
        const elbowX_R = 200 + (1 - cycleVal) * 28;
        const elbowY_R = 135 + cycleVal * 50;
        const currentAngle = Math.round(45 + cycleVal * 45); // 45° to 90°

        return (
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* Bench Graphic */}
            <rect x="70" y="210" width="160" height="14" rx="4" fill="#1C1D24" stroke="#2B2D38" strokeWidth="2" />
            <line x1="90" y1="224" x2="90" y2="280" stroke="#2B2D38" strokeWidth="4" />
            <line x1="210" y1="224" x2="210" y2="280" stroke="#2B2D38" strokeWidth="4" />

            {/* Torso & Head */}
            <circle cx="150" cy="188" r="14" fill="#3B3D4A" />
            <rect x="132" y="195" width="36" height="18" rx="6" fill={showMuscles ? '#4F46E5' : '#2A2C38'} fillOpacity={showMuscles ? 0.6 : 1} />

            {/* Left Arm Rig */}
            <line x1="135" y1="198" x2={elbowX_L} y2={elbowY_L} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <line x1={elbowX_L} y1={elbowY_L} x2="90" y2={barY} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <circle cx={elbowX_L} cy={elbowY_L} r="5" fill="#4F46E5" />
            <circle cx="90" cy={barY} r="4" fill="#E2E8F0" />

            {/* Right Arm Rig */}
            <line x1="165" y1="198" x2={elbowX_R} y2={elbowY_R} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <line x1={elbowX_R} y1={elbowY_R} x2="210" y2={barY} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <circle cx={elbowX_R} cy={elbowY_R} r="5" fill="#4F46E5" />
            <circle cx="210" cy={barY} r="4" fill="#E2E8F0" />

            {/* Barbell & Plates */}
            <line x1="45" y1={barY} x2="255" y2={barY} stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
            <rect x="40" y={barY - 22} width="8" height="44" rx="2" fill="#6366F1" />
            <rect x="252" y={barY - 22} width="8" height="44" rx="2" fill="#6366F1" />

            {/* Joint Angle Arc & Readout */}
            {showAngles && (
              <g>
                <path 
                  d={`M ${elbowX_L} ${elbowY_L} L ${elbowX_L - 15} ${elbowY_L - 15}`} 
                  stroke="#10B981" 
                  strokeWidth="1.5" 
                  strokeDasharray="2,2" 
                />
                <circle cx={elbowX_L} cy={elbowY_L} r="16" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="24,10" />
                <text x="32" y="80" fill="#10B981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Elbow: {currentAngle}° (Safe 45-90°)
                </text>
              </g>
            )}
          </svg>
        );
      }

      case 'squat-olympic': {
        // Squat: Hip and knee deep flexion, torso upright
        const hipY = 135 + cycleVal * 60; // 135 to 195
        const kneeX = 175 + cycleVal * 24;
        const kneeY = 195 + cycleVal * 15;
        const barY = 70 + cycleVal * 60;
        const torsoAngle = 75 - cycleVal * 10;
        const kneeAngle = Math.round(130 - cycleVal * 55); // 130° to 75°

        return (
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* Ground */}
            <line x1="40" y1="265" x2="260" y2="265" stroke="#2B2D38" strokeWidth="3" />

            {/* Head */}
            <circle cx={140 - cycleVal * 12} cy={barY - 14} r="13" fill="#3B3D4A" />

            {/* Spine & Torso */}
            <line 
              x1={140 - cycleVal * 12} 
              y1={barY} 
              x2={125 - cycleVal * 25} 
              y2={hipY} 
              stroke={showMuscles ? '#4F46E5' : '#94A3B8'} 
              strokeWidth="12" 
              strokeLinecap="round" 
            />

            {/* Thigh / Femur (Quad Activation) */}
            <line 
              x1={125 - cycleVal * 25} 
              y1={hipY} 
              x2={kneeX} 
              y2={kneeY} 
              stroke={showMuscles ? '#818CF8' : '#CBD5E1'} 
              strokeWidth="9" 
              strokeLinecap="round" 
            />

            {/* Shin / Tibia */}
            <line x1={kneeX} y1={kneeY} x2="165" y2="265" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="170" cy="265" rx="14" ry="4" fill="#3B3D4A" />

            {/* Joint Pivots */}
            <circle cx={125 - cycleVal * 25} cy={hipY} r="5" fill="#4F46E5" />
            <circle cx={kneeX} cy={kneeY} r="5" fill="#10B981" />

            {/* Barbell on Traps */}
            <line x1="60" y1={barY} x2="220" y2={barY} stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
            <rect x="52" y={barY - 24} width="8" height="48" rx="2" fill="#6366F1" />

            {/* Joint Angle Telemetry */}
            {showAngles && (
              <g>
                <circle cx={kneeX} cy={kneeY} r="18" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="30,10" />
                <text x="32" y="45" fill="#10B981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Knee Flexion: {kneeAngle}° (Safe 75-130°)
                </text>
              </g>
            )}
          </svg>
        );
      }

      case 'deadlift-conventional':
      case 'romanian-deadlift': {
        // Hip Hinge: Hips push back horizontally, bar skims shins
        const hipX = 145 - cycleVal * 45; // Hips move backward
        const hipY = 145 + cycleVal * 25;
        const barY = 145 + cycleVal * 85;
        const shoulderX = 160 - cycleVal * 20;
        const shoulderY = 100 + cycleVal * 45;
        const hipAngle = Math.round(90 - cycleVal * 45);

        return (
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <line x1="40" y1="265" x2="260" y2="265" stroke="#2B2D38" strokeWidth="3" />

            {/* Head */}
            <circle cx={shoulderX + 5} cy={shoulderY - 18} r="13" fill="#3B3D4A" />

            {/* Spine (Posterior Chain) */}
            <line 
              x1={shoulderX} 
              y1={shoulderY} 
              x2={hipX} 
              y2={hipY} 
              stroke={showMuscles ? '#4F46E5' : '#94A3B8'} 
              strokeWidth="10" 
              strokeLinecap="round" 
            />

            {/* Arms Hanging Straight Down to Bar */}
            <line x1={shoulderX} y1={shoulderY} x2="165" y2={barY} stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />

            {/* Thigh / Hamstring */}
            <line 
              x1={hipX} 
              y1={hipY} 
              x2="160" 
              y2="205" 
              stroke={showMuscles ? '#818CF8' : '#94A3B8'} 
              strokeWidth="8" 
              strokeLinecap="round" 
            />

            {/* Shin */}
            <line x1="160" y1="205" x2="165" y2="265" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="170" cy="265" rx="14" ry="4" fill="#3B3D4A" />

            {/* Barbell & Plates */}
            <line x1="90" y1={barY} x2="240" y2={barY} stroke="#E2E8F0" strokeWidth="4" />
            <circle cx="165" cy={barY} r="5" fill="#E2E8F0" />
            <rect x="235" y={barY - 26} width="10" height="52" rx="3" fill="#6366F1" />

            {showAngles && (
              <g>
                <circle cx={hipX} cy={hipY} r="18" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="30,10" />
                <text x="32" y="45" fill="#10B981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Hip Hinge: {hipAngle}° (Neutral Spine Lock)
                </text>
              </g>
            )}
          </svg>
        );
      }

      case 'overhead-press': {
        // Vertical Push: Barbell moving overhead from clavicle to lockout
        const barY = 165 - cycleVal * 85; // 165 down to 80
        const elbowX_L = 105 - (1 - cycleVal) * 18;
        const elbowY_L = 175 - cycleVal * 35;
        const elbowX_R = 195 + (1 - cycleVal) * 18;
        const elbowY_R = 175 - cycleVal * 35;

        return (
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <line x1="40" y1="275" x2="260" y2="275" stroke="#2B2D38" strokeWidth="3" />

            {/* Body */}
            <circle cx="150" cy="130" r="14" fill="#3B3D4A" />
            <line x1="150" y1="144" x2="150" y2="215" stroke={showMuscles ? '#4F46E5' : '#94A3B8'} strokeWidth="14" strokeLinecap="round" />
            <line x1="140" y1="215" x2="135" y2="275" stroke="#64748B" strokeWidth="7" strokeLinecap="round" />
            <line x1="160" y1="215" x2="165" y2="275" stroke="#64748B" strokeWidth="7" strokeLinecap="round" />

            {/* Left Arm */}
            <line x1="135" y1="148" x2={elbowX_L} y2={elbowY_L} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <line x1={elbowX_L} y1={elbowY_L} x2="115" y2={barY} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <circle cx={elbowX_L} cy={elbowY_L} r="4" fill="#4F46E5" />

            {/* Right Arm */}
            <line x1="165" y1="148" x2={elbowX_R} y2={elbowY_R} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <line x1={elbowX_R} y1={elbowY_R} x2="185" y2={barY} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <circle cx={elbowX_R} cy={elbowY_R} r="4" fill="#4F46E5" />

            {/* Barbell */}
            <line x1="60" y1={barY} x2="240" y2={barY} stroke="#E2E8F0" strokeWidth="4" />
            <rect x="52" y={barY - 20} width="8" height="40" rx="2" fill="#6366F1" />
            <rect x="240" y={barY - 20} width="8" height="40" rx="2" fill="#6366F1" />

            {showAngles && (
              <text x="32" y="45" fill="#10B981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Lockout: {Math.round(90 + cycleVal * 90)}° Overhead Plane
              </text>
            )}
          </svg>
        );
      }

      case 'bicep-curl': {
        // Biceps Curl: Upper arm vertical, forearm curls upward
        const handAngle = (cycleVal * 135 * Math.PI) / 180;
        const forearmLength = 65;
        const handX = 150 + Math.sin(handAngle) * forearmLength;
        const handY = 175 - Math.cos(handAngle) * forearmLength;
        const curlAngle = Math.round(cycleVal * 135);

        return (
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <line x1="40" y1="275" x2="260" y2="275" stroke="#2B2D38" strokeWidth="3" />
            <circle cx="125" cy="90" r="14" fill="#3B3D4A" />
            <line x1="125" y1="104" x2="125" y2="200" stroke="#475569" strokeWidth="12" strokeLinecap="round" />

            {/* Upper Arm (Pinned) */}
            <line x1="125" y1="115" x2="150" y2="175" stroke={showMuscles ? '#4F46E5' : '#94A3B8'} strokeWidth="9" strokeLinecap="round" />
            <circle cx="150" cy="175" r="5" fill="#10B981" />

            {/* Forearm (Curling) */}
            <line x1="150" y1="175" x2={handX} y2={handY} stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />

            {/* Dumbbell */}
            <circle cx={handX} cy={handY} r="10" fill="#6366F1" />
            <rect x={handX - 4} y={handY - 14} width="8" height="28" rx="2" fill="#E2E8F0" />

            {showAngles && (
              <g>
                <circle cx="150" cy="175" r="20" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="30,10" />
                <text x="32" y="45" fill="#10B981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Elbow Flexion: {curlAngle}° (Peak Squeeze)
                </text>
              </g>
            )}
          </svg>
        );
      }

      case 'pullup-strict':
      case 'lat-pulldown': {
        // Vertical Pull
        const bodyY = 160 - cycleVal * 55; // 160 up to 105
        const elbowX_L = 100 + cycleVal * 25;
        const elbowY_L = 95 + (1 - cycleVal) * 45;
        const elbowX_R = 200 - cycleVal * 25;
        const elbowY_R = 95 + (1 - cycleVal) * 45;

        return (
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* Pull-Up Bar */}
            <line x1="40" y1="45" x2="260" y2="45" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
            <line x1="85" y1="45" x2="85" y2="15" stroke="#2B2D38" strokeWidth="4" />
            <line x1="215" y1="45" x2="215" y2="15" stroke="#2B2D38" strokeWidth="4" />

            {/* Body */}
            <circle cx="150" cy={bodyY - 15} r="14" fill="#3B3D4A" />
            <line x1="150" y1={bodyY} x2="150" y2={bodyY + 75} stroke={showMuscles ? '#4F46E5' : '#94A3B8'} strokeWidth="14" strokeLinecap="round" />

            {/* Left Arm */}
            <line x1="95" y1="45" x2={elbowX_L} y2={elbowY_L} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <line x1={elbowX_L} y1={elbowY_L} x2="135" y2={bodyY + 10} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <circle cx={elbowX_L} cy={elbowY_L} r="5" fill="#4F46E5" />

            {/* Right Arm */}
            <line x1="205" y1="45" x2={elbowX_R} y2={elbowY_R} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <line x1={elbowX_R} y1={elbowY_R} x2="165" y2={bodyY + 10} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <circle cx={elbowX_R} cy={elbowY_R} r="5" fill="#4F46E5" />

            {showAngles && (
              <text x="32" y="275" fill="#10B981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Scapular Depressed: {Math.round(45 + cycleVal * 55)}° Adduction
              </text>
            )}
          </svg>
        );
      }

      default: {
        // Universal Biomechanical Kinematic Rig
        const yOffset = cycleVal * 45;
        return (
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <circle cx="150" cy="90" r="16" fill="#3B3D4A" />
            <line x1="150" y1="106" x2="150" y2="195" stroke="#4F46E5" strokeWidth="12" strokeLinecap="round" />
            
            {/* Limbs in motion */}
            <line x1="150" y1="120" x2={100 + yOffset} y2={165 - yOffset / 2} stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
            <line x1="150" y1="120" x2={200 - yOffset} y2={165 - yOffset / 2} stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
            <line x1="150" y1="195" x2="120" y2={260 - yOffset / 4} stroke="#64748B" strokeWidth="7" strokeLinecap="round" />
            <line x1="150" y1="195" x2="180" y2={260 + yOffset / 4} stroke="#64748B" strokeWidth="7" strokeLinecap="round" />

            <circle cx={100 + yOffset} cy={165 - yOffset / 2} r="6" fill="#10B981" />
            <circle cx={200 - yOffset} cy={165 - yOffset / 2} r="6" fill="#10B981" />

            <text x="32" y="45" fill="#818CF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
              Dynamic Kinetic Loop: {primaryMuscle}
            </text>
          </svg>
        );
      }
    }
  };

  return (
    <div className={`relative rounded-2xl bg-hp-surface border border-white/10 overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Top Telemetry Header */}
      <div className="p-3.5 border-b border-white/5 flex items-center justify-between bg-hp-surface-card/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono text-slate-300 font-semibold tracking-wide">
            RIG: <strong className="text-white uppercase">{rigType}</strong>
          </span>
        </div>

        {/* Phase Pill */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-bold tracking-wider">
            {currentPhase}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {tempo}
          </span>
        </div>
      </div>

      {/* Main Canvas Rig Viewport */}
      <div className="relative h-64 sm:h-72 w-full flex items-center justify-center bg-gradient-to-b from-hp-surface to-hp-canvas">
        {renderSkeletalRig()}

        {/* Live Progress Bar along the bottom of viewport */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <motion.div 
            className="h-full bg-indigo-500" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      {/* Biomechanical Controls Toolbar */}
      <div className="p-3 border-t border-white/5 bg-hp-surface-card/80 flex flex-wrap items-center justify-between gap-2">
        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            title={isPlaying ? "Pause Demo" : "Play Demo"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
          </button>
          
          <button
            onClick={() => setProgress(0)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
            title="Restart Loop"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Multiplier Pill */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10 text-[10px] font-mono font-semibold text-slate-300">
            {[0.5, 1, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  playbackSpeed === speed 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Overlays Toggles */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={() => setShowAngles(!showAngles)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors flex items-center gap-1 ${
              showAngles 
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Gauge className="w-3 h-3" /> Joint Angles
          </button>

          <button
            onClick={() => setShowMuscles(!showMuscles)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors flex items-center gap-1 ${
              showMuscles 
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Zap className="w-3 h-3" /> Fiber Heat
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedExerciseDemo;
