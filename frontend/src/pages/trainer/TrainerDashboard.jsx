import { motion } from 'framer-motion';
import { 
  Users, 
  Dumbbell, 
  Utensils, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Plus, 
  ChevronRight,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { toast } from 'sonner';

const TrainerDashboard = () => {
  const [assignedClients, setAssignedClients] = useState([
    { id: 1, name: 'Member User', goal: 'Muscle Gain', status: 'On Track', lastWorkout: 'Chest & Triceps (Today)', attendance: '92%' },
    { id: 2, name: 'Sarah Jenkins', goal: 'Weight Loss', status: 'Needs Review', lastWorkout: 'Cardio HIIT (Yesterday)', attendance: '85%' },
    { id: 3, name: 'Michael Vance', goal: 'Endurance', status: 'On Track', lastWorkout: 'Leg Day (2 days ago)', attendance: '78%' }
  ]);

  const [activeTab, setActiveTab] = useState('clients');

  const handleAssignPlan = (clientName) => {
    toast.success(`Assigned new workout plan to ${clientName}!`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="trainer" />

      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase text-primary tracking-widest">Trainer Portal</span>
            </div>
            <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage client rosters, assign customized workout & diet plans, and track progress.</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => toast.info("New Client Assignment feature opened")}
              className="btn-premium px-6 py-2.5 text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-black" /> Assign New Client
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 border-l-4 border-l-primary">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Assigned Clients</span>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-black">{assignedClients.length}</div>
            <div className="text-xs text-primary font-bold mt-1">Active Coaching Roster</div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Workouts Assigned</span>
              <Dumbbell className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black">28 Plans</div>
            <div className="text-xs text-blue-400 font-bold mt-1">Custom Routines Active</div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Client Attendance Rate</span>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black">88%</div>
            <div className="text-xs text-emerald-400 font-bold mt-1">Above Monthly Benchmark</div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-purple-500">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Upcoming Sessions</span>
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-black">4 Today</div>
            <div className="text-xs text-purple-400 font-bold mt-1">Next: Member User (3:00 PM)</div>
          </div>
        </div>

        {/* Client Roster Table */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" /> Active Client Roster
            </h3>
          </div>

          <div className="space-y-4">
            {assignedClients.map((client, i) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{client.name}</h4>
                    <div className="text-xs text-gray-400 flex items-center gap-3 mt-1">
                      <span>Goal: <strong className="text-white">{client.goal}</strong></span>
                      <span>•</span>
                      <span>Last: <strong className="text-gray-300">{client.lastWorkout}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Attendance</div>
                    <div className="text-sm font-black text-primary">{client.attendance}</div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    client.status === 'On Track' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {client.status}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAssignPlan(client.name)}
                      className="px-4 py-2 rounded-xl bg-primary text-black text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1"
                    >
                      <Dumbbell className="w-3.5 h-3.5" /> Assign Plan
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainerDashboard;
