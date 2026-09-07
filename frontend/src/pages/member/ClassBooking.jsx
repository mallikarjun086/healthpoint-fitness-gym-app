import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  X, 
  Filter,
  UserCheck
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const defaultClassSessions = [
  {
    id: 1,
    title: 'Sunrise Power Yoga & Mobility',
    instructorName: 'Elena Rostova',
    category: 'YOGA',
    startTime: '06:30 AM',
    endTime: '07:30 AM',
    sessionDate: new Date().toISOString().split('T')[0],
    capacity: 20,
    enrolledCount: 14,
    room: 'Studio A (Zen Hall)',
    description: 'Dynamic vinyasa flow with deep hip opening and breathwork.'
  },
  {
    id: 2,
    title: 'HIIT Metabolic Conditioning',
    instructorName: 'Alex Mercer',
    category: 'HIIT',
    startTime: '08:00 AM',
    endTime: '08:45 AM',
    sessionDate: new Date().toISOString().split('T')[0],
    capacity: 25,
    enrolledCount: 22,
    room: 'Functional Zone',
    description: 'High-octane interval circuits targeting maximum caloric expenditure.'
  },
  {
    id: 3,
    title: 'Barbell Strength & Deadlift Clinic',
    instructorName: 'Marcus Vance',
    category: 'STRENGTH',
    startTime: '05:30 PM',
    endTime: '06:30 PM',
    sessionDate: new Date().toISOString().split('T')[0],
    capacity: 15,
    enrolledCount: 12,
    room: 'Olympic Platform',
    description: 'Biomechanics breakdown of the clean, deadlift, and squat.'
  },
  {
    id: 4,
    title: 'Zumba Cardio Rhythm',
    instructorName: 'Priya Sharma',
    category: 'ZUMBA',
    startTime: '07:00 PM',
    endTime: '08:00 PM',
    sessionDate: new Date().toISOString().split('T')[0],
    capacity: 30,
    enrolledCount: 26,
    room: 'Studio B',
    description: 'High-energy Latin and contemporary cardio choreography.'
  },
  {
    id: 5,
    title: 'CrossFit MetCon Intervals',
    instructorName: 'Alex Mercer',
    category: 'CROSSFIT',
    startTime: '07:00 AM',
    endTime: '08:00 AM',
    sessionDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    capacity: 20,
    enrolledCount: 10,
    room: 'CrossFit Rig',
    description: 'WOD featuring kettlebell snatches, box jumps, and row intervals.'
  }
];

