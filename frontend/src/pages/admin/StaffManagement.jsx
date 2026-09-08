import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Phone, 
  Mail, 
  X, 
  Trash2,
  Award,
  Star
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { toast } from 'sonner';
import TiltCard from '../../components/ui/TiltCard';

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
    toast.success(`Staff member "${name}" removed`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <span className="badge-accent text-[10px] mb-1 inline-block">Staff Roster</span>
            <h1 className="heading-xl text-text-primary">Trainers & Operations Staff</h1>
            <p className="body-sm text-text-secondary mt-0.5">Manage coaching personnel, specialties, and active roster allocations.</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-2 shadow-accent"
          >
            <UserPlus className="w-4 h-4" /> Add Staff Member
          </button>
        </header>

        {/* Staff Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.map((staff) => (
            <TiltCard key={staff.id} maxTilt={3} className="panel-card p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center font-bold text-base text-text-primary font-display">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-text-primary font-display">{staff.name}</h3>
                      <span className="badge-accent text-[10px] mt-0.5 inline-block">{staff.role}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleRemoveStaff(staff.id, staff.name)}
                    className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-border text-xs">
                  <div className="text-text-secondary font-medium">{staff.specialization}</div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{staff.phoneNumber}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-text-muted">{staff.activeClients} Active Clients</span>
                <span className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {staff.rating}
                </span>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="panel-elevated max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="heading-md text-text-primary font-display">Add Staff Member</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-3">
                <div className="space-y-1">
                  <label className="caption">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStaff.name}
                    onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                    placeholder="Coach Marcus"
                    className="w-full bg-surface-elevated border border-border rounded-xl py-2 px-3 text-xs text-text-primary outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="caption">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newStaff.email}
                    onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                    placeholder="marcus@hp.com"
                    className="w-full bg-surface-elevated border border-border rounded-xl py-2 px-3 text-xs text-text-primary outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="caption">Role</label>
                    <select
                      value={newStaff.role}
                      onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                      className="w-full bg-surface-elevated border border-border rounded-xl py-2 px-3 text-xs text-text-primary outline-none focus:border-primary"
                    >
                      <option value="TRAINER">Trainer</option>
                      <option value="FRONT_DESK">Front Desk</option>
                      <option value="MANAGER">Manager</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="caption">Phone Number</label>
                    <input
                      type="tel"
                      value={newStaff.phoneNumber}
                      onChange={e => setNewStaff({...newStaff, phoneNumber: e.target.value})}
                      placeholder="+91 9876543210"
                      className="w-full bg-surface-elevated border border-border rounded-xl py-2 px-3 text-xs text-text-primary outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="caption">Specialization</label>
                  <input
                    type="text"
                    value={newStaff.specialization}
                    onChange={e => setNewStaff({...newStaff, specialization: e.target.value})}
                    placeholder="Strength & Conditioning, Mobility"
                    className="w-full bg-surface-elevated border border-border rounded-xl py-2 px-3 text-xs text-text-primary outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">Cancel</button>
                  <button type="submit" className="btn-primary shadow-accent">Save Staff</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffManagement;
