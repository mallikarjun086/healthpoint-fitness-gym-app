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
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Dollar3D, Chart3D, Shield3D, Calendar3D } from '../../components/ui/Icon3D';

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

      <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <span className="badge-accent text-[10px] mb-1 inline-block">Financial Telemetry</span>
            <h1 className="heading-xl text-text-primary">Revenue & Payment Analytics</h1>
            <p className="body-sm text-text-secondary mt-0.5">Real-time revenue tracking, subscription metrics, & Razorpay transactions.</p>
          </div>
          <button className="btn-secondary text-xs flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <TiltCard maxTilt={3} className="panel-card p-5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="caption">Total Revenue (YTD)</span>
              <div className="p-2 rounded-xl bg-surface-elevated border border-border">
                <Dollar3D size={20} />
              </div>
            </div>
            <div className="stat-display text-2xl sm:text-3xl text-text-primary">
              <CountUp target={1607000} prefix="₹" />
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +24% from last month
            </div>
          </TiltCard>

          <TiltCard maxTilt={3} className="panel-card p-5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="caption">Active Subscriptions</span>
              <div className="p-2 rounded-xl bg-surface-elevated border border-border">
                <Shield3D size={20} />
              </div>
            </div>
            <div className="stat-display text-2xl sm:text-3xl text-text-primary">
              <CountUp target={162} suffix=" Members" />
            </div>
            <div className="text-[11px] text-text-muted font-medium">₹2,999 Avg Ticket Size</div>
          </TiltCard>

          <TiltCard maxTilt={3} className="panel-card p-5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="caption">Settlement Rate</span>
              <div className="p-2 rounded-xl bg-surface-elevated border border-border">
                <Chart3D size={20} />
              </div>
            </div>
            <div className="stat-display text-2xl sm:text-3xl text-text-primary">
              <CountUp target={99.4} decimals={1} suffix="%" />
            </div>
            <div className="text-[11px] text-primary font-medium">Instant Webhook Verification</div>
          </TiltCard>

          <TiltCard maxTilt={3} className="panel-card p-5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="caption">Projected MRR</span>
              <div className="p-2 rounded-xl bg-surface-elevated border border-border">
                <Calendar3D size={20} />
              </div>
            </div>
            <div className="stat-display text-2xl sm:text-3xl text-text-primary">
              <CountUp target={340900} prefix="₹" />
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">+18% Growth Quarter</div>
          </TiltCard>
        </div>

        {/* Main Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 panel-card p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="heading-md text-text-primary font-display">Monthly Revenue Trend</h3>
                <p className="body-sm text-text-secondary">Gross recurring collections over time (INR)</p>
              </div>
              <span className="badge-accent">2024–2026 YTD</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revCurve" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#1D1F26" vertical={false} />
                  <XAxis dataKey="month" stroke="#8F9098" tick={{ fontSize: 11, fill: '#8F9098' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#8F9098" tick={{ fontSize: 11, fill: '#8F9098' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#131419', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F4F4F6', fontSize: '12px' }}
                    formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#revCurve)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel-card p-6 space-y-4">
            <div>
              <h3 className="heading-md text-text-primary font-display">Plan Distribution</h3>
              <p className="body-sm text-text-secondary">Breakdown by active membership tiers</p>
            </div>
            <div className="space-y-4 pt-2">
              {planBreakdown.map((item) => (
                <div key={item.plan} className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-text-primary">{item.plan}</span>
                    <span className="stat-display text-primary font-bold">₹{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-text-muted">
                    <span>{item.count} Active Athletes</span>
                    <span>{Math.round((item.count / 162) * 100)}% of total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevenueAnalytics;
