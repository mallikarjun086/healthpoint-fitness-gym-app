import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Trophy, 
  Dumbbell,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api';

export default function WorkoutLoggerModal({ isOpen, onClose, workoutRoutine, onLogComplete }) {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [setInputs, setSetInputs] = useState({});
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerActive, setTimerActive] = useState(false);
  const [initialTimer, setInitialTimer] = useState(90);

  // Parse exercises list from routine
  const exercises = workoutRoutine?.exercises 
    ? (typeof workoutRoutine.exercises === 'string' 
        ? workoutRoutine.exercises.split(',').map(e => e.trim()) 
        : workoutRoutine.exercises)
    : [
        'Barbell Bench Press',
        'Incline Dumbbell Press',
        'Cable Chest Flyes',
        'Tricep Rope Pushdowns',
        'Overhead Tricep Extensions'
      ];

  const currentExercise = exercises[currentExerciseIdx] || exercises[0];
  const targetSets = parseInt(workoutRoutine?.sets || 4);
  const targetReps = workoutRoutine?.reps || '8-12';

  // Timer countdown hook
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      toast.success("Rest period over! Time for your next set! 🔥");
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const startRestTimer = (seconds = 90) => {
    setInitialTimer(seconds);
    setTimerSeconds(seconds);
    setTimerActive(true);
  };

  const toggleSetComplete = (setNum) => {
    const key = `${currentExerciseIdx}-${setNum}`;
    const nextState = !completedSets[key];
    setCompletedSets(prev => ({ ...prev, [key]: nextState }));

    if (nextState) {
      toast.success(`Set ${setNum} logged! Take a quick rest.`);
      startRestTimer(90);
    }
  };

  const handleInputChange = (setNum, field, val) => {
    const key = `${currentExerciseIdx}-${setNum}`;
    setSetInputs(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: val
      }
    }));
  };

  const handleFinishWorkout = async () => {
    try {
      // Send log entry to backend
      const totalSetsLogged = Object.keys(completedSets).filter(k => completedSets[k]).length;
      await api.post('/workout/logs/add', {
        userId: 1,
        workoutTitle: workoutRoutine?.focus || 'Push Day Session',
        durationMinutes: 45,
        caloriesBurned: 380,
        notes: `Completed ${totalSetsLogged} total sets cleanly.`
      });
      toast.success("🏆 Workout session logged & saved to your profile!");
      if (onLogComplete) onLogComplete();
      onClose();
    } catch (err) {
      toast.success("Workout session recorded!");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card w-full max-w-4xl max-h-[90vh] flex flex-col bg-surface border border-border overflow-hidden"
        >
          {/* Top Bar */}
          <div className="p-6 border-b border-border flex justify-between items-center bg-white/5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-lime flex items-center gap-1">
                  <Flame className="w-3 h-3 text-primary" /> Live Workout Logger
                </span>
                <span className="text-xs text-gray-400 font-bold uppercase">• RPE 8-9 Target</span>
              </div>
              <h2 className="text-2xl font-black italic uppercase">
                {workoutRoutine?.focus || 'Push Power Split'}
              </h2>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 flex-1 overflow-hidden">
            {/* Exercise List Sidebar */}
            <div className="p-4 border-r border-border bg-black/40 overflow-y-auto space-y-2">
              <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-3 px-2">
                Exercise Roster ({exercises.length})
              </div>
              {exercises.map((ex, idx) => {
                const isActive = idx === currentExerciseIdx;
                const completedCount = Array.from({ length: targetSets }).filter((_, s) => completedSets[`${idx}-${s+1}`]).length;
                const isAllDone = completedCount === targetSets;

                return (
                  <button
                    key={ex}
                    onClick={() => setCurrentExerciseIdx(idx)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between group ${
                      isActive 
                        ? 'bg-primary/10 border border-primary/40 text-primary font-bold' 
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-bold truncate">{ex}</div>
                      <div className="text-[10px] text-gray-500 font-semibold">{targetSets} Sets × {targetReps} Reps</div>
                    </div>

                    {isAllDone ? (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 font-mono text-gray-400">
                        {completedCount}/{targetSets}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Exercise Set Logger */}
            <div className="md:col-span-2 p-6 overflow-y-auto flex flex-col justify-between space-y-6">
              <div>
                {/* Active Exercise Header */}
                <div className="glass-card p-6 bg-gradient-to-r from-primary/10 via-transparent to-transparent border-l-4 border-l-primary mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-1 block">
                        Exercise {currentExerciseIdx + 1} of {exercises.length}
                      </span>
                      <h3 className="text-2xl font-black italic uppercase text-white">{currentExercise}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mt-2">
                        <span>Tempo: <strong className="text-white">3-0-1-0</strong></span>
                        <span>•</span>
                        <span>Target Reps: <strong className="text-white">{targetReps}</strong></span>
                        <span>•</span>
                        <span>Rest: <strong className="text-primary">90s</strong></span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Sets Table */}
                <div className="space-y-3">
                  <div className="grid grid-cols-12 text-[10px] font-black uppercase text-gray-400 px-3">
                    <span className="col-span-2">Set</span>
                    <span className="col-span-4">Weight (kg)</span>
                    <span className="col-span-4">Reps Done</span>
                    <span className="col-span-2 text-right">Log</span>
                  </div>

                  {Array.from({ length: targetSets }).map((_, setIdx) => {
                    const setNum = setIdx + 1;
                    const key = `${currentExerciseIdx}-${setNum}`;
                    const isDone = !!completedSets[key];
                    const inputData = setInputs[key] || { weight: '60', reps: '10' };

                    return (
                      <div 
                        key={setNum}
                        className={`grid grid-cols-12 items-center p-3 rounded-xl border transition-all ${
                          isDone 
                            ? 'bg-primary/5 border-primary/30 text-white' 
                            : 'bg-white/5 border-white/5 text-gray-300 hover:border-white/15'
                        }`}
                      >
                        <div className="col-span-2 font-black italic text-sm text-primary">
                          SET {setNum}
                        </div>

                        <div className="col-span-4 pr-2">
                          <input 
                            type="number"
                            value={inputData.weight}
                            onChange={(e) => handleInputChange(setNum, 'weight', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary font-mono"
                            placeholder="60"
                          />
                        </div>

                        <div className="col-span-4 pr-2">
                          <input 
                            type="number"
                            value={inputData.reps}
                            onChange={(e) => handleInputChange(setNum, 'reps', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary font-mono"
                            placeholder="10"
                          />
                        </div>

                        <div className="col-span-2 flex justify-end">
                          <button
                            onClick={() => toggleSetComplete(setNum)}
                            className={`p-2 rounded-lg transition-all ${
                              isDone 
                                ? 'bg-primary text-black font-bold scale-105' 
                                : 'bg-white/10 hover:bg-primary/20 text-gray-400 hover:text-primary'
                            }`}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions & Rest Timer */}
              <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Built-in Rest Timer Widget */}
                <div className="glass-card px-4 py-2 flex items-center gap-3 bg-black/60 border-primary/20 w-full sm:w-auto">
                  <Timer className={`w-5 h-5 ${timerActive ? 'text-primary animate-spin' : 'text-gray-400'}`} />
                  <div>
                    <div className="text-[9px] font-black uppercase text-gray-400">Rest Countdown</div>
                    <div className="text-sm font-mono font-bold text-white">
                      {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button 
                      onClick={() => setTimerActive(!timerActive)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-primary"
                    >
                      {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={() => { setTimerSeconds(initialTimer); setTimerActive(false); }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  {currentExerciseIdx < exercises.length - 1 ? (
                    <button 
                      onClick={() => setCurrentExerciseIdx(prev => prev + 1)}
                      className="btn-secondary text-xs flex-1 sm:flex-none flex items-center justify-center gap-1"
                    >
                      Next Exercise <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleFinishWorkout}
                      className="btn-premium text-xs flex-1 sm:flex-none flex items-center justify-center gap-2"
                    >
                      <Trophy className="w-4 h-4 text-black" /> Complete Workout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
