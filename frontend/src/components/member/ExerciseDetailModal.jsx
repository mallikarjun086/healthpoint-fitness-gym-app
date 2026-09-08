import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Dumbbell, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Clock, 
  Activity, 
  Layers, 
  Gauge, 
  Sparkles,
  Camera
} from 'lucide-react';
import AnimatedExerciseDemo from '../common/AnimatedExerciseDemo';
import LivePoseCoachModal from './LivePoseCoachModal';

function getExercisePoseId(name = '') {
  const n = name.toUpperCase();
  if (n.includes('SQUAT')) return 'SQUAT';
  if (n.includes('PUSH') || n.includes('PRESS') || n.includes('BENCH') || n.includes('DIP')) return 'PUSHUP';
  if (n.includes('DEADLIFT') || n.includes('HINGE') || n.includes('GOOD MORNING')) return 'DEADLIFT';
  if (n.includes('ROW') || n.includes('PULL') || n.includes('LAT')) return 'ROW';
  if (n.includes('CURL') || n.includes('ARM')) return 'CURL';
  return 'SQUAT';
}

const ExerciseDetailModal = ({ 
  exercise, 
  onClose, 
  onAddToWorkout,
  onStartPoseCoach 
}) => {
  const [activeTab, setActiveTab] = useState('DEMO'); // DEMO, INSTRUCTIONS, BIOMECHANICS
  const [isPoseCoachOpen, setIsPoseCoachOpen] = useState(false);

  if (!exercise) return null;

  // Safe joint angles parsed safely
  let jointAngles = null;
  if (exercise.safeJointAngleRanges) {
    if (typeof exercise.safeJointAngleRanges === 'string') {
      try {
        jointAngles = JSON.parse(exercise.safeJointAngleRanges);
      } catch (e) {
        jointAngles = null;
      }
    } else {
      jointAngles = exercise.safeJointAngleRanges;
    }
  }

  const poseExerciseId = getExercisePoseId(exercise.name || exercise.title || '');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-hp-surface border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/5 flex items-start justify-between bg-hp-surface-card/60 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="badge-accent">{exercise.primaryMuscleGroup || exercise.category || 'CHEST'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium">
                  {exercise.equipmentRequired || exercise.equipment || 'Barbell'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium">
                  {exercise.difficulty || 'INTERMEDIATE'}
                </span>
              </div>
              <h2 className="heading-xl text-white">
                {exercise.name || exercise.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span><strong className="text-slate-200">Target Anatomy:</strong> {exercise.muscleImpact || exercise.targetMuscles || exercise.secondaryMuscleGroups || 'Primary & Secondary Stabilizers'}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 border-b border-white/5 bg-hp-surface-card flex items-center gap-2">
            {[
              { id: 'DEMO', label: 'Animated Biomechanics', icon: Activity },
              { id: 'INSTRUCTIONS', label: 'Step-by-Step Cues', icon: CheckCircle2 },
              { id: 'BIOMECHANICS', label: 'Joint Angles & Safety', icon: Gauge },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-all ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-white font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Modal Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {activeTab === 'DEMO' && (
              <div className="space-y-6">
                {/* Skeletal Animation Rig */}
                <AnimatedExerciseDemo
                  exerciseName={exercise.name || exercise.title}
                  rigType={exercise.animatedDemoReference || 'bench-press'}
                  primaryMuscle={exercise.primaryMuscleGroup || 'CHEST'}
                  safeAngleRanges={exercise.safeJointAngleRanges}
                  tempo={exercise.tempo || '3-0-1-0'}
                />

                {/* Quick Cues & Mistakes Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-hp-surface-card border border-white/5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                      <Sparkles className="w-4 h-4" /> Coaching Cue & Focus
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {exercise.formCues || exercise.cues || 'Maintain strict core bracing, stacked wrist-to-elbow alignment, and slow 3s eccentric loading.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-hp-surface-card border border-rose-500/20 bg-rose-500/5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                      <AlertTriangle className="w-4 h-4" /> Common Error to Avoid
                    </div>
                    <p className="text-xs text-rose-200/80 leading-relaxed">
                      {exercise.commonMistakes || exercise.mistakes || 'Excessive body swing or bouncing at the bottom, risking connective tissue overload.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'INSTRUCTIONS' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-hp-surface-card border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Precision Execution Protocol
                  </h3>
                  <div className="space-y-3 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {exercise.instructions || exercise.cues || '1. Setup posture with 360-degree core bracing.\n2. Initiate movement through the target muscle group.\n3. Execute with 3s eccentric control and 1s peak squeeze.'}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-hp-surface-card border border-white/5">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Recommended Sets</div>
                    <div className="text-base font-bold text-white mt-0.5">{exercise.sets || 4} Sets</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-hp-surface-card border border-white/5">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Target Reps</div>
                    <div className="text-base font-bold text-indigo-400 mt-0.5">{exercise.reps || '8-12'}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-hp-surface-card border border-white/5">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Rest Period</div>
                    <div className="text-base font-bold text-slate-200 mt-0.5">{exercise.restTime || '90s'}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-hp-surface-card border border-white/5">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Tempo</div>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">{exercise.tempo || '3-0-1-0'}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'BIOMECHANICS' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-hp-surface-card border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Computer Vision Safe Joint Angles (Phase 3 Spec)
                    </h3>
                    <span className="badge-success text-[10px]">Validated Biomechanics</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    These calibrated joint angle ranges are monitored during live session tracking to prevent rotator cuff, lumbar, and patellar stress.
                  </p>

                  {jointAngles ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {Object.entries(jointAngles).map(([joint, range]) => (
                        <div key={joint} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                          <div>
                            <div className="text-xs font-semibold text-white capitalize">
                              {joint.replace(/_/g, ' ')}
                            </div>
                            <div className="text-[10px] text-slate-400">Optimal Range of Motion</div>
                          </div>
                          <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            {Array.isArray(range) ? `${range[0]}° - ${range[1]}°` : String(range)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white/5 text-xs text-slate-400 text-center">
                      Standard neutral-plane kinematics apply ({exercise.primaryMuscleGroup || 'STRENGTH'}).
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-white/5 bg-hp-surface-card/80 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400 hidden sm:block">
              Rig: <span className="font-mono text-slate-200">{exercise.animatedDemoReference || 'standard'}</span>
            </div>

            <div className="flex items-center gap-2 ml-auto flex-wrap">
              <button
                onClick={() => {
                  if (onStartPoseCoach) onStartPoseCoach(exercise);
                  else setIsPoseCoachOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition-all"
              >
                <Camera className="w-3.5 h-3.5" /> AI Camera Coach
              </button>

              <button
                onClick={onClose}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close
              </button>

              <button
                onClick={() => {
                  if (onAddToWorkout) onAddToWorkout(exercise);
                }}
                className="btn-primary text-xs py-2 px-4"
              >
                <Plus className="w-3.5 h-3.5" /> Add to My Workout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Embedded Live Pose Coach Modal */}
        <LivePoseCoachModal
          isOpen={isPoseCoachOpen}
          onClose={() => setIsPoseCoachOpen(false)}
          initialExercise={poseExerciseId}
        />
      </div>
    </AnimatePresence>
  );
};

export default ExerciseDetailModal;
