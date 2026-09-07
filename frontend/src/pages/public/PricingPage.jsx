import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Sparkles3D, Shield3D, Dumbbell3D, Zap3D } from '../../components/ui/Icon3D';

const PricingPage = () => {
  const plans = [
    {
      name: "Basic Access",
      price: 999,
      period: "/month",
      description: "Essential tools for individual athletes starting structured programming.",
      features: [
        "Standard Workout Library",
        "Basic Diet Guidelines",
        "Community Standings Access",
        "Mobile Digital Pass"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Elite Performance",
      price: 2999,
      period: "/month",
      description: "Signature tier for serious athletes with AI blueprints & coach messaging.",
      features: [
        "Everything in Basic Access",
        "AI Periodized Split Architect",
        "Personalized Macro Balance",
        "Biomechanical Muscle Heatmap",
        "Dedicated Master Trainer Chat",
        "Advanced Volume Telemetry"
      ],
      cta: "Join Elite Club",
      popular: true
    },
    {
      name: "Pro Conditioning",
      price: 1499,
      period: "/month",
      description: "Intermediate protocols for consistent progressive overload gains.",
      features: [
        "Everything in Basic Access",
        "Custom Split Creator",
        "Advanced Progress Tracking",
        "Workout Log History & Notes"
      ],
      cta: "Go Pro",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary pt-28 pb-20 px-6">
      <Navbar />

      {/* Header */}
      <header className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border mb-4">
          <Sparkles3D size={16} />
          <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Invest in Your Performance</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Transparent Membership Tiers
        </h1>
        <p className="text-text-secondary text-sm max-w-xl mx-auto leading-relaxed">
          Choose the level of guidance and telemetry that matches your athletic ambition. Cancel anytime with zero contracts.
        </p>
      </header>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan, i) => (
          <TiltCard
            key={plan.name}
            maxTilt={plan.popular ? 4 : 3}
            className={`panel p-8 flex flex-col justify-between ${
              plan.popular ? 'border-primary/50 bg-surface-elevated shadow-hero' : ''
            }`}
          >
            <div>
              {plan.popular && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Star className="w-3 h-3 fill-primary" /> Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-text-primary mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl stat-number text-text-primary">
                    <CountUp value={plan.price} prefix="₹" />
                  </span>
                  <span className="text-text-secondary text-xs font-medium">{plan.period}</span>
                </div>
                <p className="text-text-secondary text-xs mt-3 leading-relaxed">
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
                ? 'btn-hero' 
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
      <div className="max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-border pt-12">
        {[
          { IconComponent: Shield3D, label: "Secure Payments" },
          { IconComponent: Zap3D, label: "Instant Access" },
          { IconComponent: Sparkles3D, label: "AI Blueprints" },
          { IconComponent: Dumbbell3D, label: "Pro Content" }
        ].map((badge) => (
          <div key={badge.label} className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-xl bg-surface-elevated border border-border">
              <badge.IconComponent size={20} />
            </div>
            <span className="text-[11px] font-medium text-text-secondary">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
