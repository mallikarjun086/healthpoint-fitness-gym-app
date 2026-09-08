import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Video, 
  ClipboardList, 
  Zap, 
  Target, 
  Users, 
  Smartphone, 
  ShieldCheck, 
  Flame, 
  ChevronRight, 
  TrendingUp, 
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import TiltCard from '../../components/ui/TiltCard';
import { Dumbbell3D, Sparkles3D, Chart3D, Shield3D, Heart3D } from '../../components/ui/Icon3D';
import { motionTokens } from '../../tokens/designTokens';

const FeaturesPage = () => {
  const mainFeatures = [
    {
      icon: Video,
      title: "Interactive Video Vault",
      description: "Master multi-joint mechanics with 4K demonstrations and coach form cues.",
      tag: "Biomechanics"
    },
    {
      icon: ClipboardList,
      title: "Precision Nutrition Planning",
      description: "Personalized diet protocols with live macro distribution adjustments and PDF exports.",
      tag: "Nutrition"
    },
    {
      icon: Target,
      title: "Periodized Split Architect",
      description: "Specialized Push, Pull, Legs, and Upper/Lower volume curves tailored to your training age.",
      tag: "Programming"
    }
  ];

  const gridFeatures = [
    {
      icon: Smartphone,
      title: "Responsive Mobile Interface",
      description: "Access your splits, timers, and meal schedule seamlessly across desktop, tablet, and mobile."
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Data & Privacy",
      description: "Encrypted telemetry storage with zero third-party tracking or data monetization."
    },
    {
      icon: TrendingUp,
      title: "Volume Load Analytics",
      description: "Real-time progressive overload charting with RPE tracking and fatigue monitoring."
    },
    {
      icon: Zap,
      title: "Live Workout Timers",
      description: "Dynamic rest countdowns, set weight memory, and heart rate telemetry sync."
    },
    {
      icon: Award,
      title: "Club Leaderboard & PRs",
      description: "Celebrate milestones, track 1RM records, and compete on athletic streak standings."
    },
    {
      icon: Users,
      title: "Direct Master Coach Chat",
      description: "Synchronized direct messaging with certified strength specialists and dietitians."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary pt-28 pb-20 px-6 relative overflow-hidden">
      <Navbar />

      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[200px] pointer-events-none" />

      {/* Hero Header */}
      <header className="max-w-4xl mx-auto text-center mb-16 space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border">
          <Sparkles3D size={16} />
          <span className="caption">Architecture & Capabilities</span>
        </div>
        <h1 className="heading-xl sm:text-5xl text-text-primary">
          Intelligent Features. Calibrated Results.
        </h1>
        <p className="body-md max-w-2xl mx-auto">
          HealthPoint unifies sports biomechanics, algorithmic volume calibration, and automated club operations into a single platform.
        </p>
      </header>

      {/* Main Feature Cards */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mb-24 relative z-10">
        {mainFeatures.map((f, i) => (
          <TiltCard key={f.title} maxTilt={3} className="panel-card p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center shadow-sm text-primary">
                  <f.icon className="w-6 h-6" />
                </div>
                <span className="badge-accent text-[10px]">{f.tag}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-text-primary font-display">{f.title}</h3>
                <p className="body-sm text-text-secondary">{f.description}</p>
              </div>
            </div>
          </TiltCard>
        ))}
      </section>

      {/* Tech Breakdown Section */}
      <section className="py-20 border-y border-border max-w-7xl mx-auto rounded-3xl bg-surface/30 p-8 sm:p-12 mb-24 relative z-10">
        <div className="grid md:grid-cols-2 items-center gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-primary">
              <Flame className="w-4 h-4" />
              <span className="caption text-primary">Algorithmic Precision</span>
            </div>
            <h2 className="heading-xl sm:text-4xl text-text-primary">
              Data-Driven Human Potential
            </h2>
            <div className="space-y-4">
              {[
                { title: "Dynamic Adaptive Overload", desc: "Automated progression targets calibrated against fatigue and actual completed sets." },
                { title: "Metabolic Calorie Balancer", desc: "Formulas factoring lean muscle mass, daily steps, and resistance training expenditure." },
                { title: "Biomechanical Movement Calibration", desc: "Joint-sparing cues for squat, bench, and hinge patterns." }
              ].map(item => (
                <div key={item.title} className="flex gap-3">
                  <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">{item.title}</h4>
                    <p className="body-sm text-text-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <TiltCard maxTilt={3} className="panel-elevated p-8 aspect-video flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                <Dumbbell3D size={32} />
              </div>
              <div className="space-y-1">
                <div className="text-base font-bold text-text-primary font-display">Live Telemetry Engine</div>
                <div className="body-sm text-text-secondary">Sub-second synchronization across mobile & cloud</div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="max-w-7xl mx-auto space-y-10 mb-24 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="heading-xl sm:text-3xl text-text-primary">The Complete Ecosystem</h2>
          <p className="body-sm text-text-secondary">Engineered for athletes, coaches, and facility managers.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {gridFeatures.map((f) => (
            <div key={f.title} className="panel-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-primary">
                <f.icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-text-primary font-display">{f.title}</h4>
              <p className="body-sm text-text-secondary">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Card */}
      <section className="max-w-4xl mx-auto text-center relative z-10">
        <TiltCard maxTilt={2} className="panel-elevated p-10 sm:p-14 space-y-6">
          <h2 className="heading-xl sm:text-4xl text-text-primary">
            Ready to experience intelligent training?
          </h2>
          <p className="body-md max-w-lg mx-auto">
            Join thousands of athletes and gym members leveraging HealthPoint.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/register" className="btn-hero shadow-accent">
              Start 14-Day Free Access <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link to="/pricing" className="btn-secondary">
              View Memberships
            </Link>
          </div>
        </TiltCard>
      </section>
    </div>
  );
};

export default FeaturesPage;
