import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Utensils, 
  ChevronRight, 
  Download,
  Flame,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';

const DietPlans = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (activeTab === 'ALL') {
      setFilteredPlans(plans);
    } else {
      setFilteredPlans(plans.filter(p => p.mealType === activeTab));
    }
  }, [activeTab, plans]);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/diet/all');
      setPlans(res.data);
      setFilteredPlans(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch diet plans", err);
      setLoading(false);
    }
  };

  const downloadPlan = (plan) => {
    const content = `
HEALTHPOINT FITNESS - DIET PLAN
================================
Title: ${plan.title}
Meal Type: ${plan.mealType}
Total Calories: ${plan.calories} kcal

NUTRITION BREAKDOWN:
- Protein: ${plan.protein}g
- Carbs: ${plan.carbs}g
- Fats: ${plan.fat}g

MEAL ITEMS:
${plan.items.split(',').map(item => `• ${item.trim()}`).join('\n')}

NOTES:
- Drink at least 3-4 liters of water daily.
- Consistency is key to seeing results.
- Consult with your trainer before making major changes.
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plan.title.replace(/\s+/g, '_')}_Plan.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="member" />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Nutrition Plans</h1>
            <p className="text-gray-400 mt-1">Specialized meal protocols for your goals.</p>
          </div>
          <div className="flex gap-4 p-1 bg-surface border border-border rounded-2xl">
            {['ALL', 'VEG', 'NON_VEG'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab 
                  ? 'bg-primary text-black' 
                  : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card group overflow-hidden border-t-4 border-t-transparent hover:border-t-primary transition-all duration-500"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${plan.mealType === 'VEG' ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                      {plan.mealType === 'VEG' ? (
                        <Leaf className="w-6 h-6 text-green-500" />
                      ) : (
                        <Utensils className="w-6 h-6 text-orange-500" />
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Calories</span>
                      <span className="text-2xl font-black text-primary">{plan.calories}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{plan.title}</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed italic border-l-2 border-primary/20 pl-4">
                    "{plan.description}"
                  </p>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5 group-hover:border-primary/20 transition-all">
                      <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Protein</div>
                      <div className="text-lg font-black">{plan.protein}g</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5 group-hover:border-primary/20 transition-all">
                      <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Carbs</div>
                      <div className="text-lg font-black">{plan.carbs}g</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5 group-hover:border-primary/20 transition-all">
                      <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Fat</div>
                      <div className="text-lg font-black">{plan.fat}g</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" /> Recommended Items
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {plan.items.split(',').map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">
                          {item.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-white/5">
                    <button 
                      onClick={() => downloadPlan(plan)}
                      className="flex-1 bg-white/5 border border-white/10 hover:border-primary/50 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4 text-primary" /> Download PDF
                    </button>
                    <button className="flex-1 bg-primary text-black font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                      Activate Plan <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Nutrition Tips */}
        <section className="mt-16">
          <div className="glass-card p-8 bg-gradient-to-r from-primary/10 to-transparent flex flex-col md:flex-row items-center gap-8">
            <div className="p-6 rounded-3xl bg-primary text-black">
              <Clock className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Meal Timing is Crucial</h3>
              <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
                For optimal results, try to consume your high-protein meals within 2 hours of your workout. This triggers the anabolic phase and speeds up muscle recovery.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DietPlans;
