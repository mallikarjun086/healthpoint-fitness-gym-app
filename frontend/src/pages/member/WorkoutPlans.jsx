import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const BodyModelContainer = lazy(() => import('../../components/body/BodyModelContainer'));
import { 
  Dumbbell, 
  Timer, 
  Trophy, 
  Target, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  ArrowRight, 
  RefreshCw, 
  Play, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Layers, 
  Flame,
  Camera,
  Watch,
  Wind,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import WorkoutLoggerModal from '../../components/member/WorkoutLoggerModal';
import LivePoseCoachModal from '../../components/member/LivePoseCoachModal';
import WearableConnectModal from '../../components/biometrics/WearableConnectModal';
import GuidedBreathingModal from '../../components/biometrics/GuidedBreathingModal';
import AiChatWidget from '../../components/ai/AiChatWidget';

function getExercisePoseId(name = '') {
  const n = name.toUpperCase();
  if (n.includes('SQUAT')) return 'SQUAT';
  if (n.includes('PUSH') || n.includes('PRESS') || n.includes('BENCH') || n.includes('DIP')) return 'PUSHUP';
  if (n.includes('DEADLIFT') || n.includes('HINGE') || n.includes('GOOD MORNING')) return 'DEADLIFT';
  if (n.includes('ROW') || n.includes('PULL') || n.includes('LAT')) return 'ROW';
  if (n.includes('CURL') || n.includes('ARM')) return 'CURL';
  return 'SQUAT';
}

const WorkoutPlans = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('PERIODIZED'); // 'PERIODIZED' | 'CUSTOM' | 'BODY_MAP'
  const [profile, setProfile] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
  const [workoutDays, setWorkoutDays] = useState([]);
  const [customWorkouts, setCustomWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [isPoseCoachOpen, setIsPoseCoachOpen] = useState(false);
  const [isWearableModalOpen, setIsWearableModalOpen] = useState(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState(false);
  const [poseExercise, setPoseExercise] = useState('SQUAT');

  useEffect(() => {
    fetchPersonalizedPlan();
    fetchCustomWorkouts();
    fetchReadiness();
  }, []);

  const fetchPersonalizedPlan = async () => {
    try {
      const res = await api.get('/goals/my-plan');
      if (res.data && res.data.workoutPlanJson) {
        setProfile(res.data);
        try {
          const parsed = JSON.parse(res.data.workoutPlanJson);
          setWorkoutDays(parsed);
        } catch (e) {
          console.error("Error parsing workoutPlanJson", e);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch my plan", err);
      setLoading(false);
    }
  };

  const fetchReadiness = async () => {
    try {
      const res = await api.get('/biometrics/readiness/today');
      if (res.data) {
        setReadinessData(res.data);
      }
    } catch (e) {
      console.warn("Readiness offline fallback");
    }
  };

  const fetchCustomWorkouts = async () => {
    try {
      const res = await api.get('/custom-workouts');
      if (res.data && Array.isArray(res.data)) {
        setCustomWorkouts(res.data);
      }
    } catch (err) {
      console.warn("Failed to fetch custom workouts", err);
    }
  };

  const handleDeleteCustomWorkout = async (workoutId) => {
    try {
      await api.delete(`/custom-workouts/${workoutId}`);
      setCustomWorkouts(prev => prev.filter(w => w.id !== workoutId));
    } catch (err) {
      console.error("Failed to delete custom workout", err);
    }
  };

  const handleStartRoutine = (dayRoutine) => {
    setSelectedRoutine(dayRoutine);
    setIsLoggerOpen(true);
  };

  const handleStartPoseCoach = (exerciseName = 'SQUAT') => {
    setPoseExercise(getExercisePoseId(exerciseName));
    setIsPoseCoachOpen(true);
  };

  const handleStartCustomWorkout = (cw) => {
    let exercises = [];
    if (cw.workoutDataJson) {
      try {
        const parsed = JSON.parse(cw.workoutDataJson);
        exercises = parsed.map(p => `${p.name} (${p.sets}x${p.reps})`);
      } catch (e) {
        exercises = [cw.title];
      }
    }

    const adaptedRoutine = {
      dayName: cw.title,
      focus: cw.targetMuscleGroup || 'Custom Hypertrophy',
      restPeriod: '90s',
      sets: 4,
      reps: '10-12',
      exercises: exercises.length > 0 ? exercises : ['Barbell Bench Press', 'Squat', 'Lat Pulldown']
    };

    setSelectedRoutine(adaptedRoutine);
    setIsLoggerOpen(true);
  };

  const readinessScore = readinessData?.readinessScore || 78;
  const isDeload = readinessData?.statusCategory === 'DELOAD_TRIGGERED' || readinessData?.isConsecutiveLow;

  return (
    <div className="min-h-screen bg-hp-canvas flex">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-6 sm:p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="badge-accent">Training Architecture</span>
              <span className="text-[11px] text-slate-400 font-medium">Biometric Auto-Adaptation Engine</span>
            </div>
            <h1 className="heading-xl text-white">Personalized Training Split & Custom Routines</h1>
            <p className="body-sm text-slate-400 mt-1">
              Calibrated for your anthropometrics, recovery readiness ({readinessScore}/100), and bespoke routines.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button 
              onClick={() => setIsWearableModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-hp-surface hover:bg-hp-surface-card border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Watch className="w-3.5 h-3.5 text-indigo-400" /> Wearables & Sync
            </button>
            <button 
              onClick={() => handleStartPoseCoach('SQUAT')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Camera className="w-3.5 h-3.5" /> AI Camera Coach
            </button>
            <Link to="/member/videos" className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Build Routine
            </Link>
          </div>
        </header>

        {/* ── BIOMETRIC ADAPTATION NOTIFICATION BANNER ────────────────────── */}
        {readinessData && (
          <div className={`mb-6 p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isDeload 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
              : readinessScore < 50 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/5 shrink-0">
                {isDeload ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <Activity className="w-4 h-4 text-indigo-400" />}
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">
                  {readinessData.adaptiveWorkout?.headline || `Readiness ${readinessScore}/100: ${readinessData.statusCategory}`}
                </span>
                <span className="text-slate-300 text-[11px]">
                  {readinessData.adaptiveWorkout?.rationale}
                </span>
              </div>
            </div>

            {readinessScore < 50 && (
              <button
                onClick={() => setIsBreathingModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5"
              >
                <Wind className="w-3.5 h-3.5" /> 0.1Hz Breathing Prime
              </button>
            )}
          </div>
        )}


        {/* Top Segmented Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-hp-surface border border-white/5 w-fit mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('PERIODIZED')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'PERIODIZED'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            AI Periodized Split (7-Day)
          </button>

          <button
            onClick={() => setActiveTab('CUSTOM')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'CUSTOM'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5 text-indigo-300" />
            My Custom Workouts ({customWorkouts.length})
          </button>

          {/* 3D Body Map tab */}
          <button
            onClick={() => setActiveTab('BODY_MAP')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'BODY_MAP'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            3D Body Map
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/15 text-[9px] font-bold tracking-wide">NEW</span>
          </button>
        </div>

        {/* Tab 1: AI Periodized Split */}
        {activeTab === 'PERIODIZED' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : profile && workoutDays.length > 0 ? (
              <div className="space-y-6">
                {/* Profile Anthropometrics Summary */}
                <div className="panel-card p-5 border-indigo-500/20 bg-gradient-to-r from-hp-surface via-indigo-950/20 to-hp-surface">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mb-0.5">Objective</div>
                      <div className="text-sm font-bold text-indigo-400">{profile.goalType || 'AESTHETIC'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mb-0.5">Training Age</div>
                      <div className="text-sm font-bold text-white">{profile.experienceLevel || 'INTERMEDIATE'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mb-0.5">BMI Index</div>
                      <div className="text-sm font-bold text-white font-mono">{profile.bmi || 23.4}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mb-0.5">Calories</div>
                      <div className="text-sm font-bold text-emerald-400 font-mono">{profile.dailyCalories || 2650} kcal</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mb-0.5">Daily Protein</div>
                      <div className="text-sm font-bold text-indigo-400 font-mono">{profile.dailyProtein || 185}g</div>
                    </div>
                  </div>
                </div>

                {/* 7-Day Periodized Workout Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {workoutDays.map((day, i) => (
                    <div
                      key={day.dayName || i}
                      className="panel-card p-5 flex flex-col justify-between space-y-4 hover:border-white/10 transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="badge-accent">{day.dayName}</span>
                          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 font-mono">
                            <Timer className="w-3.5 h-3.5 text-indigo-400" /> Rest: {day.restPeriod || '90s'}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white">
                          {day.focus}
                        </h3>

                        {/* Exercise Roster */}
                        <div className="space-y-2">
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                            <span>Movement Selection</span>
                            <span className="font-mono text-indigo-400">Tempo 3-0-1-0</span>
                          </div>

                          {(typeof day.exercises === 'string' ? day.exercises.split(',') : day.exercises).map((ex, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-hp-surface-card border border-white/5 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2 text-white font-medium truncate">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                <span className="truncate">{ex.trim()}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                <button
                                  onClick={() => handleStartPoseCoach(ex)}
                                  className="p-1 rounded-md bg-white/5 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 transition-colors"
                                  title="Analyze form with Camera"
                                >
                                  <Camera className="w-3 h-3" />
                                </button>
                                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                  {day.sets || 4}x{day.reps || '8-12'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                        <div className="text-slate-400">
                          RPE: <strong className="text-white">8.5 - 9</strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartPoseCoach(day.focus)}
                            className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs flex items-center gap-1"
                            title="Start AI Camera Form Coach"
                          >
                            <Camera className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="hidden sm:inline">Coach</span>
                          </button>
                          <button 
                            onClick={() => handleStartRoutine(day)}
                            className="btn-primary py-1.5 px-3 text-xs"
                          >
                            <Play className="w-3 h-3 fill-white" /> Log Session
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="panel-card p-12 text-center max-w-lg mx-auto my-12 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-indigo-400">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white">No Workout Plan Calibrated</h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Complete a brief assessment of your training age and hypertrophy goals to generate your periodized split.
                  </p>
                </div>
                <div>
                  <Link to="/member/goals" className="btn-primary text-xs px-6 py-2.5 inline-flex items-center gap-2">
                    Setup Goal Profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Custom Workouts */}
        {activeTab === 'CUSTOM' && (
          <div className="space-y-6">
            {customWorkouts.length === 0 ? (
              <div className="panel-card p-12 text-center max-w-lg mx-auto my-12 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-indigo-400">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white">No Custom Workouts Created Yet</h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Browse our biomechanical exercise library and queue your favorite movements with custom sets, reps, and tempo.
                  </p>
                </div>
                <div>
                  <Link to="/member/videos" className="btn-primary text-xs px-6 py-2.5 inline-flex items-center gap-2">
                    Browse Exercise Library <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {customWorkouts.map((cw) => {
                  let exercisesData = [];
                  if (cw.workoutDataJson) {
                    try {
                      exercisesData = JSON.parse(cw.workoutDataJson);
                    } catch (e) {
                      exercisesData = [];
                    }
                  }

                  return (
                    <div
                      key={cw.id}
                      className="panel-card p-5 flex flex-col justify-between space-y-4 hover:border-white/10 transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="badge-accent">{cw.difficulty || 'INTERMEDIATE'}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-indigo-400" /> ~{cw.estimatedDurationMinutes || 45}m
                            </span>
                            <button
                              onClick={() => handleDeleteCustomWorkout(cw.id)}
                              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Routine"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white">
                            {cw.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {cw.description || 'Custom crafted workout routine.'}
                          </p>
                        </div>

                        {/* Exercise Sequence Preview */}
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                            <span>Sequence ({exercisesData.length})</span>
                            <span className="text-indigo-400 font-mono">Custom Loads</span>
                          </div>

                          {exercisesData.map((item, idx) => (
                            <div key={idx} className="p-2 rounded-xl bg-hp-surface-card border border-white/5 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2 text-white font-medium truncate">
                                <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-[9px] flex items-center justify-center font-bold">
                                  {idx + 1}
                                </span>
                                <span className="truncate">{item.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                <button
                                  onClick={() => handleStartPoseCoach(item.name)}
                                  className="p-1 rounded-md bg-white/5 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 transition-colors"
                                  title="Check Form"
                                >
                                  <Camera className="w-3 h-3" />
                                </button>
                                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                  {item.sets}x{item.reps} ({item.restSeconds}s)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                        <span className="text-slate-400 text-[11px] font-mono">
                          Target: <strong className="text-slate-200">{cw.targetMuscleGroup || 'Full Body'}</strong>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartPoseCoach(cw.title)}
                            className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs flex items-center gap-1"
                            title="Start AI Camera Form Coach"
                          >
                            <Camera className="w-3.5 h-3.5 text-indigo-400" />
                          </button>
                          <button
                            onClick={() => handleStartCustomWorkout(cw)}
                            className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-white" /> Start Session
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: 3D Body Map */}
        {activeTab === 'BODY_MAP' && (
          <div>
            <div className="mb-5">
              <h2 className="heading-lg text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                3D Muscle Map
              </h2>
              <p className="body-sm text-slate-400 mt-1">
                Click muscle groups to filter exercises and build targeted workouts. Switch to Progress mode to see your training heatmap.
              </p>
            </div>

            <Suspense fallback={
              <div className="flex flex-col items-center justify-center h-[560px] gap-4 rounded-2xl border border-white/5 bg-hp-surface">
                <div className="relative">
                  <div className="w-28 h-48 rounded-[40px] bg-hp-surface-card animate-pulse" />
                  <div className="absolute -left-8 top-6 w-8 h-28 rounded-full bg-hp-surface-card animate-pulse" />
                  <div className="absolute -right-8 top-6 w-8 h-28 rounded-full bg-hp-surface-card animate-pulse" />
                  <div className="absolute left-5 bottom-0 w-8 h-20 rounded-full bg-hp-surface-card animate-pulse" />
                  <div className="absolute right-5 bottom-0 w-8 h-20 rounded-full bg-hp-surface-card animate-pulse" />
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  Loading 3D Body Model…
                </span>
              </div>
            }>
              <BodyModelContainer
                onBuildWorkout={(muscleIds) => {
                  const muscleLabels = muscleIds.map((id) => {
                    const parts = id.split('-');
                    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
                  });
                  setSelectedRoutine({
                    dayName: `Body Map: ${muscleLabels.join(' + ')} Day`,
                    focus: muscleLabels.join(' + '),
                    restPeriod: '90s',
                    sets: 4,
                    reps: '10-12',
                    exercises: muscleLabels.map((m) => `${m} Exercise`),
                  });
                  setIsLoggerOpen(true);
                }}
              />
            </Suspense>
          </div>
        )}

        {/* Live Logger Modal */}

        <WorkoutLoggerModal 
          isOpen={isLoggerOpen} 
          onClose={() => setIsLoggerOpen(false)}
          workoutRoutine={selectedRoutine}
        />

        {/* Live Pose Coach Modal */}
        <LivePoseCoachModal
          isOpen={isPoseCoachOpen}
          onClose={() => setIsPoseCoachOpen(false)}
          initialExercise={poseExercise}
        />

        {/* Wearable Connect & Recovery Sync Modal */}
        <WearableConnectModal
          isOpen={isWearableModalOpen}
          onClose={() => setIsWearableModalOpen(false)}
          onDataUpdated={(updated) => {
            if (updated) setReadinessData(updated);
            else fetchReadiness();
          }}
          connectedWearables={readinessData?.connectedWearables || []}
        />

        {/* 0.1Hz Guided Coherence Breathing Modal */}
        <GuidedBreathingModal
          isOpen={isBreathingModalOpen}
          onClose={() => setIsBreathingModalOpen(false)}
        />

        {/* Floating AI Coach Assistant */}
        <AiChatWidget />
      </main>
    </div>
  );
};

export default WorkoutPlans;

