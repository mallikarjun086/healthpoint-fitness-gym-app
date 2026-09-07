import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Dumbbell, 
  ShieldAlert, 
  Sparkles, 
  ChevronRight, 
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

const articles = [
  {
    id: 1,
    title: 'The Hypertrophy Equation: Progressive Overload & Mechanical Tension',
    category: 'STRENGTH SCIENCE',
    readTime: '6 min read',
    summary: 'Why muscle growth requires progressive tension over time, effective reps in reserve (RIR 1-3), and proper recovery intervals.',
    author: 'HealthPoint Research Team',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: 'Debunking 7 Major Nutrition Myths: Seed Oils, Carbs at Night & Protein Limits',
    category: 'NUTRITION SCIENCE',
    readTime: '8 min read',
    summary: 'Evidence-based breakdown on macro distribution, anabolic window myths, and optimal daily protein thresholds (1.6 - 2.2g/kg).',
    author: 'Performance Nutrition Lab',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    title: 'Rotator Cuff & Lumbar Spine Protection for Lifters',
    category: 'INJURY PREVENTION',
    readTime: '5 min read',
    summary: 'Scapular stabilization exercises, thoracic mobility drills, and hip hinge mechanics to lift heavy without joint breakdown.',
    author: 'Sports Physio Department',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 4,
    title: 'Sleep Architecture, HRV & Central Nervous System Recovery',
    category: 'RECOVERY SCIENCE',
    readTime: '7 min read',
    summary: 'How deep slow-wave sleep drives human growth hormone (HGH) release and restores muscle glycogen stores.',
    author: 'Bio-Telemetry Lab',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'
  }
];

