import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Save, 
  Plus, 
  Dumbbell, 
  Clock, 
  Flame, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import api from '../../api';

const CustomWorkoutBuilderDrawer = ({ 
  isOpen, 
  onClose, 
  selectedExercises = [], 
  onRemoveExercise,
  onClearAll,
  onSaveSuccess
}) => {
  const [title, setTitle] = useState('My Custom Hypertrophy Routine');
  const [description, setDescription] = useState('Bespoke custom workout created in HealthPoint Library.');
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [category, setCategory] = useState('STRENGTH');
  const [targetMuscleGroup, setTargetMuscleGroup] = useState('FULL_BODY');
  const [exerciseConfigs, setExerciseConfigs] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle configuration updates for specific exercise
  const handleConfigChange = (exId, field, value) => {
    setExerciseConfigs(prev => ({
      ...prev,
      [exId]: {
        ...(prev[exId] || { sets: 4, reps: '10', restSec: 90, targetWeight: '25kg', notes: '' }),
        [field]: value
      }
    }));
  };

  const calculateTotalDuration = () => {
    let totalSec = 0;
    selectedExercises.forEach(ex => {
      const cfg = exerciseConfigs[ex.id] || { sets: 4, reps: '10', restSec: 90 };
      const sets = parseInt(cfg.sets) || 4;
      const rest = parseInt(cfg.restSec) || 90;
      // Assume 45 seconds work per set + rest
      totalSec += sets * (45 + rest);
    });
    return Math.max(15, Math.round(totalSec / 60));
  };

  const handleSaveWorkout = async () => {
    if (!title.trim()) {
      setErrorMsg('Please enter a routine title');
      return;
    }
    if (selectedExercises.length === 0) {
      setErrorMsg('Please add at least one exercise to your routine');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const workoutData = selectedExercises.map((ex, idx) => {
        const cfg = exerciseConfigs[ex.id] || { sets: 4, reps: '10', restSec: 90, targetWeight: '25kg', notes: '' };
        return {
          sequence: idx + 1,
          exerciseId: ex.id,
          name: ex.name || ex.title,
          primaryMuscleGroup: ex.primaryMuscleGroup || ex.category,
          equipmentRequired: ex.equipmentRequired || ex.equipment,
          animatedDemoReference: ex.animatedDemoReference || 'standard',
          sets: parseInt(cfg.sets) || 4,
          reps: cfg.reps || '10',
          restSeconds: parseInt(cfg.restSec) || 90,
          targetWeight: cfg.targetWeight || '',
          notes: cfg.notes || ''
        };
      });

      const payload = {
        title,
        description,
        difficulty,
        category,
        targetMuscleGroup: selectedExercises[0]?.primaryMuscleGroup || targetMuscleGroup,
        estimatedDurationMinutes: calculateTotalDuration(),
        workoutDataJson: JSON.stringify(workoutData)
      };

      const res = await api.post('/custom-workouts', payload);
      setSavedSuccess(true);
      if (onSaveSuccess) onSaveSuccess(res.data);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to save custom workout', err);
      setErrorMsg('Failed to save workout routine. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Drawer Sheet */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="relative w-full max-w-lg bg-hp-surface border-l border-white/10 h-full shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/5 bg-hp-surface-card flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Custom Workout Builder</h3>
                <p className="text-[11px] text-slate-400">
                  {selectedExercises.length} {selectedExercises.length === 1 ? 'Movement' : 'Movements'} Queued
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedExercises.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-medium px-2 py-1"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Meta Configuration Panel */}
            <div className="p-4 rounded-2xl bg-hp-surface-card border border-white/5 space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Routine Title
                </label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Upper Body Hypertrophy Blitz"
                  className="w-full bg-hp-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Intensity Tier
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-hp-surface border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-hp-surface border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="STRENGTH">Strength</option>
                    <option value="HIIT">HIIT</option>
                    <option value="MOBILITY">Mobility</option>
                    <option value="HOME_WORKOUT">Home Workout</option>
                  </select>
                </div>
              </div>

              {/* Estimated Telemetry Readout */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-400" /> Est. Duration: <strong className="text-white">{calculateTotalDuration()} mins</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-emerald-400" /> Total Volume: <strong className="text-white">~{selectedExercises.length * 4} Sets</strong>
                </span>
              </div>
            </div>

            {/* Exercises List */}
            {selectedExercises.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-hp-surface-card border border-dashed border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto text-slate-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">No Exercises in Routine</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click "Add to my workout" on any exercise card in the library to queue it here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-1">
                  Movement Sequence ({selectedExercises.length})
                </div>

                {selectedExercises.map((ex, idx) => {
                  const cfg = exerciseConfigs[ex.id] || { sets: 4, reps: '10', restSec: 90, targetWeight: '25kg', notes: '' };
                  return (
                    <div
                      key={ex.id}
                      className="p-3.5 rounded-2xl bg-hp-surface-card border border-white/5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white line-clamp-1">
                              {ex.name || ex.title}
                            </h4>
                            <span className="text-[10px] text-indigo-400 font-medium">
                              {ex.primaryMuscleGroup || ex.category} • {ex.equipmentRequired || ex.equipment}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveExercise(ex.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove Exercise"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Sets & Reps Inputs */}
                      <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold">SETS</label>
                          <input 
                            type="number"
                            min="1"
                            max="10"
                            value={cfg.sets}
                            onChange={(e) => handleConfigChange(ex.id, 'sets', e.target.value)}
                            className="w-full bg-hp-surface border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-center outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold">REPS</label>
                          <input 
                            type="text"
                            value={cfg.reps}
                            onChange={(e) => handleConfigChange(ex.id, 'reps', e.target.value)}
                            placeholder="8-12"
                            className="w-full bg-hp-surface border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-center outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5 font-semibold">REST</label>
                          <select
                            value={cfg.restSec}
                            onChange={(e) => handleConfigChange(ex.id, 'restSec', e.target.value)}
                            className="w-full bg-hp-surface border border-white/10 rounded-lg px-1.5 py-1 text-white font-mono text-[10px] outline-none focus:border-indigo-500"
                          >
                            <option value="60">60s</option>
                            <option value="90">90s</option>
                            <option value="120">120s</option>
                            <option value="180">180s</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}
          </div>

          {/* Footer Save Actions */}
          <div className="p-5 border-t border-white/5 bg-hp-surface-card flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveWorkout}
              disabled={saving || selectedExercises.length === 0}
              className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Saved Routine!
                </>
              ) : saving ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Save Workout Routine
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomWorkoutBuilderDrawer;
