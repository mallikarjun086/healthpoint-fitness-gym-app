import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  ArrowUpRight,
  Download,
  ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import Sidebar from '../../components/layout/Sidebar';

const RevenueAnalytics = () => {
  const revenueData = [
    { month: 'Jan', revenue: 145000, subscriptions: 42 },
    { month: 'Feb', revenue: 182000, subscriptions: 55 },
    { month: 'Mar', revenue: 210000, subscriptions: 68 },
    { month: 'Apr', revenue: 195000, subscriptions: 60 },
    { month: 'May', revenue: 245000, subscriptions: 78 },
    { month: 'Jun', revenue: 290000, subscriptions: 92 },
    { month: 'Jul', revenue: 340000, subscriptions: 110 }
  ];

  const planBreakdown = [
    { plan: 'Annual Elite', amount: 185000, count: 62 },
    { plan: 'Pro Fitness', amount: 110000, count: 55 },
    { plan: 'Basic Starter', amount: 45000, count: 45 }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Revenue & Payment Analytics</h1>
            <p className="text-gray-400 mt-1">Real-time revenue tracking, subscription metrics, & Razorpay transactions.</p>
          </div>
          <button className="btn-premium px-6 py-2.5 text-xs flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border-l-4 border-l-primary">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase">Total Revenue (YTD)</span>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-black mb-1">₹16,07,000</div>
            <div className="text-xs text-green-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +24% from last month
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase">Active Subscriptions</span>
              <CreditCard className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black mb-1">162 Members</div>
            <div className="text-xs text-blue-400 font-bold">₹2,999 Avg Ticket Size</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 border-l-4 border-l-purple-500">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase">Razorpay Success Rate</span>
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-black mb-1">99.4%</div>
            <div className="text-xs text-purple-400 font-bold">Instant Webhook Verification</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 border-l-4 border-l-orange-500">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase">MRR (Monthly Recurring)</span>
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-black mb-1">₹3,40,000</div>
            <div className="text-xs text-orange-400 font-bold">Projected Next Month</div>
          </motion.div>
        </div>

        {/* Main Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold">Monthly Revenue Trend</h3>
                <p className="text-xs text-gray-400">Total gross earnings over time (INR)</p>
              </div>
              <span className="text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">2024 YTD</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevFixed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5B6EFF" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis dataKey="month" stroke="#52525B" fontSize={12} tick={{ fill: '#8C8C91' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#52525B" fontSize={12} tick={{ fill: '#8C8C91' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '12px', color: '#F2F2F0', fontSize: '12px' }}
                    formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#5B6EFF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevFixed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">Revenue by Plan</h3>
              <p className="text-xs text-gray-400 mb-6">Contribution breakdown by tier</p>
              
              <div className="space-y-4">
                {planBreakdown.map((item, index) => (
                  <div key={item.plan} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm">{item.plan}</span>
                      <span className="font-black text-primary">₹{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${(item.amount / 340000) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2 flex justify-between">
                      <span>{item.count} Subscribers</span>
                      <span>{Math.round((item.amount / 340000) * 100)}% of revenue</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevenueAnalytics;
