import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-premium rounded-xl group-hover:rotate-12 transition-transform">
              <Dumbbell className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">HealthPoint <span className="text-primary">Fitness</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="nav-link">Features</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="btn-premium py-2 text-sm">Join Now</Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">{isOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-surface border-b border-border px-4 pt-2 pb-6 flex flex-col gap-4">
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="btn-premium text-center">Join Now</Link>
        </motion.div>
      )}
    </nav>
  );
};
export default Navbar;
