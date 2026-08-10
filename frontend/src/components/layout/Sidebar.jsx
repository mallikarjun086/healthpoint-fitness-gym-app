import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  CreditCard, 
  LogOut, 
  Dumbbell, 
  Video, 
  ClipboardList, 
  Target,
  UserCheck,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Sidebar = ({ role = 'admin' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRole = (role || user?.role || 'admin').toLowerCase();

  const menuItems = {
    admin: [
      { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { path: '/admin/analytics', icon: TrendingUp, label: 'Revenue' },
      { path: '/admin/members', icon: Users, label: 'Members' },
      { path: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
      { path: '/admin/content', icon: Video, label: 'Content' },
    ],
    trainer: [
      { path: '/trainer/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { path: '/admin/members', icon: UserCheck, label: 'Client Roster' },
      { path: '/admin/content', icon: Video, label: 'Workout Library' },
    ],
    member: [
      { path: '/member/dashboard', icon: LayoutDashboard, label: 'My Progress' },
      { path: '/member/goals', icon: Target, label: 'Set Goals' },
      { path: '/member/workouts', icon: Dumbbell, label: 'Workouts' },
      { path: '/member/diet', icon: ClipboardList, label: 'Diet Plans' },
      { path: '/member/videos', icon: Video, label: 'Video Library' },
      { path: '/member/payments', icon: CreditCard, label: 'Billing' },
    ]
  };

  const items = menuItems[currentRole] || menuItems.admin;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-50 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-premium rounded-lg"><Dumbbell className="w-5 h-5 text-black" /></div>
          <span className="text-lg font-bold">HealthPoint</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-gray-400 hover:text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Drawer */}
      <aside className={`
        fixed left-0 top-0 z-40 h-screen w-64 bg-surface border-r border-border flex flex-col justify-between transition-transform duration-300
        ${isOpen ? 'translate-x-0 pt-16 md:pt-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full justify-between p-6">
          <div>
            <div className="hidden md:flex items-center gap-2 mb-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-2 bg-gradient-premium rounded-xl group-hover:rotate-12 transition-transform">
                  <Dumbbell className="w-5 h-5 text-black" />
                </div>
                <span className="text-lg font-bold tracking-tight">HealthPoint <span className="text-primary text-xs uppercase block font-black">Portal</span></span>
              </Link>
            </div>

            <nav className="space-y-1.5">
              {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${isActive ? 'text-primary font-bold bg-primary/10 border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-border space-y-4">
            {user && (
              <div className="px-4 py-2 bg-white/5 rounded-xl flex items-center justify-between">
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{user.role || currentRole}</div>
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-bold"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
