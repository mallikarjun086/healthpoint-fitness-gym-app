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
  ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import AiChatWidget from '../../components/ai/AiChatWidget';
import AiInsightCard from '../../components/ai/AiInsightCard';

const MemberDashboard = () => {
  const [user, setUser] = useState({ name: 'Mallikarjun' });
  const [stats, setStats] = useState([
    { label: 'Workouts', value: '12', icon: Dumbbell, color: 'text-primary' },
    { label: 'Calories', value: '18.4k', icon: Flame, color: 'text-orange-500' },
    { label: 'Streak', value: '5 Days', icon: Zap, color: 'text-yellow-400' },
    { label: 'Level', value: 'Pro', icon: Award, color: 'text-blue-400' }
  ]);

  const [activeRoutine, setActiveRoutine] = useState({
    title: 'Push Power: Chest & Triceps',
    progress: 65,
    lastActive: '2 hours ago'
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="member" />
      
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Background Decorative Aura */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        
        {/* Header Section */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary mb-2"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Thursday, May 14</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black italic uppercase tracking-tighter"
            >
              Welcome Back, <span className="text-primary">{user.name}</span>
            </motion.h1>
          </div>
          <div className="flex gap-4">
            <div className="glass-card px-6 py-3 border-white/5 flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] text-gray-500 font-bold uppercase">Membership</div>
                <div className="text-sm font-black text-primary">ELITE PLAN</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 group hover:border-primary/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-3xl font-black italic mb-1">{stat.value}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Workout Card */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent border-l-4 border-l-primary overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Dumbbell className="w-32 h-32 -rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Currently Active</span>
                </div>
                <h3 className="text-3xl font-black italic uppercase mb-2">{activeRoutine.title}</h3>
                <p className="text-gray-400 text-sm mb-8">Continue where you left off. You're crushing it today!</p>
                
                <div className="flex items-center gap-8 mb-8">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                      <span>Progress</span>
                      <span>{activeRoutine.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${activeRoutine.progress}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <button className="w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </button>
                </div>
                <div className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Last session: {activeRoutine.lastActive}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase italic tracking-tight">Set New Goal</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Updated May 12</p>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-auto text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
              <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase italic tracking-tight">Daily Streak</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Keep it up!</p>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-auto text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Activity & Info */}
          <div className="space-y-8">
            <AiInsightCard type="nudge" />
            <AiInsightCard type="progress" />
            <div className="glass-card p-6">
              <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center justify-between">
                Performance Tip <ChevronDown className="w-4 h-4" />
              </h4>
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "For maximum muscle protein synthesis, aim to consume 20-40g of protein within 2 hours of your workout."
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Play className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Read Masterclass</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h4 className="text-sm font-black uppercase tracking-widest mb-6">Recent Achievements</h4>
              <div className="space-y-4">
                {[
                  { label: 'Morning Warrior', icon: '☀️', desc: '5 workouts before 8 AM' },
                  { label: 'Strength King', icon: '👑', desc: 'New PR in Deadlift' }
                ].map(ach => (
                  <div key={ach.label} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                    <div className="text-2xl">{ach.icon}</div>
                    <div>
                      <div className="text-sm font-bold uppercase italic">{ach.label}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">{ach.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <AiChatWidget />
    </div>
  );
};

export default MemberDashboard;
