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
          const normalized = Array.isArray(parsed) ? parsed.map(m => {
            if (m.name && Array.isArray(m.items)) {
              const cals = m.items.reduce((s, i) => s + (parseFloat(i.calories) || 0), 0);
              const prot = m.items.reduce((s, i) => s + (parseFloat(i.protein) || 0), 0);
              const itemsStr = m.items.map(i => `${i.food} (${i.quantity || ''})`).join(', ');
              return {
                mealName: m.name,
                timing: m.time || 'Daily',
                description: `${m.name} — Assigned by Master Trainer`,
                calories: cals,
                protein: prot,
                carbs: Math.round(cals * 0.45 / 4),
                fat: Math.round(cals * 0.25 / 9),
                items: itemsStr
              };
            }
            return m;
          }) : [];
          setDietMeals(normalized);
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
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-6 sm:p-8 relative overflow-hidden">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent">Precision Nutrition</span>
            </div>
            <h1 className="heading-xl text-text-primary">Personalized Nutrition & Meal Split</h1>
            <p className="body-sm text-text-secondary mt-0.5">Calculates baseline TDEE, macronutrient partitioning, and anabolic meal timing.</p>
          </div>

          <div className="flex items-center gap-3">
            {profile && (
              <button 
                onClick={downloadPlan} 
                className="btn-secondary"
              >
                <Download className="w-3.5 h-3.5 text-primary" /> Export Nutrition Plan
              </button>
            )}
            <Link to="/member/goals" className="btn-primary">
              <RefreshCw className="w-3.5 h-3.5" /> Edit Goal Profile
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : profile && dietMeals.length > 0 ? (
          <div className="space-y-8">
            {/* Macro Header Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel-card p-6 border-l-4 border-l-primary"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div>
                  <div className="caption mb-1">Target Calories</div>
                  <div className="text-2xl stat-display text-primary">{profile.dailyCalories || 2650} <span className="text-xs font-normal text-text-secondary">kcal/day</span></div>
                </div>

                <div>
                  <div className="caption mb-1">Protein (2.2g/kg)</div>
                  <div className="text-2xl stat-display text-text-primary">{profile.dailyProtein || 185}g</div>
                  <div className="text-[10px] text-primary font-medium mt-0.5">Muscle Synthesis</div>
                </div>

                <div>
                  <div className="caption mb-1">Carbohydrates</div>
                  <div className="text-2xl stat-display text-text-secondary">{profile.dailyCarbs || 320}g</div>
                  <div className="text-[10px] text-text-muted font-medium mt-0.5">Glycogen Replenish</div>
                </div>

                <div>
                  <div className="caption mb-1">Healthy Fats</div>
                  <div className="text-2xl stat-display text-amber-400">{profile.dailyFat || 75}g</div>
                  <div className="text-[10px] text-amber-400/80 font-medium mt-0.5">Hormonal Health</div>
                </div>

                <div>
                  <div className="caption mb-1">Daily Hydration</div>
                  <div className="text-2xl stat-display text-blue-400 flex items-center gap-1">
                    <Droplet className="w-4 h-4 text-blue-400 fill-blue-400" /> 3.8 L
                  </div>
                  <div className="text-[10px] text-blue-400/80 font-medium mt-0.5">+ Electrolytes</div>
                </div>
              </div>
            </motion.div>

            {/* Meal-by-Meal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dietMeals.map((meal, idx) => (
                <motion.div
                  key={meal.mealName || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="panel-card p-6 flex flex-col justify-between group hover:border-border-light transition-all"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="badge-accent">
                        {meal.mealName}
                      </span>
                      <span className="text-xs text-text-secondary font-medium flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-primary" /> {meal.timing || 'Suggested: 8:00 AM'}
                      </span>
                    </div>

                    <h3 className="heading-md text-text-primary mb-3 group-hover:text-primary transition-colors">
                      {meal.description || 'Nutrient Dense Meal'}
                    </h3>

                    <div className="p-3.5 rounded-xl bg-surface-elevated border border-border mb-4">
                      <div className="caption mb-1.5">Recommended Items</div>
                      <p className="text-xs text-text-primary leading-relaxed font-medium">
                        {meal.items}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-surface-elevated border border-border">
                      <div className="caption">Calories</div>
                      <div className="stat-display text-text-primary mt-0.5">{meal.calories}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <div className="text-[10px] font-semibold text-primary">Protein</div>
                      <div className="stat-display mt-0.5">{meal.protein}g</div>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-elevated border border-border">
                      <div className="caption">Carbs</div>
                      <div className="stat-display text-text-secondary mt-0.5">{meal.carbs}g</div>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-elevated border border-border">
                      <div className="caption">Fat</div>
                      <div className="stat-display text-text-secondary mt-0.5">{meal.fat}g</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="panel-card p-12 text-center max-w-lg mx-auto my-12 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center mx-auto text-primary">
              <Utensils className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="heading-lg text-text-primary">No Personalized Diet Plan Found</h2>
              <p className="body-sm text-text-secondary leading-relaxed">
                Complete your goal profile setup to calculate your exact caloric expenditure, macronutrient targets, and meal timing split.
              </p>
            </div>
            <div>
              <Link to="/member/goals" className="btn-primary px-6 py-2.5">
                Setup Nutrition Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Floating AI Coach Assistant */}
        <AiChatWidget />
      </main>
    </div>
  );
};

export default DietPlans;
