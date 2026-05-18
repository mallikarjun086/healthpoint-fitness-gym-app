import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import api from '../../api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginPromise = api.post('/auth/login', { email, password });
    
    toast.promise(loginPromise, {
      loading: 'Authenticating...',
      success: (res) => {
        const { token } = res.data;
        localStorage.setItem('token', token);
        
        // Demo routing logic based on email
        if (email.includes('admin')) navigate('/admin/dashboard');
        else if (email.includes('trainer')) navigate('/trainer/dashboard');
        else navigate('/member/dashboard');
        
        return 'Logged in successfully!';
      },
      error: (err) => {
        return err.response?.data?.error || 'Login failed. Please check credentials.';
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md relative">
        <div className="glass-card p-8 lg:p-10">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="p-2 bg-gradient-premium rounded-xl group-hover:rotate-12 transition-transform"><Dumbbell className="w-6 h-6 text-black" /></div>
              <span className="text-xl font-bold tracking-tight">HealthPoint</span>
            </Link>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white" />
              </div>
            </div>
            <button type="submit" className="btn-premium w-full flex items-center justify-center gap-2 py-4 mt-8">Sign In <ArrowRight className="w-5 h-5" /></button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-400">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Create an account</Link>
          </div>
        </div>
        <div className="mt-6 p-4 rounded-xl border border-border bg-surface/30 text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-400 mb-1">Demo Access:</p>
          <p>Admin: <code className="text-primary">admin@hp.com</code>, Trainer: <code className="text-primary">trainer@hp.com</code>, Member: <code className="text-primary">user@hp.com</code></p>
        </div>
      </motion.div>
    </div>
  );
};
export default LoginPage;
