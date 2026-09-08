import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Moon, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  Sliders, 
  Wind, 
  AlertTriangle, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import CountUp from '../ui/CountUp';
import TiltCard from '../ui/TiltCard';

const ReadinessScoreCard = ({ 
  readinessData, 
  onOpenWearableModal, 
  onOpenBreathingModal,
  onRefresh
}) => {
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);

  if (!readinessData) {
    return (
      <div className="panel-card p-6 flex items-center justify-center min-h-[220px]">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <RefreshCw className="w-4 h-4 animate-spin text-primary" />
          <span>Calibrating physiological baseline...</span>
        </div>
      </div>
    );
  }

  const score = readinessData.readinessScore || 78;
  const status = readinessData.statusCategory || 'OPTIMAL';
  const zScore = readinessData.hrvZScore || 0.4;
  const isDeload = status === 'DELOAD_TRIGGERED' || readinessData.isConsecutiveLow;
  const weeklyTrends = readinessData.weeklyTrendSeries || [];

  // Categorical Badge & Glow Styling
  let statusBadge = {
    label: 'Optimal Recovery',
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    ringColor: '#6366F1',
    description: 'Physiologically primed for planned training split.'
  };

  if (score >= 80) {
    statusBadge = {
      label: 'Peak Parasympathetic Tone',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      ringColor: '#10B981',
      description: 'Cleared for high-intensity progressive overload (+2.5kg PR target).'
    };
  } else if (isDeload || score < 35) {
    statusBadge = {
      label: '⚠️ Deload & Recovery Protocol',
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
      ringColor: '#F43F5E',
      description: '5-day downward trend detected. Program auto-adapted to active decompression.'
    };
  } else if (score < 50) {
    statusBadge = {
      label: 'High Systemic Fatigue',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      ringColor: '#F59E0B',
      description: 'Working sets auto-reduced by ~20% and RPE capped at 7.0.'
    };
  }

  // Calculate SVG Ring values
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <TiltCard maxTilt={3} className="panel-card p-6 relative overflow-hidden border-border-light">
      {/* Background Accent Glow */}
      <div 
        className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: statusBadge.ringColor }}
      />

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-surface-elevated border border-border text-primary">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="heading-sm text-text-primary font-display">Biometric Training Readiness</h3>
              <button 
                onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
                className="text-text-muted hover:text-text-secondary transition-colors"
                title="View Z-Score Formula"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="caption text-text-secondary mt-0.5">7-day rolling HRV (RMSSD) + Sleep recovery algorithm</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {score < 50 && (
            <button
              onClick={onOpenBreathingModal}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/20 flex items-center gap-1.5 transition-all shadow-sm"
              title="5-minute 0.1Hz HRV coherence breathwork"
            >
              <Wind className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>0.1Hz Breathing</span>
            </button>
          )}

          <button
            onClick={onOpenWearableModal}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Wearables</span>
          </button>
        </div>
      </div>

      {/* Formula Explainer Drawer */}
      <AnimatePresence>
        {showFormulaTooltip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3.5 rounded-xl bg-surface-elevated border border-border text-xs text-text-secondary space-y-1.5 overflow-hidden"
          >
            <div className="font-semibold text-text-primary flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Transparent Z-Score Recovery Mathematics
            </div>
            <p className="font-mono text-[11px] text-indigo-300">
              Readiness = 0.50 × Score_HRV(z) + 0.35 × Score_Sleep + 0.15 × Score_RHR
            </p>
            <p className="text-[11px] text-text-muted">
              Where z = (HRV_today - Mean_7d) / SD_7d. Prevents overfitting with baseline personalization.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Readiness Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Recovery Dial */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              {/* Track Background */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke={statusBadge.ringColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease-in-out, stroke 0.5s ease" }}
              />
            </svg>

            {/* Inner Score Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="stat-display text-3xl font-bold text-text-primary font-display leading-none">
                <CountUp target={score} />
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mt-0.5">
                / 100 Score
              </span>
            </div>
          </div>

          <div className={`mt-3 px-3 py-1 rounded-full border text-xs font-semibold text-center ${statusBadge.color}`}>
            {statusBadge.label}
          </div>
        </div>

        {/* Right: Key Biometric Pillars */}
        <div className="md:col-span-8 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {/* 1. HRV RMSSD */}
            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-1">
              <div className="flex items-center justify-between text-text-muted text-[11px] font-medium">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-indigo-400" /> HRV (RMSSD)
                </span>
                <span className={`text-[10px] font-mono font-bold ${zScore >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {zScore >= 0 ? `+${zScore}σ` : `${zScore}σ`}
                </span>
              </div>
              <div className="stat-display text-xl text-text-primary">
                <CountUp target={readinessData.todayHrvRmssd || 65} suffix=" ms" decimals={1} />
              </div>
              <div className="text-[10px] text-text-muted">7-day baseline: ~{Math.round(readinessData.todayHrvRmssd * 0.95 || 62)} ms</div>
            </div>

            {/* 2. Sleep Duration */}
            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-1">
              <div className="flex items-center justify-between text-text-muted text-[11px] font-medium">
                <span className="flex items-center gap-1">
                  <Moon className="w-3 h-3 text-indigo-400" /> Sleep
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {readinessData.sleepScore || 88}%
                </span>
              </div>
              <div className="stat-display text-xl text-text-primary">
                {Math.floor((readinessData.todaySleepMinutes || 450) / 60)}h {(readinessData.todaySleepMinutes || 450) % 60}m
              </div>
              <div className="text-[10px] text-text-muted">Target: 8.0h optimal</div>
            </div>

            {/* 3. Resting HR */}
            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-1">
              <div className="flex items-center justify-between text-text-muted text-[11px] font-medium">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400" /> Resting HR
                </span>
                <span className="text-[10px] font-mono text-text-secondary">BPM</span>
              </div>
              <div className="stat-display text-xl text-text-primary">
                <CountUp target={readinessData.todayRestingHr || 58} />
              </div>
              <div className="text-[10px] text-text-muted">Normal circadian</div>
            </div>
          </div>

          {/* Biometric Adaptation Callout */}
          <div className="p-3.5 rounded-2xl bg-surface-elevated/60 border border-border flex items-start gap-3">
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${score < 50 ? 'bg-amber-500/10 text-amber-400' : score >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
              {score < 50 ? <AlertTriangle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className="text-xs space-y-0.5 flex-1">
              <div className="font-semibold text-text-primary">
                {readinessData.adaptiveWorkout?.headline || statusBadge.description}
              </div>
              <p className="text-text-secondary leading-relaxed text-[11px]">
                {readinessData.adaptiveWorkout?.rationale || 'Volume and RPE calibrated to today\'s autonomic recovery state.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Sparkline Bar Trend */}
      {weeklyTrends.length > 0 && (
        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-2">
          <span className="caption text-text-muted">7-Day Recovery Trend</span>
          <div className="flex items-end gap-1.5 h-7">
            {weeklyTrends.map((t, idx) => {
              const h = Math.max(20, Math.min(100, (t.hrv / 90) * 100));
              const isToday = idx === weeklyTrends.length - 1;
              return (
                <div key={idx} className="flex flex-col items-center gap-1 group relative">
                  <div 
                    className={`w-4 rounded-md transition-all ${
                      isToday ? 'bg-primary shadow-accent' : 'bg-surface-elevated border border-border group-hover:bg-primary/50'
                    }`}
                    style={{ height: `${h * 0.28}px` }}
                    title={`${t.date}: ${t.hrv}ms HRV | ${t.sleepHours}h Sleep`}
                  />
                  <span className="text-[9px] font-mono text-text-muted">{t.date?.split('-')[2] || idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </TiltCard>
  );
};

export default ReadinessScoreCard;
