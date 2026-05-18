import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  Timer, 
  Trophy, 
  Plus,
  Play,
  Layout,
  Target,
  CheckCircle2,
  History,
  X,
  ChevronDown,
  Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import WorkoutCreatorModal from '../../components/member/WorkoutCreatorModal';
import ExerciseVideoModal from '../../components/member/ExerciseVideoModal';
import api from '../../api';

const WorkoutPlans = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [timer, setTimer] = useState(0);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const categories = [
    { id: 'ALL', label: 'All Routines', icon: <Layout className="w-4 h-4" /> },
    { id: 'PUSH_DAY', label: 'Push Day', icon: <Target className="w-4 h-4" /> },
    { id: 'PULL_DAY', label: 'Pull Day', icon: <Target className="w-4 h-4" /> },
    { id: 'LEG_DAY', label: 'Leg Day', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'CORE_ABS', label: 'Core / Abs', icon: <Target className="w-4 h-4" /> },
    { id: 'CARDIO', label: 'Cardio', icon: <Timer className="w-4 h-4" /> },
    { id: 'FULL_BODY', label: 'Full Body', icon: <Layout className="w-4 h-4" /> },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeCategory === 'ALL') {
      setFilteredPlans(plans);
    } else {
      setFilteredPlans(plans.filter(p => p.bodyPart === activeCategory));
    }
  }, [activeCategory, plans]);

  const fetchData = async () => {
    try {
      const [plansRes, logsRes] = await Promise.all([
        api.get('/workout/all'),
        api.get('/workout/logs/user/1')
      ]);
      setPlans(plansRes.data);
      setFilteredPlans(plansRes.data);
      setLogs(logsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch workout data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (activeWorkout) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeWorkout]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completeWorkout = async () => {
    try {
      const logData = {
        userId: 1,
        workoutPlanId: activeWorkout.id,
        durationSpentMinutes: Math.ceil(timer / 60),
        notes: "Excellent session!"
      };
      await api.post('/workout/logs/add', logData);
      setActiveWorkout(null);
      fetchData();
    } catch (err) {
      console.error("Failed to log workout", err);
      setActiveWorkout(null);
    }
  };

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'BEGINNER': return 'text-green-400 bg-green-400/10';
      case 'INTERMEDIATE': return 'text-blue-400 bg-blue-400/10';
      case 'ADVANCED': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="member" />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Workout Library</h1>
            <p className="text-gray-400 mt-1">Explore specialized training protocols.</p>
          </div>
          <button 
            onClick={() => setIsCreatorOpen(true)}
            className="btn-premium py-2 px-4 text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Custom Plan
          </button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-2 border ${
                activeCategory === cat.id 
                ? 'bg-primary border-primary text-black' 
                : 'bg-surface border-border text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              <div className={`p-2 rounded-xl ${activeCategory === cat.id ? 'bg-black/10' : 'bg-white/5'}`}>
                {cat.icon}
              </div>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Live Session Bar */}
        <AnimatePresence>
          {activeWorkout && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-10 overflow-hidden"
            >
              <div className="bg-primary/10 border border-primary/30 rounded-3xl p-6 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-primary text-black rounded-2xl animate-pulse">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] text-primary font-black uppercase tracking-widest">Active Session</div>
                    <h3 className="text-xl font-bold">{activeWorkout.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <div className="text-3xl font-mono font-bold text-primary">{formatTime(timer)}</div>
                  <div className="flex gap-4">
                    <button onClick={() => setActiveWorkout(null)} className="p-4 rounded-2xl bg-white/5 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                    <button onClick={completeWorkout} className="bg-primary text-black font-bold px-8 py-4 rounded-2xl flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Finish</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : filteredPlans.length > 0 ? filteredPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${getDifficultyColor(plan.difficulty)}`}>
                        {plan.difficulty}
                      </div>
                      <span className="text-xs text-gray-500 font-bold uppercase">{plan.bodyPart}</span>
                    </div>
                    <div className="text-xs font-bold text-gray-500 flex items-center gap-1">
                      <Timer className="w-3 h-3" /> {plan.durationMinutes} MIN
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                      className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                    >
                      {expandedPlan === plan.id ? 'Hide Exercises' : 'View Exercises'} 
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedPlan === plan.id ? 'rotate-180' : ''}`} />
                    </button>
                    <button 
                      onClick={() => setActiveWorkout(plan)}
                      disabled={!!activeWorkout}
                      className="bg-primary/10 text-primary hover:bg-primary hover:text-black font-bold px-6 py-2 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 fill-current" /> Start Training
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedPlan === plan.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 pt-6 border-t border-white/5 space-y-3"
                      >
                        {plan.exercises && plan.exercises.map((ex, j) => (
                          <div key={j} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">{j+1}</div>
                              <div>
                                <div className="font-bold text-sm">{ex.name}</div>
                                <button 
                                  onClick={() => setSelectedExercise(ex)}
                                  className="text-[10px] text-primary hover:underline flex items-center gap-1"
                                >
                                  <Play className="w-2 h-2 fill-current" /> Watch Form
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-4 text-xs font-bold text-gray-500">
                              <span>{ex.sets} SETS</span>
                              <span>{ex.reps} REPS</span>
                              <span className="text-primary/70">{ex.restTime} REST</span>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-20 text-gray-500">No routines found for this category.</div>
            )}
          </div>

          {/* History & Stats Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-3 mb-6">
                <History className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {logs.slice(0, 3).map((log, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                      {new Date(log.completedAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-bold">Session Completed</div>
                    <div className="text-xs text-primary font-bold mt-1">{log.durationSpentMinutes} mins tracked</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 border-t-2 border-t-primary/30">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-sm">Quick Pro Tip</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed italic">
                "For Push days, focus on the eccentric (lowering) phase of the Bench Press. A 3-second descent will maximize fiber recruitment."
              </p>
            </div>
          </div>
        </div>

        {/* Modals */}
        <WorkoutCreatorModal 
          isOpen={isCreatorOpen} 
          onClose={() => setIsCreatorOpen(false)}
          onSuccess={fetchData}
        />

        <ExerciseVideoModal 
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      </main>
    </div>
  );
};

export default WorkoutPlans;
