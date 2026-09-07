import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      <Sidebar />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent">Periodized Split</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Personalized Training Split</h1>
            <p className="text-xs text-text-secondary mt-0.5">Calibrated specifically for your anthropometrics, training age, and hypertrophy goals.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/member/goals" className="btn-secondary">
              <RefreshCw className="w-3.5 h-3.5" /> Re-Calibrate Profile
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : profile && workoutDays.length > 0 ? (
          <div className="space-y-6">
            {/* Person-Specific Profile Banner */}
            <div className="panel p-5 bg-gradient-hero-subtle border-primary/20">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="text-[10px] text-text-secondary uppercase font-semibold mb-0.5">Objective</div>
                  <div className="text-base font-bold text-primary">{profile.goalType || 'AESTHETIC'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-text-secondary uppercase font-semibold mb-0.5">Training Age</div>
                  <div className="text-base font-bold text-text-primary">{profile.experienceLevel || 'INTERMEDIATE'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-text-secondary uppercase font-semibold mb-0.5">BMI Index</div>
                  <div className="text-base stat-number text-text-primary">{profile.bmi || 23.4}</div>
                </div>
                <div>
                  <div className="text-[10px] text-text-secondary uppercase font-semibold mb-0.5">Calories</div>
                  <div className="text-base stat-number text-emerald-400">{profile.dailyCalories || 2650} kcal</div>
                </div>
                <div>
                  <div className="text-[10px] text-text-secondary uppercase font-semibold mb-0.5">Daily Protein</div>
                  <div className="text-base stat-number text-primary">{profile.dailyProtein || 185}g</div>
                </div>
              </div>
            </div>

            {/* 7-Day Periodized Workout Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {workoutDays.map((day, i) => (
                <div
                  key={day.dayName || i}
                  className="panel p-5 flex flex-col justify-between space-y-4 hover:border-border-light transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="badge-muted">{day.dayName}</span>
                      <span className="text-xs text-text-secondary font-medium flex items-center gap-1 font-mono">
                        <Timer className="w-3.5 h-3.5 text-primary" /> Rest: {day.restPeriod || '90s'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-text-primary">
                      {day.focus}
                    </h3>

                    {/* Exercise Roster */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
                        <span>Movement Selection</span>
                        <span className="font-mono text-primary">Tempo 3-0-1-0</span>
                      </div>

                      {(typeof day.exercises === 'string' ? day.exercises.split(',') : day.exercises).map((ex, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-surface-elevated border border-border flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-text-primary font-medium truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{ex.trim()}</span>
                          </div>
                          <span className="text-[10px] font-mono text-text-secondary font-semibold shrink-0 ml-2">
                            {day.sets || 4}x{day.reps || '8-12'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
                    <div className="text-text-secondary">
                      RPE Target: <strong className="text-text-primary">8.5 - 9</strong>
                    </div>

                    <button 
                      onClick={() => handleStartRoutine(day)}
                      className="btn-primary py-1.5 px-3 text-xs"
                    >
                      <Play className="w-3 h-3 fill-white" /> Log Workout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="panel p-12 text-center max-w-lg mx-auto my-12 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center mx-auto text-primary">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-text-primary">No Workout Plan Calibrated</h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Complete a brief assessment of your training age and hypertrophy goals to generate your periodized split.
              </p>
            </div>
            <div>
              <Link to="/member/goals" className="btn-hero text-xs px-6 py-2.5">
                Setup Goal Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
