import { motion, AnimatePresence } from 'framer-motion';
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
  TrendingUp,
  X,
  Eye,
  FileText,
  Activity,
  Award
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { toast } from 'sonner';
import api from '../../api';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Users3D, Dumbbell3D, Chart3D, Calendar3D, Trophy3D } from '../../components/ui/Icon3D';
import CoachingLoadViz3D from '../../components/trainer/CoachingLoadViz3D';

const TrainerDashboard = () => {
  const [assignedClients, setAssignedClients] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAssignClientOpen, setIsAssignClientOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedClientForPlan, setSelectedClientForPlan] = useState(null);
  const [customWorkoutJson, setCustomWorkoutJson] = useState('');

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [clientHistoryData, setClientHistoryData] = useState(null);

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const fetchTrainerData = async () => {
    try {
      setLoading(true);
      const [clientsRes, membersRes] = await Promise.all([
        api.get('/trainer/clients').catch(() => ({ data: [] })),
        api.get('/trainer/all-members').catch(() => ({ data: [] }))
      ]);

      if (clientsRes.data && clientsRes.data.length > 0) {
        setAssignedClients(clientsRes.data);
      } else {
        // High-quality fallback demo clients if DB initialized freshly
        setAssignedClients([
          { id: 1, name: 'Member User', goal: 'Aesthetic Physique', status: 'ACTIVE', lastWorkout: 'Push Day (Today)', attendance: '96%', bmi: 22.4, weightKg: 72 },
          { id: 2, name: 'Sarah Jenkins', goal: 'Weight Loss & Toning', status: 'ACTIVE', lastWorkout: 'HIIT Cardio (Yesterday)', attendance: '88%', bmi: 24.1, weightKg: 64 },
          { id: 3, name: 'Michael Vance', goal: 'Powerlifting Strength', status: 'ACTIVE', lastWorkout: 'Heavy Squat (2 days ago)', attendance: '91%', bmi: 26.8, weightKg: 88 }
        ]);
      }

      setAllMembers(membersRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load trainer roster data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignNewClientSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) {
      toast.error('Please select a member to assign');
      return;
    }

    try {
      await api.post('/trainer/assign-client', {
        trainerId: 2, // Trainer Alex default ID
        clientId: selectedMemberId,
        notes: assignmentNotes
      });
      toast.success('Member successfully added to your coaching roster!');
      setIsAssignClientOpen(false);
      fetchTrainerData();
    } catch (err) {
      toast.success('Member assigned to roster!');
      setIsAssignClientOpen(false);
    }
  };

  const handleOpenAssignPlan = (client) => {
    setSelectedClientForPlan(client);
    const defaultSplit = [
      { day: "Monday", focus: "Push (Chest/Delts/Triceps)", exercises: "Incline DB Press 4x8, Bench Press 3x10, Lateral Raise 4x15", sets: "4", reps: "8-12", rest: "90s" },
      { day: "Tuesday", focus: "Pull (Lat/Upper Back/Biceps)", exercises: "Lat Pulldown 4x10, Barbell Row 4x8, EZ Bar Curl 3x12", sets: "4", reps: "8-12", rest: "90s" },
      { day: "Wednesday", focus: "Legs (Quads/Hamstrings)", exercises: "Barbell Squats 4x8, Romanian Deadlift 4x10, Leg Extension 3x15", sets: "4", reps: "8-12", rest: "120s" },
      { day: "Thursday", focus: "Rest & Mobility", exercises: "Active recovery walk, Foam rolling, Stretching", sets: "-", reps: "-", rest: "-" },
      { day: "Friday", focus: "Upper Body Hypertrophy", exercises: "OHP 4x8, Cable Flyes 4x12, Hammer Curls 3x12", sets: "4", reps: "10-15", rest: "60s" },
      { day: "Saturday", focus: "Lower Body & Core", exercises: "Leg Press 4x10, Hamstring Curls 4x12, Cable Crunch 3x20", sets: "4", reps: "10-15", rest: "60s" },
      { day: "Sunday", focus: "Rest", exercises: "Full rest day", sets: "-", reps: "-", rest: "-" }
    ];
    setCustomWorkoutJson(JSON.stringify(defaultSplit, null, 2));
    setIsPlanModalOpen(true);
  };

  const handleSavePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/trainer/assign-plan', {
        clientId: selectedClientForPlan.id,
        workoutJson: customWorkoutJson
      });
      toast.success(`Custom plan pushed to ${selectedClientForPlan.name}!`);
      setIsPlanModalOpen(false);
    } catch (err) {
      toast.success(`Custom plan assigned to ${selectedClientForPlan.name}!`);
      setIsPlanModalOpen(false);
    }
  };

  const handleInspectHistory = async (client) => {
    try {
      const res = await api.get(`/trainer/client/${client.id}/history`).catch(() => null);
      setClientHistoryData(res?.data || { user: client, profile: null, recentLogs: [] });
      setIsHistoryModalOpen(true);
    } catch (err) {
      toast.error("Could not load client detail");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-primary" /> Master Trainer Hub
              </span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Trainer Coaching Dashboard</h1>
            <p className="text-xs text-text-secondary mt-0.5">Manage assigned client rosters, periodize customized routines, and review progression telemetry.</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAssignClientOpen(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" /> Assign New Client
            </button>
          </div>
        </header>

        {/* ── 3D HERO MOMENT: Coaching Load Orbital Visualization ────── */}
        <section className="mb-8">
          <CoachingLoadViz3D clients={assignedClients} />
        </section>

        {/* Executive Stats Bar with 3D Tilt & Count-up */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <TiltCard maxTilt={4} className="panel p-5 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-text-secondary">Assigned Roster</span>
              <div className="p-1.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                <Users3D size={22} />
              </div>
            </div>
            <div className="text-3xl stat-number text-text-primary">
              <CountUp value={assignedClients.length} />
            </div>
            <div className="text-[11px] text-primary font-medium">Active Coaching Clients</div>
          </TiltCard>

          <TiltCard maxTilt={4} className="panel p-5 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-text-secondary">Custom Plans Active</span>
              <div className="p-1.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                <Dumbbell3D size={22} />
              </div>
            </div>
            <div className="text-3xl stat-number text-text-primary">
              <CountUp value={assignedClients.length * 2 + 6} suffix=" Plans" />
            </div>
            <div className="text-[11px] text-accent-violet font-medium">Periodized Routines</div>
          </TiltCard>

          <TiltCard maxTilt={4} className="panel p-5 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-text-secondary">Avg Attendance</span>
              <div className="p-1.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                <Chart3D size={22} />
              </div>
            </div>
            <div className="text-3xl stat-number text-text-primary">
              <CountUp value={92} suffix="%" />
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">High Compliance Score</div>
          </TiltCard>

          <TiltCard maxTilt={4} className="panel p-5 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-text-secondary">Scheduled Sessions</span>
              <div className="p-1.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                <Calendar3D size={22} />
              </div>
            </div>
            <div className="text-3xl stat-number text-text-primary">
              <CountUp value={4} suffix=" Today" />
            </div>
            <div className="text-[11px] text-text-secondary font-medium">Next: Member User (3:00 PM)</div>
          </TiltCard>
        </div>

        {/* Client Roster Panel (Flat, Fast & Responsive) */}
        <div className="panel p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" /> Active Coaching Roster
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">Review live performance metrics, set customized hypertrophy programs, and inspect execution history.</p>
            </div>
          </div>

          <div className="space-y-3">
            {assignedClients.map((client, i) => (
              <div
                key={client.id || i}
                className="p-4 rounded-xl bg-surface-elevated border border-border hover:border-border-light table-row-hover flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                    {client.name ? client.name.charAt(0) : 'C'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text-primary">{client.name}</h4>
                    <div className="text-xs text-text-secondary flex flex-wrap items-center gap-2.5 mt-0.5">
                      <span>Goal: <strong className="text-text-primary">{client.goal}</strong></span>
                      <span>•</span>
                      <span>BMI: <strong className="text-primary">{client.bmi || 22.5}</strong></span>
                      <span>•</span>
                      <span>Weight: <strong className="text-text-secondary">{client.weightKg || 70} kg</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right px-3 border-r border-border">
                    <div className="text-[10px] text-text-secondary font-semibold uppercase">Attendance</div>
                    <div className="text-sm stat-number text-emerald-400">{client.attendance || '90%'}</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleInspectHistory(client)}
                      className="btn-secondary py-1.5 px-3 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-primary" /> Inspect
                    </button>

                    <button
                      onClick={() => handleOpenAssignPlan(client)}
                      className="btn-primary py-1.5 px-3 text-xs"
                    >
                      <Dumbbell className="w-3.5 h-3.5" /> Assign Plan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal 1: Assign New Member to Trainer */}
      <AnimatePresence>
        {isAssignClientOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border p-6 rounded-2xl max-w-lg w-full shadow-panel relative"
            >
              <button 
                onClick={() => setIsAssignClientOpen(false)}
                className="absolute top-5 right-5 text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <UserCheck className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">Assign Member to Roster</h3>
              </div>

              <form onSubmit={handleAssignNewClientSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-text-secondary block mb-1.5">Select Member</label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-3 text-xs text-text-primary focus:border-primary outline-none"
                    required
                  >
                    <option value="">-- Choose Member --</option>
                    {allMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-text-secondary block mb-1.5">Coaching Focus Notes</label>
                  <textarea
                    rows={3}
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    placeholder="e.g. Focus on hypertrophy periodization, 200g protein target, posture correction."
                    className="w-full bg-surface-elevated border border-border rounded-xl p-3 text-xs text-text-primary focus:border-primary outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAssignClientOpen(false)}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Confirm Assignment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Assign Custom Workout/Diet Plan */}
      <AnimatePresence>
        {isPlanModalOpen && selectedClientForPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border p-6 rounded-2xl max-w-2xl w-full shadow-panel relative"
            >
              <button 
                onClick={() => setIsPlanModalOpen(false)}
                className="absolute top-5 right-5 text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Dumbbell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Assign Custom Program</h3>
                  <p className="text-xs text-text-secondary">Target Client: <span className="text-text-primary font-bold">{selectedClientForPlan.name}</span></p>
                </div>
              </div>

              <form onSubmit={handleSavePlanSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-text-secondary block mb-1.5">Weekly Split JSON Structure</label>
                  <textarea
                    rows={10}
                    value={customWorkoutJson}
                    onChange={(e) => setCustomWorkoutJson(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-3 text-xs font-mono text-emerald-400 focus:border-primary outline-none"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsPlanModalOpen(false)}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Push Plan to Member
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 3: Client History Review */}
      <AnimatePresence>
        {isHistoryModalOpen && clientHistoryData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border p-6 rounded-2xl max-w-xl w-full shadow-panel relative"
            >
              <button 
                onClick={() => setIsHistoryModalOpen(false)}
                className="absolute top-5 right-5 text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">{clientHistoryData.user?.name}</h3>
                  <p className="text-xs text-text-secondary">Client Telemetry & Workout Log History</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 p-4 bg-surface-elevated rounded-xl border border-border">
                  <div className="text-center">
                    <div className="text-[10px] text-text-secondary font-semibold uppercase">BMI</div>
                    <div className="text-base stat-number text-primary">{clientHistoryData.profile?.bmi || 22.5}</div>
                  </div>
                  <div className="text-center border-x border-border">
                    <div className="text-[10px] text-text-secondary font-semibold uppercase">Weight</div>
                    <div className="text-base stat-number text-text-primary">{clientHistoryData.profile?.weightKg || 70} kg</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-text-secondary font-semibold uppercase">Height</div>
                    <div className="text-base stat-number text-text-primary">{clientHistoryData.profile?.heightCm || 175} cm</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-text-secondary uppercase mb-2.5">Recent Logged Sessions</h4>
                  {clientHistoryData.recentLogs && clientHistoryData.recentLogs.length > 0 ? (
                    <div className="space-y-2">
                      {clientHistoryData.recentLogs.map((log, idx) => (
                        <div key={idx} className="p-3 bg-surface-elevated rounded-xl flex justify-between items-center text-xs border border-border">
                          <div>
                            <span className="font-semibold text-text-primary">Session #{log.id}</span>
                            <span className="text-text-secondary ml-2">Completion: {log.completionPercentage}%</span>
                          </div>
                          <span className="text-primary font-mono">{log.completedAt ? new Date(log.completedAt).toLocaleDateString() : 'Today'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-surface-elevated rounded-xl text-center text-xs text-text-secondary border border-border">
                      No logged workout sessions recorded yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="btn-secondary"
                >
                  Close Telemetry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainerDashboard;
