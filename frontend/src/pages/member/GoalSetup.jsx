import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Target, ArrowRight, ArrowLeft, Ruler, Weight,
  Dumbbell, Trophy, Flame, Zap, Medal, Activity,
  CheckCircle2, Sparkles, ChevronRight
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';

const STEPS = ['Personal Info', 'Experience', 'Choose Goal', 'Your Plan'];

const GOALS = [
  { id: 'COMPETITION', label: 'Competition Prep', desc: 'Physique periodization for bodybuilding shows', icon: Trophy },
  { id: 'AESTHETIC', label: 'Aesthetic Body', desc: 'Lean, proportionate & defined physique', icon: Flame },
  { id: 'STRENGTH', label: 'Strength Training', desc: 'Maximize compound raw strength progression', icon: Zap },
  { id: 'POWERLIFTING', label: 'Powerlifting', desc: 'Squat, Bench, and Deadlift power milestones', icon: Medal },
  { id: 'SPORTS', label: 'Sports Conditioning', desc: 'Agility, power output, and sport stamina', icon: Activity },
];

const EXPERIENCE_LEVELS = [
  { id: 'BEGINNER', label: 'Beginner', desc: '0–1 year of structured training', emoji: '🌱' },
  { id: 'INTERMEDIATE', label: 'Intermediate', desc: '1–3 years of consistent lifting', emoji: '💪' },
  { id: 'ADVANCED', label: 'Advanced', desc: '3+ years of progressive overload', emoji: '🔥' },
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
      toast.success('Your personalized plan is ready');
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
      <Sidebar />
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <div className="mb-8 border-b border-border pb-6">
          <div className="flex items-center gap-2 text-primary mb-1">
            <span className="badge-accent">Goal Setup Wizard</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Calibrate Your Training Blueprint
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">Input your baseline metrics to synthesize a periodized workout and nutrition split.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                i < step ? 'bg-primary/10 text-primary border border-primary/20' :
                i === step ? 'bg-primary text-white font-semibold' :
                'bg-surface-elevated text-text-muted border border-border'
              }`}>
                {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
                <span className="hidden md:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-6 h-0.5 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
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
          <div className="flex justify-between mt-8 max-w-3xl">
            <button onClick={prevStep} disabled={step === 0}
              className={`btn-secondary ${
                step === 0 ? 'opacity-30 cursor-not-allowed' : ''
              }`}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={nextStep} disabled={!canNext() || loading}
              className={`btn-primary ${
                !canNext() || loading ? 'opacity-40 cursor-not-allowed' : ''
              }`}>
              {loading ? (
                'Generating...'
              ) : step === 2 ? (
                <><Sparkles className="w-4 h-4" /> Generate Plan</>
              ) : (
                <>Next <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

/* ──────── STEP 0: Personal Info ──────── */
const StepPersonalInfo = ({ formData, setFormData }) => (
  <div className="max-w-3xl grid md:grid-cols-2 gap-4">
    <div className="panel p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-surface-elevated text-primary border border-border">
          <Ruler className="w-5 h-5" />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-primary">Height (cm)</label>
          <p className="text-[11px] text-text-secondary">Measured in centimeters</p>
        </div>
      </div>
      <input type="number" placeholder="e.g. 178" value={formData.heightCm}
        onChange={e => setFormData({ ...formData, heightCm: e.target.value })}
        className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 px-3.5 text-xl stat-number text-text-primary outline-none focus:border-primary" />
    </div>

    <div className="panel p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-surface-elevated text-primary border border-border">
          <Weight className="w-5 h-5" />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-primary">Weight (kg)</label>
          <p className="text-[11px] text-text-secondary">Measured in kilograms</p>
        </div>
      </div>
      <input type="number" placeholder="e.g. 75" value={formData.weightKg}
        onChange={e => setFormData({ ...formData, weightKg: e.target.value })}
        className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 px-3.5 text-xl stat-number text-text-primary outline-none focus:border-primary" />
    </div>
  </div>
);

/* ──────── STEP 1: Experience Level ──────── */
const StepExperience = ({ formData, setFormData }) => (
  <div className="max-w-3xl space-y-3">
    <p className="text-xs text-text-secondary mb-2">Select your current training consistency</p>
    {EXPERIENCE_LEVELS.map(lvl => (
      <button key={lvl.id} onClick={() => setFormData({ ...formData, experienceLevel: lvl.id })}
        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
          formData.experienceLevel === lvl.id
            ? 'border-primary bg-primary/5'
            : 'border-border bg-surface hover:border-border-light'
        }`}>
        <div className="text-2xl">{lvl.emoji}</div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-text-primary">{lvl.label}</h3>
          <p className="text-xs text-text-secondary">{lvl.desc}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
          formData.experienceLevel === lvl.id ? 'border-primary bg-primary' : 'border-border'
        }`}>
          {formData.experienceLevel === lvl.id && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
        </div>
      </button>
    ))}
  </div>
);

/* ──────── STEP 2: Goal Selection ──────── */
const StepGoal = ({ formData, setFormData }) => (
  <div className="max-w-3xl space-y-3">
    <p className="text-xs text-text-secondary mb-2">Primary physique or athletic outcome</p>
    <div className="grid md:grid-cols-2 gap-3">
      {GOALS.map(goal => (
        <button key={goal.id} onClick={() => setFormData({ ...formData, goalType: goal.id })}
          className={`panel p-4 flex items-start gap-3.5 text-left transition-all ${
            formData.goalType === goal.id
              ? 'border-primary bg-surface-elevated'
              : 'border-border hover:border-border-light'
          }`}>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <goal.icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-text-primary">{goal.label}</h3>
            <p className="text-[11px] text-text-secondary mt-0.5">{goal.desc}</p>
          </div>
          {formData.goalType === goal.id && (
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          )}
        </button>
      ))}
    </div>

    {formData.goalType === 'SPORTS' && (
      <div className="panel p-4 mt-3">
        <label className="text-xs font-semibold text-text-secondary mb-2 block">
          Target Sport / Athletic Event
        </label>
        <input type="text" placeholder="e.g. Football, MMA, Cricket, Track..."
          value={formData.sportName}
          onChange={e => setFormData({ ...formData, sportName: e.target.value })}
          className="w-full bg-surface-elevated border border-border rounded-xl py-2 px-3 text-xs text-text-primary outline-none focus:border-primary" />
      </div>
    )}
  </div>
);

/* ──────── STEP 3: Plan Result ──────── */
const StepPlanResult = ({ plan, parseJson, navigate }) => {
  const workouts = parseJson(plan.workoutPlan);
  const meals = parseJson(plan.dietPlan);
  const goalLabel = GOALS.find(g => g.id === plan.goalType)?.label || plan.goalType;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'BMI Index', value: plan.bmi },
          { label: 'Daily Calories', value: `${plan.dailyCalories} kcal` },
          { label: 'Protein Target', value: `${plan.dailyProtein}g` },
          { label: 'Carbs Target', value: `${plan.dailyCarbs}g` },
          { label: 'Fats Target', value: `${plan.dailyFat}g` },
        ].map(stat => (
          <div key={stat.label} className="panel p-4 text-center">
            <div className="text-xl stat-number text-primary">{stat.value}</div>
            <div className="text-[10px] font-semibold text-text-secondary uppercase mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="panel p-4 border-l-4 border-l-primary flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-text-primary">
          Your Personalized {goalLabel} Blueprint has been Calibrated
        </span>
      </div>

      {/* Workout Plan */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-primary" /> Weekly Training Split
        </h2>
        <div className="space-y-2">
          {workouts.map((w, i) => (
            <div key={i} className="panel p-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-elevated text-primary font-bold text-xs flex items-center justify-center border border-border">
                  {(w.dayName || w.day || 'Day')?.slice(0, 3)}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-text-primary">{w.focus}</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">{w.exercises}</p>
                </div>
              </div>
              {w.sets !== '-' && (
                <div className="flex gap-3 text-right shrink-0 text-xs">
                  <div><span className="text-text-muted text-[10px]">Sets</span><div className="font-medium text-text-primary">{w.sets}</div></div>
                  <div><span className="text-text-muted text-[10px]">Reps</span><div className="font-medium text-text-primary">{w.reps}</div></div>
                  <div><span className="text-text-muted text-[10px]">Rest</span><div className="font-medium text-primary">{w.restPeriod || w.rest}</div></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Diet Plan */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Flame className="w-4 h-4 text-primary" /> Macro Nutrition Framework
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {meals.map((m, i) => (
            <div key={i} className="panel p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-text-primary">{m.mealName || m.meal}</h4>
                <span className="badge-accent text-[10px]">{m.time}</span>
              </div>
              <p className="text-xs text-text-secondary">{m.items}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={() => navigate('/member/workouts')} className="btn-primary">
          View Workouts <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={() => navigate('/member/diet')} className="btn-secondary">
          View Diet Plans <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default GoalSetup;
