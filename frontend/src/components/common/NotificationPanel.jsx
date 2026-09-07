import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Sparkles, 
  Calendar, 
  UserCheck, 
  Flame,
  CreditCard, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const defaultNotifications = [
  {
    id: 1,
    title: 'Coach Protocol Updated',
    message: 'Master Trainer Alex updated your Push hypertrophy volume targets (34kg Incline DB Press).',
    type: 'COACH',
    isRead: false,
    linkUrl: '/member/workouts',
    createdAt: '10m ago'
  },
  {
    id: 2,
    title: 'Class Reminder: Barbell Clinic',
    message: 'Barbell Strength & Deadlift Clinic begins today at 05:30 PM in the Olympic Platform.',
    type: 'CLASS',
    isRead: false,
    linkUrl: '/member/classes',
    createdAt: '2h ago'
  },
  {
    id: 3,
    title: 'Consistency Streak Milestone: 7 Days',
    message: 'Outstanding consistency! You have completed 7 consecutive days at HealthPoint.',
    type: 'STREAK',
    isRead: true,
    linkUrl: '/member/attendance',
    createdAt: '1d ago'
  },
  {
    id: 4,
    title: 'Annual VIP Membership Active',
    message: 'Your 365-day multi-branch VIP membership is active with auto-renewal enabled.',
    type: 'RENEWAL',
    isRead: true,
    linkUrl: '/member/payments',
    createdAt: '3d ago'
  }
];

const NotificationPanel = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(defaultNotifications);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const fetchNotifications = async () => {
    try {
      const userId = user?.id || 3;
      const res = await api.get(`/notifications/user/${userId}`);
      if (res.data && res.data.length > 0) {
        setNotifications(res.data);
      }
    } catch (e) {
      console.log('Notifications fallback');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const userId = user?.id || 3;
      await api.post(`/notifications/mark-all-read/${userId}`);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (e) {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-surface border-l border-border h-full flex flex-col justify-between shadow-2xl p-6"
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-border mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-text-primary">Notifications</h3>
                    <span className="text-[11px] text-text-secondary">{unreadCount} unread updates</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                  <button onClick={onClose} className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    to={n.linkUrl || '#'}
                    onClick={onClose}
                    className={`block p-3.5 rounded-xl border transition-all ${
                      !n.isRead
                        ? 'bg-surface-elevated border-primary/30 hover:border-primary'
                        : 'bg-surface border-border hover:border-border-light opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        n.type === 'COACH' ? 'bg-accent-violet/10 text-accent-violet' :
                        n.type === 'CLASS' ? 'bg-primary/10 text-primary' :
                        n.type === 'STREAK' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-surface-elevated text-text-secondary'
                      }`}>
                        {n.type === 'COACH' ? <UserCheck className="w-3.5 h-3.5" /> :
                         n.type === 'CLASS' ? <Calendar className="w-3.5 h-3.5" /> :
                         n.type === 'STREAK' ? <Flame className="w-3.5 h-3.5" /> :
                         <Sparkles className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="font-semibold text-xs text-text-primary">{n.title}</h4>
                          <span className="text-[10px] text-text-muted">{n.createdAt || 'Today'}</span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border text-center text-xs text-text-secondary">
              Real-time telemetry and schedule updates active
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
