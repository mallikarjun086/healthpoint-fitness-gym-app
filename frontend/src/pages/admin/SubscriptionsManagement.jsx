import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Plus, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Zap, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Trash2,
  X
} from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { toast } from 'sonner';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Shield3D, Dollar3D, Sparkles3D } from '../../components/ui/Icon3D';

const SubscriptionsManagement = () => {
  const [plans, setPlans] = useState([
    { id: 1, name: 'Basic Starter', price: 999, durationDays: 30, activeSubscribers: 45, features: ['Access to Gym Floor', 'Locker Room Access', 'Basic Workout Tracking'] },
    { id: 2, name: 'Pro Fitness', price: 1999, durationDays: 30, activeSubscribers: 55, features: ['Full Gym & Group Classes', 'AI Personal Workout Coach', 'Nutritional Meal Plans'] },
    { id: 3, name: 'Annual Elite Membership', price: 2999, durationDays: 365, activeSubscribers: 62, features: ['All Inclusive VIP Access', 'Dedicated Personal Trainer', 'Priority AI Adaptation', 'Free Sauna & Recovery Suite'] }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', durationDays: 30, features: '' });

  const handleAddPlan = (e) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.price) {
      toast.error('Please complete plan details');
      return;
    }
    const planObj = {
      id: Date.now(),
      name: newPlan.name,
      price: parseFloat(newPlan.price),
      durationDays: parseInt(newPlan.durationDays),
      activeSubscribers: 0,
      features: newPlan.features.split(',').map(f => f.trim()).filter(Boolean)
    };
    setPlans(prev => [...prev, planObj]);
    setIsModalOpen(false);
    setNewPlan({ name: '', price: '', durationDays: 30, features: '' });
    toast.success(`Membership Plan "${planObj.name}" created successfully!`);
  };

  const handleDeletePlan = (id, name) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    toast.success(`Plan "${name}" removed`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <span className="badge-accent text-[10px] mb-1 inline-block">Product Architecture</span>
            <h1 className="heading-xl text-text-primary">Membership & Subscriptions</h1>
            <p className="body-sm text-text-secondary mt-0.5">Configure membership tiers, pricing models, and subscriber perks.</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-2 shadow-accent"
          >
            <Plus className="w-4 h-4" /> Create New Tier
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <TiltCard maxTilt={3} className="panel-card p-5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="caption">Active Subscriptions</span>
              <Shield3D size={20} />
            </div>
            <div className="stat-display text-2xl sm:text-3xl text-text-primary">
              <CountUp target={162} />
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">100% Payment Fulfillment</div>
          </TiltCard>

          <TiltCard maxTilt={3} className="panel-card p-5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="caption">Monthly Recurring Revenue</span>
              <Dollar3D size={20} />
            </div>
            <div className="stat-display text-2xl sm:text-3xl text-text-primary">
              <CountUp target={340900} prefix="₹" />
            </div>
            <div className="text-[11px] text-primary font-medium">+18% Growth this quarter</div>
          </TiltCard>

          <TiltCard maxTilt={3} className="panel-card p-5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="caption">Most Popular Tier</span>
              <Sparkles3D size={20} />
            </div>
            <div className="text-xl font-bold text-text-primary font-display mt-1">Annual Elite</div>
            <div className="text-[11px] text-text-muted">62 active athletes enrolled</div>
          </TiltCard>
        </div>

        {/* Membership Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <TiltCard key={plan.id} maxTilt={3} className="panel-card p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary font-display">{plan.name}</h3>
                    <div className="text-2xl font-black stat-display text-primary mt-1">
                      ₹{plan.price.toLocaleString()}
                      <span className="text-xs text-text-muted font-normal"> / {plan.durationDays} days</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeletePlan(plan.id, plan.name)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="caption">Included Perks:</div>
                  <ul className="space-y-1.5 text-xs text-text-secondary">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-text-muted font-medium">{plan.activeSubscribers} Active Members</span>
                <span className="badge-accent">{plan.durationDays} Days</span>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="panel-elevated max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="heading-md text-text-primary font-display">Create Membership Tier</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddPlan} className="space-y-3">
                <div className="space-y-1">
                  <label className="caption">Plan Name</label>
                  <input
                    type="text"
                    required
                    value={newPlan.name}
                    onChange={e => setNewPlan({...newPlan, name: e.target.value})}
                    placeholder="e.g. Semi-Annual VIP"
                    className="w-full bg-surface-elevated border border-border rounded-xl py-2 px-3 text-xs text-text-primary outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="caption">Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={newPlan.price}
                      onChange={e => setNewPlan({...newPlan, price: e.target.value})}
                      placeholder="2499"
                      className="w-full bg-surface-elevated border border-border rounded-xl py-2 px-3 text-xs text-text-primary outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="caption">Duration (Days)</label>
                    <input
                      type="number"
                      required
                      value={newPlan.durationDays}
                      onChange={e => setNewPlan({...newPlan, durationDays: e.target.value})}
                      placeholder="30"
                      className="w-full bg-surface-elevated border border-border rounded-xl py-2 px-3 text-xs text-text-primary outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="caption">Features (Comma-separated)</label>
                  <textarea
                    rows={3}
                    value={newPlan.features}
                    onChange={e => setNewPlan({...newPlan, features: e.target.value})}
                    placeholder="Free Weights, AI Workout Coach, Sauna Pass"
                    className="w-full bg-surface-elevated border border-border rounded-xl py-2 px-3 text-xs text-text-primary outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">Cancel</button>
                  <button type="submit" className="btn-primary shadow-accent">Save Tier</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubscriptionsManagement;
