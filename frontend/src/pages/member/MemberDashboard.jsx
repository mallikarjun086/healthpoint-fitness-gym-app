import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Flame, 
  Target, 
  Calendar, 
  ChevronRight, 
  Play, 
  Clock, 
  Dumbbell,
  Zap,
  Award,
  Sparkles,
  Activity,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import AiChatWidget from '../../components/ai/AiChatWidget';
import AiInsightCard from '../../components/ai/AiInsightCard';
import WorkoutLoggerModal from '../../components/member/WorkoutLoggerModal';

const strengthProgressData = [
  { day: 'Mon', bench: 80, squat: 110, deadlift: 140, totalVolume: 8400 },
  { day: 'Tue', bench: 82.5, squat: 112.5, deadlift: 145, totalVolume: 9200 },
  { day: 'Wed', bench: 85, squat: 115, deadlift: 147.5, totalVolume: 9800 },
  { day: 'Thu', bench: 87.5, squat: 117.5, deadlift: 150, totalVolume: 10500 },
  { day: 'Fri', bench: 90, squat: 122.5, deadlift: 155, totalVolume: 11400 },
  { day: 'Sat', bench: 92.5, squat: 125, deadlift: 160, totalVolume: 12100 },
  { day: 'Sun', bench: 95, squat: 130, deadlift: 165, totalVolume: 12900 }
];

const MemberDashboard = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [user, setUser] = useState({ name: authUser?.name || 'Mallikarjun' });

  const [stats, setStats] = useState([
    { label: 'Workouts Done', value: '18', icon: Dumbbell, color: 'text-primary', change: '+3 this week' },
    { label: 'Volume Lifted', value: '12.9k kg', icon: Activity, color: 'text-secondary', change: '+14% strength' },
    { label: 'Calories Burned', value: '24.8k', icon: Flame, color: 'text-orange-400', change: '2,800/day avg' },
    { label: 'Streak Status', value: '7 Days', icon: Zap, color: 'text-yellow-400', change: 'Personal Best 🔥' }
  ]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/goals/my-plan');
      if (res.data && res.data.bmi) {
        setProfile(res.data);
      }
    } catch (e) {
      console.log("Profile offline fallback");
    }
  };

  const todayDateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="member" />
      
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full -z-10 animate-pulse-slow"></div>

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary mb-1"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{todayDateStr}</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black italic uppercase tracking-tighter"
            >
              Welcome Back, <span className="gradient-text-lime">{user.name}</span>
            </motion.h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLoggerOpen(true)}
              className="btn-premium px-6 py-3 text-xs flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" /> Launch Live Workout Logger
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-interactive p-6 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-black italic text-white mb-1">{stat.value}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          {/* Main Chart: Strength & Volume Progression */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase text-primary tracking-widest">Live Progression</span>
                  </div>
                  <h3 className="text-xl font-bold uppercase italic">Volume Load & Progressive Overload</h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Total Volume (kg)</span>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={strengthProgressData}>
                    <defs>
                      <linearGradient id="volumeGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9FF00" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#C9FF00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222228" vertical={false} />
                    <XAxis dataKey="day" stroke="#666" tick={{ fontSize: 12, fill: '#888' }} />
                    <YAxis stroke="#666" tick={{ fontSize: 12, fill: '#888' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121215', borderColor: '#222228', borderRadius: '12px', color: '#fff' }}
                      formatter={(val) => [`${val} kg`, 'Total Volume']}
                    />
                    <Area type="monotone" dataKey="totalVolume" stroke="#C9FF00" strokeWidth={3} fillOpacity={1} fill="url(#volumeGlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* AI Coaching Insight Component */}
            <AiInsightCard />
          </div>

          {/* Sidebar: Macro Fulfillment & Next Workout Card */}
          <div className="space-y-8">
            {/* Today's Workout Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 bg-gradient-to-br from-primary/10 via-transparent to-transparent border-l-4 border-l-primary"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="badge-lime">Today's Scheduled Split</span>
                <span className="text-xs text-gray-400 font-bold">45 Mins</span>
              </div>

              <h3 className="text-2xl font-black italic uppercase text-white mb-2">
                Push Power: Chest & Triceps
              </h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Focused on hyper-trophy bench press, dumbbell incline, and cable flyes targeting upper chest fiber density.
              </p>

              <button 
                onClick={() => setIsLoggerOpen(true)}
                className="w-full btn-premium py-3 text-xs flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" /> Start Session Now
              </button>
            </motion.div>

            {/* Daily Macro Compliance */}
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold italic uppercase flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" /> Daily Macro Targets
                </h4>
                <span className="text-xs font-bold text-primary">2,650 kcal</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-400">Protein (2.2g/kg)</span>
                    <span className="text-primary">185g / 200g (92%)</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full w-[92%] transition-all"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-400">Carbohydrates</span>
                    <span className="text-secondary">280g / 320g (87%)</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full w-[87%] transition-all"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-400">Healthy Fats</span>
                    <span className="text-orange-400">65g / 75g (86%)</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-400 h-full rounded-full w-[86%] transition-all"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Workout Logger Modal */}
        <WorkoutLoggerModal 
          isOpen={isLoggerOpen} 
          onClose={() => setIsLoggerOpen(false)} 
        />

        {/* Floating AI Assistant Coach */}
        <AiChatWidget />
      </main>
    </div>
  );
};

export default MemberDashboard;
