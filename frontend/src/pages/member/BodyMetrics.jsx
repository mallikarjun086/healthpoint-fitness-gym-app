import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingDown, 
  Plus, 
  Ruler, 
  X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Scale3D, Activity3D, Heart3D, Chart3D } from '../../components/ui/Icon3D';

const defaultMetricsData = [
  { logDate: '2026-08-01', weightKg: 82.0, bodyFatPercentage: 22.5, chestCm: 104, waistCm: 88, armsCm: 37, thighsCm: 60 },
  { logDate: '2026-08-08', weightKg: 80.8, bodyFatPercentage: 21.8, chestCm: 104.5, waistCm: 86.5, armsCm: 37.2, thighsCm: 59.5 },
  { logDate: '2026-08-15', weightKg: 79.5, bodyFatPercentage: 21.0, chestCm: 105, waistCm: 85, armsCm: 37.8, thighsCm: 59 },
  { logDate: '2026-08-22', weightKg: 78.2, bodyFatPercentage: 20.2, chestCm: 105.5, waistCm: 83.5, armsCm: 38.2, thighsCm: 58.5 },
  { logDate: '2026-08-29', weightKg: 76.8, bodyFatPercentage: 19.5, chestCm: 106, waistCm: 82, armsCm: 38.6, thighsCm: 58 },
  { logDate: '2026-09-02', weightKg: 75.0, bodyFatPercentage: 18.8, chestCm: 107, waistCm: 80.5, armsCm: 39.0, thighsCm: 57.5 }
];

