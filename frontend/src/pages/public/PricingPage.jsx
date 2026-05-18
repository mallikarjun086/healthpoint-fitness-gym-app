import { motion } from 'framer-motion';
import { 
  Check, 
  Dumbbell, 
  Zap, 
  ShieldCheck, 
  ZapOff,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const plans = [
    {
      name: "Basic",
      price: "999",
      period: "/month",
      description: "Essential tools for those just starting their fitness journey.",
      features: [
        "Standard Workout Library",
        "Basic Diet Guidelines",
        "Community Access",
        "Mobile App Access"
      ],
      cta: "Start Free",
      premium: false
    },
    {
      name: "Elite",
      price: "2,999",
      period: "/month",
      description: "Our most popular plan for serious athletes and bodybuilders.",
      features: [
        "Everything in Basic",
        "Animated Form Masterclasses",
        "Personalized Macros (Veg/Non-Veg)",
        "PDF Diet Exports",
        "Trainer Chat Support",
        "Advanced Analytics"
      ],
      cta: "Join Elite",
      premium: true,
      popular: true
    },
    {
      name: "Pro",
      price: "1,499",
      period: "/month",
      description: "Intermediate protocols for consistent performance gains.",
      features: [
        "Everything in Basic",
        "Custom Workout Creator",
        "Advanced Progress Tracking",
        "Workout Log History"
      ],
      cta: "Go Pro",
      premium: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-white pt-32 pb-20 px-6">
      {/* Background Aura */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full"></div>
      </div>

      <header className="max-w-4xl mx-auto text-center mb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Invest in Yourself</span>
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6">
          Premium <span className="text-primary">Performance</span>.<br />Transparent Pricing.
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Choose the level of guidance that matches your ambition. No hidden fees, just results.
        </p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative glass-card p-10 flex flex-col h-full transition-all duration-500 hover:translate-y-[-10px] ${
              plan.popular ? 'border-primary shadow-[0_0_50px_rgba(var(--primary-rgb),0.15)] ring-1 ring-primary/50 scale-105' : 'hover:border-white/20'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Star className="w-3 h-3 fill-current" /> Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-black italic uppercase mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">₹{plan.price}</span>
                <span className="text-gray-500 font-bold">{plan.period}</span>
              </div>
              <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                {plan.description}
              </p>
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="mt-1 p-0.5 rounded-full bg-primary/10">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <Link 
              to="/register" 
              className={`w-full py-5 rounded-2xl text-center text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group ${
                plan.popular 
                ? 'bg-primary text-black hover:scale-105 shadow-xl' 
                : 'bg-white/5 border border-white/10 hover:border-white/30'
              }`}
            >
              {plan.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="max-w-4xl mx-auto mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-white/5 pt-20">
        {[
          { icon: ShieldCheck, label: "Secure Payments" },
          { icon: Zap, label: "Instant Access" },
          { icon: ZapOff, label: "No Contracts" },
          { icon: Dumbbell, label: "Pro Content" }
        ].map((badge) => (
          <div key={badge.label} className="flex flex-col items-center gap-3">
            <badge.icon className="w-6 h-6 text-gray-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
