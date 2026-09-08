import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Dumbbell, 
  Sparkles, 
  Activity, 
  Shield, 
  Users, 
  TrendingUp,
  Flame,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import HeroCanvas3D from '../../components/common/HeroCanvas3D';
import { Link } from 'react-router-dom';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Sparkles3D, Chart3D, Dumbbell3D, Heart3D, Shield3D } from '../../components/ui/Icon3D';
import { motionTokens } from '../../tokens/designTokens';

const workoutCategories = [
  {
    title: 'Hypertrophy & Physique',
    description: 'Volume-calibrated push/pull/legs splits with 3-0-1 tempo prescriptions.',
    exercises: '180+ Form Guides',
    tag: 'High Demand',
    icon: Dumbbell3D,
  },
  {
    title: 'Functional Biomechanics',
    description: 'Joint-protective compound mechanics and scapular stabilizers for athlete longevity.',
    exercises: '94+ Drills',
    tag: 'Sports Science',
    icon: Sparkles3D,
  },
  {
    title: 'Power & Neuromuscular',
    description: 'Concentric peak rate-of-force development and low-impact CNS recovery.',
    exercises: '68+ Protocols',
    tag: 'Elite Tier',
    icon: Chart3D,
  },
  {
    title: 'Cardiovascular Conditioning',
    description: 'Real-time heart rate zone telemetry and lactate threshold periodization.',
    exercises: '45+ Modules',
    tag: 'Endurance',
    icon: Heart3D,
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden selection:bg-primary/30 selection:text-white">
      <Navbar />

      {/* =========================================================
          HERO SECTION — Asymmetric Cinematic Architecture
         ========================================================= */}
      <section className="relative min-h-[94vh] lg:min-h-[100vh] flex items-center pt-28 lg:pt-0 overflow-hidden border-b border-border">
        
        {/* Ambient Atmospheric Obsidian Glow */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" 
        />

        {/* 3D SCULPTURAL HERO OBJECT (Torus Knot with Titanium Metalness) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.88, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 right-[-14%] lg:right-[-6%] w-[75%] sm:w-[65%] lg:w-[58%] h-full flex items-center justify-center pointer-events-none z-0"
        >
          <HeroCanvas3D />
        </motion.div>

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10 py-16 lg:py-24">
          <div className="max-w-2xl lg:max-w-3xl space-y-8">
            
            {/* Athletic Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border-light shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-semibold text-text-primary tracking-wide uppercase">
                HealthPoint OS 2.0 • Biomechanical Precision
              </span>
            </motion.div>

            {/* Cinematic Headline with Staggered Lines */}
            <div className="space-y-1">
              <div className="overflow-hidden">
                <motion.h1 
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="display-2xl block"
                >
                  Where Human
                </motion.h1>
              </div>

              <div className="overflow-hidden">
                <motion.h1 
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.85, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                  className="display-2xl block text-text-primary"
                >
                  Biomechanics
                </motion.h1>
              </div>

              <div className="overflow-hidden">
                <motion.h1 
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.85, delay: 0.60, ease: [0.16, 1, 0.3, 1] }}
                  className="display-2xl block bg-gradient-to-r from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent"
                >
                  Meets Intelligence.
                </motion.h1>
              </div>
            </div>

            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
              className="body-lg max-w-xl"
            >
              The unified operating system uniting athlete hypertrophy splits, live progressive overload telemetry, and automated facility access.
            </motion.p>

            {/* CTA Action Cluster */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
              className="pt-2 flex flex-wrap items-center gap-4"
            >
              <Link 
                to="/register" 
                className="btn-primary py-3.5 px-7 text-xs sm:text-sm font-semibold shadow-card hover:shadow-accent"
              >
                <span>Start 14-Day Free Access</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link 
                to="/login"
                className="btn-secondary py-3.5 px-6 text-xs sm:text-sm font-medium"
              >
                <span>Explore Live Platform</span>
              </Link>
            </motion.div>

            {/* Live Metrics Ribbon */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.05 }}
              className="pt-6 border-t border-border grid grid-cols-3 gap-6 max-w-md"
            >
              <div>
                <div className="stat-display text-xl sm:text-2xl text-text-primary">
                  <CountUp target={99.8} decimals={1} suffix="%" />
                </div>
                <div className="caption mt-0.5">Telemetry Accuracy</div>
              </div>
              <div>
                <div className="stat-display text-xl sm:text-2xl text-text-primary">
                  <CountUp target={180} suffix="+" />
                </div>
                <div className="caption mt-0.5">Biomechanical Drills</div>
              </div>
              <div>
                <div className="stat-display text-xl sm:text-2xl text-text-primary">
                  <CountUp target={42} suffix="k" />
                </div>
                <div className="caption mt-0.5">Logged Sets</div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================
          WORKOUT CATEGORY GRID — Subtle 3D Layer Parallax
         ========================================================= */}
      <section className="py-24 bg-background-subtle border-b border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="max-w-2xl mb-14 space-y-2">
            <span className="badge-accent">Training Architecture</span>
            <h2 className="heading-xl sm:text-4xl">Scientific Specialization Splits</h2>
            <p className="body-md">Calibrated by master strength coaches and biomechanists for continuous progression.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {workoutCategories.map((cat, i) => (
              <TiltCard key={i} maxTilt={4} className="panel-card p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center shadow-sm">
                      <cat.icon size={22} />
                    </div>
                    <span className="badge-muted text-[10px]">{cat.tag}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-text-primary font-display">{cat.title}</h3>
                    <p className="body-sm">{cat.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-text-muted font-medium">{cat.exercises}</span>
                  <Link to="/free-workouts" className="text-primary font-semibold hover:underline flex items-center gap-1">
                    Explore <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FACILITY & PERFORMANCE HIGHLIGHTS
         ========================================================= */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles3D,
                title: "Person-Specific AI Coach",
                desc: "Calculates BMR, TDEE, macro ratios, and periodized splits tailored to individual body metrics and fatigue scores."
              },
              {
                icon: Chart3D,
                title: "Live Volume Telemetry",
                desc: "Set-by-set tracker with weight and rep inputs, integrated rest timer countdown, and progressive overload curves."
              },
              {
                icon: Shield3D,
                title: "Contactless NFC & QR Pass",
                desc: "Turnstile sync, dynamic facility occupancy telemetry, and live member check-in verification."
              }
            ].map((f, i) => (
              <TiltCard key={i} maxTilt={3} className="panel-card p-7 space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center shadow-sm">
                  <f.icon size={24} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-text-primary font-display">{f.title}</h3>
                  <p className="body-sm">{f.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CALL TO ACTION CONTAINER
         ========================================================= */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <TiltCard maxTilt={2} className="panel-elevated p-12 space-y-6">
            <div className="space-y-2">
              <span className="badge-accent">Elevate Your Performance</span>
              <h2 className="heading-xl sm:text-4xl text-text-primary">
                Ready to train with intelligent precision?
              </h2>
              <p className="body-md max-w-lg mx-auto">
                Join elite athletes, personal trainers, and gym facility owners leveraging HealthPoint Fitness.
              </p>
            </div>
            <div>
              <Link to="/register" className="btn-hero text-xs sm:text-sm px-8 py-3.5 shadow-accent">
                Create Member Account <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-surface text-xs text-text-secondary">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-text-primary font-semibold">
            <Dumbbell3D size={20} />
            <span className="font-display">HealthPoint Fitness</span>
          </div>
          <div>© 2026 HealthPoint Fitness Platform. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
