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
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  const mainFeatures = [
    {
      icon: Video,
      title: "Interactive Video Library",
      description: "Master every movement with 4K animated demonstrations and pro-athlete form cues.",
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      icon: ClipboardList,
      title: "Elite Nutrition Planning",
      description: "Personalized diet protocols for both Veg & Non-Veg athletes with PDF export support.",
      color: "text-green-400",
      bg: "bg-green-400/10"
    },
    {
      icon: Target,
      title: "Goal-Oriented Training",
      description: "Specialized protocols for Push, Pull, Legs, and HIIT to match your specific physique goals.",
      color: "text-primary",
      bg: "bg-primary/10"
    }
  ];

  const gridFeatures = [
    {
      icon: Smartphone,
      title: "Responsive Mobile App",
      description: "Access your training and diet plans anywhere, anytime on any device."
    },
    {
      icon: ShieldCheck,
      title: "Secure Data & Privacy",
      description: "Your fitness data and payment information are protected with enterprise-grade encryption."
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Detailed visualization of your strength gains, calorie burn, and consistency metrics."
    },
    {
      icon: Zap,
      title: "Live Workout Timers",
      description: "Integrated timers and rest-period counters to keep your intensity high."
    },
    {
      icon: Award,
      title: "Member Achievements",
      description: "Earn badges and climb the leaderboard as you smash your personal records."
    },
    {
      icon: Users,
      title: "Trainer Consultation",
      description: "Direct access to certified pro trainers for form checks and strategy tweaks."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-premium rounded-xl group-hover:rotate-12 transition-transform">
              <Dumbbell className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-black italic tracking-tighter">HEALTHPOINT</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link to="/login" className="text-sm font-bold hover:text-primary transition-colors">LOGIN</Link>
            <Link to="/register" className="btn-premium px-6 py-2.5 text-xs font-black">GET STARTED</Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-40 pb-20 px-6 overflow-hidden relative">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Future of Fitness</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-8"
          >
            Smarter <span className="text-primary">Features</span>.<br />Better Results.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            HealthPoint combines cutting-edge technology with elite athletic knowledge to provide a training experience like no other.
          </motion.p>
        </div>
      </header>

      {/* Main Features Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {mainFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 group hover:border-primary/50 transition-all"
            >
              <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-black italic uppercase mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Breakdown Section */}
      <section className="py-40 px-6 bg-white/[0.02] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-20">
          <div>
            <div className="inline-flex items-center gap-2 text-primary mb-6">
              <Flame className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Performance Engine</span>
            </div>
            <h2 className="text-5xl font-black italic uppercase leading-tight mb-8">
              Data-Driven<br />Human Potential
            </h2>
            <div className="space-y-8">
              {[
                { title: "Dynamic Intensity", desc: "Adaptive workout protocols that adjust as you get stronger." },
                { title: "Metabolic Tracking", desc: "Real-time calculation of calorie expenditure and macro requirements." },
                { title: "Form Calibration", desc: "AI-integrated cues that ensure you are moving safely and effectively." }
              ].map(item => (
                <div key={item.title} className="flex gap-6">
                  <div className="mt-1"><ChevronRight className="w-5 h-5 text-primary" /></div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
            <div className="glass-card aspect-square relative overflow-hidden p-8 flex items-center justify-center border-primary/20">
              <div className="w-full h-full border border-white/5 rounded-full animate-[spin_20s_linear_infinite] flex items-center justify-center">
                <div className="w-3/4 h-3/4 border border-primary/20 rounded-full flex items-center justify-center">
                  <Dumbbell className="w-32 h-32 text-primary animate-pulse" />
                </div>
              </div>
              <div className="absolute top-10 left-10 p-4 bg-surface/80 backdrop-blur-md rounded-2xl border border-white/10">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <div className="absolute bottom-10 right-10 p-4 bg-surface/80 backdrop-blur-md rounded-2xl border border-white/10">
                <Zap className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black italic uppercase mb-4">The Complete Ecosystem</h2>
          <p className="text-gray-500">Everything you need to transform your body and mind.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all"
            >
              <feature.icon className="w-8 h-8 text-primary mb-6" />
              <h4 className="text-lg font-bold mb-3 uppercase tracking-tight">{feature.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-4xl mx-auto glass-card p-20 bg-gradient-premium relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 -z-10"></div>
          <h2 className="text-5xl font-black italic uppercase mb-8 text-black">Ready to Unleash Your Potential?</h2>
          <p className="text-black/70 mb-10 text-lg font-bold">Join the community of elite athletes moving smarter.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="bg-black text-white px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
              START YOUR TRIAL
            </Link>
            <Link to="/pricing" className="text-black font-black uppercase tracking-widest border-b-2 border-black hover:pb-1 transition-all">
              VIEW PRICING
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-10 border-t border-white/5 text-center text-gray-500 text-[10px] font-black uppercase tracking-widest">
        &copy; 2024 HealthPoint Fitness. All Rights Reserved. Engineered for Excellence.
      </footer>
    </div>
  );
};

export default FeaturesPage;
