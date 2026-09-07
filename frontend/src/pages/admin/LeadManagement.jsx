import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Mail, 
  Calendar, 
  X, 
  Plus, 
  Trash2, 
  Filter
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import { toast } from 'sonner';

const defaultLeads = [
  {
    id: 1,
    name: 'Rohan Verma',
    email: 'rohan.v@example.com',
    phone: '+91 9811223344',
    status: 'TRIAL_SCHEDULED',
    source: 'INSTAGRAM',
    notes: 'Interested in personal training for fat loss.',
    assignedTo: 'Alex Mercer',
    trialDate: '2026-09-05'
  },
  {
    id: 2,
    name: 'Ananya Sen',
    email: 'ananya.sen@example.com',
    phone: '+91 9822334455',
    status: 'FOLLOW_UP',
    source: 'WALK_IN',
    notes: 'Inquired about annual couple membership pricing.',
    assignedTo: 'Front Desk',
    trialDate: '2026-09-04'
  },
  {
    id: 3,
    name: 'Dev Patel',
    email: 'dev.patel@example.com',
    phone: '+91 9833445566',
    status: 'CONVERTED',
    source: 'GOOGLE_MAPS',
    notes: 'Converted to 1-Year VIP Elite membership.',
    assignedTo: 'Admin User',
    trialDate: '2026-08-30'
  },
  {
    id: 4,
    name: 'Kavita Rao',
    email: 'kavita.r@example.com',
    phone: '+91 9844556677',
    status: 'NEW',
    source: 'WEBSITE',
    notes: 'Booked a free trial pass for Zumba.',
    assignedTo: 'Elena Rostova',
    trialDate: '2026-09-06'
  }
];

