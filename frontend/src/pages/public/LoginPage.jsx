import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight, Mail, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell3D } from '../../components/ui/Icon3D';
import { motionTokens } from '../../tokens/designTokens';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      login(token, user);

      toast.success(`Welcome back, ${user.name}!`);
      
      const role = user.role?.toUpperCase();
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'TRAINER') navigate('/trainer/dashboard');
      else navigate('/member/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (fillEmail, fillPass = 'password') => {
    setEmail(fillEmail);
    setPassword(fillPass);
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
        <div className="panel-elevated p-8 sm:p-10 space-y-8 bg-surface-card border-border-light shadow-modal">
          
          {/* Header Brand */}
          <div className="text-center space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="p-2 bg-surface-elevated border border-border-light rounded-xl group-hover:scale-105 transition-transform shadow-sm">
                <Dumbbell3D size={26} />
              </div>
              <span className="text-xl font-bold tracking-tight text-text-primary font-display">
                HealthPoint
              </span>
            </Link>
            <div>
              <h1 className="heading-xl text-text-primary">Sign in to your portal</h1>
              <p className="body-sm text-text-secondary mt-1">Access your workouts, biomechanics logs, and coach chat</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="caption ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="athlete@healthpoint.com"
                  required 
                  className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-xs text-text-primary placeholder:text-text-muted" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="caption">Password</label>
                <span className="text-[11px] text-primary hover:underline cursor-pointer">Forgot?</span>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  required 
                  className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-xs text-text-primary placeholder:text-text-muted" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-3 text-xs sm:text-sm font-semibold mt-2 shadow-accent"
            >
              {loading ? 'Authenticating...' : 'Sign In'} 
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="caption text-text-muted">Instant Demo Sign-In</span>
              <span className="badge-muted text-[10px]">Test Sandboxes</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleQuickFill('user@hp.com', 'password')}
                className="px-2 py-1.5 rounded-lg bg-surface border border-border hover:border-primary/40 hover:text-text-primary text-text-secondary text-[11px] font-medium transition-all text-center"
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('trainer@hp.com', 'password')}
                className="px-2 py-1.5 rounded-lg bg-surface border border-border hover:border-primary/40 hover:text-text-primary text-text-secondary text-[11px] font-medium transition-all text-center"
              >
                Trainer
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@hp.com', 'password')}
                className="px-2 py-1.5 rounded-lg bg-surface border border-border hover:border-primary/40 hover:text-text-primary text-text-secondary text-[11px] font-medium transition-all text-center"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
