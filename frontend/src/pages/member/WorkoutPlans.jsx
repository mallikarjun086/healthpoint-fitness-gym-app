import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Timer, 
  Trophy, 
  Target, 
  CheckCircle2, 
  Sparkles,
  Flame,
  Zap,
  Activity,
  ArrowRight,
  RefreshCw,
  Play,
  Layers,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import WorkoutLoggerModal from '../../components/member/WorkoutLoggerModal';
import AiChatWidget from '../../components/ai/AiChatWidget';

const WorkoutPlans = () => {
  const [profile, setProfile] = useState(null);
  const [workoutDays, setWorkoutDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);

  useEffect(() => {
    fetchPersonalizedPlan();
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

  const handleStartRoutine = (dayRoutine) => {
    setSelectedRoutine(dayRoutine);
    setIsLoggerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="member" />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase text-primary tracking-widest">Periodized AI Workout Engine</span>
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tight">Personalized Training Split</h1>
            <p className="text-gray-400 mt-1">Calibrated specifically for your anthropometrics, training age, and muscle hypertrophy goals.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/member/goals" className="btn-secondary text-xs flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-primary" /> Re-Calibrate Profile
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : profile && workoutDays.length > 0 ? (
          <div className="space-y-8">
            {/* Person-Specific Profile Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 bg-gradient-to-r from-primary/10 via-transparent to-transparent border-l-4 border-l-primary"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Primary Objective</div>
                  <div className="text-lg font-black text-primary uppercase italic">{profile.goalType || 'AESTHETIC'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Training Age</div>
                  <div className="text-lg font-bold text-white uppercase">{profile.experienceLevel || 'INTERMEDIATE'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">BMI Index</div>
                  <div className="text-lg font-bold text-white">{profile.bmi || 23.4}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Target Calories</div>
                  <div className="text-lg font-bold text-green-400">{profile.dailyCalories || 2650} kcal/day</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Protein Target</div>
                  <div className="text-lg font-bold text-blue-400">{profile.dailyProtein || 185}g / day</div>
                </div>
              </div>
            </motion.div>

            {/* 7-Day Periodized Workout Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutDays.map((day, i) => (
                <motion.div
                  key={day.dayName || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card-interactive p-6 flex flex-col justify-between group hover:border-primary/40 transition-all border-t-2 border-t-primary/30"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="badge-lime">
                        {day.dayName}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 font-semibold">
                        <Timer className="w-3.5 h-3.5 text-primary" /> Rest: {day.restPeriod || '90s'}
                      </span>
                    </div>

                    <h3 className="text-xl font-black italic mb-4 text-white uppercase group-hover:text-primary transition-colors">
                      {day.focus}
                    </h3>

                    {/* Exercise Roster */}
                    <div className="space-y-2.5 mb-6">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                        <span>Exercise Selection</span>
                        <span className="text-primary font-mono">Tempo 3-0-1-0</span>
                      </div>

                      {(typeof day.exercises === 'string' ? day.exercises.split(',') : day.exercises).map((ex, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group-hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-200 truncate">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            <span className="truncate">{ex.trim()}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-gray-400 shrink-0 ml-2">
                            {day.sets || 4}x{day.reps || '8-12'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <div className="text-[10px] font-bold text-gray-400">
                      RPE Target: <strong className="text-white">8.5 - 9</strong>
                    </div>

                    <button 
                      onClick={() => handleStartRoutine(day)}
                      className="btn-premium px-4 py-2 text-xs flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" /> Log Session
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-black italic uppercase mb-3">No Custom Workout Plan Found</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Answer a few quick questions about your anthropometrics, experience level, and targets to generate your periodized AI split.
            </p>
            <Link to="/member/goals" className="btn-premium px-8 py-3 text-sm inline-flex items-center gap-2">
              Setup Your Goal Profile <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        )}

        {/* Live Logger Modal */}
        <WorkoutLoggerModal 
          isOpen={isLoggerOpen} 
          onClose={() => setIsLoggerOpen(false)}
          workoutRoutine={selectedRoutine}
        />

        {/* Floating AI Coach Assistant */}
        <AiChatWidget />
      </main>
    </div>
  );
};

export default WorkoutPlans;
