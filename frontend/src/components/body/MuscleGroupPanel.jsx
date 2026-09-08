import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, TrendingUp, ChevronRight, Plus, Loader2, AlertCircle, Flame, Clock } from 'lucide-react';
import { MUSCLE_GROUPS, heatColor } from './muscleData';
import api from '../../api';

const MUSCLE_MAP = Object.fromEntries(MUSCLE_GROUPS.map((m) => [m.id, m]));

/** Map from apiKey → display name */
const API_KEY_LABELS = {
  CHEST: 'Chest', BACK: 'Back', SHOULDERS: 'Shoulders',
  BICEPS: 'Biceps', TRICEPS: 'Triceps', FOREARMS: 'Forearms',
  CORE: 'Core / Abs', GLUTES: 'Glutes', QUADS: 'Quads',
  HAMSTRINGS: 'Hamstrings', CALVES: 'Calves', NECK: 'Neck',
};

function HeatLegend() {
  const items = [
    { label: '0–2 days', color: '#EF4444' },
    { label: '3–5 days', color: '#F59E0B' },
    { label: '6–7 days', color: '#10B981' },
    { label: '8–14 days', color: '#3B82F6' },
    { label: '14+ / never', color: '#3B3B45' },
  ];
  return (
    <div className="p-3 rounded-xl bg-surface border border-border">
      <p className="caption mb-2">Training Recency</p>
      <div className="flex flex-col gap-1.5">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: i.color }} />
            <span className="text-[11px] text-text-secondary">{i.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * MuscleGroupPanel — shows selected muscles, filtered exercises, and heat legend.
 */
export default function MuscleGroupPanel({
  selectedGroups,
  mode,
  heatData,
  onRemoveMuscle,
  onClearAll,
  onBuildWorkout,
}) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Collect unique API keys from selected muscle IDs
  const selectedApiKeys = [...new Set(
    [...selectedGroups].map((id) => MUSCLE_MAP[id]?.apiKey).filter(Boolean)
  )];

  useEffect(() => {
    if (selectedApiKeys.length === 0) {
      setExercises([]);
      return;
    }
    setLoading(true);
    setError(null);

    // Fetch exercises for the first selected API key (can expand to multi)
    const primaryKey = selectedApiKeys[0];
    api.get(`/exercises?muscleGroup=${primaryKey}&size=20`)
      .then((res) => {
        const data = res.data;
        const list = Array.isArray(data) ? data
          : data?.content ?? data?.exercises ?? [];
        setExercises(list.slice(0, 12));
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load exercises');
        setLoading(false);
      });
  }, [selectedGroups.size, selectedApiKeys.join(',')]);

  const selectedMuscleList = [...selectedGroups].map((id) => MUSCLE_MAP[id]).filter(Boolean);

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      {/* Mode: heatmap legend */}
      {mode === 'heatmap' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <HeatLegend />
          {/* Muscle recency list */}
          <div className="mt-3 space-y-1.5">
            {MUSCLE_GROUPS.filter((m) => heatData[m.id] !== undefined).map((m) => (
              <div key={m.id} className="flex items-center justify-between text-[12px] px-2 py-1.5 rounded-lg bg-surface-card border border-border">
                <span className="text-text-secondary">{m.label}</span>
                <span className="flex items-center gap-1.5 font-medium" style={{ color: heatColor(heatData[m.id]) }}>
                  <Clock size={10} />
                  {heatData[m.id] === 0 ? 'Today' : `${heatData[m.id]}d ago`}
                </span>
              </div>
            ))}
            {Object.keys(heatData).length === 0 && (
              <p className="text-text-muted text-xs text-center py-4">No workout history yet.</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Mode: selection */}
      {mode === 'select' && (
        <>
          {/* Selected muscles chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="caption">Selected Muscles</span>
              {selectedMuscleList.length > 0 && (
                <button onClick={onClearAll} className="text-[10px] text-text-muted hover:text-red-400 transition-colors">
                  Clear all
                </button>
              )}
            </div>

            <AnimatePresence>
              {selectedMuscleList.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4 px-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center mx-auto mb-2">
                    <Dumbbell size={18} className="text-text-muted" />
                  </div>
                  <p className="text-xs text-text-muted">Click muscle groups on the model to select them</p>
                </motion.div>
              ) : (
                <motion.div
                  key="chips"
                  className="flex flex-wrap gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {selectedMuscleList.map((m) => (
                    <motion.div
                      key={m.id}
                      layout
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/15 text-primary border border-primary/30"
                    >
                      {m.label}
                      <button
                        onClick={() => onRemoveMuscle(m.id)}
                        className="hover:text-red-400 transition-colors ml-0.5"
                        aria-label={`Remove ${m.label}`}
                      >
                        <X size={10} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Exercise list */}
          {selectedMuscleList.length > 0 && (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <span className="caption">Exercises</span>
                {selectedApiKeys.length > 0 && (
                  <span className="text-[10px] text-text-muted">
                    {API_KEY_LABELS[selectedApiKeys[0]] ?? selectedApiKeys[0]}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={20} className="text-primary animate-spin" />
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-xs text-red-400 py-4 px-2">
                  <AlertCircle size={14} />
                  {error}
                </div>
              ) : exercises.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-6">No exercises found for this muscle group.</p>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-0">
                  {exercises.map((ex) => (
                    <motion.div
                      key={ex.id ?? ex.name}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-surface-card border border-border hover:border-border-light hover:bg-surface-elevated transition-all duration-150 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Dumbbell size={13} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-text-primary truncate">{ex.name}</p>
                          {ex.difficulty && (
                            <p className="text-[10px] text-text-muted">{ex.difficulty}</p>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={13} className="text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Build workout CTA */}
          {selectedMuscleList.length > 0 && (
            <motion.button
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onBuildWorkout}
              className="btn-primary w-full mt-auto"
            >
              <Plus size={14} />
              Build Workout ({selectedMuscleList.length} muscle{selectedMuscleList.length > 1 ? 's' : ''})
            </motion.button>
          )}
        </>
      )}
    </div>
  );
}
