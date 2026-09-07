import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Phone, 
  Mail, 
  X, 
  Trash2
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { toast } from 'sonner';

const defaultStaffMembers = [
  {
    id: 2,
    name: 'Alex Mercer',
    email: 'trainer@hp.com',
    phoneNumber: '+91 9876543211',
    role: 'TRAINER',
    specialization: 'Hypertrophy & Biomechanics',
    activeClients: 14,
    rating: '4.9/5.0',
    joinedDate: 'Jan 2024',
    status: 'ACTIVE'
  },
  {
    id: 10,
    name: 'Elena Rostova',
    email: 'elena.r@hp.com',
    phoneNumber: '+91 9876543215',
    role: 'TRAINER',
    specialization: 'Yoga & Mobility',
    activeClients: 18,
    rating: '5.0/5.0',
    joinedDate: 'Mar 2024',
    status: 'ACTIVE'
  },
  {
    id: 11,
    name: 'Marcus Vance',
    email: 'marcus.v@hp.com',
    phoneNumber: '+91 9876543216',
    role: 'TRAINER',
    specialization: 'Olympic Weightlifting',
    activeClients: 11,
    rating: '4.8/5.0',
    joinedDate: 'Jun 2024',
    status: 'ACTIVE'
  },
  {
    id: 12,
    name: 'Priya Sharma',
    email: 'priya.s@hp.com',
    phoneNumber: '+91 9876543217',
    role: 'FRONT_DESK',
    specialization: 'Front Desk & Zumba Lead',
    activeClients: 0,
    rating: '4.9/5.0',
    joinedDate: 'Feb 2024',
    status: 'ACTIVE'
  }
];

const StaffManagement = () => {
  const [staffList, setStaffList] = useState(defaultStaffMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'TRAINER',
    specialization: '',
    status: 'ACTIVE'
  });

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) {
      toast.error('Please enter name and email');
      return;
    }

    const created = {
      id: Date.now(),
      ...newStaff,
      activeClients: 0,
      rating: '5.0/5.0',
      joinedDate: 'Today'
    };

    setStaffList([created, ...staffList]);
    setIsModalOpen(false);
    toast.success(`Staff member "${newStaff.name}" added to roster`);
    setNewStaff({ name: '', email: '', phoneNumber: '', role: 'TRAINER', specialization: '', status: 'ACTIVE' });
  };

  const handleRemoveStaff = (id, name) => {
    setStaffList(staffList.filter(s => s.id !== id));
    toast.info(`Staff member "${name}" removed`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="admin" />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent">Staff Directory</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Staff & Trainer Management</h1>
            <p className="text-xs text-text-secondary mt-0.5">Manage personal trainers, front-desk administrators, and coaching assignments.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <UserPlus className="w-4 h-4" /> Add Staff Member
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="panel p-5 space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Active Master Trainers</span>
            <div className="text-2xl stat-number text-text-primary">3 Trainers</div>
            <div className="text-[11px] text-primary font-medium">43 Assigned Members</div>
          </div>

          <div className="panel p-5 space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Average Member Rating</span>
            <div className="text-2xl stat-number text-text-primary">4.9 / 5.0</div>
            <div className="text-[11px] text-emerald-400 font-medium">High satisfaction</div>
          </div>

          <div className="panel p-5 space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Staff Coverage</span>
            <div className="text-2xl stat-number text-text-primary">06:00 - 22:00</div>
            <div className="text-[11px] text-text-secondary font-medium">Full facility shift coverage</div>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {staffList.map((staff, idx) => (
            <div
              key={staff.id || idx}
              className="panel p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                        {staff.name}
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      </h4>
                      <span className="badge-accent text-[10px] mt-0.5 inline-block">{staff.role}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveStaff(staff.id, staff.name)}
                    className="text-text-muted hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-surface-elevated border border-border space-y-1.5 mb-3 text-xs text-text-secondary">
                  <div className="flex justify-between">
                    <span>Specialization:</span>
                    <span className="font-medium text-text-primary">{staff.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Clients:</span>
                    <span className="font-medium text-text-primary">{staff.activeClients} Members</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Member Score:</span>
                    <span className="font-medium text-emerald-400">{staff.rating}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-text-secondary font-mono">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-primary" /> {staff.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary" /> {staff.phoneNumber}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
                <span className="text-text-muted">Joined: {staff.joinedDate}</span>
                <span className="badge-success">
                  {staff.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Staff Modal */}
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
                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20"><UserPlus className="w-4 h-4" /></div>
                <h3 className="text-base font-bold text-text-primary">Add Staff Member</h3>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-text-secondary block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={newStaff.name}
                    onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. elena@hp.com"
                      value={newStaff.email}
                      onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 9876543210"
                      value={newStaff.phoneNumber}
                      onChange={e => setNewStaff({ ...newStaff, phoneNumber: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Role / Position</label>
                    <select
                      value={newStaff.role}
                      onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    >
                      <option value="TRAINER">Certified Master Trainer</option>
                      <option value="FRONT_DESK">Front Desk & Concierge</option>
                      <option value="BRANCH_MANAGER">Branch Manager</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Hypertrophy & Power"
                      value={newStaff.specialization}
                      onChange={e => setNewStaff({ ...newStaff, specialization: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>
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
                    Add to Roster
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

export default StaffManagement;
