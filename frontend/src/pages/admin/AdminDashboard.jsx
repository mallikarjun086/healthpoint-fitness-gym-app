import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Sparkles, ShieldCheck, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';

const revenueTrendData = [
  { name: 'Jan', revenue: 240000, members: 120 },
  { name: 'Feb', revenue: 275000, members: 135 },
  { name: 'Mar', revenue: 290000, members: 142 },
  { name: 'Apr', revenue: 310000, members: 150 },
  { name: 'May', revenue: 325000, members: 158 },
  { name: 'Jun', revenue: 340900, members: 162 }
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 162,
    activeSubscriptions: 162,
    mrr: 340900,
    totalPayments: 24
  });

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data) {
        setStats(res.data);
      }
    } catch (e) {
      console.log("Admin stats fallback");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="admin" />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase text-primary tracking-widest">System Control Center</span>
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tight">Executive Admin Overview</h1>
            <p className="text-gray-400 mt-1">Real-time gym performance, member retention index, and MRR metrics.</p>
          </div>

          <Link to="/admin/members" className="btn-premium px-6 py-3 text-xs flex items-center gap-2">
            <Plus className="w-4 h-4 text-black" /> Manage Member Directory
          </Link>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Monthly Recurring Revenue', value: `₹${(stats.mrr || 340900).toLocaleString()}`, trend: '+18.5%', up: true, icon: DollarSign, color: 'text-primary' },
            { label: 'Total Gym Members', value: (stats.totalMembers || 162).toString(), trend: '+12 new', up: true, icon: Users, color: 'text-secondary' },
            { label: 'Active Subscriptions', value: (stats.activeSubscriptions || 162).toString(), trend: '100% Active', up: true, icon: ShieldCheck, color: 'text-green-400' },
            { label: 'Fulfilled Payments', value: (stats.totalPayments || 24).toString(), trend: '+4 today', up: true, icon: CreditCard, color: 'text-purple-400' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.08 }} 
              className="glass-card-interactive p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">
                  {stat.trend} <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-3xl font-black italic text-white mb-1">{stat.value}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold uppercase italic mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Revenue & MRR Growth (₹)
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="revGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9FF00" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#C9FF00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222228" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis stroke="#666" tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121215', borderColor: '#222228', borderRadius: '12px', color: '#fff' }} 
                    formatter={(val) => [`₹${val.toLocaleString()}`, 'MRR']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#C9FF00" strokeWidth={3} fillOpacity={1} fill="url(#revGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold uppercase italic mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" /> Active Member Scale Trend
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222228" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis stroke="#666" tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121215', borderColor: '#222228', borderRadius: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="members" fill="#00F0FF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
