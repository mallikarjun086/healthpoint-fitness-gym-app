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
  Calendar,
  Sparkles,
  Utensils,
  MessageSquare,
  Scale,
  Camera,
  Trophy,
  UserPlus,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import NotificationPanel from '../common/NotificationPanel';
import { Dumbbell3D } from '../ui/Icon3D';

const Sidebar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRole = (role || user?.role || 'member').toLowerCase();

  const menuItems = {
    admin: [
      { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { path: '/admin/analytics', icon: TrendingUp, label: 'Revenue Analytics' },
      { path: '/admin/members', icon: Users, label: 'Member Directory' },
      { path: '/admin/staff', icon: UserCheck, label: 'Staff & Trainers' },
      { path: '/admin/leads', icon: UserPlus, label: 'Lead Inquiries' },
      { path: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
      { path: '/admin/content', icon: Video, label: 'Content Manager' },
    ],
    trainer: [
      { path: '/trainer/dashboard', icon: LayoutDashboard, label: 'Trainer Hub' },
      { path: '/trainer/schedule', icon: Calendar, label: 'Session Schedule' },
      { path: '/trainer/diet-builder', icon: Utensils, label: 'Diet Plan Builder' },
      { path: '/trainer/chat', icon: MessageSquare, label: 'Client Messaging' },
      { path: '/admin/members', icon: Users, label: 'Coaching Roster' },
      { path: '/admin/content', icon: Video, label: 'Exercise Vault' },
    ],
    member: [
      { path: '/member/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/member/ai-planner', icon: Sparkles, label: 'AI Plan Wizard' },
      { path: '/member/workouts', icon: Dumbbell, label: 'Workout Split' },
      { path: '/member/nutrition', icon: Utensils, label: 'Nutrition & Macros' },
      { path: '/member/metrics', icon: Scale, label: 'Body Metrics' },
      { path: '/member/photos', icon: Camera, label: 'Progress Photos' },
      { path: '/member/classes', icon: Calendar, label: 'Book Classes' },
      { path: '/member/attendance', icon: ClipboardList, label: 'Attendance & Pass' },
      { path: '/member/leaderboard', icon: Trophy, label: 'Leaderboard' },
      { path: '/member/chat', icon: MessageSquare, label: 'Coach Chat' },
      { path: '/member/videos', icon: Video, label: 'Video Library' },
      { path: '/member/payments', icon: CreditCard, label: 'Billing' },
    ]
  };

  const items = menuItems[currentRole] || menuItems.member;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-50 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-surface-elevated border border-border">
            <Dumbbell3D size={24} />
          </div>
          <span className="text-base font-bold text-text-primary tracking-tight">HealthPoint</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 text-text-secondary hover:text-text-primary relative"
          >
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-primary absolute top-1.5 right-1.5"></span>
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-text-secondary hover:text-text-primary"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar & Mobile Drawer */}
      <aside className={`
        fixed left-0 top-0 z-40 h-screen w-64 bg-surface border-r border-border flex flex-col justify-between transition-transform duration-200
        ${isOpen ? 'translate-x-0 pt-16 md:pt-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full justify-between p-5">
          <div className="overflow-y-auto pr-1">
            <div className="hidden md:flex items-center justify-between mb-6 px-1">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="p-1.5 bg-surface-elevated border border-border rounded-xl group-hover:scale-105 transition-transform shadow-panel">
                  <Dumbbell3D size={24} />
                </div>
                <div>
                  <span className="text-base font-bold tracking-tight text-text-primary block leading-none">HealthPoint</span>
                  <span className="text-[10px] text-text-secondary font-medium tracking-wide">Fitness Platform</span>
                </div>
              </Link>

              <button
                onClick={() => setIsNotificationOpen(true)}
                className="p-2 rounded-xl bg-surface-elevated hover:bg-surface-hover text-text-secondary hover:text-text-primary relative transition-colors border border-border"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-1.5 right-1.5"></span>
              </button>
            </div>

            <nav className="space-y-0.5">
              {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-xs font-medium relative group ${
                      isActive 
                        ? 'text-white bg-primary/10 border border-primary/20 font-semibold shadow-sm' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'}`} />
                    <span>{item.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-border space-y-3 shrink-0">
            {/* Persona Switcher */}
            <div className="p-2.5 rounded-xl bg-surface-elevated border border-border space-y-1.5">
              <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                Persona Switcher
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10px] font-medium">
                <button
                  onClick={() => navigate('/member/dashboard')}
                  className={`py-1 rounded-lg text-center transition-all ${location.pathname.startsWith('/member') ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:text-text-primary bg-surface'}`}
                >
                  Member
                </button>
                <button
                  onClick={() => navigate('/trainer/dashboard')}
                  className={`py-1 rounded-lg text-center transition-all ${location.pathname.startsWith('/trainer') ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:text-text-primary bg-surface'}`}
                >
                  Trainer
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className={`py-1 rounded-lg text-center transition-all ${location.pathname.startsWith('/admin') ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:text-text-primary bg-surface'}`}
                >
                  Admin
                </button>
              </div>
            </div>

            {user && (
              <div className="px-3 py-2 bg-surface-elevated border border-border rounded-xl flex items-center justify-between">
                <div className="truncate">
                  <div className="text-xs font-semibold text-text-primary truncate">{user.name}</div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-wider">{user.role || currentRole}</div>
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-secondary hover:text-red-400 hover:bg-red-500/5 transition-all text-xs font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Global Notification Panel Drawer */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
};

export default Sidebar;
