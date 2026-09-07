import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Menu, X, MapPin, Calculator, Video } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-primary rounded-xl text-white group-hover:scale-105 transition-transform shadow-sm">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-base font-bold tracking-tight text-text-primary">
              HealthPoint <span className="text-text-secondary font-medium">Fitness</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium">
            <Link to="/health-hub" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-primary" /> Health Hub
            </Link>
            <Link to="/free-workouts" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-primary" /> Workout Library
            </Link>
            <Link to="/find-gym" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Find a Gym
            </Link>
            <Link to="/features" className="text-text-secondary hover:text-text-primary transition-colors">Features</Link>
            <Link to="/pricing" className="text-text-secondary hover:text-text-primary transition-colors">Pricing</Link>
            
            <div className="flex items-center gap-3 pl-2 border-l border-border">
              <Link to="/login" className="btn-ghost">Sign In</Link>
              <Link to="/register" className="btn-primary">Join Club</Link>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-text-secondary hover:text-text-primary">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-surface border-b border-border px-6 pt-3 pb-6 flex flex-col gap-3 text-xs font-medium">
          <Link to="/health-hub" onClick={() => setIsOpen(false)} className="text-text-primary py-1">Health Hub & Calculators</Link>
          <Link to="/free-workouts" onClick={() => setIsOpen(false)} className="text-text-primary py-1">Workout Library</Link>
          <Link to="/find-gym" onClick={() => setIsOpen(false)} className="text-text-primary py-1">Find a Gym & Pass</Link>
          <Link to="/features" onClick={() => setIsOpen(false)} className="text-text-secondary py-1">Features</Link>
          <Link to="/pricing" onClick={() => setIsOpen(false)} className="text-text-secondary py-1">Pricing</Link>
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary text-center">Sign In</Link>
            <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary text-center">Join Club</Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
