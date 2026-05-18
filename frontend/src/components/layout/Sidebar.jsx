import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, TrendingUp, CreditCard, LogOut, Dumbbell, Video, ClipboardList, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ role = 'admin' }) => {
  const location = useLocation();
  const menuItems = {
    admin: [
      { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { path: '/admin/analytics', icon: TrendingUp, label: 'Revenue' },
      { path: '/admin/members', icon: Users, label: 'Members' },
      { path: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
      { path: '/admin/content', icon: Video, label: 'Content' },
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
  const items = menuItems[role] || menuItems.admin;
  return (
    <div className="w-64 h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-gradient-premium rounded-lg"><Dumbbell className="w-5 h-5 text-black" /></div>
          <span className="text-lg font-bold">HealthPoint</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${isActive ? 'text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all">
          <LogOut className="w-5 h-5" /><span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
