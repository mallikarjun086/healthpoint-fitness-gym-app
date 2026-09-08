import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Target, 
  Heart, 
  Zap, 
  Users, 
  Trophy, 
  History, 
  ShieldCheck, 
  Quote,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import TiltCard from '../../components/ui/TiltCard';
import { Dumbbell3D, Sparkles3D, Chart3D, Shield3D } from '../../components/ui/Icon3D';

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: "Biomechanical Precision",
      desc: "We calibrate exercise mechanics down to tempo prescriptions and scapular paths to protect joints while maximizing tension."
    },
    {
      icon: Heart,
      title: "Human-Centric Intelligence",
      desc: "Algorithms serve the athlete. Every formula adapts to real-world fatigue, busy schedules, and lifestyle recovery markers."
    },
    {
      icon: ShieldCheck,
      title: "Sports Science Integrity",
      desc: "Our training and diet architectures are developed with certified physiologists and coaches. Zero gimmick trends."
    }
  ];

  const stats = [
    { label: "Active Athletes", value: "10k+" },
    { label: "Logged Working Sets", value: "1.2M+" },
    { label: "Coaches & Trainers", value: "50+" },
    { label: "Goal Attainment Rate", value: "98%" }
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary pt-28 pb-20 px-6 relative overflow-hidden">
      <Navbar />

      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[200px] pointer-events-none" />

      {/* Hero Header */}
      <header className="max-w-4xl mx-auto text-center mb-16 space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border">
          <History className="w-3.5 h-3.5 text-primary" />
          <span className="caption">Our Foundation & Mission</span>
        </div>
        <h1 className="heading-xl sm:text-5xl text-text-primary">
          The Science of Athletic Excellence
        </h1>
        <p className="body-md max-w-2xl mx-auto">
          HealthPoint was founded on a simple principle: high-performance sports science shouldn't be locked behind elite olympic facilities.
        </p>
      </header>

      {/* Stats Ribbon */}
      <section className="max-w-5xl mx-auto mb-20 relative z-10">
        <div className="panel-card p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="stat-display text-2xl sm:text-3xl text-text-primary">{stat.value}</div>
              <div className="caption">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="max-w-7xl mx-auto mb-24 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="badge-accent">Core Principles</span>
          <h2 className="heading-xl sm:text-3xl">Built on First Principles</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map((val) => (
            <TiltCard key={val.title} maxTilt={3} className="panel-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center text-primary shadow-sm">
                <val.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary font-display">{val.title}</h3>
              <p className="body-sm text-text-secondary">{val.desc}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-4xl mx-auto text-center relative z-10">
        <TiltCard maxTilt={2} className="panel-elevated p-10 sm:p-14 space-y-6">
          <h2 className="heading-xl sm:text-4xl text-text-primary">
            Join the new era of strength training.
          </h2>
          <p className="body-md max-w-md mx-auto">
            Experience the unified platform connecting training, nutrition, and club management.
          </p>
          <div className="pt-2">
            <Link to="/register" className="btn-hero shadow-accent">
              Start Free Trial <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </TiltCard>
      </section>
    </div>
  );
};

export default AboutPage;
