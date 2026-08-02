import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Target, ArrowRight, ArrowLeft, User, Ruler, Weight,
  Dumbbell, Trophy, Flame, Zap, Medal, Activity,
  CheckCircle2, Sparkles, ChevronRight
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';

const STEPS = ['Personal Info', 'Experience', 'Choose Goal', 'Your Plan'];

const GOALS = [
  { id: 'COMPETITION', label: 'Competition Prep', desc: 'Stage-ready physique for bodybuilding shows', icon: Trophy, color: 'from-yellow-500 to-orange-500', accent: 'text-yellow-400' },
  { id: 'AESTHETIC', label: 'Aesthetic Body', desc: 'Lean, proportionate & visually stunning physique', icon: Flame, color: 'from-pink-500 to-rose-500', accent: 'text-pink-400' },
  { id: 'STRENGTH', label: 'Strength Training', desc: 'Maximize raw strength across all lifts', icon: Zap, color: 'from-blue-500 to-cyan-500', accent: 'text-blue-400' },
  { id: 'POWERLIFTING', label: 'Powerlifting', desc: 'Squat, Bench, Deadlift — chase numbers', icon: Medal, color: 'from-red-500 to-orange-600', accent: 'text-red-400' },
  { id: 'SPORTS', label: 'Sports Performance', desc: 'Train for your specific sport & competitions', icon: Activity, color: 'from-green-500 to-emerald-500', accent: 'text-green-400' },
];

const EXPERIENCE_LEVELS = [
  { id: 'BEGINNER', label: 'Beginner', desc: '0–1 year of training', emoji: '🌱' },
  { id: 'INTERMEDIATE', label: 'Intermediate', desc: '1–3 years of training', emoji: '💪' },
  { id: 'ADVANCED', label: 'Advanced', desc: '3+ years of serious training', emoji: '🔥' },
];

const GoalSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    heightCm: '', weightKg: '', experienceLevel: '', goalType: '', sportName: ''
  });

  const canNext = () => {
    if (step === 0) return formData.heightCm && formData.weightKg;
    if (step === 1) return formData.experienceLevel;
    if (step === 2) {
      if (formData.goalType === 'SPORTS') return formData.sportName;
      return formData.goalType;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        heightCm: parseFloat(formData.heightCm),
        weightKg: parseFloat(formData.weightKg),
        experienceLevel: formData.experienceLevel,
        goalType: formData.goalType,
        sportName: formData.sportName || null
      };
      const res = await api.post('/goals/setup', payload);
      setPlan(res.data);
      setStep(3);
      toast.success('Your personalized plan is ready!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 2) { handleSubmit(); return; }
    setStep(s => Math.min(s + 1, 3));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const parseJson = (str) => { try { return JSON.parse(str); } catch { return []; } };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="member" />
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Background auras */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-64 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Goal Setup Wizard</span>
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Build Your <span className="text-primary">Perfect Plan</span>
          </h1>
          <p className="text-gray-400 mt-2">Tell us about yourself and we'll craft a personalized workout & diet plan</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                i < step ? 'bg-primary/20 text-primary' :
                i === step ? 'bg-primary text-black' :
                'bg-white/5 text-gray-500'
              }`}>
                {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
                <span className="hidden md:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-primary' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepPersonalInfo key="step0" formData={formData} setFormData={setFormData} />
          )}
          {step === 1 && (
            <StepExperience key="step1" formData={formData} setFormData={setFormData} />
          )}
          {step === 2 && (
            <StepGoal key="step2" formData={formData} setFormData={setFormData} />
          )}
          {step === 3 && plan && (
            <StepPlanResult key="step3" plan={plan} parseJson={parseJson} navigate={navigate} />
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between mt-8 max-w-3xl">
            <button onClick={prevStep} disabled={step === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-wider transition-all ${
                step === 0 ? 'opacity-30 cursor-not-allowed text-gray-500' : 'text-gray-300 hover:text-white hover:bg-white/5 border border-border'
              }`}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={nextStep} disabled={!canNext() || loading}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold uppercase text-sm tracking-wider transition-all ${
                canNext() && !loading
                  ? 'bg-gradient-to-r from-primary to-blue-500 text-black hover:scale-105 shadow-lg shadow-primary/20'
                  : 'opacity-30 cursor-not-allowed bg-white/10 text-gray-500'
              }`}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Generating...</>
              ) : step === 2 ? (
                <><Sparkles className="w-4 h-4" /> Generate My Plan</>
              ) : (
                <>Next <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

/* ──────── STEP 0: Personal Info ──────── */
const StepPersonalInfo = ({ formData, setFormData }) => (
  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
    className="max-w-3xl grid md:grid-cols-2 gap-6">
    <div className="glass-card p-6 group hover:border-primary/30 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
          <Ruler className="w-6 h-6" />
        </div>
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Height</label>
          <p className="text-[10px] text-gray-600">In centimeters</p>
        </div>
      </div>
      <input type="number" placeholder="e.g. 175" value={formData.heightCm}
        onChange={e => setFormData({ ...formData, heightCm: e.target.value })}
        className="w-full bg-background border border-border rounded-xl py-4 px-4 text-2xl font-black text-white outline-none focus:border-primary/50 transition-all" />
      <p className="text-[10px] text-gray-600 mt-2">
        {formData.heightCm && `${(formData.heightCm / 30.48).toFixed(1)} feet`}
      </p>
    </div>

    <div className="glass-card p-6 group hover:border-primary/30 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
          <Weight className="w-6 h-6" />
        </div>
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Weight</label>
          <p className="text-[10px] text-gray-600">In kilograms</p>
        </div>
      </div>
      <input type="number" placeholder="e.g. 75" value={formData.weightKg}
        onChange={e => setFormData({ ...formData, weightKg: e.target.value })}
        className="w-full bg-background border border-border rounded-xl py-4 px-4 text-2xl font-black text-white outline-none focus:border-primary/50 transition-all" />
      <p className="text-[10px] text-gray-600 mt-2">
        {formData.weightKg && `${(formData.weightKg * 2.205).toFixed(1)} lbs`}
      </p>
    </div>

    {formData.heightCm && formData.weightKg && (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="md:col-span-2 glass-card p-6 bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-l-primary">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-black text-primary">
            {(formData.weightKg / ((formData.heightCm / 100) ** 2)).toFixed(1)}
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-gray-400">Your BMI</div>
            <div className="text-sm text-gray-400">
              {(() => {
                const bmi = formData.weightKg / ((formData.heightCm / 100) ** 2);
                if (bmi < 18.5) return 'Underweight — we\'ll help you build mass';
                if (bmi < 25) return 'Normal range — great foundation to build on';
                if (bmi < 30) return 'Overweight — let\'s optimize your body composition';
                return 'Obese range — we\'ll create a safe progressive plan';
              })()}
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </motion.div>
);

/* ──────── STEP 1: Experience Level ──────── */
const StepExperience = ({ formData, setFormData }) => (
  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
    className="max-w-3xl space-y-4">
    <p className="text-gray-400 mb-6">Select your current training experience level</p>
    {EXPERIENCE_LEVELS.map(lvl => (
      <button key={lvl.id} onClick={() => setFormData({ ...formData, experienceLevel: lvl.id })}
        className={`w-full flex items-center gap-6 p-6 rounded-2xl border transition-all text-left group ${
          formData.experienceLevel === lvl.id
            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
            : 'border-border bg-surface/50 hover:border-primary/30 hover:bg-white/5'
        }`}>
        <div className="text-4xl">{lvl.emoji}</div>
        <div className="flex-1">
          <h3 className="text-lg font-black uppercase italic tracking-tight">{lvl.label}</h3>
          <p className="text-sm text-gray-400">{lvl.desc}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          formData.experienceLevel === lvl.id ? 'border-primary bg-primary' : 'border-gray-600'
        }`}>
          {formData.experienceLevel === lvl.id && <CheckCircle2 className="w-4 h-4 text-black" />}
        </div>
      </button>
    ))}
  </motion.div>
);

