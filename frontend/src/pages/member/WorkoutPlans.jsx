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
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';

const WorkoutPlans = () => {
  const [profile, setProfile] = useState(null);
  const [workoutDays, setWorkoutDays] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="member" />

      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase text-primary tracking-widest">Personalized AI Workout Split</span>
            </div>
            <h1 className="text-3xl font-bold">Your Custom Workout Routine</h1>
            <p className="text-gray-400 mt-1">Generated specifically for your body metrics, experience level, and fitness goals.</p>
          </div>

          <Link to="/member/goals" className="btn-premium px-6 py-2.5 text-xs flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-black" /> Re-Generate / Edit Goal
          </Link>
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Primary Goal</div>
                  <div className="text-base font-black text-primary uppercase">{profile.goalType}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Experience Level</div>
                  <div className="text-base font-bold text-white uppercase">{profile.experienceLevel}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">BMI Index</div>
                  <div className="text-base font-bold text-white">{profile.bmi}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Target Calories</div>
                  <div className="text-base font-bold text-green-400">{profile.dailyCalories} kcal/day</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Daily Protein</div>
                  <div className="text-base font-bold text-blue-400">{profile.dailyProtein}g</div>
                </div>
              </div>
            </motion.div>

            {/* 7-Day Personalized Workout Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutDays.map((day, i) => (
                <motion.div
                  key={day.dayName || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-6 flex flex-col justify-between hover:border-primary/40 transition-all border-t-2 border-t-primary/30"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
                        {day.dayName}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 font-semibold">
                        <Timer className="w-3.5 h-3.5 text-gray-400" /> Rest: {day.restPeriod}
                      </span>
                    </div>

                    <h3 className="text-xl font-black italic mb-4 text-white uppercase">{day.focus}</h3>

                    <div className="space-y-3 mb-6">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Exercise Selection</div>
                      {day.exercises.split(',').map((ex, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            <span>{ex.trim()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs font-bold text-gray-400">
                    <span>Target Sets: <strong className="text-white">{day.sets}</strong></span>
                    <span>Target Reps: <strong className="text-white">{day.reps}</strong></span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty state prompting user to setup goal */
          <div className="glass-card p-12 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No Custom Workout Plan Found</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Answer a few quick questions about your height, weight, fitness experience, and target goal to generate your personalized AI workout split.
            </p>
            <Link to="/member/goals" className="btn-premium px-8 py-3 text-sm inline-flex items-center gap-2">
              Setup Your Goal Profile <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkoutPlans;