const HealthHub = () => {
  const [activeTab, setActiveTab] = useState('CALCULATORS');
  const [calcType, setCalcType] = useState('BMR_TDEE');

  // Calculator states
  const [bmiInputs, setBmiInputs] = useState({ heightCm: 178, weightKg: 75 });
  const [bmrInputs, setBmrInputs] = useState({ gender: 'MALE', age: 26, heightCm: 178, weightKg: 75, activity: 'MODERATE' });
  const [ormInputs, setOrmInputs] = useState({ weightLifted: 100, reps: 5 });

  // Calculations
  const calculatedBmi = (bmiInputs.weightKg / ((bmiInputs.heightCm / 100) * (bmiInputs.heightCm / 100))).toFixed(1);
  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-text-secondary' };
    if (bmi < 24.9) return { label: 'Optimal & Lean', color: 'text-emerald-400' };
    if (bmi < 29.9) return { label: 'Overweight / Muscular', color: 'text-amber-400' };
    return { label: 'High Body Mass', color: 'text-red-400' };
  };

  // Mifflin-St Jeor Equation
  const baseBmr = bmrInputs.gender === 'MALE'
    ? (10 * bmrInputs.weightKg) + (6.25 * bmrInputs.heightCm) - (5 * bmrInputs.age) + 5
    : (10 * bmrInputs.weightKg) + (6.25 * bmrInputs.heightCm) - (5 * bmrInputs.age) - 161;

  const activityMultipliers = { SEDENTARY: 1.2, LIGHT: 1.375, MODERATE: 1.55, VERY_ACTIVE: 1.725, EXTRA_ACTIVE: 1.9 };
  const calculatedTdee = Math.round(baseBmr * (activityMultipliers[bmrInputs.activity] || 1.55));

  // Epley formula for 1RM: Weight * (1 + Reps / 30)
  const calculated1Rm = Math.round(ormInputs.weightLifted * (1 + ormInputs.reps / 30.0));

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-text-secondary text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Open Health Knowledge
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Scientific Calculators & Guides
          </h1>
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">
            Free physiological calculators and evidence-based biomechanics for everyone.
          </p>

          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab('CALCULATORS')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'CALCULATORS' ? 'bg-primary text-white font-semibold' : 'bg-surface-elevated text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              Calculators
            </button>
            <button
              onClick={() => setActiveTab('ARTICLES')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ARTICLES' ? 'bg-primary text-white font-semibold' : 'bg-surface-elevated text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              Research Articles
            </button>
            <Link
              to="/free-workouts"
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-surface-elevated text-text-secondary hover:text-text-primary border border-border flex items-center gap-1"
            >
              Video Vault <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-surface-elevated border border-border flex items-start gap-3 mb-8 text-xs text-text-secondary leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-text-primary font-medium">Educational Disclaimer:</strong> All calculators and health guides provided on HealthPoint are for educational and informational fitness purposes only. They do not constitute medical diagnosis or advice.
          </div>
        </div>

        {activeTab === 'CALCULATORS' ? (
          <div className="space-y-6">
            {/* Calculator Selector */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[
                { id: 'BMR_TDEE', label: 'BMR & TDEE Calorie Burn', icon: Flame },
                { id: 'ONE_REP_MAX', label: '1-Rep Max (1RM) Estimator', icon: Dumbbell },
                { id: 'BMI', label: 'BMI & Body Composition', icon: Scale },
              ].map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => setCalcType(calc.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    calcType === calc.id ? 'bg-primary text-white font-semibold' : 'bg-surface-elevated text-text-secondary hover:text-text-primary border border-border'
                  }`}
                >
                  <calc.icon className="w-3.5 h-3.5" /> {calc.label}
                </button>
              ))}
            </div>

            {/* BMR / TDEE Calculator */}
            {calcType === 'BMR_TDEE' && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="panel p-6 space-y-4">
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Flame className="w-4 h-4 text-primary" /> Basal Metabolic Rate & TDEE
                  </h3>
                  <p className="text-xs text-text-secondary">Calculate your daily energy expenditure using the Mifflin-St Jeor formula.</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-text-secondary block mb-1">Gender</label>
                      <select
                        value={bmrInputs.gender}
                        onChange={e => setBmrInputs({ ...bmrInputs, gender: e.target.value })}
                        className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-text-secondary block mb-1">Age (years)</label>
                      <input
                        type="number"
                        value={bmrInputs.age}
                        onChange={e => setBmrInputs({ ...bmrInputs, age: parseInt(e.target.value) || 20 })}
                        className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-text-secondary block mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={bmrInputs.heightCm}
                        onChange={e => setBmrInputs({ ...bmrInputs, heightCm: parseFloat(e.target.value) || 170 })}
                        className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-text-secondary block mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={bmrInputs.weightKg}
                        onChange={e => setBmrInputs({ ...bmrInputs, weightKg: parseFloat(e.target.value) || 70 })}
                        className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Daily Activity Level</label>
                    <select
                      value={bmrInputs.activity}
                      onChange={e => setBmrInputs({ ...bmrInputs, activity: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    >
                      <option value="SEDENTARY">Sedentary (Desk Job, little exercise)</option>
                      <option value="LIGHT">Light Activity (1-3 days workout/week)</option>
                      <option value="MODERATE">Moderate Activity (3-5 days workout/week)</option>
                      <option value="VERY_ACTIVE">Very Active (6-7 days heavy training)</option>
                      <option value="EXTRA_ACTIVE">Athlete / 2x Training Daily</option>
                    </select>
                  </div>
                </div>

                <div className="panel p-6 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="badge-accent mb-2 inline-block">Metabolic Telemetry</span>
                    <h3 className="text-base font-bold text-text-primary mb-4">Daily Caloric Baseline</h3>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
                        <span className="text-[10px] font-semibold text-text-secondary uppercase">BMR (At Rest)</span>
                        <div className="text-2xl stat-number text-text-primary mt-1">{Math.round(baseBmr)} <span className="text-xs font-normal text-text-secondary">kcal</span></div>
                        <div className="text-[10px] text-text-muted mt-0.5">Basal resting burn</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20">
                        <span className="text-[10px] font-semibold text-primary uppercase">Maintenance (TDEE)</span>
                        <div className="text-2xl stat-number text-primary mt-1">{calculatedTdee} <span className="text-xs font-normal text-text-secondary">kcal</span></div>
                        <div className="text-[10px] text-text-secondary mt-0.5">To maintain weight</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-surface-elevated border border-border flex justify-between items-center">
                        <span className="font-medium text-emerald-400">Fat Loss / Deficit (-500 kcal):</span>
                        <span className="stat-number text-text-primary">{calculatedTdee - 500} kcal/day</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-surface-elevated border border-border flex justify-between items-center">
                        <span className="font-medium text-primary">Lean Mass Gain (+300 kcal):</span>
                        <span className="stat-number text-text-primary">{calculatedTdee + 300} kcal/day</span>
                      </div>
                    </div>
                  </div>

                  <Link to="/register" className="btn-primary w-full text-center py-2.5 text-xs block">
                    Save to Profile & Calibrate Splits →
                  </Link>
                </div>
              </div>
            )}

            {/* 1-Rep Max Calculator */}
            {calcType === 'ONE_REP_MAX' && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="panel p-6 space-y-4">
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-primary" /> One-Rep Max Estimator
                  </h3>
                  <p className="text-xs text-text-secondary">Estimate single-rep maximum load using the validated Epley formula.</p>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Weight Lifted (kg) *</label>
                    <input
                      type="number"
                      value={ormInputs.weightLifted}
                      onChange={e => setOrmInputs({ ...ormInputs, weightLifted: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Repetitions Performed (1 - 12 reps) *</label>
                    <input
                      type="number"
                      max={15}
                      min={1}
                      value={ormInputs.reps}
                      onChange={e => setOrmInputs({ ...ormInputs, reps: parseInt(e.target.value) || 1 })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="panel p-6 flex flex-col justify-between">
                  <div>
                    <span className="badge-accent mb-2 inline-block">Estimated Strength Peak</span>
                    <div className="text-3xl stat-number text-primary my-2">
                      1RM: {calculated1Rm} kg
                    </div>

                    <h4 className="text-xs font-semibold text-text-secondary mb-2 uppercase">Training Load Percentages</h4>
                    <div className="space-y-1.5 text-xs font-mono">
                      {[
                        { pct: 95, label: 'Heavy Strength (1-2 reps)' },
                        { pct: 85, label: 'Hypertrophy Power (5-6 reps)' },
                        { pct: 75, label: 'Volume Hypertrophy (8-10 reps)' },
                        { pct: 65, label: 'Muscular Endurance (12-15 reps)' }
                      ].map((item) => (
                        <div key={item.pct} className="p-2 rounded-lg bg-surface-elevated border border-border flex justify-between items-center">
                          <span className="text-text-secondary">{item.pct}% 1RM ({item.label})</span>
                          <span className="stat-number text-text-primary">{Math.round(calculated1Rm * (item.pct / 100))} kg</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to="/register" className="btn-primary w-full text-center py-2.5 text-xs block mt-4">
                    Track Progressive Overload in App →
                  </Link>
                </div>
              </div>
            )}

            {/* BMI Calculator */}
            {calcType === 'BMI' && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="panel p-6 space-y-4">
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Scale className="w-4 h-4 text-primary" /> Body Mass Index
                  </h3>
                  <p className="text-xs text-text-secondary">Calculate ratio of weight to height according to standard population guidelines.</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-text-secondary block mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={bmiInputs.heightCm}
                        onChange={e => setBmiInputs({ ...bmiInputs, heightCm: parseFloat(e.target.value) || 170 })}
                        className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-text-secondary block mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={bmiInputs.weightKg}
                        onChange={e => setBmiInputs({ ...bmiInputs, weightKg: parseFloat(e.target.value) || 70 })}
                        className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="panel p-6 flex flex-col justify-between">
                  <div>
                    <span className="badge-accent mb-2 inline-block">Classification</span>
                    <div className="text-3xl stat-number text-text-primary my-1">{calculatedBmi}</div>
                    <div className={`text-sm font-semibold ${getBmiCategory(calculatedBmi).color} mb-3`}>
                      {getBmiCategory(calculatedBmi).label}
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed">
                      Note: BMI is a generalized index and does not differentiate between skeletal muscle and adipose tissue.
                    </p>
                  </div>

                  <Link to="/register" className="btn-primary w-full text-center py-2.5 text-xs block mt-4">
                    Calibrate Goal Profile →
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Evidence-Based Articles Section */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((art) => (
              <div
                key={art.id}
                className="panel overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden relative bg-surface-elevated">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-black/20 to-transparent" />
                    <span className="absolute bottom-2.5 left-2.5 badge-accent">{art.category}</span>
                    <span className="absolute bottom-2.5 right-2.5 text-[10px] text-text-primary font-mono bg-black/80 px-2 py-0.5 rounded-md">
                      {art.readTime}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex justify-between items-center text-xs text-text-secondary border-t border-border mt-2 pt-3">
                  <span>{art.author}</span>
                  <span className="text-primary font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform text-[11px]">
                    Read Guide <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthHub;
