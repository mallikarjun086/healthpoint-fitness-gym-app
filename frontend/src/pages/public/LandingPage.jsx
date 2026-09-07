import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Dumbbell
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import HeroCanvas3D from '../../components/common/HeroCanvas3D';
import { Link } from 'react-router-dom';
import TiltCard from '../../components/ui/TiltCard';
import { Sparkles3D, Chart3D, Dumbbell3D } from '../../components/ui/Icon3D';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden selection:bg-primary/30 selection:text-white">
      <Navbar />

      {/* =========================================================
          HERO SECTION — Asymmetric, Oversized, Off-Center Architecture
         ========================================================= */}
      <section className="relative min-h-[92vh] lg:min-h-[100vh] flex items-center pt-24 lg:pt-0 overflow-hidden border-b border-border">
        
        {/* Subtle Dark Atmospheric Aura (Fades in 0-0.3s) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] pointer-events-none -z-10" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-accent-violet/10 rounded-full blur-[180px] pointer-events-none -z-10" 
        />

        {/* 3D OBJECT — Breaks the frame, bleeds off right edge & overlaps text (Fades/scales in 0.2-0.9s) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.88, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 right-[-12%] lg:right-[-6%] w-[75%] sm:w-[65%] lg:w-[58%] h-full flex items-center justify-center pointer-events-none z-0"
        >
          <HeroCanvas3D />
        </motion.div>

        {/* HERO CONTENT CONTAINER — Left Asymmetric Anchor (~55% width) */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10 py-16 lg:py-24">
          <div className="max-w-2xl lg:max-w-3xl space-y-8">
            
            {/* Oversized Headline with Staggered Line-by-Line Reveal (0.5-1.2s) */}
            <div className="space-y-1">
              {/* Line 1 */}
              <div className="overflow-hidden">
                <motion.h1 
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.85, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl sm:text-7xl lg:text-[5.75rem] font-black tracking-[-0.035em] text-text-primary leading-[0.96] block"
                >
                  Where Human
                </motion.h1>
              </div>

              {/* Line 2 */}
              <div className="overflow-hidden">
                <motion.h1 
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.85, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl sm:text-7xl lg:text-[5.75rem] font-black tracking-[-0.035em] text-text-primary leading-[0.96] block"
                >
                  Biomechanics
                </motion.h1>
              </div>

              {/* Line 3 */}
              <div className="overflow-hidden">
                <motion.h1 
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.85, delay: 0.70, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl sm:text-7xl lg:text-[5.75rem] font-black tracking-[-0.035em] leading-[0.96] block bg-gradient-to-r from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent"
                >
                  Meets Intelligence.
                </motion.h1>
              </div>
            </div>

            {/* Subheading (Fades in 0.9-1.3s) */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
              className="text-base sm:text-lg text-text-secondary max-w-lg font-normal leading-relaxed tracking-tight"
            >
              The unified platform connecting person-specific hypertrophy splits, live progressive overload telemetry, and automated facility operations.
            </motion.p>

            {/* Understated Single Action CTA (Fades in 1.05-1.4s) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.05, ease: "easeOut" }}
              className="pt-2 flex items-center gap-6"
            >
              <Link 
                to="/register" 
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-text-primary text-background font-semibold text-xs hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <span>Start 14-Day Free Access</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link 
                to="/login"
                className="group text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 py-2"
              >
                <span>Explore Live Portal</span>
                <span className="text-text-muted group-hover:text-text-primary transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-24 bg-surface/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-14">
            <span className="badge-accent mb-2.5 inline-block text-[11px]">Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">Built for serious performance.</h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">Calibrated by master strength coaches and software architects for athlete retention.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                IconComponent: Sparkles3D,
                title: "Person-Specific AI Coach",
                desc: "Calculates BMR, TDEE, macro ratios, and periodized Push/Pull/Legs splits tailored to body metrics and training age."
              },
              {
                IconComponent: Chart3D,
                title: "Live Volume Telemetry",
                desc: "Set-by-set tracker with weight and rep inputs, integrated rest timer countdown, and progressive overload target curves."
              },
              {
                IconComponent: Dumbbell3D,
                title: "3D Biomechanical Vault",
                desc: "Interactive anatomical body map and 100% muscle coverage exercise database with form cues and common error alerts."
              }
            ].map((f, i) => (
              <TiltCard key={i} maxTilt={3} className="panel p-6 space-y-3.5">
                <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                  <f.IconComponent size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <TiltCard maxTilt={2} className="panel p-12 bg-surface-elevated border-border space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Upgrade your club and athlete experience.
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
                Join athletes, trainers, and gym facility owners elevating performance with HealthPoint Fitness.
              </p>
            </div>
            <div>
              <Link to="/register" className="btn-hero text-xs px-8 py-3.5 shadow-lg">
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
            <span>HealthPoint Fitness</span>
          </div>
          <div>© 2026 HealthPoint Fitness Platform. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
