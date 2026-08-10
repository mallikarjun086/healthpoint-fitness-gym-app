import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  Download,
  Flame,
  Clock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Droplet,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import AiChatWidget from '../../components/ai/AiChatWidget';

const DietPlans = () => {
  const [profile, setProfile] = useState(null);
  const [dietMeals, setDietMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonalizedDiet();
  }, []);

  const fetchPersonalizedDiet = async () => {
    try {
      const res = await api.get('/goals/my-plan');
      if (res.data && res.data.dietPlanJson) {
        setProfile(res.data);
        try {
          const parsed = JSON.parse(res.data.dietPlanJson);
          setDietMeals(parsed);
        } catch (e) {
          console.error("Error parsing dietPlanJson", e);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch diet plan", err);
      setLoading(false);
    }
  };

  const downloadPlan = () => {
    if (!profile) return;
    const textData = `
HEALTHPOINT FITNESS - SCIENTIFIC NUTRITION PLAN
===================================================
Goal Type: ${profile.goalType || 'AESTHETIC'}
Caloric Target: ${profile.dailyCalories || 2650} kcal/day
Protein Target: ${profile.dailyProtein || 185}g
Carbs Target: ${profile.dailyCarbs || 320}g
Fats Target: ${profile.dailyFat || 75}g

MEAL TIMING & MACRO BREAKDOWN:
---------------------------------------------------
${dietMeals.map(m => `
[${m.mealName}] (${m.timing || 'Daily'})
- Focus: ${m.description}
- Target: ${m.calories} kcal | Protein: ${m.protein}g | Carbs: ${m.carbs}g | Fat: ${m.fat}g
- Menu: ${m.items}
`).join('')}

HYDRATION TARGET: 3.8 Liters Water + Electrolytes
    `;
    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HealthPoint_DietPlan_${profile.goalType || 'Custom'}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="member" />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase text-primary tracking-widest">Precision Nutrition Engine</span>
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tight">Personalized Nutrition & Meal Split</h1>
            <p className="text-gray-400 mt-1">Calculates baseline TDEE, macronutrient partitioning, and anabolic meal timing.</p>
          </div>

          <div className="flex items-center gap-3">
            {profile && (
              <button 
                onClick={downloadPlan} 
                className="btn-secondary text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-primary" /> Export PDF/TXT Receipt
              </button>
            )}
            <Link to="/member/goals" className="btn-premium text-xs flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-black" /> Edit Goal Profile
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : profile && dietMeals.length > 0 ? (
          <div className="space-y-8">
            {/* Macro Header Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 bg-gradient-to-r from-primary/10 via-transparent to-transparent border-l-4 border-l-primary"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Target Calories</div>
                  <div className="text-3xl font-black text-primary italic">{profile.dailyCalories || 2650} <span className="text-xs font-normal text-gray-400">kcal/day</span></div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Protein (2.2g/kg)</div>
                  <div className="text-2xl font-black text-white italic">{profile.dailyProtein || 185}g</div>
                  <div className="text-[10px] text-primary font-bold mt-1">Lean Muscle Repair</div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Carbohydrates</div>
                  <div className="text-2xl font-black text-secondary italic">{profile.dailyCarbs || 320}g</div>
                  <div className="text-[10px] text-secondary font-bold mt-1">Glycogen Replenish</div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Healthy Fats</div>
                  <div className="text-2xl font-black text-orange-400 italic">{profile.dailyFat || 75}g</div>
                  <div className="text-[10px] text-orange-400 font-bold mt-1">Hormonal Health</div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Daily Hydration</div>
                  <div className="text-2xl font-black text-blue-400 italic flex items-center gap-1">
                    <Droplet className="w-5 h-5 text-blue-400 fill-blue-400" /> 3.8 L
                  </div>
                  <div className="text-[10px] text-blue-400 font-bold mt-1">+ Electrolytes</div>
                </div>
              </div>
            </motion.div>

            {/* Meal-by-Meal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dietMeals.map((meal, idx) => (
                <motion.div
                  key={meal.mealName || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="glass-card-interactive p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="badge-lime">
                        {meal.mealName}
                      </span>
                      <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-primary" /> {meal.timing || 'Suggested: 8:00 AM'}
                      </span>
                    </div>

                    <h3 className="text-xl font-black italic text-white uppercase mb-2 group-hover:text-primary transition-colors">
                      {meal.description || 'Nutrient Dense Meal'}
                    </h3>

                    <div className="p-4 rounded-2xl bg-black/40 border border-border mb-6">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Recommended Items</div>
                      <p className="text-xs text-gray-200 leading-relaxed font-medium">
                        {meal.items}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-white/5">
                      <div className="text-[9px] text-gray-400 font-bold">Calories</div>
                      <div className="font-black text-white">{meal.calories}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <div className="text-[9px] font-bold">Protein</div>
                      <div className="font-black">{meal.protein}g</div>
                    </div>
                    <div className="p-2 rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
                      <div className="text-[9px] font-bold">Carbs</div>
                      <div className="font-black">{meal.carbs}g</div>
                    </div>
                    <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      <div className="text-[9px] font-bold">Fat</div>
                      <div className="font-black">{meal.fat}g</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Utensils className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-black italic uppercase mb-3">No Personalized Diet Plan Found</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Complete your goal profile setup to calculate your exact caloric expenditure, macronutrient targets, and meal timing split.
            </p>
            <Link to="/member/goals" className="btn-premium px-8 py-3 text-sm inline-flex items-center gap-2">
              Setup Nutrition Profile <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        )}

        {/* Floating AI Coach Assistant */}
        <AiChatWidget />
      </main>
    </div>
  );
};

export default DietPlans;