/* ──────── STEP 2: Goal Selection ──────── */
const StepGoal = ({ formData, setFormData }) => (
  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
    className="max-w-3xl space-y-4">
    <p className="text-gray-400 mb-6">What's your primary fitness objective?</p>
    <div className="grid md:grid-cols-2 gap-4">
      {GOALS.map(goal => (
        <button key={goal.id} onClick={() => setFormData({ ...formData, goalType: goal.id })}
          className={`relative overflow-hidden flex items-start gap-4 p-6 rounded-2xl border transition-all text-left group ${
            formData.goalType === goal.id
              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
              : 'border-border bg-surface/50 hover:border-primary/30 hover:bg-white/5'
          }`}>
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${goal.color} text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
            <goal.icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black uppercase italic tracking-tight">{goal.label}</h3>
            <p className="text-xs text-gray-400 mt-1">{goal.desc}</p>
          </div>
          {formData.goalType === goal.id && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
            </motion.div>
          )}
        </button>
      ))}
    </div>

    {formData.goalType === 'SPORTS' && (
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
        <div className="glass-card p-6">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">
            Which sport are you training for?
          </label>
          <input type="text" placeholder="e.g. Cricket, Football, MMA, Basketball..."
            value={formData.sportName}
            onChange={e => setFormData({ ...formData, sportName: e.target.value })}
            className="w-full bg-background border border-border rounded-xl py-3 px-4 text-white outline-none focus:border-primary/50" />
        </div>
      </motion.div>
    )}
  </motion.div>
);

/* ──────── STEP 3: Plan Result ──────── */
const StepPlanResult = ({ plan, parseJson, navigate }) => {
  const workouts = parseJson(plan.workoutPlan);
  const meals = parseJson(plan.dietPlan);
  const goalLabel = GOALS.find(g => g.id === plan.goalType)?.label || plan.goalType;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'BMI', value: plan.bmi, color: 'text-primary' },
          { label: 'Calories/day', value: `${plan.dailyCalories}`, color: 'text-orange-400' },
          { label: 'Protein', value: `${plan.dailyProtein}g`, color: 'text-blue-400' },
          { label: 'Carbs', value: `${plan.dailyCarbs}g`, color: 'text-yellow-400' },
          { label: 'Fat', value: `${plan.dailyFat}g`, color: 'text-pink-400' },
        ].map(stat => (
          <motion.div key={stat.label} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className="glass-card p-4 text-center hover:border-primary/20 transition-all">
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-l-primary">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-black uppercase italic text-sm tracking-tight">
            Your Personalized {goalLabel} Plan is Ready
          </span>
        </div>
      </div>

      {/* Workout Plan */}
      <div>
        <h2 className="text-xl font-black italic uppercase tracking-tight mb-4 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-primary" /> Weekly Workout Plan
        </h2>
        <div className="space-y-3">
          {workouts.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 hover:border-primary/20 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                    {(w.dayName || w.day || 'Day')?.slice(0, 3)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase italic">{w.focus}</h4>
                    <p className="text-xs text-gray-400 mt-1 max-w-md">{w.exercises}</p>
                  </div>
                </div>
                {w.sets !== '-' && (
                  <div className="flex gap-4 text-right flex-shrink-0">
                    <div><div className="text-xs text-gray-500 font-bold">Sets</div><div className="text-sm font-black text-primary">{w.sets}</div></div>
                    <div><div className="text-xs text-gray-500 font-bold">Reps</div><div className="text-sm font-black">{w.reps}</div></div>
                    <div><div className="text-xs text-gray-500 font-bold">Rest</div><div className="text-sm font-black text-blue-400">{w.restPeriod || w.rest}</div></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Diet Plan */}
      <div>
        <h2 className="text-xl font-black italic uppercase tracking-tight mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" /> Daily Diet Plan
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {meals.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 hover:border-orange-500/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm uppercase italic">{m.mealName || m.meal}</h4>
                <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-full">{m.time}</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">{m.items}</p>
              <p className="text-[10px] text-primary/70 italic">{m.notes}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={() => navigate('/member/workouts')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-black font-bold uppercase text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20">
          View Workouts <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={() => navigate('/member/diet')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-gray-300 font-bold uppercase text-sm hover:bg-white/5 transition-all">
          View Diet Plans <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default GoalSetup;
