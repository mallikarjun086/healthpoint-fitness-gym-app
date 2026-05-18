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
  Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: "Precision Training",
      desc: "We believe in the science of movement. Every rep, set, and rest period is calculated for maximum metabolic impact."
    },
    {
      icon: Heart,
      title: "Human First",
      desc: "Technology is our tool, but human success is our goal. We build systems that adapt to your lifestyle, not the other way around."
    },
    {
      icon: ShieldCheck,
      title: "Elite Integrity",
      desc: "Our protocols are designed by certified professionals and Olympic athletes. We don't follow trends; we set standards."
    }
  ];

  const stats = [
    { label: "Active Members", value: "10k+" },
    { label: "Workouts Logged", value: "1.2M" },
    { label: "Expert Trainers", value: "50+" },
    { label: "Success Stories", value: "98%" }
  ];

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-premium rounded-xl"><Dumbbell className="w-6 h-6 text-black" /></div>
            <span className="text-xl font-black italic tracking-tighter">HEALTHPOINT</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link to="/features" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">Features</Link>
            <Link to="/pricing" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">Pricing</Link>
            <Link to="/register" className="btn-premium px-6 py-2.5 text-xs font-black">JOIN NOW</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <History className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Story</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-8">
            The Science of <br /><span className="text-primary">Human Excellence.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            HealthPoint was born out of a simple realization: the gap between professional athletic training and the average gym experience was too wide. We bridged it with technology.
          </p>
        </motion.div>
      </header>

      {/* Stats Bar */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-black italic text-primary mb-2">{stat.value}</div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000" 
              alt="Gym Environment" 
              className="relative rounded-3xl border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-10 -right-10 glass-card p-8 border-primary/20 max-w-[280px]">
              <Quote className="w-8 h-8 text-primary mb-4" />
              <p className="text-sm italic font-medium leading-relaxed">
                "Our mission is to democratize elite training. If you have the drive, we have the system."
              </p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">HealthPoint Founder</span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-tight mb-8">
              Why We <br />Built This.
            </h2>
            <div className="space-y-12">
              {values.map((value) => (
                <div key={value.title} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">{value.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-40 px-6 text-center bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-3xl mx-auto">
          <Trophy className="w-16 h-16 text-primary mx-auto mb-10" />
          <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-8 leading-none">Your Success is Our Only Benchmark.</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            We aren't just an app; we are your digital partner in progress. Every line of code we write and every workout we seed is aimed at one thing: making you 1% better every single day.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/register" className="btn-premium px-12 py-5 text-sm font-black uppercase tracking-widest">JOIN THE REVOLUTION</Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Dumbbell className="w-5 h-5 text-primary" />
          <span className="text-sm font-black italic tracking-tighter">HEALTHPOINT FITNESS</span>
        </div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
          &copy; 2024 Built with Passion for the Dedicated.
        </p>
      </footer>
    </div>
  );
};

export default AboutPage;