const ClassBooking = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState(defaultClassSessions);
  const [myBookings, setMyBookings] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeTab, setActiveTab] = useState('SCHEDULE');

  const categories = ['ALL', 'YOGA', 'HIIT', 'STRENGTH', 'ZUMBA', 'CROSSFIT'];

  useEffect(() => {
    fetchSessions();
    fetchUserBookings();
  }, [user]);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/classes/upcoming');
      if (res.data && res.data.length > 0) {
        setSessions(res.data);
      }
    } catch (e) {
      console.log('Using default classes');
    }
  };

  const fetchUserBookings = async () => {
    try {
      const userId = user?.id || 3;
      const res = await api.get(`/classes/my-bookings/user/${userId}`);
      if (res.data) {
        setMyBookings(res.data);
      }
    } catch (e) {
      console.log('Bookings fallback');
    }
  };

  const handleBookSession = async (session) => {
    try {
      const userId = user?.id || 3;
      await api.post('/classes/book', {
        userId: userId,
        classSessionId: session.id
      });
      toast.success(`Reserved slot for ${session.title}`);
      setSessions(prev => prev.map(s => s.id === session.id ? { ...s, enrolledCount: s.enrolledCount + 1 } : s));
      fetchUserBookings();
    } catch (err) {
      const errMsg = err.response?.data?.error || `Failed to reserve slot for ${session.title}`;
      toast.error(errMsg);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.post(`/classes/cancel/${bookingId}`);
      toast.info('Booking cancelled successfully');
      fetchUserBookings();
      fetchSessions();
    } catch (e) {
      toast.info('Booking reservation removed');
      setMyBookings(prev => prev.filter(b => b.id !== bookingId));
    }
  };

  const isAlreadyBooked = (sessionId) => {
    return myBookings.some(b => b.classSession?.id === sessionId && b.status === 'CONFIRMED');
  };

  const filteredSessions = sessions.filter(s => {
    return activeCategory === 'ALL' || s.category.toUpperCase() === activeCategory;
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent">Studio Schedule</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Class & Studio Booking</h1>
            <p className="text-xs text-text-secondary mt-0.5">Reserve your slot for functional conditioning, barbell clinics, and mobility sessions.</p>
          </div>

          <div className="flex bg-surface-elevated border border-border p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('SCHEDULE')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'SCHEDULE' ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Class Schedule
            </button>
            <button
              onClick={() => setActiveTab('MY_BOOKINGS')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all relative ${activeTab === 'MY_BOOKINGS' ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:text-text-primary'}`}
            >
              My Reservations
              {myBookings.filter(b => b.status === 'CONFIRMED').length > 0 && (
                <span className="ml-2 px-1.5 py-0.2 bg-surface text-primary text-[10px] rounded-full font-bold">
                  {myBookings.filter(b => b.status === 'CONFIRMED').length}
                </span>
              )}
            </button>
          </div>
        </header>

        {activeTab === 'SCHEDULE' ? (
          <>
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
              <Filter className="w-3.5 h-3.5 text-text-muted mr-1 shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    activeCategory === cat 
                      ? 'bg-primary text-white font-semibold' 
                      : 'bg-surface-elevated text-text-secondary hover:text-text-primary border border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSessions.map((session) => {
                const booked = isAlreadyBooked(session.id);
                const slotsRemaining = session.capacity - session.enrolledCount;
                const percentFilled = Math.min(100, Math.round((session.enrolledCount / session.capacity) * 100));

                return (
                  <div
                    key={session.id}
                    className="panel p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="badge-accent">{session.category}</span>

                        <div className="flex items-center gap-1 text-[11px] text-text-secondary font-mono bg-surface-elevated px-2 py-0.5 rounded-md border border-border">
                          <Clock className="w-3 h-3 text-primary" />
                          {session.startTime} - {session.endTime}
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-text-primary">
                        {session.title}
                      </h3>

                      <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                        {session.description}
                      </p>

                      <div className="space-y-1.5 py-2.5 border-y border-border text-xs text-text-secondary">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-text-muted"><UserCheck className="w-3.5 h-3.5 text-primary" /> Instructor</span>
                          <span className="font-medium text-text-primary">{session.instructorName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-text-muted"><MapPin className="w-3.5 h-3.5 text-primary" /> Location</span>
                          <span className="font-medium text-text-primary">{session.room}</span>
                        </div>
                      </div>

                      {/* Capacity bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-text-secondary">Class Capacity</span>
                          <span className={slotsRemaining <= 3 ? 'text-amber-400 font-medium' : 'text-primary font-medium'}>
                            {session.enrolledCount} / {session.capacity} ({slotsRemaining} slots left)
                          </span>
                        </div>
                        <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden border border-border">
                          <div
                            className={`h-full rounded-full transition-all ${slotsRemaining <= 3 ? 'bg-amber-400' : 'bg-primary'}`}
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={booked || slotsRemaining <= 0}
                      onClick={() => handleBookSession(session)}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        booked 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default' 
                          : slotsRemaining <= 0 
                            ? 'bg-surface-elevated text-text-muted cursor-not-allowed border border-border'
                            : 'btn-primary'
                      }`}
                    >
                      {booked ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Reserved
                        </>
                      ) : slotsRemaining <= 0 ? (
                        'Class Full'
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" /> Reserve Slot
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* My Bookings Tab */
          <div className="space-y-3 max-w-3xl">
            {myBookings.length === 0 ? (
              <div className="panel p-10 text-center space-y-3">
                <Calendar className="w-10 h-10 text-text-muted mx-auto opacity-50" />
                <h3 className="text-sm font-bold text-text-primary">No Active Reservations</h3>
                <p className="text-xs text-text-secondary">You have not booked any upcoming group sessions yet.</p>
                <button onClick={() => setActiveTab('SCHEDULE')} className="btn-primary">
                  Browse Class Schedule
                </button>
              </div>
            ) : (
              myBookings.map((b, idx) => (
                <div key={b.id || idx} className="panel p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="badge-accent mb-1 inline-block">{b.classSession?.category || 'GROUP'}</span>
                      <h4 className="text-sm font-bold text-text-primary">{b.classSession?.title || 'Studio Session'}</h4>
                      <div className="text-xs text-text-secondary flex items-center gap-2 mt-0.5">
                        <span>{b.classSession?.startTime} - {b.classSession?.endTime}</span>
                        <span>•</span>
                        <span>{b.classSession?.room}</span>
                        <span>•</span>
                        <span>Instructor: <strong className="text-text-primary">{b.classSession?.instructorName}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="badge-success">
                      {b.status || 'CONFIRMED'}
                    </span>
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      title="Cancel Booking"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClassBooking;
