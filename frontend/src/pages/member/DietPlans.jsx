import { motion } from 'framer-motion';
import { 
  Utensils, 
  Download,
  Flame,
  Clock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';

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
    const content = `
HEALTHPOINT FITNESS - PERSONALIZED DIET PLAN
=============================================
Goal Type: ${profile.goalType}
Target Calories: ${profile.dailyCalories} kcal/day

DAILY MACRONUTRIENT TARGETS:
- Protein: ${profile.dailyProtein}g
- Carbs: ${profile.dailyCarbs}g
- Fats: ${profile.dailyFat}g

MEAL TIMINGS & FOOD ITEMS:
${dietMeals.map(m => `\n[${m.mealName} - ${m.time}]\nItems: ${m.items}\nNotes: ${m.notes}`).join('\n')}

NOTES:
- Drink at least 3-4 liters of water daily.
- Consistency is key to seeing results.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HealthPoint_DietPlan_${profile.goalType}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="member" />

      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase text-primary tracking-widest">Personalized Macro & Meal Plan</span>
            </div>
            <h1 className="text-3xl font-bold">Your Custom Nutrition Plan</h1>
            <p className="text-gray-400 mt-1">Calculated specifically for your body weight, BMI, and daily energy expenditure.</p>
          </div>

          <div className="flex items-center gap-3">
            {profile && (
              <button onClick={downloadPlan} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-2 hover:bg-white/10 transition-colors">
                <Download className="w-4 h-4 text-primary" /> Download PDF / TXT
              </button>
            )}
            <Link to="/member/goals" className="btn-premium px-6 py-2.5 text-xs flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-black" /> Re-Calculate
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : profile && dietMeals.length > 0 ? (
          <div className="space-y-8">
            {/* Person-Specific Macro Targets Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent border-l-4 border-l-primary"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <span className="text-xs font-black text-primary uppercase tracking-widest">Target Daily Energy</span>
                  <h2 className="text-4xl font-black italic">{profile.dailyCalories} <span className="text-lg font-normal text-gray-400">kcal/day</span></h2>
                </div>
                <div className="flex gap-4">
                  <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Protein</div>
                    <div className="text-xl font-bold text-blue-400">{profile.dailyProtein}g</div>
                  </div>
                  <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Carbs</div>
                    <div className="text-xl font-bold text-amber-400">{profile.dailyCarbs}g</div>
                  </div>
                  <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Fats</div>
                    <div className="text-xl font-bold text-rose-400">{profile.dailyFat}g</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Meal Timings & Items Schedule */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dietMeals.map((meal, i) => (
                <motion.div
                  key={meal.mealName || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-6 flex flex-col justify-between hover:border-primary/40 transition-all border-t-2 border-t-emerald-500/30"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                        {meal.mealName}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-gray-400" /> {meal.time}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Food Selection</div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm font-semibold text-gray-200 leading-relaxed">
                        {meal.items}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-xs text-gray-400">
                    <strong className="text-primary">Tip:</strong> {meal.notes}
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
            <h2 className="text-2xl font-bold mb-3">No Custom Diet Plan Found</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Complete your goal profile setup to calculate your exact caloric & macro targets and generate your custom meal plan.
            </p>
            <Link to="/member/goals" className="btn-premium px-8 py-3 text-sm inline-flex items-center gap-2">
              Setup Your Goal Profile <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default DietPlans;
