import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Menu, X, MapPin, Calculator, Video, Sparkles, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motionTokens } from '../../tokens/designTokens';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/health-hub', label: 'Health Hub', icon: Calculator },
    { to: '/free-workouts', label: 'Workouts', icon: Video },
    { to: '/find-gym', label: 'Locations', icon: MapPin },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Memberships' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 pb-2 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo Floating Capsule */}
        <Link 
          to="/" 
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-2xl glass-pill hover:border-white/20 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Dumbbell className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-text-primary leading-tight font-display">
              HealthPoint
            </span>
            <span className="text-[10px] tracking-wider uppercase text-text-muted font-medium">
              Athletic Intelligence
            </span>
          </div>
        </Link>

        {/* Center Navigation Pill (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl glass-pill pointer-events-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white/10 text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-primary" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Auth CTA Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-2 pointer-events-auto">
          <Link to="/login" className="btn-secondary py-2 text-xs">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary py-2 text-xs">
            Join Club <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden pointer-events-auto p-2.5 rounded-2xl glass-pill text-text-primary hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={motionTokens.spring.default}
            className="md:hidden max-w-lg mx-auto mt-2 p-5 rounded-3xl glass-surface pointer-events-auto space-y-3"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-text-primary hover:bg-white/5 transition-colors"
                  >
                    {Icon && <Icon className="w-4 h-4 text-primary" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="btn-secondary w-full text-center py-2.5 text-xs"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full text-center py-2.5 text-xs"
              >
                Join HealthPoint Club
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
