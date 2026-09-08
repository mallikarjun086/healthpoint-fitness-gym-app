import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Sparkles3D, Shield3D, Dumbbell3D, Zap3D } from '../../components/ui/Icon3D';
import { motionTokens } from '../../tokens/designTokens';

const PricingPage = () => {
  const plans = [
    {
      name: "Basic Access",
      price: 999,
      period: "/month",
      description: "Essential tools for athletes starting structured programming.",
      features: [
        "Standard Workout Library & Splits",
        "Basic Macro Distribution Guidelines",
        "Community Standings Access",
        "Contactless Mobile Digital Pass"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Elite Performance",
      price: 2999,
      period: "/month",
      description: "Signature tier for athletes with AI blueprints & coach messaging.",
      features: [
        "Everything in Basic Access",
        "AI Periodized Split Architect",
        "Personalized Macro Load Targets",
        "Biomechanical Muscle Heatmap",
        "Dedicated Master Trainer Chat",
        "Advanced Volume Telemetry & RPE"
      ],
      cta: "Join Elite Club",
      popular: true
    },
    {
      name: "Pro Conditioning",
      price: 1499,
      period: "/month",
      description: "Intermediate protocols for progressive overload strength.",
      features: [
        "Everything in Basic Access",
        "Custom Split Builder & Presets",
        "Advanced Volume Load Metrics",
        "Workout Log History & Notes"
      ],
      cta: "Go Pro",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary pt-28 pb-20 px-6 relative overflow-hidden">
      <Navbar />

      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-4xl mx-auto text-center mb-16 space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border">
          <Sparkles3D size={16} />
          <span className="caption">Invest in Your Performance</span>
        </div>
        <h1 className="heading-xl sm:text-5xl text-text-primary">
          Transparent Membership Tiers
        </h1>
        <p className="body-md max-w-xl mx-auto">
          Choose the level of biomechanics guidance and telemetry matching your goals. Cancel anytime with zero contracts.
        </p>
      </header>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch relative z-10">
        {plans.map((plan) => (
          <TiltCard
            key={plan.name}
            maxTilt={plan.popular ? 4 : 3}
            className={`p-8 flex flex-col justify-between rounded-2xl ${
              plan.popular 
                ? 'panel-elevated border-primary/50 shadow-accent' 
                : 'panel-card'
            }`}
          >
            <div>
              {plan.popular && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Star className="w-3 h-3 fill-primary" /> Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-text-primary font-display">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl stat-display text-text-primary">
                    <CountUp target={plan.price} prefix="₹" />
                  </span>
                  <span className="text-text-secondary text-xs font-medium">{plan.period}</span>
                </div>
                <p className="body-sm text-text-secondary mt-3">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-3 mb-8 pt-4 border-t border-border">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-xs">
                    <div className="mt-0.5 p-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link 
              to="/register" 
              className={`w-full py-3 rounded-xl text-center text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                plan.popular 
                  ? 'btn-hero shadow-accent' 
                  : 'btn-secondary'
              }`}
            >
              <span>{plan.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </TiltCard>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-border pt-12 relative z-10">
        {[
          { icon: Shield3D, label: "Secure Payments" },
          { icon: Zap3D, label: "Instant Access" },
          { icon: Sparkles3D, label: "AI Blueprints" },
          { icon: Dumbbell3D, label: "Pro Content" }
        ].map((badge) => (
          <div key={badge.label} className="flex flex-col items-center gap-2">
            <div className="p-2.5 rounded-xl bg-surface-elevated border border-border shadow-sm">
              <badge.icon size={22} />
            </div>
            <span className="caption">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
