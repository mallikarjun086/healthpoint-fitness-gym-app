import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  Heart, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2,
  Activity
} from 'lucide-react';

const PHASE_CONFIG = {
  INHALE: { name: 'Inhale', duration: 4.0, instruction: 'Inhale deeply through your nose, expanding your diaphragm', scale: 1.5, color: '#6366F1' },
  HOLD: { name: 'Hold', duration: 1.5, instruction: 'Hold breath gently without tension', scale: 1.5, color: '#8B5CF6' },
  EXHALE: { name: 'Exhale', duration: 4.5, instruction: 'Smoothly release all air through your lips', scale: 1.0, color: '#10B981' },
};

const GuidedBreathingModal = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('INHALE'); // INHALE, HOLD, EXHALE
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(4.0);
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(300); // 5 Minutes
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef(null);

  // Play subtle web audio chime on phase transition
  const playChime = (freq = 440) => {
    if (isMuted || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (ignored) {}
  };

  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTotalSecondsLeft(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 0.1;
      });

      setPhaseTimeLeft(prev => {
        if (prev <= 0.15) {
          // Transition phase
          if (phase === 'INHALE') {
            setPhase('HOLD');
            playChime(520);
            return PHASE_CONFIG.HOLD.duration;
          } else if (phase === 'HOLD') {
            setPhase('EXHALE');
            playChime(390);
            return PHASE_CONFIG.EXHALE.duration;
          } else {
            setPhase('INHALE');
            setCompletedCycles(c => c + 1);
            playChime(440);
            return PHASE_CONFIG.INHALE.duration;
          }
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [isActive, phase, isMuted]);

  const handleToggleActive = () => {
    if (!isActive && totalSecondsLeft === 0) {
      setTotalSecondsLeft(300);
      setCompletedCycles(0);
      setPhase('INHALE');
      setPhaseTimeLeft(4.0);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('INHALE');
    setPhaseTimeLeft(4.0);
    setTotalSecondsLeft(300);
    setCompletedCycles(0);
  };

  if (!isOpen) return null;

  const currentPhaseConfig = PHASE_CONFIG[phase];
  const minutes = Math.floor(totalSecondsLeft / 60);
  const seconds = Math.floor(totalSecondsLeft % 60);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-lg"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="relative w-full max-w-xl bg-surface-card border border-border-light rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-surface-elevated/40">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-accent">Parasympathetic Priming</span>
                <span className="text-[10px] text-indigo-400 font-mono font-bold">0.1 Hz Cadence (6 BPM)</span>
              </div>
              <h2 className="heading-lg text-text-primary">Pre-Workout Coherence Breathing</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 text-text-muted hover:text-text-primary border border-border transition-colors"
                title={isMuted ? "Unmute Chime" : "Mute Chime"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-primary" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 text-text-muted hover:text-text-primary border border-border transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-8 flex flex-col items-center justify-center space-y-8 min-h-[380px] relative overflow-hidden">
            {/* Ambient Background Pulse */}
            <motion.div
              animate={{
                scale: phase === 'INHALE' ? 1.4 : phase === 'HOLD' ? 1.4 : 0.9,
                opacity: phase === 'INHALE' ? 0.25 : 0.12
              }}
              transition={{ duration: currentPhaseConfig.duration, ease: "easeInOut" }}
              className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: currentPhaseConfig.color }}
            />

            {/* Paced Respiration Orb */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Outer Pulsing Rings */}
              <motion.div
                animate={{
                  scale: phase === 'INHALE' ? [1, 1.25, 1.3] : phase === 'HOLD' ? 1.3 : [1.3, 1.1, 1.0],
                }}
                transition={{ duration: currentPhaseConfig.duration, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-primary/30"
              />
              <motion.div
                animate={{
                  scale: phase === 'INHALE' ? [0.9, 1.15, 1.2] : phase === 'HOLD' ? 1.2 : [1.2, 1.0, 0.9],
                }}
                transition={{ duration: currentPhaseConfig.duration, ease: "easeInOut" }}
                className="absolute inset-4 rounded-full border border-dashed border-indigo-400/20"
              />

              {/* Center Morphing Core */}
              <motion.div
                animate={{
                  scale: phase === 'INHALE' ? 1.35 : phase === 'HOLD' ? 1.35 : 0.9,
                  backgroundColor: currentPhaseConfig.color
                }}
                transition={{ duration: currentPhaseConfig.duration, ease: "easeInOut" }}
                className="w-28 h-28 rounded-full shadow-2xl flex flex-col items-center justify-center text-white text-center p-2 z-10"
              >
                <Wind className="w-5 h-5 mb-0.5 animate-pulse" />
                <span className="text-sm font-bold tracking-wide uppercase font-display">
                  {currentPhaseConfig.name}
                </span>
                <span className="text-xs font-mono font-bold">
                  {phaseTimeLeft.toFixed(1)}s
                </span>
              </motion.div>
            </div>

            {/* Phase Instructions & Cycle Counter */}
            <div className="text-center space-y-2 relative z-10 max-w-sm">
              <p className="text-sm font-medium text-text-primary">
                {currentPhaseConfig.instruction}
              </p>

              <div className="flex items-center justify-center gap-4 text-xs text-text-muted pt-1">
                <span className="font-mono text-text-secondary">
                  Session: <strong className="text-text-primary">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</strong>
                </span>
                <span>•</span>
                <span className="font-mono text-text-secondary">
                  Cycles Completed: <strong className="text-primary">{completedCycles}</strong>
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 pt-2 relative z-10">
              <button
                onClick={handleToggleActive}
                className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2 shadow-accent"
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> Start Breathing Protocol
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 text-text-muted hover:text-text-primary border border-border transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Footer Rationale */}
          <div className="p-4 sm:p-5 border-t border-border bg-surface-elevated/60 flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Stimulates vagus nerve & balances sympathetic tone</span>
            </span>
            <button onClick={onClose} className="btn-secondary text-xs py-1.5 px-3">
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GuidedBreathingModal;
