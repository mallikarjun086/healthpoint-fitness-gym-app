import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Users, 
  Trophy, 
  Zap, 
  ShieldCheck, 
  Dumbbell, 
  Sparkles,
  Bot,
  CreditCard,
  Flame,
  Activity,
  CheckCircle2,
  Lock
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden selection:bg-primary selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden">
        {/* Background Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-[700px] h-[700px] bg-primary/10 blur-[160px] rounded-full animate-pulse-slow" />
        <div className="absolute top-1/3 right-10 -z-10 w-[400px] h-[400px] bg-secondary/10 blur-[140px] rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card border-primary/30 text-primary text-xs font-black uppercase tracking-widest mb-8 glow-border">
              <Zap className="w-4 h-4 fill-primary animate-bounce" /> Enterprise Gym SaaS & Multi-Agent AI Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">
              TRANSFORM YOUR <br />
              <span className="gradient-text-lime">FITNESS EVOLUTION</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              The ultimate enterprise management platform for elite gym facilities, coaches, and athletes. Powered by person-specific AI hypertrophy splits, live volume load analytics, and Razorpay automated billing.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
              <Link to="/register" className="btn-premium w-full sm:w-auto px-8 py-4 text-xs flex items-center justify-center gap-2 shadow-2xl shadow-primary/30">
                Start 14-Day Pro Access <ArrowRight className="w-4 h-4 text-black" />
              </Link>

              <Link to="/login" className="btn-secondary w-full sm:w-auto px-8 py-4 text-xs flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-primary" /> Live Demo Portal Sign In
              </Link>
            </div>

            {/* Live Demo Credentials Ribbon */}
            <div className="glass-card p-6 max-w-4xl mx-auto border-primary/20 bg-black/60">
              <div className="text-[10px] font-black uppercase text-primary tracking-widest mb-3 flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Instant Demo Access Credentials
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-left">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Member Role</span> <span className="badge-lime">MEMBER</span>
                  </div>
                  <div className="text-gray-400 font-mono text-[11px] mt-1">user@hp.com • password123</div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-left">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Trainer Role</span> <span className="badge-blue">TRAINER</span>
                  </div>
                  <div className="text-gray-400 font-mono text-[11px] mt-1">trainer@hp.com • password123</div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-left">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Admin System</span> <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">ADMIN</span>
                  </div>
                  <div className="text-gray-400 font-mono text-[11px] mt-1">admin@hp.com • password123</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Pillars Feature Grid */}
      <section className="py-24 bg-surface/50 border-y border-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge-lime mb-2 inline-block">Engineered For Growth</span>
            <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tight mb-4">Enterprise Features Built Like A Pro</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">Designed by master strength coaches & principal software architects for maximum member retention.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Bot className="w-7 h-7 text-primary" />, 
                title: "Person-Specific AI Coach", 
                desc: "Calculates BMR, TDEE, macro ratios, and periodized Push/Pull/Legs splits tailored to body metrics & experience." 
              },
              { 
                icon: <Activity className="w-7 h-7 text-secondary" />, 
                title: "Live Workout Logger & Rest Timer", 
                desc: "Interactive set-by-set tracker with weight & rep inputs, audio-visual rest timer countdown, and RPE 8-9 targets." 
              },
              { 
                icon: <CreditCard className="w-7 h-7 text-primary" />, 
                title: "Razorpay Payment Gateway", 
                desc: "HMAC signature verification, instant tier upgrades (Starter, Pro, Elite), automated billing history & receipt downloads." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -8 }} 
                className="p-8 glass-card-interactive flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black italic uppercase text-white mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-xs sm:text-sm font-medium">{feature.desc}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-border flex items-center gap-2 text-xs font-bold text-primary">
                  <span>Explore Feature</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-24 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass-card p-12 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 border-primary/30 glow-border">
            <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tight mb-4">
              READY TO SCALE YOUR GYM SYSTEM?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Join thousands of athletes, trainers, and facility owners getting results with HealthPoint Fitness AI.
            </p>
            <Link to="/register" className="btn-premium px-10 py-4 text-xs inline-flex items-center gap-2">
              Launch Your Portal Account <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-primary" />
            <span className="font-bold text-white uppercase tracking-wider">HealthPoint Fitness Platform</span>
          </div>
          <div>© 2026 HealthPoint Fitness Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
