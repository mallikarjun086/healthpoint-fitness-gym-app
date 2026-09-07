import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Play, 
  Zap, 
  QrCode, 
  Flame,
  Activity,
  PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import AiInsightCard from '../../components/ai/AiInsightCard';
import WorkoutLoggerModal from '../../components/member/WorkoutLoggerModal';
import LiveWorkoutModal from '../../components/member/LiveWorkoutModal';
import DigitalPassModal from '../../components/member/DigitalPassModal';
import MuscleHeatmap from '../../components/member/MuscleHeatmap';
import AiCoachAssistant from '../../components/common/AiCoachAssistant';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Dumbbell3D, Chart3D, Heart3D, Shield3D, Zap3D, QrCode3D, Sparkles3D } from '../../components/ui/Icon3D';
import ProgressOrb3D from '../../components/member/ProgressOrb3D';

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
  const [isLiveWorkoutOpen, setIsLiveWorkoutOpen] = useState(false);
  const [isDigitalPassOpen, setIsDigitalPassOpen] = useState(false);
  const [user, setUser] = useState({ name: authUser?.name || 'Alex Rivers' });

  const stats = [
    { label: 'Workouts Completed', value: '18', IconComponent: Dumbbell3D, change: '+3 this week' },
    { label: 'Total Volume Lifted', value: '12.9k kg', IconComponent: Chart3D, change: '+14% strength load' },
    { label: 'Wearable Sync HR', value: '128 BPM', IconComponent: Heart3D, change: 'Apple Watch Active' },
    { label: 'Attendance Streak', value: '7 Days', IconComponent: Shield3D, change: 'VIP Club Pass' }
  ];

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
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{todayDateStr}</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">Your training load, biomechanics map, and recovery status.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setIsDigitalPassOpen(true)}
              className="btn-secondary"
            >
              <QrCode className="w-4 h-4 text-primary" /> Digital Pass
            </button>

            <button 
              onClick={() => setIsLiveWorkoutOpen(true)}
              className="btn-primary"
            >
              <Zap className="w-4 h-4" /> Start Live Workout
            </button>
          </div>
        </header>

        {/* ── 3D HERO MOMENT: Progress Orb Banner ────────────────────── */}
        <section className="mb-8">
          <div className="panel overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D0D12 0%, #12121c 100%)' }}>
            <div className="flex flex-col lg:flex-row items-stretch gap-0">
              {/* Left: 3D Orb */}
              <div className="lg:w-[320px] shrink-0" style={{ minHeight: 260 }}>
                <ProgressOrb3D progress={0.72} streakDays={7} weeklyVolume={12900} />
              </div>

              {/* Right: Hero Numbers */}
              <div className="flex-1 p-7 flex flex-col justify-center gap-5 border-t lg:border-t-0 lg:border-l border-border">
                <div>
                  <span className="badge-accent text-[11px] mb-2 inline-block">Weekly Training Summary</span>
                  <h2 className="text-xl font-bold text-text-primary tracking-tight">
                    Strong week, {user.name.split(' ')[0]}. You're on target.
                  </h2>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Progressive overload confirmed across 3 main lifts. Protein compliance at 92%.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
                  <div>
                    <div className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mb-1">Weekly Volume</div>
                    <div className="text-2xl font-black stat-number text-text-primary"><CountUp value={12900} suffix=" kg" /></div>
                    <div className="text-[11px] text-emerald-400 font-medium mt-0.5">+14% vs last week</div>
                  </div>
                  <div className="border-l border-border pl-4">
                    <div className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mb-1">Sessions</div>
                    <div className="text-2xl font-black stat-number text-text-primary"><CountUp value={18} /></div>
                    <div className="text-[11px] text-text-secondary font-medium mt-0.5">This month</div>
                  </div>
                  <div className="border-l border-border pl-4">
                    <div className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mb-1">Streak</div>
                    <div className="text-2xl font-black stat-number" style={{ background: 'linear-gradient(135deg, #5B6EFF, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      <CountUp value={7} suffix=" Days" />
                    </div>
                    <div className="text-[11px] text-primary font-medium mt-0.5">VIP Club Pass</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Athletic Scoreboard Stat Cards with 3D Tilt & Count-up */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <TiltCard
              key={stat.label}
              maxTilt={4}
              className="panel p-5 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-text-secondary">{stat.label}</span>
                <div className="p-1.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                  <stat.IconComponent size={24} />
                </div>
              </div>
              <div className="text-3xl stat-number text-text-primary">
                <CountUp value={stat.value} />
              </div>
              <div className="text-[11px] text-text-secondary font-medium">
                {stat.change}
              </div>
            </TiltCard>
          ))}
        </section>

        {/* 3D Interactive Muscle Activation Section */}
        <section className="mb-8">
          <MuscleHeatmap />
        </section>

        {/* Main Progression Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart: Volume Progression */}
          <div className="lg:col-span-2 space-y-6">
            <TiltCard maxTilt={2} className="panel p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="badge-accent">Volume Analytics</span>
                  </div>
                  <h3 className="text-base font-bold text-text-primary">Progressive Overload Tracking</h3>
                </div>
                <div className="text-xs text-text-secondary font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" /> Total Weekly Volume (kg)
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={strengthProgressData}>
                    <defs>
                      <linearGradient id="volumeCurve" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5B6EFF" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#5B6EFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" stroke="#27272A" vertical={false} />
                    <XAxis dataKey="day" stroke="#8C8C91" tick={{ fontSize: 11, fill: '#8C8C91' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#8C8C91" tick={{ fontSize: 11, fill: '#8C8C91' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '12px', color: '#F2F2F0', fontSize: '12px' }}
                      formatter={(val) => [`${val} kg`, 'Volume Lifted']}
                    />
                    <Area type="monotone" dataKey="totalVolume" stroke="#5B6EFF" strokeWidth={2.5} fillOpacity={1} fill="url(#volumeCurve)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TiltCard>

            {/* AI Coaching Insight Component */}
            <AiInsightCard />
          </div>

          {/* Sidebar: Recommended Split & Macro Compliance */}
          <div className="space-y-6">
            {/* Today's Workout Card with 3D Tilt */}
            <TiltCard maxTilt={3} className="panel p-5 space-y-4 border-l-2 border-l-primary">
              <div className="flex justify-between items-start">
                <span className="badge-accent">Today's Session</span>
                <span className="text-xs text-text-secondary font-medium">45 Mins</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-text-primary mb-1">
                  Push Power: Upper Chest & Triceps
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Incline DB Press, Flat Barbell Bench, Standing Lateral Raise, and Rope Extensions.
                </p>
              </div>

              <button 
                onClick={() => setIsLiveWorkoutOpen(true)}
                className="w-full btn-primary py-2.5 text-xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Launch Live Session Tracker
              </button>
            </TiltCard>

            {/* Daily Macro Compliance with 3D Tilt & Count-up */}
            <TiltCard maxTilt={3} className="panel p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-primary" /> Daily Macro Targets
                </h4>
                <span className="stat-number text-xs text-primary">
                  <CountUp value={2650} suffix=" kcal" />
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Protein (2.2g/kg)</span>
                    <span className="stat-number text-xs">
                      <CountUp value={185} suffix="g" /> / 200g
                    </span>
                  </div>
                  <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden border border-border">
                    <div className="bg-primary h-full rounded-full w-[92%] transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Carbohydrates</span>
                    <span className="stat-number text-xs">
                      <CountUp value={280} suffix="g" /> / 320g
                    </span>
                  </div>
                  <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden border border-border">
                    <div className="bg-accent-violet h-full rounded-full w-[87%] transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Healthy Fats</span>
                    <span className="stat-number text-xs">
                      <CountUp value={65} suffix="g" /> / 75g
                    </span>
                  </div>
                  <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden border border-border">
                    <div className="bg-text-secondary h-full rounded-full w-[86%] transition-all" />
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Live Interactive Modals */}
        <LiveWorkoutModal 
          isOpen={isLiveWorkoutOpen} 
          onClose={() => setIsLiveWorkoutOpen(false)} 
        />

        <DigitalPassModal 
          isOpen={isDigitalPassOpen} 
          onClose={() => setIsDigitalPassOpen(false)} 
          userName={user.name}
        />

        <WorkoutLoggerModal 
          isOpen={isLoggerOpen} 
          onClose={() => setIsLoggerOpen(false)} 
        />

        {/* Floating AI Assistant */}
        <AiCoachAssistant />
      </main>
    </div>
  );
};

export default MemberDashboard;
