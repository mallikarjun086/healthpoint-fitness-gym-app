import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  Plus, 
  MapPin, 
  X
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { toast } from 'sonner';

const defaultSchedule = [
  {
    id: 1,
    clientName: 'Alex Rivers',
    type: '1-on-1 Personal Training',
    focus: 'Bench Press Form & Chest Hypertrophy',
    time: '03:00 PM - 04:00 PM',
    date: 'Today',
    room: 'Olympic Strength Zone',
    status: 'CONFIRMED'
  },
  {
    id: 2,
    clientName: 'Group Class (22 Enrolled)',
    type: 'HIIT Conditioning',
    focus: 'Full Body Conditioning Circuit',
    time: '05:30 PM - 06:15 PM',
    date: 'Today',
    room: 'Functional Arena',
    status: 'SCHEDULED'
  },
  {
    id: 3,
    clientName: 'Sarah Jenkins',
    type: '1-on-1 Personal Training',
    focus: 'Barbell Deadlift Mechanics & Glute Activation',
    time: '07:00 PM - 08:00 PM',
    date: 'Today',
    room: 'Platform #2',
    status: 'CONFIRMED'
  },
  {
    id: 4,
    clientName: 'Michael Vance',
    type: '1-on-1 Personal Training',
    focus: 'Heavy Squat Periodization (140kg Target)',
    time: '08:00 AM - 09:00 AM',
    date: 'Tomorrow',
    room: 'Squat Rack #1',
    status: 'CONFIRMED'
  }
];

const SessionSchedule = () => {
  const [sessions, setSessions] = useState(defaultSchedule);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    clientName: '',
    type: '1-on-1 Personal Training',
    focus: '',
    time: '10:00 AM - 11:00 AM',
    date: 'Today',
    room: 'Olympic Strength Zone'
  });

  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!newSession.clientName || !newSession.focus) {
      toast.error('Please enter client name and session focus');
      return;
    }

    const created = {
      id: Date.now(),
      ...newSession,
      status: 'CONFIRMED'
    };

    setSessions([created, ...sessions]);
    setIsModalOpen(false);
    toast.success(`Session scheduled for ${newSession.clientName}`);
    setNewSession({ clientName: '', type: '1-on-1 Personal Training', focus: '', time: '10:00 AM - 11:00 AM', date: 'Today', room: 'Olympic Strength Zone' });
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="trainer" />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent">Master Trainer Schedule</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">PT Sessions & Studio Clinics</h1>
            <p className="text-xs text-text-secondary mt-0.5">Manage 1-on-1 personal coaching slots, group clinics, and calendar availability.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" /> Schedule Session
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="panel p-5 space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Today's Sessions</span>
            <div className="text-2xl stat-number text-text-primary">3 Sessions</div>
            <div className="text-[11px] text-primary font-medium">Next: Alex Rivers (03:00 PM)</div>
          </div>

          <div className="panel p-5 space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Weekly Booked</span>
            <div className="text-2xl stat-number text-text-primary">28 Hours</div>
            <div className="text-[11px] text-text-secondary font-medium">85% Capacity</div>
          </div>

          <div className="panel p-5 space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Show-Up Rate</span>
            <div className="text-2xl stat-number text-text-primary">98%</div>
            <div className="text-[11px] text-emerald-400 font-medium">High adherence</div>
          </div>
        </div>

        {/* Weekly Day Strip */}
        <div className="panel p-3.5 mb-6">
          <div className="flex items-center justify-between overflow-x-auto gap-2">
            {daysOfWeek.map((day, idx) => (
              <div
                key={day}
                className={`flex-1 min-w-[90px] p-2.5 rounded-xl text-center transition-all ${
                  idx === 2 ? 'bg-primary text-white font-semibold' : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                }`}
              >
                <div className="text-[10px] uppercase font-medium">{day.slice(0, 3)}</div>
                <div className="text-sm stat-number mt-0.5">{28 + idx > 31 ? (28 + idx) - 31 : 28 + idx}</div>
                <div className="text-[10px] opacity-80">{idx === 2 ? '3 Slots' : idx === 6 ? 'Off' : '4 Slots'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-text-primary">
            Upcoming Appointments
          </h3>

          {sessions.map((s, idx) => (
            <div
              key={s.id || idx}
              className="panel p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-text-primary">{s.clientName}</h4>
                    <span className="badge-accent text-[10px]">{s.type}</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">Focus: <strong className="text-text-primary">{s.focus}</strong></p>
                  <div className="text-xs text-text-secondary flex flex-wrap items-center gap-2 mt-1 font-mono">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> {s.time}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> {s.room}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <span className="badge-success">
                  {s.status}
                </span>

                <button
                  onClick={() => toast.success(`Reminder sent to ${s.clientName}`)}
                  className="btn-secondary"
                >
                  Send Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Schedule Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="panel bg-surface border border-border p-6 rounded-2xl max-w-lg w-full shadow-2xl relative space-y-4"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-elevated">
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20"><Calendar className="w-4 h-4" /></div>
                <h3 className="text-base font-bold text-text-primary">Schedule PT Session</h3>
              </div>

              <form onSubmit={handleCreateSession} className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-text-secondary block mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivers"
                    value={newSession.clientName}
                    onChange={e => setNewSession({ ...newSession, clientName: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Type</label>
                    <select
                      value={newSession.type}
                      onChange={e => setNewSession({ ...newSession, type: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    >
                      <option value="1-on-1 Personal Training">1-on-1 Personal Training</option>
                      <option value="Group Studio Class">Group Studio Class</option>
                      <option value="Biometric Assessment">Biometric Assessment</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Room / Platform</label>
                    <input
                      type="text"
                      value={newSession.room}
                      onChange={e => setNewSession({ ...newSession, room: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Time Window</label>
                    <input
                      type="text"
                      value={newSession.time}
                      onChange={e => setNewSession({ ...newSession, time: e.target.value })}
                      placeholder="e.g. 04:00 PM - 05:00 PM"
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Day</label>
                    <select
                      value={newSession.date}
                      onChange={e => setNewSession({ ...newSession, date: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    >
                      <option value="Today">Today</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="This Friday">This Friday</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-text-secondary block mb-1">Focus Target *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Squat biomechanics & RDL overload"
                    value={newSession.focus}
                    onChange={e => setNewSession({ ...newSession, focus: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Confirm Slot
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SessionSchedule;
