import { motion } from 'framer-motion';
import { Users, DollarSign, Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Sidebar from '../../components/layout/Sidebar';

const data = [
  { name: 'Jan', revenue: 4000, members: 2400 },
  { name: 'Feb', revenue: 3000, members: 1398 },
  { name: 'Mar', revenue: 2000, members: 9800 },
  { name: 'Apr', revenue: 2780, members: 3908 },
  { name: 'May', revenue: 1890, members: 4800 },
  { name: 'Jun', revenue: 2390, members: 3800 },
  { name: 'Jul', revenue: 3490, members: 4300 },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="admin" />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div><h1 className="text-3xl font-bold">Admin Dashboard</h1><p className="text-gray-400 mt-1">Welcome back, here's what's happening today.</p></div>
          <button className="btn-premium py-2 px-4 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Member</button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: '$45,231', trend: '+12.5%', up: true, icon: DollarSign },
            { label: 'Active Members', value: '1,248', trend: '+5.2%', up: true, icon: Users },
            { label: 'Avg Attendance', value: '85%', trend: '-2.1%', up: false, icon: Activity },
            { label: 'New Signups', value: '124', trend: '+18.7%', up: true, icon: TrendingUp },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 glass-card">
              <div className="flex justify-between items-start mb-4"><div className="p-2 bg-primary/10 rounded-lg"><stat.icon className="w-5 h-5 text-primary" /></div><div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-green-400' : 'text-red-400'}`}>{stat.trend} {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}</div></div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div><div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="p-8 glass-card">
            <h3 className="font-bold text-lg mb-8">Revenue Overview</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00FF9D" stopOpacity={0.3}/><stop offset="95%" stopColor="#00FF9D" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '12px' }} itemStyle={{ color: '#00FF9D' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#00FF9D" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-8 glass-card">
            <h3 className="font-bold text-lg mb-8">Member Growth</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '12px' }} />
                  <Bar dataKey="members" fill="#00A3FF" radius={[4, 4, 0, 0]} barSize={20} />
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
