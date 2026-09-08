import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight, Mail, Lock, User, Phone, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import api from '../../api';
import { Dumbbell3D } from '../../components/ui/Icon3D';
import { motionTokens } from '../../tokens/designTokens';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Lighting Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.98 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={motionTokens.spring.default}
        className="w-full max-w-md relative z-10"
      >
        <div className="panel-elevated p-8 sm:p-10 space-y-6 bg-surface-card border-border-light shadow-modal">
          
          {/* Header Brand */}
          <div className="text-center space-y-2.5">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="p-2 bg-surface-elevated border border-border-light rounded-xl group-hover:scale-105 transition-transform shadow-sm">
                <Dumbbell3D size={26} />
              </div>
              <span className="text-xl font-bold tracking-tight text-text-primary font-display">
                HealthPoint
              </span>
            </Link>
            <div>
              <h1 className="heading-xl text-text-primary">Join the Athletic Club</h1>
              <p className="body-sm text-text-secondary mt-0.5">Start your 14-day free access to personalized training</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1">
              <label className="caption ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Alex Rivers" 
                  required 
                  className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-xs text-text-primary placeholder:text-text-muted" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="caption ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  placeholder="alex@healthpoint.com" 
                  required 
                  className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-xs text-text-primary placeholder:text-text-muted" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="caption ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="tel" 
                  placeholder="+1 (555) 019-2834" 
                  required 
                  className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-xs text-text-primary placeholder:text-text-muted" 
                  value={formData.phoneNumber} 
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="caption ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-xs text-text-primary placeholder:text-text-muted" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-3 text-xs sm:text-sm font-semibold mt-4 shadow-accent"
            >
              {loading ? 'Creating Account...' : 'Create Account'} 
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
