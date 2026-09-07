import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import axios from 'axios';
import { toast } from 'sonner';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Dollar3D, Users3D, Shield3D, Chart3D, Wrench3D, Activity3D } from '../../components/ui/Icon3D';
import MrrCenterpiece3D from '../../components/admin/MrrCenterpiece3D';

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

  const [occupancy, setOccupancy] = useState({
    activeOccupancy: 38,
    capacityLimit: 150,
    peakHours: '5:00 PM - 8:00 PM',
    todayTotalCheckIns: 124
  });

  const [equipmentList, setEquipmentList] = useState([
    { id: 1, name: "Olympic Squat Rack #1", zone: "Free Weights Zone", status: "OPERATIONAL", healthScore: "100%", notes: "Cleaned 2h ago" },
    { id: 2, name: "Dual Cable Crossover #2", zone: "Functional Zone", status: "NEEDS_MAINTENANCE", healthScore: "85%", notes: "Cable tension check due" },
    { id: 3, name: "Matrix Treadmill Pro #4", zone: "Cardio Deck", status: "OPERATIONAL", healthScore: "98%", notes: "In use" },
    { id: 4, name: "Smith Machine #1", zone: "Strength Zone", status: "OUT_OF_SERVICE", healthScore: "0%", notes: "Safety bar check" }
  ]);

  useEffect(() => {
    fetchAdminStats();
    fetchAttendanceData();
    fetchEquipment();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data) setStats(res.data);
    } catch (e) {
      console.log("Admin stats fallback");
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const res = await api.get('/attendance/today');
      if (res.data) setOccupancy(res.data);
    } catch (e) {
      console.log("Attendance fallback");
    }
  };

  const fetchEquipment = () => {
    axios.get('http://localhost:8085/api/equipment/all')
      .then(res => setEquipmentList(res.data))
      .catch(() => console.log("Equipment fallback"));
  };

  const handleToggleEquipment = (id, currentStatus) => {
    const nextStatus = currentStatus === 'OPERATIONAL' ? 'NEEDS_MAINTENANCE' : 'OPERATIONAL';
    axios.post(`http://localhost:8085/api/equipment/toggle-status/${id}`, { status: nextStatus })
      .then(() => {
        toast.success(`Equipment status updated to ${nextStatus}`);
        fetchEquipment();
      })
      .catch(() => {
        setEquipmentList(prev => prev.map(eq => eq.id === id ? { ...eq, status: nextStatus } : eq));
        toast.success(`Equipment status updated to ${nextStatus}`);
      });
  };

  const statItems = [
    { label: 'Monthly Recurring Revenue', value: stats.mrr || 340900, prefix: '₹', trend: '+18.5%', IconComponent: Dollar3D },
    { label: 'Total Active Members', value: stats.totalMembers || 162, trend: '+12 new', IconComponent: Users3D },
    { label: 'Active Subscriptions', value: stats.activeSubscriptions || 162, trend: '100% active', IconComponent: Shield3D },
    { label: 'Settled Payments', value: stats.totalPayments || 24, trend: '+4 today', IconComponent: Chart3D }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* ── 3D HERO MOMENT: MRR Centerpiece ────────────────────── */}
        <section className="mb-8">
          <MrrCenterpiece3D mrr={stats.mrr || 340900} members={stats.totalMembers || 162} />
        </section>

        {/* Stats Row with 3D Tilt & Count-up */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statItems.map((stat, i) => (
            <TiltCard 
              key={i} 
              maxTilt={4}
              className="panel p-5 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="p-1.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                  <stat.IconComponent size={24} />
                </div>
                <div className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-400">
                  {stat.trend} <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
              <div className="text-2xl stat-number text-text-primary">
                <CountUp value={stat.value} prefix={stat.prefix} />
              </div>
              <div className="text-[11px] text-text-secondary font-medium">{stat.label}</div>
            </TiltCard>
          ))}
        </div>

        {/* Live Facility Telemetry with 3D Tilt */}
        <TiltCard maxTilt={2} className="panel p-6 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold block">Facility Telemetry</span>
                <h3 className="text-base font-bold text-text-primary">Gym Floor Occupancy</h3>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between border-t md:border-t-0 border-border pt-3 md:pt-0">
              <div>
                <div className="text-[10px] text-text-secondary uppercase font-semibold">Active Floor Count</div>
                <div className="text-xl stat-number text-primary">
                  <CountUp value={occupancy.activeOccupancy} /> <span className="text-xs font-normal text-text-secondary">/ {occupancy.capacityLimit}</span>
                </div>
              </div>

              <div className="border-l border-border pl-6">
                <div className="text-[10px] text-text-secondary uppercase font-semibold">Today's Visits</div>
                <div className="text-xl stat-number text-text-primary">
                  <CountUp value={occupancy.todayTotalCheckIns} />
                </div>
              </div>

              <div className="border-l border-border pl-6 hidden sm:block">
                <div className="text-[10px] text-text-secondary uppercase font-semibold">Peak Window</div>
                <div className="text-xs font-medium text-amber-400">{occupancy.peakHours}</div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Equipment Maintenance Tracker */}
        <section className="panel p-6 mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                <Wrench3D size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">Equipment & Zone Status</h3>
                <p className="text-xs text-text-secondary">Track machinery status and operational health</p>
              </div>
            </div>
            <span className="badge-accent">Asset Telemetry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {equipmentList.map(eq => (
              <div key={eq.id} className="p-3.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between table-row-hover">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary text-xs">{eq.name}</span>
                    <span className="text-[10px] text-text-secondary font-mono">({eq.zone})</span>
                  </div>
                  <div className="text-[11px] text-text-secondary">{eq.notes}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                    eq.status === 'OPERATIONAL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    eq.status === 'NEEDS_MAINTENANCE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {eq.status}
                  </span>

                  <button
                    onClick={() => handleToggleEquipment(eq.id, eq.status)}
                    className="btn-ghost py-1 px-2 text-[11px]"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <TiltCard maxTilt={2} className="panel p-6 space-y-4">
            <h3 className="text-base font-bold text-text-primary">
              Revenue & MRR Growth (₹)
            </h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="revGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5B6EFF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#5B6EFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis dataKey="name" stroke="#52525B" tick={{ fontSize: 11, fill: '#8C8C91' }} />
                  <YAxis stroke="#52525B" tick={{ fontSize: 11, fill: '#8C8C91' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px', color: '#F2F2F0' }} 
                    formatter={(val) => [`₹${val.toLocaleString()}`, 'MRR']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#5B6EFF" strokeWidth={2.5} fillOpacity={1} fill="url(#revGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TiltCard>

          <TiltCard maxTilt={2} className="panel p-6 space-y-4">
            <h3 className="text-base font-bold text-text-primary">
              Active Member Scaling
            </h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis dataKey="name" stroke="#52525B" tick={{ fontSize: 11, fill: '#8C8C91' }} />
                  <YAxis stroke="#52525B" tick={{ fontSize: 11, fill: '#8C8C91' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px', color: '#F2F2F0' }}
                  />
                  <Bar dataKey="members" fill="#5B6EFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TiltCard>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
