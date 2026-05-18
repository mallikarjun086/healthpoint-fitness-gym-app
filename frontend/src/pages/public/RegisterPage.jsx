import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight, Mail, Lock, User, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import api from '../../api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const registerPromise = api.post('/auth/register', formData);
    
    toast.promise(registerPromise, {
      loading: 'Creating account...',
      success: () => {
        setTimeout(() => navigate('/login'), 2000);
        return 'Account created! Redirecting to login...';
      },
      error: (err) => err.response?.data?.error || 'Registration failed.'
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="p-2 bg-gradient-premium rounded-xl group-hover:rotate-12 transition-transform"><Dumbbell className="w-6 h-6 text-black" /></div>
              <span className="text-xl font-bold tracking-tight">HealthPoint</span>
            </Link>
            <h1 className="text-3xl font-bold">Join the Community</h1>
          </div>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary" />
                <input type="text" placeholder="John Doe" required className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 text-white" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary" />
                <input type="email" placeholder="john@example.com" required className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 text-white" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary" />
                <input type="tel" placeholder="+1 (555) 000-0000" required className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 text-white" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary" />
                <input type="password" placeholder="••••••••" required className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 text-white" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn-premium w-full py-4 mt-6">Create Account</button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
