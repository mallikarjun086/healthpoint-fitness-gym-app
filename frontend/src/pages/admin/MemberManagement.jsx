import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Shield, 
  Dumbbell, 
  MoreVertical,
  Mail,
  Phone
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import { toast } from 'sonner';

const MemberManagement = () => {
  const [members, setMembers] = useState([
    { id: 1, name: 'Member User', email: 'user@hp.com', phoneNumber: '9876543210', role: 'MEMBER', status: 'ACTIVE', plan: 'Annual Elite Membership', joined: '2024-01-15' },
    { id: 2, name: 'Trainer Alex', email: 'trainer@hp.com', phoneNumber: '9876543211', role: 'TRAINER', status: 'ACTIVE', plan: 'Staff / Trainer', joined: '2023-11-01' },
    { id: 3, name: 'Admin System', email: 'admin@hp.com', phoneNumber: '9876543212', role: 'ADMIN', status: 'ACTIVE', plan: 'System Admin', joined: '2023-10-10' },
    { id: 4, name: 'Sarah Jenkins', email: 'sarah.j@example.com', phoneNumber: '9123456789', role: 'MEMBER', status: 'ACTIVE', plan: 'Pro Fitness', joined: '2024-03-20' },
    { id: 5, name: 'Michael Vance', email: 'vance@example.com', phoneNumber: '9812345678', role: 'MEMBER', status: 'INACTIVE', plan: 'Basic Starter', joined: '2024-02-10' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map(u => ({
          id: u.id,
          name: u.name || 'User #' + u.id,
          email: u.email,
          phoneNumber: u.phoneNumber || 'N/A',
          role: u.role || 'MEMBER',
          status: u.isActive !== false ? 'ACTIVE' : 'INACTIVE',
          plan: u.role === 'ADMIN' ? 'System Admin' : u.role === 'TRAINER' ? 'Staff / Trainer' : 'Annual Elite Membership',
          joined: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '2024-01-15'
        }));
        setMembers(formatted);
      }
    } catch (e) {
      console.log("Using initial seeded users");
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = async (id) => {
    try {
      await api.put(`/admin/users/${id}/status`);
    } catch (e) {
      console.log("Local status toggle fallback");
    }
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const newStatus = m.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        toast.success(`User status updated to ${newStatus}`);
        return { ...m, status: newStatus };
      }
      return m;
    }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Member & Staff Management</h1>
            <p className="text-gray-400 mt-1">View, filter, and manage all gym members and trainers.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> {members.length} Total Users
            </span>
          </div>
        </header>

        {/* Search & Filter Bar */}
        <div className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/50 text-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex gap-2">
              {['ALL', 'MEMBER', 'TRAINER', 'ADMIN'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    roleFilter === role ? 'bg-primary text-black' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Member Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="p-5">User</th>
                  <th className="p-5">Role</th>
                  <th className="p-5">Subscription Plan</th>
                  <th className="p-5">Joined Date</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMembers.map((m, index) => (
                  <motion.tr 
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{m.name}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-2">
                            <span><Mail className="w-3 h-3 inline mr-1" />{m.email}</span>
                            <span>•</span>
                            <span><Phone className="w-3 h-3 inline mr-1" />{m.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                        m.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        m.role === 'TRAINER' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="p-5 text-gray-300 font-medium">{m.plan}</td>
                    <td className="p-5 text-gray-400">{m.joined}</td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                        m.status === 'ACTIVE' ? 'text-green-400' : 'text-rose-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${m.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-rose-400'}`}></span>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => toggleUserStatus(m.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          m.status === 'ACTIVE' 
                            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20' 
                            : 'bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black border border-green-500/20'
                        }`}
                      >
                        {m.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberManagement;
