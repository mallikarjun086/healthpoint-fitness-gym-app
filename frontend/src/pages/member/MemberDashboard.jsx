import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Play, 
  Zap, 
  QrCode, 
  Flame, 
  Activity, 
  PieChart,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Camera,
  AlertTriangle,
  Watch,
  Wind,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import AiInsightCard from '../../components/ai/AiInsightCard';
import WorkoutLoggerModal from '../../components/member/WorkoutLoggerModal';
import LiveWorkoutModal from '../../components/member/LiveWorkoutModal';
import LivePoseCoachModal from '../../components/member/LivePoseCoachModal';
import DigitalPassModal from '../../components/member/DigitalPassModal';
import MuscleHeatmap from '../../components/member/MuscleHeatmap';
import AiCoachAssistant from '../../components/common/AiCoachAssistant';
import ReadinessScoreCard from '../../components/biometrics/ReadinessScoreCard';
import WearableConnectModal from '../../components/biometrics/WearableConnectModal';
import GuidedBreathingModal from '../../components/biometrics/GuidedBreathingModal';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Dumbbell3D, Chart3D, Heart3D, Shield3D, Zap3D, QrCode3D, Sparkles3D } from '../../components/ui/Icon3D';
import ProgressOrb3D from '../../components/member/ProgressOrb3D';
import OnboardingModal from '../../components/member/OnboardingModal';
import { motionTokens } from '../../tokens/designTokens';

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
  const [readinessData, setReadinessData] = useState(null);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [isLiveWorkoutOpen, setIsLiveWorkoutOpen] = useState(false);
  const [isPoseCoachOpen, setIsPoseCoachOpen] = useState(false);
  const [isWearableModalOpen, setIsWearableModalOpen] = useState(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState(false);
  const [isDigitalPassOpen, setIsDigitalPassOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [user, setUser] = useState({ name: authUser?.name || 'Alex Rivers' });

  const stats = [
    { label: 'Workouts Completed', value: 18, icon: Dumbbell3D, change: '+3 this week', suffix: '' },
    { label: 'Total Volume Lifted', value: 12.9, icon: Chart3D, change: '+14% strength load', suffix: 'k kg', decimals: 1 },
    { label: 'Wearable Sync HR', value: readinessData?.todayRestingHr || 58, icon: Heart3D, change: readinessData?.deviceSource ? `${readinessData.deviceSource.replace('_', ' ')} Active` : 'Apple Watch Ultra', suffix: ' BPM' },
    { label: 'Readiness Score', value: readinessData?.readinessScore || 78, icon: Shield3D, change: readinessData?.statusCategory || 'OPTIMAL', suffix: ' / 100' }
  ];

  useEffect(() => {
    fetchProfile();
    fetchReadiness();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/goals/my-plan');
      if (res.data) {
        setProfile(res.data);
      }
    } catch (e) {
      console.log("Profile offline fallback");
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

  const targetCalories = profile?.dailyCalories || profile?.targetCalories || 2650;
  const targetProtein = profile?.proteinGrams || profile?.targetProteinG || 185;
  const targetCarbs = profile?.carbsGrams || profile?.targetCarbsG || 280;
  const targetFat = profile?.fatGrams || profile?.targetFatG || 65;

  const todayDateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const isDeload = readinessData?.statusCategory === 'DELOAD_TRIGGERED' || readinessData?.isConsecutiveLow;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-8 relative overflow-hidden">
        {/* Dashboard Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{todayDateStr}</span>
            </div>
            <h1 className="heading-xl text-text-primary">
              Welcome back, {user.name}
            </h1>
            <p className="body-sm text-text-secondary mt-0.5">Biometric training readiness, live form coach, and adaptive load.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setIsOnboardingOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> First-Run Onboarding
            </button>

            <button 
              onClick={() => setIsWearableModalOpen(true)}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <Watch className="w-4 h-4 text-primary" /> Wearables
            </button>

            <button 
              onClick={() => setIsPoseCoachOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Camera className="w-4 h-4" /> AI Camera Coach
            </button>

            <button 
              onClick={() => setIsLiveWorkoutOpen(true)}
              className="btn-primary text-xs shadow-accent"
            >
              <Zap className="w-4 h-4" /> Start Live Workout
            </button>
          </div>
        </header>

        {/* ── OVERTRAINING DELOAD ALERT BANNER ────────────────────── */}
        <AnimatePresence>
          {isDeload && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15 }}
              className="mb-8 p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-rose-950/20"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 mt-0.5 shrink-0">
                  <AlertTriangle className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-rose-300">Overtraining Alert: 5-Day Downward Recovery Trend</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
                      Deload Suggested
                    </span>
                  </div>
                  <p className="caption text-rose-200/80 mt-1 leading-relaxed">
                    HRV has steadily declined for 5 consecutive days. Today's program is auto-adapted to <strong>Active Decompression & Joint Mobilization</strong> to restore autonomic equilibrium.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => setIsBreathingModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-surface-card hover:bg-surface-elevated text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Wind className="w-3.5 h-3.5" /> 0.1Hz Breathing
                </button>
                <Link
                  to="/member/workouts"
                  className="btn-primary bg-rose-600 hover:bg-rose-700 text-xs py-1.5 px-3.5 shadow-none"
                >
                  View Deload Plan
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BIOMETRIC READINESS PILLAR CARD ────────────────────── */}
        <section className="mb-8">
          <ReadinessScoreCard
            readinessData={readinessData}
            onOpenWearableModal={() => setIsWearableModalOpen(true)}
            onOpenBreathingModal={() => setIsBreathingModalOpen(true)}
            onRefresh={fetchReadiness}
          />
        </section>

        {/* ── 3D HERO MOMENT: Progress Orb Banner ────────────────────── */}
        <section className="mb-8">
          <div className="panel-elevated overflow-hidden bg-surface-card border-border-light">
            <div className="flex flex-col lg:flex-row items-stretch gap-0">
              {/* Left: 3D Orb */}
              <div className="lg:w-[320px] shrink-0" style={{ minHeight: 260 }}>
                <ProgressOrb3D progress={0.72} streakDays={7} weeklyVolume={12900} />
              </div>

              {/* Right: Hero Telemetry Numbers */}
              <div className="flex-1 p-7 flex flex-col justify-center gap-5 border-t lg:border-t-0 lg:border-l border-border">
                <div>
                  <span className="badge-accent text-[11px] mb-2 inline-block">Weekly Training Summary</span>
                  <h2 className="heading-lg text-text-primary font-display">
                    Strong week, {user.name.split(' ')[0]}. You're on target.
                  </h2>
                  <p className="body-sm text-text-secondary mt-1">
                    Progressive overload confirmed across 3 main lifts. Biometric recovery tracking active.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
                  <div>
                    <div className="caption mb-1">Weekly Volume</div>
                    <div className="stat-display text-2xl text-text-primary">
                      <CountUp target={12900} suffix=" kg" />
                    </div>
                    <div className="text-[11px] text-emerald-400 font-medium mt-0.5">+14% vs last week</div>
                  </div>
                  <div className="border-l border-border pl-4">
                    <div className="caption mb-1">Sessions</div>
                    <div className="stat-display text-2xl text-text-primary">
                      <CountUp target={18} />
                    </div>
                    <div className="text-[11px] text-text-secondary font-medium mt-0.5">This month</div>
                  </div>
                  <div className="border-l border-border pl-4">
                    <div className="caption mb-1">Streak</div>
                    <div className="stat-display text-2xl text-primary">
                      <CountUp target={7} suffix=" Days" />
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
          {stats.map((stat) => (
            <TiltCard
              key={stat.label}
              maxTilt={4}
              className="panel-card p-5 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-text-secondary">{stat.label}</span>
                <div className="p-2 rounded-xl bg-surface-elevated border border-border flex items-center justify-center shadow-sm">
                  <stat.icon size={22} />
                </div>
              </div>
              <div className="stat-display text-3xl text-text-primary">
                <CountUp target={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
              </div>
              <div className="text-[11px] text-text-muted font-medium">
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
            <TiltCard maxTilt={2} className="panel-card p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="badge-accent text-[10px] mb-1 inline-block">Volume Analytics</span>
                  <h3 className="heading-md text-text-primary font-display">Progressive Overload Tracking</h3>
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
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" stroke="#1D1F26" vertical={false} />
                    <XAxis dataKey="day" stroke="#8F9098" tick={{ fontSize: 11, fill: '#8F9098' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#8F9098" tick={{ fontSize: 11, fill: '#8F9098' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#131419', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', color: '#F4F4F6', fontSize: '12px' }}
                      formatter={(val) => [`${val} kg`, 'Volume Lifted']}
                    />
                    <Area type="monotone" dataKey="totalVolume" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#volumeCurve)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TiltCard>

            {/* AI Coaching Insight Component */}
            <AiInsightCard />
          </div>

          {/* Sidebar: Recommended Split & Macro Compliance */}
          <div className="space-y-6">
            {/* Today's Workout Card with Adaptive Biometrics Status */}
            <TiltCard maxTilt={3} className="panel-card p-5 space-y-4 border-l-2 border-l-primary">
              <div className="flex justify-between items-start">
                <span className="badge-accent">Today's Session</span>
                <span className="text-xs text-text-muted font-medium font-mono">
                  {readinessData?.adaptiveWorkout?.rpeCap ? `Cap: RPE ${readinessData.adaptiveWorkout.rpeCap}` : '45 Mins'}
                </span>
              </div>

              <div>
                <h3 className="heading-sm text-text-primary mb-1 font-display">
                  {isDeload ? "Deload: Spinal Decompression & Hip Flow" : "Push Power: Upper Chest & Triceps"}
                </h3>
                <p className="body-sm text-text-secondary leading-relaxed">
                  {readinessData?.adaptiveWorkout?.rationale || "Incline DB Press, Flat Barbell Bench, Standing Lateral Raise, and Cable Pushdowns."}
                </p>
              </div>

              {readinessData?.readinessScore < 50 && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Working sets reduced 20%</span>
                  </span>
                  <button
                    onClick={() => setIsBreathingModalOpen(true)}
                    className="underline text-[11px] hover:text-white"
                  >
                    0.1Hz Prime
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button 
                  onClick={() => setIsPoseCoachOpen(true)}
                  className="btn-secondary py-2.5 text-xs flex items-center justify-center gap-1.5 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                >
                  <Camera className="w-3.5 h-3.5 text-indigo-400" /> Form Coach
                </button>
                <button 
                  onClick={() => setIsLiveWorkoutOpen(true)}
                  className="btn-primary py-2.5 text-xs shadow-accent flex items-center justify-center gap-1"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Live Tracker
                </button>
              </div>
            </TiltCard>

            {/* Daily Macro Compliance with 3D Tilt & Count-up */}
            <TiltCard maxTilt={3} className="panel-card p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="heading-sm text-text-primary flex items-center gap-1.5 font-display">
                  <PieChart className="w-4 h-4 text-primary" /> Daily Macro Targets
                </h4>
                <span className="stat-display text-xs text-primary">
                  <CountUp target={targetCalories} suffix=" kcal" />
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary font-medium">Protein Target</span>
                    <span className="stat-display text-xs">
                      <CountUp target={targetProtein} suffix="g" />
                    </span>
                  </div>
                  <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden border border-border">
                    <div className="bg-primary h-full rounded-full w-[92%] transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary font-medium">Carbohydrates</span>
                    <span className="stat-display text-xs">
                      <CountUp target={targetCarbs} suffix="g" />
                    </span>
                  </div>
                  <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden border border-border">
                    <div className="bg-primary/60 h-full rounded-full w-[87%] transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary font-medium">Healthy Fats</span>
                    <span className="stat-display text-xs">
                      <CountUp target={targetFat} suffix="g" />
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

        <LivePoseCoachModal
          isOpen={isPoseCoachOpen}
          onClose={() => setIsPoseCoachOpen(false)}
          initialExercise="SQUAT"
        />

        <WearableConnectModal
          isOpen={isWearableModalOpen}
          onClose={() => setIsWearableModalOpen(false)}
          onDataUpdated={(updated) => {
            if (updated) setReadinessData(updated);
            else fetchReadiness();
          }}
          connectedWearables={readinessData?.connectedWearables || []}
        />

        <GuidedBreathingModal
          isOpen={isBreathingModalOpen}
          onClose={() => setIsBreathingModalOpen(false)}
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

        {/* First-Run Onboarding Modal */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onLaunchCalibrationWorkout={() => setIsLiveWorkoutOpen(true)}
        />

        {/* Floating AI Assistant */}
        <AiCoachAssistant />
      </main>
    </div>
  );
};

export default MemberDashboard;