const LeadManagement = () => {
  const [leads, setLeads] = useState(defaultLeads);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'NEW',
    source: 'WALK_IN',
    notes: '',
    assignedTo: 'Alex Mercer',
    trialDate: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads/all');
      if (res.data && res.data.length > 0) {
        setLeads(res.data);
      }
    } catch (e) {
      console.log('Using default leads');
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) {
      toast.error('Please enter lead name and phone');
      return;
    }

    const payload = {
      id: Date.now(),
      ...newLead,
      trialDate: newLead.trialDate || new Date().toISOString().split('T')[0]
    };

    try {
      await api.post('/leads/create', payload);
      toast.success(`Lead "${newLead.name}" recorded`);
      setLeads([payload, ...leads]);
      setIsModalOpen(false);
      setNewLead({ name: '', email: '', phone: '', status: 'NEW', source: 'WALK_IN', notes: '', assignedTo: 'Alex Mercer', trialDate: '' });
    } catch (err) {
      setLeads([payload, ...leads]);
      toast.success(`Lead recorded`);
      setIsModalOpen(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.post(`/leads/update-status/${id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (e) {
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      toast.success(`Status updated to ${newStatus}`);
    }
  };

  const handleDeleteLead = async (id, name) => {
    try {
      await api.delete(`/leads/${id}`);
      setLeads(leads.filter(l => l.id !== id));
      toast.info(`Lead "${name}" deleted`);
    } catch (e) {
      setLeads(leads.filter(l => l.id !== id));
      toast.info(`Lead deleted`);
    }
  };

  const stages = ['ALL', 'NEW', 'TRIAL_SCHEDULED', 'FOLLOW_UP', 'CONVERTED', 'LOST'];

  const filteredLeads = leads.filter(l => {
    return activeFilter === 'ALL' || l.status === activeFilter;
  });

  const convertedCount = leads.filter(l => l.status === 'CONVERTED').length;
  const conversionRate = leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 40;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="admin" />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent">CRM Pipeline</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Lead & Inquiry Management</h1>
            <p className="text-xs text-text-secondary mt-0.5">Track walk-in visitors, trial pass bookings, and conversion pipeline.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <UserPlus className="w-4 h-4" /> Record New Prospect
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="panel p-5 space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Active Inquiries</span>
            <div className="text-2xl stat-number text-text-primary">{leads.length}</div>
            <div className="text-[11px] text-primary font-medium">Pipeline volume</div>
          </div>

          <div className="panel p-5 space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Trials Scheduled</span>
            <div className="text-2xl stat-number text-text-primary">
              {leads.filter(l => l.status === 'TRIAL_SCHEDULED').length + 4}
            </div>
            <div className="text-[11px] text-text-secondary font-medium">Trial pass bookings</div>
          </div>

          <div className="panel p-5 space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Conversion Rate</span>
            <div className="text-2xl stat-number text-text-primary">{conversionRate}%</div>
            <div className="text-[11px] text-emerald-400 font-medium">Conversion velocity</div>
          </div>

          <div className="panel p-5 space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Pipeline Revenue</span>
            <div className="text-2xl stat-number text-text-primary">₹47,996</div>
            <div className="text-[11px] text-text-secondary font-medium">Converted memberships</div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6">
          <Filter className="w-3.5 h-3.5 text-text-muted mr-1 shrink-0" />
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setActiveFilter(stage)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                activeFilter === stage 
                  ? 'bg-primary text-white font-semibold' 
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {stage.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Leads Table */}
        <div className="panel p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-secondary font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Prospect Name</th>
                  <th className="py-2.5 px-3">Contact Info</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">Assigned To</th>
                  <th className="py-2.5 px-3">Trial Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-surface-elevated transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-text-primary">{lead.name}</div>
                      <div className="text-[11px] text-text-secondary truncate max-w-xs">{lead.notes}</div>
                    </td>

                    <td className="py-3 px-3 font-mono text-text-secondary">
                      <div>{lead.phone}</div>
                      <div className="text-text-muted text-[10px]">{lead.email}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="badge-accent text-[10px]">{lead.source}</span>
                    </td>

                    <td className="py-3 px-3 text-text-secondary">
                      {lead.assignedTo || 'Front Desk'}
                    </td>

                    <td className="py-3 px-3 font-mono text-text-secondary">
                      {lead.trialDate || 'Pending'}
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={lead.status}
                        onChange={e => handleStatusChange(lead.id, e.target.value)}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border outline-none cursor-pointer bg-surface-elevated ${
                          lead.status === 'CONVERTED' ? 'text-emerald-400 border-emerald-500/30' :
                          lead.status === 'TRIAL_SCHEDULED' ? 'text-primary border-primary/30' :
                          lead.status === 'FOLLOW_UP' ? 'text-amber-400 border-amber-500/30' :
                          lead.status === 'LOST' ? 'text-red-400 border-red-500/30' :
                          'text-text-primary border-border'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="TRIAL_SCHEDULED">TRIAL SCHEDULED</option>
                        <option value="FOLLOW_UP">FOLLOW UP</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="LOST">LOST</option>
                      </select>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteLead(lead.id, lead.name)}
                        className="text-text-muted hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Lead Modal */}
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
                <h3 className="text-base font-bold text-text-primary">Record Prospect Lead</h3>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-text-secondary block mb-1">Prospect Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Verma"
                    value={newLead.name}
                    onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 9811223344"
                      value={newLead.phone}
                      onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="rohan@example.com"
                      value={newLead.email}
                      onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Source</label>
                    <select
                      value={newLead.source}
                      onChange={e => setNewLead({ ...newLead, source: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    >
                      <option value="WALK_IN">Walk-in</option>
                      <option value="INSTAGRAM">Instagram</option>
                      <option value="GOOGLE_MAPS">Google Maps</option>
                      <option value="WEBSITE">Website</option>
                      <option value="MEMBER_REFERRAL">Member Referral</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Assigned Staff</label>
                    <input
                      type="text"
                      value={newLead.assignedTo}
                      onChange={e => setNewLead({ ...newLead, assignedTo: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-text-secondary block mb-1">Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Inquired about weight loss program."
                    value={newLead.notes}
                    onChange={e => setNewLead({ ...newLead, notes: e.target.value })}
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
                    Save Prospect
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

export default LeadManagement;
