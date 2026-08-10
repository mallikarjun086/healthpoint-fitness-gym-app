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
  Edit,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { toast } from 'sonner';

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
      <Sidebar role="admin" />

      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase text-primary tracking-widest">Admin Control</span>
            </div>
            <h1 className="text-3xl font-bold">Membership & Subscriptions</h1>
            <p className="text-gray-400 mt-1">Configure membership tiers, pricing models, and subscriber perks.</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-premium px-6 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-black" /> Create New Tier
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 border-l-4 border-l-primary">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Active Subscriptions</span>
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-black">162</div>
            <div className="text-xs text-primary font-bold mt-1">100% Payment Fulfillment</div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Monthly Recurring Revenue</span>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black">₹3,40,900</div>
            <div className="text-xs text-blue-400 font-bold mt-1">+18% Growth this quarter</div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-purple-500">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Most Popular Tier</span>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-black">Annual Elite</div>
            <div className="text-xs text-purple-400 font-bold mt-1">62 Active Members</div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 flex flex-col justify-between relative group hover:border-primary/40 transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold uppercase italic">{plan.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {plan.durationDays === 365 ? 'Annual Billing' : 'Monthly Recurring'}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeletePlan(plan.id, plan.name)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-black">₹{plan.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 font-bold ml-1">/ {plan.durationDays} days</span>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold">Subscribers</span>
                <span className="px-3 py-1 bg-primary/10 text-primary font-black text-xs rounded-full">
                  {plan.activeSubscribers} Active
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Plan Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card p-8 w-full max-w-md bg-surface border-border">
              <h3 className="text-2xl font-bold mb-4">Create Membership Tier</h3>
              <form onSubmit={handleAddPlan} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Plan Name</label>
                  <input 
                    type="text" 
                    value={newPlan.name} 
                    onChange={e => setNewPlan({...newPlan, name: e.target.value})}
                    placeholder="e.g. VIP Ultra Pass" 
                    required 
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Price (₹)</label>
                  <input 
                    type="number" 
                    value={newPlan.price} 
                    onChange={e => setNewPlan({...newPlan, price: e.target.value})}
                    placeholder="2499" 
                    required 
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Duration (Days)</label>
                  <select 
                    value={newPlan.durationDays}
                    onChange={e => setNewPlan({...newPlan, durationDays: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm text-white outline-none focus:border-primary"
                  >
                    <option value={30}>30 Days (Monthly)</option>
                    <option value={90}>90 Days (Quarterly)</option>
                    <option value={365}>365 Days (Annual)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Features (Comma Separated)</label>
                  <textarea 
                    value={newPlan.features} 
                    onChange={e => setNewPlan({...newPlan, features: e.target.value})}
                    placeholder="Full access, AI Coaching, Sauna" 
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm text-white outline-none focus:border-primary h-24"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-border text-sm font-bold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-premium text-sm py-3"
                  >
                    Save Tier
                  </button>
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
