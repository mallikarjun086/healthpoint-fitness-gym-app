import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  Utensils, 
  Target, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Zap, 
  RefreshCw,
  Clock,
  ShieldCheck
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Sparkles3D, Dumbbell3D, Utensils3D, Zap3D } from '../../components/ui/Icon3D';

const AiPlanner = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' or 'nutrition'

  const [formData, setFormData] = useState({
    primaryGoal: 'Lean Muscle Hypertrophy',
    experienceLevel: 'INTERMEDIATE',
    daysPerWeek: 5,
    equipment: 'FULL_GYM',
    gender: 'MALE',
    age: 26,
    heightCm: 178,
    weightKg: 75,
    targetWeightKg: 72,
    dietPreference: 'NON_VEG',
    activityLevel: 'VERY_ACTIVE'
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      generateAiPlan();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const generateAiPlan = async () => {
    setIsGenerating(true);
    setCurrentStep(4);

    try {
      let backendGoal = 'AESTHETIC';
      if (formData.primaryGoal.includes('Strength')) backendGoal = 'STRENGTH';
      else if (formData.primaryGoal.includes('Powerlifting')) backendGoal = 'POWERLIFTING';
      else if (formData.primaryGoal.includes('Functional') || formData.primaryGoal.includes('Sports')) backendGoal = 'SPORTS';
      else if (formData.primaryGoal.includes('Fat Loss')) backendGoal = 'AESTHETIC';

      const payload = {
        heightCm: formData.heightCm,
        weightKg: formData.weightKg,
        experienceLevel: formData.experienceLevel,
        goalType: backendGoal,
        sportName: formData.primaryGoal
      };

      const res = await api.post('/goals/setup', payload);
      const data = res.data;

      let parsedWorkout = [];
      let parsedDiet = [];

      try {
        if (data.workoutPlan) parsedWorkout = JSON.parse(data.workoutPlan);
      } catch (e) {
        console.error('Error parsing workout plan', e);
      }

      try {
        if (data.dietPlan) parsedDiet = JSON.parse(data.dietPlan);
      } catch (e) {
        console.error('Error parsing diet plan', e);
      }

      const bmr = formData.gender === 'MALE' 
        ? (10 * formData.weightKg) + (6.25 * formData.heightCm) - (5 * formData.age) + 5
        : (10 * formData.weightKg) + (6.25 * formData.heightCm) - (5 * formData.age) - 161;
      const tdee = Math.round(bmr * 1.6);

      // Orchestrated generation timing for smooth reveal
      setTimeout(() => {
        setGeneratedPlan({
          bmr: Math.round(bmr),
          tdee,
          targetCalories: data.dailyCalories || 2650,
          targetProtein: data.dailyProtein || 185,
          targetCarbs: data.dailyCarbs || 280,
          targetFat: data.dailyFat || 65,
          workoutSplit: parsedWorkout.length > 0 ? parsedWorkout.map(w => ({
            day: w.day,
            focus: w.focus,
            exercises: w.exercises,
            intensity: `${w.sets} sets • ${w.reps} reps`
          })) : [
            { day: 'Day 1 (Monday)', focus: 'Push: Upper Chest & Lateral Delts', exercises: 'Incline DB Press, Flat Barbell Bench, Standing Cable Lateral Raise, Overhead Rope Tricep Extension', intensity: '4 sets • 8-12 reps' },
            { day: 'Day 2 (Tuesday)', focus: 'Pull: Lats & Posterior Chain', exercises: 'Weighted Neutral Pull-ups, Chest-Supported Row, Face Pulls, Incline Dumbbell Bicep Curl', intensity: '4 sets • 8-12 reps' },
            { day: 'Day 3 (Wednesday)', focus: 'Legs: Quad Dominance & Calves', exercises: 'High-Bar Back Squat, Romanian Deadlift (RDL), Bulgarian Split Squats, Standing Calf Raise', intensity: '4 sets • 10-12 reps' },
            { day: 'Day 4 (Thursday)', focus: 'Active Recovery & Core Decompression', exercises: '90/90 Hip Mobility Flow, Foam Rolling, Hanging Leg Raises, Zone 2 Walk', intensity: 'Active Rest' },
            { day: 'Day 5 (Friday)', focus: 'Upper Body Hypertrophy Specialization', exercises: 'Standing Overhead Press, Low-to-High Cable Fly, Single-Arm DB Row, Skull Crushers', intensity: '4 sets • 10-15 reps' },
            { day: 'Day 6 (Saturday)', focus: 'Lower Body Posterior & Hamstrings', exercises: 'Barbell Hip Thrust, Stiff-Leg Deadlift, Lying Leg Curl, Ab Wheel Rollouts', intensity: '4 sets • 10-15 reps' },
            { day: 'Day 7 (Sunday)', focus: 'Full Central Nervous System Recovery', exercises: 'Complete Rest, Sleep Optimization & Hydration Protocol', intensity: 'Full Rest' }
          ],
          mealSchedule: parsedDiet.length > 0 ? parsedDiet.map(d => ({
            time: d.timing || 'Daily',
            meal: d.mealName,
            items: d.items,
            cals: Math.round((data.dailyCalories || 2650) / parsedDiet.length),
            protein: Math.round((data.dailyProtein || 185) / parsedDiet.length)
          })) : [
            { time: '08:00 AM', meal: 'Breakfast Fuel', items: 'Oatmeal with Whey Isolate, 4 Egg Whites + 2 Whole Eggs, Raw Almonds & Blueberries', cals: 580, protein: 48 },
            { time: '01:00 PM', meal: 'Hypertrophy Lunch', items: 'Grilled Chicken Breast / Low-Fat Paneer (180g), Brown Jasmine Rice (150g), Steamed Broccoli & Olive Oil', cals: 640, protein: 56 },
            { time: '05:00 PM', meal: 'Pre-Workout Fuel', items: 'Sourdough Toast with Natural Peanut Butter, 1 Ripe Banana, Pinch of Himalayan Pink Salt', cals: 340, protein: 14 },
            { time: '08:30 PM', meal: 'Anabolic Dinner', items: 'Wild Caught Salmon / Sprouted Moong Dal, Steamed Sweet Potatoes, Greek Yogurt Cucumber Salad', cals: 680, protein: 50 }
          ]
        });
        setIsGenerating(false);
      }, 1200);

    } catch (err) {
      console.error('Plan generation error', err);
      setIsGenerating(false);
    }
  };

  const handleApplyToDashboard = () => {
    toast.success('AI Periodized Blueprint applied to your dashboard!');
    navigate('/member/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-hero flex items-center gap-1.5">
              <Sparkles3D size={16} /> AI Training Architect
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Periodized AI Plan Wizard</h1>
          <p className="text-xs text-text-secondary mt-0.5">Synthesize an anthropometrically calibrated training split and precision nutrition chart.</p>
        </header>

        {currentStep < 4 ? (
          /* Multi-Step Wizard Configuration */
          <div className="max-w-3xl panel p-6 space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              {[
                { step: 1, label: 'Goal & Frequency' },
                { step: 2, label: 'Anthropometrics' },
                { step: 3, label: 'Equipment & Nutrition' }
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                    currentStep === s.step 
                      ? 'bg-primary text-white' 
                      : currentStep > s.step 
                      ? 'bg-surface-elevated text-emerald-400 border border-emerald-500/30' 
                      : 'bg-surface-elevated text-text-secondary border border-border'
                  }`}>
                    {currentStep > s.step ? '✓' : s.step}
                  </div>
                  <span className={`text-xs font-medium hidden sm:inline ${currentStep === s.step ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Goal & Frequency */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-2.5">Primary Focus Objective</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'Lean Muscle Hypertrophy', desc: 'Maximize myofibrillar hypertrophy and upper body aesthetics' },
                      { id: 'Aggressive Fat Loss & Shred', desc: 'Caloric deficit preserving functional lean muscle tissue' },
                      { id: 'Powerlifting & Absolute Strength', desc: 'Peak 1RM squat, bench press, and deadlift output' },
                      { id: 'Functional Longevity & Conditioning', desc: 'VO2 max endurance, joint mobility, and core integrity' }
                    ].map(g => (
                      <div
                        key={g.id}
                        onClick={() => setFormData({ ...formData, primaryGoal: g.id })}
                        className={`p-3.5 rounded-xl cursor-pointer border transition-all text-xs ${
                          formData.primaryGoal === g.id
                            ? 'bg-primary/10 border-primary text-text-primary font-medium'
                            : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary hover:border-border-light'
                        }`}
                      >
                        <h4 className="font-semibold text-text-primary mb-1">{g.id}</h4>
                        <p className="text-[11px] text-text-secondary leading-relaxed">{g.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">Experience Level</label>
                    <select
                      value={formData.experienceLevel}
                      onChange={e => setFormData({ ...formData, experienceLevel: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    >
                      <option value="BEGINNER">Beginner (&lt; 1 Year)</option>
                      <option value="INTERMEDIATE">Intermediate (1 - 3 Years)</option>
                      <option value="ADVANCED">Advanced Athlete (3+ Years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">Weekly Split Frequency</label>
                    <select
                      value={formData.daysPerWeek}
                      onChange={e => setFormData({ ...formData, daysPerWeek: parseInt(e.target.value) })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    >
                      <option value={3}>3 Days Split (Full Body Alternating)</option>
                      <option value={4}>4 Days Split (Upper / Lower)</option>
                      <option value={5}>5 Days Split (PPL / Upper / Lower)</option>
                      <option value={6}>6 Days Split (Push / Pull / Legs x 2)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Anthropometrics */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">Height (cm)</label>
                    <input
                      type="number"
                      value={formData.heightCm}
                      onChange={e => setFormData({ ...formData, heightCm: parseFloat(e.target.value) || 170 })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">Current Weight (kg)</label>
                    <input
                      type="number"
                      value={formData.weightKg}
                      onChange={e => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 70 })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">Target Weight (kg)</label>
                    <input
                      type="number"
                      value={formData.targetWeightKg}
                      onChange={e => setFormData({ ...formData, targetWeightKg: parseFloat(e.target.value) || 70 })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none font-mono"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Equipment & Nutrition */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1.5">Available Equipment</label>
                  <select
                    value={formData.equipment}
                    onChange={e => setFormData({ ...formData, equipment: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                  >
                    <option value="FULL_GYM">Commercial Gym (Barbells, Cables, Machines, Dumbbells)</option>
                    <option value="HOME_DUMBBELLS">Home Setup (Adjustable DBs, Pull-up Bar, Bench)</option>
                    <option value="BODYWEIGHT">Calisthenics & Bodyweight Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1.5">Dietary Protocol</label>
                  <select
                    value={formData.dietPreference}
                    onChange={e => setFormData({ ...formData, dietPreference: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                  >
                    <option value="NON_VEG">High-Protein Omnivore (Chicken, Fish, Eggs, Whey)</option>
                    <option value="VEG">Vegetarian (Paneer, Tofu, Greek Yogurt, Lentils, Whey)</option>
                    <option value="VEGAN">Plant-Based Vegan (Soy, Seitan, Pea Protein, Chickpeas)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Wizard Navigation Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
              {currentStep > 1 ? (
                <button onClick={handleBack} className="btn-secondary">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : <div />}

              <button
                onClick={handleNext}
                className={currentStep === 3 ? "btn-hero" : "btn-primary"}
              >
                {currentStep === 3 ? (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-white" /> Synthesize AI Blueprint
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : isGenerating ? (
          /* Orchestrated AI Reveal Synthesis Animation */
          <div className="panel p-16 max-w-xl mx-auto text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div 
                className="absolute inset-0 rounded-full border-4 border-t-primary border-r-accent-violet border-b-transparent border-l-transparent animate-spin"
                style={{ animationDuration: '1.2s' }}
              />
              <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center shadow-inner">
                <Sparkles3D size={28} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-text-primary">Architecting Neural Split</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                Calculating BMR/TDEE metabolic balance, periodized volume distribution, and exercise biomechanics...
              </p>
            </div>
          </div>
        ) : (
          /* High-Impact AI Plan Reveal Display */
          generatedPlan && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Macro & Metabolic Scoreboard with 3D Tilt & Count-up */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <TiltCard maxTilt={3} className="panel p-4 bg-gradient-hero-subtle border-primary/30">
                  <div className="text-[11px] text-text-secondary font-medium">Daily Caloric Target</div>
                  <div className="text-3xl stat-number text-primary mt-1">
                    <CountUp value={generatedPlan.targetCalories} suffix=" kcal" />
                  </div>
                  <div className="text-[10px] text-text-secondary mt-1">BMR: {generatedPlan.bmr} • TDEE: {generatedPlan.tdee}</div>
                </TiltCard>

                <TiltCard maxTilt={3} className="panel p-4">
                  <div className="text-[11px] text-text-secondary font-medium">Protein Target (2.2g/kg)</div>
                  <div className="text-3xl stat-number text-text-primary mt-1">
                    <CountUp value={generatedPlan.targetProtein} suffix="g" />
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium mt-1">Muscle Protein Synthesis</div>
                </TiltCard>

                <TiltCard maxTilt={3} className="panel p-4">
                  <div className="text-[11px] text-text-secondary font-medium">Carbohydrate Fuel</div>
                  <div className="text-3xl stat-number text-text-primary mt-1">
                    <CountUp value={generatedPlan.targetCarbs} suffix="g" />
                  </div>
                  <div className="text-[10px] text-text-secondary mt-1">Glycogen Replenishment</div>
                </TiltCard>

                <TiltCard maxTilt={3} className="panel p-4">
                  <div className="text-[11px] text-text-secondary font-medium">Essential Lipids</div>
                  <div className="text-3xl stat-number text-text-primary mt-1">
                    <CountUp value={generatedPlan.targetFat} suffix="g" />
                  </div>
                  <div className="text-[10px] text-text-secondary mt-1">Hormonal Support</div>
                </TiltCard>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <button
                  onClick={() => setActiveTab('workout')}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'workout'
                      ? 'bg-primary text-white font-semibold shadow-sm'
                      : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Dumbbell3D size={16} />
                  <span>Periodized Training Split (7 Days)</span>
                </button>

                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'nutrition'
                      ? 'bg-primary text-white font-semibold shadow-sm'
                      : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Utensils3D size={16} />
                  <span>Precision Nutrition & Meal Schedule</span>
                </button>
              </div>

              {/* Workout Split Content */}
              {activeTab === 'workout' ? (
                <div className="space-y-3">
                  {generatedPlan.workoutSplit.map((day, idx) => (
                    <div 
                      key={idx} 
                      className="panel p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 table-row-hover hover:border-border-light transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="badge-muted">{day.day}</span>
                          <h4 className="text-sm font-semibold text-text-primary">{day.focus}</h4>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed pl-1">{day.exercises}</p>
                      </div>

                      <div className="shrink-0 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-[11px] font-mono text-primary font-medium">
                        {day.intensity}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedPlan.mealSchedule.map((meal, idx) => (
                    <TiltCard key={idx} maxTilt={2} className="panel p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="badge-hero">{meal.time} • {meal.meal}</span>
                        <span className="stat-number text-xs text-primary">{meal.cals} kcal ({meal.protein}g Protein)</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed pt-1">{meal.items}</p>
                    </TiltCard>
                  ))}
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="btn-secondary w-full sm:w-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-Configure Parameters
                </button>

                <button
                  onClick={handleApplyToDashboard}
                  className="btn-hero w-full sm:w-auto"
                >
                  <CheckCircle2 className="w-4 h-4" /> Apply Blueprint to Member Dashboard
                </button>
              </div>
            </motion.div>
          )
        )}
      </main>
    </div>
  );
};

export default AiPlanner;
