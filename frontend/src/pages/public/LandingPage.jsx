import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Trophy, Zap, ShieldCheck, Dumbbell } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden">
      <Navbar />
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4 fill-primary" /> Revolutionizing Gym Management
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
              Elevate Your Fitness <br />
              <span className="bg-gradient-premium bg-clip-text text-transparent">Business to the Next Level</span>
            </h1>
            <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              The all-in-one SaaS platform for gym owners, trainers, and members. 
              Manage memberships, track progress, and scale your fitness community effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-premium w-full sm:w-auto flex items-center justify-center gap-2">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-surface border border-border hover:bg-white/5 transition-colors w-full sm:w-auto justify-center">
                <Play className="w-5 h-5 fill-white" /> Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Powerful Features for Everyone</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Everything you need to run a modern fitness facility and keep your members engaged.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Users />, title: "Membership Mgmt", desc: "Automated billing, renewals, and member profiles at your fingertips." },
              { icon: <Trophy />, title: "Workout & Diet Plans", desc: "Personalized plans for members with progress tracking and video guides." },
              { icon: <ShieldCheck />, title: "Secure Payments", desc: "Integrated Razorpay support for subscriptions and add-on services." }
            ].map((feature, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="p-8 glass-card">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 border border-primary/20 text-primary">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Dumbbell className="w-5 h-5 text-primary" />
            <span className="text-white font-bold tracking-tight">HealthPoint</span>
          </div>
          <p>© 2026 HealthPoint Fitness. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