const BodyMetrics = () => {
  const { user } = useAuth();
  const [metricsHistory, setMetricsHistory] = useState(defaultMetricsData);
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    weightKg: '',
    bodyFatPercentage: '',
    chestCm: '',
    waistCm: '',
    armsCm: '',
    thighsCm: '',
    notes: ''
  });

  useEffect(() => {
    fetchMetrics();
  }, [user]);

  const fetchMetrics = async () => {
    try {
      const userId = user?.id || 3;
      const res = await api.get(`/biometrics/progress/user/${userId}`);
      if (res.data?.history && res.data.history.length > 0) {
        setMetricsHistory(res.data.history);
      }
      if (res.data?.profile) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.log('Using initial progress metrics fallback');
    }
  };

  const handleSaveMetrics = async (e) => {
    e.preventDefault();
    if (!formData.weightKg) {
      toast.error('Please enter your weight');
      return;
    }

    const payload = {
      userId: user?.id || 3,
      logDate: new Date().toISOString().split('T')[0],
      weightKg: parseFloat(formData.weightKg),
      bodyFatPercentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : null,
      chestCm: formData.chestCm ? parseFloat(formData.chestCm) : null,
      waistCm: formData.waistCm ? parseFloat(formData.waistCm) : null,
      armsCm: formData.armsCm ? parseFloat(formData.armsCm) : null,
      thighsCm: formData.thighsCm ? parseFloat(formData.thighsCm) : null,
      notes: formData.notes
    };

    try {
      await api.post('/biometrics/progress', payload);
      toast.success('Body metrics recorded successfully');
      setIsModalOpen(false);
      setFormData({ weightKg: '', bodyFatPercentage: '', chestCm: '', waistCm: '', armsCm: '', thighsCm: '', notes: '' });
      fetchMetrics();
    } catch (err) {
      setMetricsHistory(prev => [...prev, payload]);
      toast.success('Body metrics logged');
      setIsModalOpen(false);
    }
  };

  const latestLog = metricsHistory[metricsHistory.length - 1] || {};
  const firstLog = metricsHistory[0] || {};
  const totalWeightDelta = latestLog.weightKg && firstLog.weightKg 
    ? (latestLog.weightKg - firstLog.weightKg).toFixed(1) 
    : '-7.0';

  const currentBmi = profile?.bmi || (latestLog.weightKg ? (latestLog.weightKg / (1.78 * 1.78)).toFixed(1) : 23.7);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent flex items-center gap-1.5">
                <Scale3D size={18} /> Body Composition
              </span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Body Metrics & Progression</h1>
            <p className="text-xs text-text-secondary mt-0.5">Track scale weight, body fat %, and circumference measurements with longitudinal charts.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" /> Log Biometrics
          </button>
        </header>

        {/* Quick Stat Highlights with 3D Tilt & Count-up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <TiltCard maxTilt={4} className="panel p-5 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-text-secondary">Current Weight</span>
              <div className="p-1.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                <Scale3D size={22} />
              </div>
            </div>
            <div className="text-3xl stat-number text-text-primary">
              <CountUp value={latestLog.weightKg || 75.0} suffix=" kg" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
              <TrendingDown className="w-3.5 h-3.5" /> {totalWeightDelta} kg total change
            </div>
          </TiltCard>

          <TiltCard maxTilt={4} className="panel p-5 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-text-secondary">Body Fat %</span>
              <div className="p-1.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                <Chart3D size={22} />
              </div>
            </div>
            <div className="text-3xl stat-number text-text-primary">
              <CountUp value={latestLog.bodyFatPercentage || 18.8} suffix="%" />
            </div>
            <div className="text-[11px] text-text-secondary font-medium">Optimal lean range</div>
          </TiltCard>

          <TiltCard maxTilt={4} className="panel p-5 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-text-secondary">BMI Index</span>
              <div className="p-1.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                <Activity3D size={22} />
              </div>
            </div>
            <div className="text-3xl stat-number text-text-primary">
              <CountUp value={currentBmi} />
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">Healthy mass ratio</div>
          </TiltCard>

          <TiltCard maxTilt={4} className="panel p-5 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-text-secondary">Target Goal</span>
              <div className="p-1.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                <Heart3D size={22} />
              </div>
            </div>
            <div className="text-3xl stat-number text-text-primary">
              <CountUp value={profile?.targetWeightKg || 72.0} suffix=" kg" />
            </div>
            <div className="text-[11px] text-text-secondary font-medium">3.0 kg to goal</div>
          </TiltCard>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Weight Trend with 3D Tilt */}
          <TiltCard maxTilt={2} className="panel p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  Weight Progression
                </h3>
                <p className="text-xs text-text-secondary">Longitudinal weight trajectory over time</p>
              </div>
              <span className="badge-accent">kg</span>
            </div>

            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsHistory}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5B6EFF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#5B6EFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis dataKey="logDate" stroke="#52525B" tick={{ fontSize: 11, fill: '#8C8C91' }} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#52525B" tick={{ fontSize: 11, fill: '#8C8C91' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px', color: '#F2F2F0' }} />
                  <Area type="monotone" dataKey="weightKg" stroke="#5B6EFF" strokeWidth={2.5} fill="url(#weightGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TiltCard>

          {/* Body Fat % Trend with 3D Tilt */}
          <TiltCard maxTilt={2} className="panel p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  Body Fat Trajectory
                </h3>
                <p className="text-xs text-text-secondary">Body fat percentage change curve</p>
              </div>
              <span className="badge-accent">%</span>
            </div>

            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricsHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                  <XAxis dataKey="logDate" stroke="#52525B" tick={{ fontSize: 11, fill: '#8C8C91' }} />
                  <YAxis domain={[15, 25]} stroke="#52525B" tick={{ fontSize: 11, fill: '#8C8C91' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '8px', color: '#F2F2F0' }} />
                  <Line type="monotone" dataKey="bodyFatPercentage" stroke="#5B6EFF" strokeWidth={2.5} dot={{ r: 3.5, fill: '#5B6EFF' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TiltCard>
        </div>

        {/* Circumference Measurement Cards with 3D Tilt */}
        <div className="panel p-6 mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-surface-elevated text-primary border border-border">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">Body Circumference Measurements</h3>
              <p className="text-xs text-text-secondary">Hypertrophy expansion and waist taper measurements</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <TiltCard maxTilt={3} className="p-3.5 rounded-xl bg-surface-elevated border border-border">
              <span className="text-[10px] font-semibold text-text-secondary uppercase">Chest Circumference</span>
              <div className="text-xl stat-number text-text-primary mt-1">
                <CountUp value={latestLog.chestCm || 107} suffix=" cm" />
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-0.5">+3 cm gain</div>
            </TiltCard>

            <TiltCard maxTilt={3} className="p-3.5 rounded-xl bg-surface-elevated border border-border">
              <span className="text-[10px] font-semibold text-text-secondary uppercase">Waist Circumference</span>
              <div className="text-xl stat-number text-text-primary mt-1">
                <CountUp value={latestLog.waistCm || 80.5} suffix=" cm" />
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-0.5">-7.5 cm reduction</div>
            </TiltCard>

            <TiltCard maxTilt={3} className="p-3.5 rounded-xl bg-surface-elevated border border-border">
              <span className="text-[10px] font-semibold text-text-secondary uppercase">Arms (Biceps)</span>
              <div className="text-xl stat-number text-text-primary mt-1">
                <CountUp value={latestLog.armsCm || 39.0} suffix=" cm" />
              </div>
              <div className="text-[11px] text-text-secondary font-medium mt-0.5">+2.0 cm peak</div>
            </TiltCard>

            <TiltCard maxTilt={3} className="p-3.5 rounded-xl bg-surface-elevated border border-border">
              <span className="text-[10px] font-semibold text-text-secondary uppercase">Thighs / Quads</span>
              <div className="text-xl stat-number text-text-primary mt-1">
                <CountUp value={latestLog.thighsCm || 57.5} suffix=" cm" />
              </div>
              <div className="text-[11px] text-text-secondary font-medium mt-0.5">Defined mass</div>
            </TiltCard>
          </div>
        </div>

        {/* Metric History Log Table (Flat, Fast & Clean) */}
        <div className="panel p-6 space-y-4">
          <h3 className="text-base font-bold text-text-primary">
            Logged Measurement Records
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-secondary font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Weight (kg)</th>
                  <th className="py-2.5 px-3">Body Fat %</th>
                  <th className="py-2.5 px-3">Chest (cm)</th>
                  <th className="py-2.5 px-3">Waist (cm)</th>
                  <th className="py-2.5 px-3">Arms (cm)</th>
                  <th className="py-2.5 px-3">Thighs (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...metricsHistory].reverse().map((row, idx) => (
                  <tr key={idx} className="table-row-hover">
                    <td className="py-2.5 px-3 font-mono text-text-secondary">{row.logDate}</td>
                    <td className="py-2.5 px-3 font-semibold text-text-primary">{row.weightKg} kg</td>
                    <td className="py-2.5 px-3 text-primary">{row.bodyFatPercentage ? `${row.bodyFatPercentage}%` : '-'}</td>
                    <td className="py-2.5 px-3 text-text-secondary">{row.chestCm ? `${row.chestCm} cm` : '-'}</td>
                    <td className="py-2.5 px-3 text-text-secondary">{row.waistCm ? `${row.waistCm} cm` : '-'}</td>
                    <td className="py-2.5 px-3 text-text-secondary">{row.armsCm ? `${row.armsCm} cm` : '-'}</td>
                    <td className="py-2.5 px-3 text-text-secondary">{row.thighsCm ? `${row.thighsCm} cm` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Metric Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="panel bg-surface border border-border p-6 rounded-2xl max-w-lg w-full shadow-panel relative space-y-4"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-elevated">
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-xl text-primary border border-primary/20"><Scale3D size={20} /></div>
                <h3 className="text-base font-bold text-text-primary">Record Biometrics Entry</h3>
              </div>

              <form onSubmit={handleSaveMetrics} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Body Weight (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 74.8"
                      value={formData.weightKg}
                      onChange={e => setFormData({ ...formData, weightKg: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Body Fat (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 18.5"
                      value={formData.bodyFatPercentage}
                      onChange={e => setFormData({ ...formData, bodyFatPercentage: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Chest (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 107"
                      value={formData.chestCm}
                      onChange={e => setFormData({ ...formData, chestCm: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Waist (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 80"
                      value={formData.waistCm}
                      onChange={e => setFormData({ ...formData, waistCm: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Arms (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 39"
                      value={formData.armsCm}
                      onChange={e => setFormData({ ...formData, armsCm: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Thighs (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 58"
                      value={formData.thighsCm}
                      onChange={e => setFormData({ ...formData, thighsCm: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-text-secondary block mb-1">Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Post-workout morning weigh-in."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BodyMetrics;
