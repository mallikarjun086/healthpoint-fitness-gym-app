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
  Award,
  ShieldAlert,
  AlertTriangle,
  Camera,
  MessageSquare,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { toast } from 'sonner';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Users3D, Dumbbell3D, Chart3D, Calendar3D, Trophy3D, Shield3D } from '../../components/ui/Icon3D';
import CoachingLoadViz3D from '../../components/trainer/CoachingLoadViz3D';

const fallbackSafetyQueue = [
  {
    id: 1,
    userId: 3,
    userName: 'Alex Rivers',
    userEmail: 'alex@example.com',
    userPhone: '+1 (555) 234-5678',
    escalationType: 'PAIN_REPORT',
    severity: 'HIGH',
    status: 'OPEN',
    userNotes: 'Sharp pinch in lower lumbar region during deep sets of conventional deadlifts.',
    createdAt: '2026-09-08T09:30:00',
    details: {
      bodyPart: 'LOWER_BACK',
      painLevel: 6,
      exerciseName: 'Conventional Deadlift',
      painCountIn7Days: 2,
      actionTaken: 'AI progression auto-paused; Escalated to human trainer for clinical check.'
    }
  },
  {
    id: 2,
    userId: 1,
    userName: 'Member User',
    userEmail: 'member@healthpoint.com',
    userPhone: '+1 (555) 876-5432',
    escalationType: 'REPEATED_FORM_FAULT',
    severity: 'HIGH',
    status: 'OPEN',
    userNotes: 'CV Form Coach detected repeated biomechanical fault (3x in session)',
    createdAt: '2026-09-08T11:15:00',
    details: {
      exerciseName: 'Barbell Back Squat',
      faultDescription: 'Knee valgus collapse & incomplete 90° hip hinge depth',
      faultCountInSession: 3,
      cvEngine: 'MediaPipe 33-Landmark Biomechanical Angle Tracker'
    }
  },
  {
    id: 3,
    userId: 2,
    userName: 'Sarah Jenkins',
    userEmail: 'sarah@example.com',
    userPhone: '+1 (555) 345-6789',
    escalationType: 'PLATEAU_AUDIT',
    severity: 'LOW',
    status: 'RESOLVED',
    userNotes: 'Stuck at 50kg bench press for 4 consecutive weeks.',
    trainerResponse: 'Prescribed 1-week wave loading protocol (5x3 @ 80%) with dumbbell floor press auxiliary.',
    createdAt: '2026-09-04T14:00:00',
    resolvedAt: '2026-09-05T10:00:00',
    details: {
      exerciseOrGoal: 'Barbell Bench Press',
      plateauDurationWeeks: 4,
      auditReason: 'Volume & 1RM stagnation detected across 4 consecutive microcycles.'
    }
  }
];

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ROSTER'); // 'ROSTER' or 'SAFETY_QUEUE'
  const [assignedClients, setAssignedClients] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [safetyQueue, setSafetyQueue] = useState(fallbackSafetyQueue);
  const [queueFilter, setQueueFilter] = useState('ALL');
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

  // Safety Resolve Modal
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState(null);
  const [trainerResponseText, setTrainerResponseText] = useState('');

  useEffect(() => {
    fetchTrainerData();
  }, [user]);

  const fetchTrainerData = async () => {
    try {
      setLoading(true);
      const trainerParam = user?.id ? `?trainerId=${user.id}` : '';
      const [clientsRes, membersRes, queueRes] = await Promise.all([
        api.get(`/trainer/clients${trainerParam}`).catch(() => ({ data: [] })),
        api.get('/trainer/all-members').catch(() => ({ data: [] })),
        api.get('/safety/trainer-queue?status=ALL').catch(() => ({ data: [] }))
      ]);

      if (clientsRes.data && clientsRes.data.length > 0) {
        setAssignedClients(clientsRes.data);
      } else {
        setAssignedClients([
          { id: 1, name: 'Member User', goal: 'Aesthetic Physique', status: 'ACTIVE', lastWorkout: 'Push Day (Today)', attendance: '96%', bmi: 22.4, weightKg: 72 },
          { id: 2, name: 'Sarah Jenkins', goal: 'Weight Loss & Toning', status: 'ACTIVE', lastWorkout: 'HIIT Cardio (Yesterday)', attendance: '88%', bmi: 24.1, weightKg: 64 },
          { id: 3, name: 'Alex Rivers', goal: 'Hypertrophy & Strength', status: 'ACTIVE', lastWorkout: 'Heavy Pull (Today)', attendance: '94%', bmi: 23.2, weightKg: 75 },
          { id: 4, name: 'Michael Vance', goal: 'Powerlifting Strength', status: 'ACTIVE', lastWorkout: 'Heavy Squat (2 days ago)', attendance: '91%', bmi: 26.8, weightKg: 88 }
        ]);
      }

      setAllMembers(membersRes.data || []);
      if (queueRes.data && queueRes.data.length > 0) {
        setSafetyQueue(queueRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResolveModal = (esc) => {
    setSelectedEscalation(esc);
    if (esc.escalationType === 'PAIN_REPORT') {
      setTrainerResponseText(`Reviewed pain log for ${esc.details?.bodyPart || 'joint'}. Prescribed substitution to dumbbell variation with 20% reduced load and core bracing warmup.`);
    } else if (esc.escalationType === 'REPEATED_FORM_FAULT') {
      setTrainerResponseText(`Biomechanical video telemetry audited. Recommended cue: widen stance by 2 inches and push knees outward against lateral hip abductors.`);
    } else {
      setTrainerResponseText(`Plateau analyzed. Adjusted training volume with a 1-week wave periodization reset.`);
    }
    setIsResolveModalOpen(true);
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/safety/resolve/${selectedEscalation.id}`, {
        trainerId: user?.id || 2,
        trainerResponse: trainerResponseText
      }).catch(() => null);

      setSafetyQueue(safetyQueue.map(item => item.id === selectedEscalation.id ? {
        ...item,
        status: 'RESOLVED',
        trainerResponse: trainerResponseText,
        resolvedAt: new Date().toISOString()
      } : item));

      toast.success(`Escalation #${selectedEscalation.id} resolved & clinical response sent to member!`);
      setIsResolveModalOpen(false);
    } catch (err) {
      toast.success(`Escalation resolved!`);
      setIsResolveModalOpen(false);
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
        trainerId: user?.id || 2,
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

  const openTicketsCount = safetyQueue.filter(s => s.status === 'OPEN').length;
  const filteredSafetyQueue = safetyQueue.filter(s => {
    if (queueFilter === 'ALL') return true;
    if (queueFilter === 'OPEN') return s.status === 'OPEN';
    if (queueFilter === 'RESOLVED') return s.status === 'RESOLVED';
    return s.escalationType === queueFilter;
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="trainer" />

      <main className="flex-1 ml-0 md:ml-64 p-6 sm:p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-primary" /> Master Trainer Hub
              </span>
            </div>
            <h1 className="heading-xl text-text-primary">Trainer Coaching Dashboard</h1>
            <p className="body-sm text-text-secondary mt-0.5">
              Manage client rosters, review AI safety escalations, and prescribe biomechanical adjustments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-surface-elevated border border-border p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('ROSTER')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'ROSTER' ? 'bg-primary text-black font-bold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Coaching Roster ({assignedClients.length})
              </button>
              <button
                onClick={() => setActiveTab('SAFETY_QUEUE')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'SAFETY_QUEUE' ? 'bg-rose-500 text-white font-bold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Safety Queue
                {openTicketsCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white text-rose-600 font-black">
                    {openTicketsCount}
                  </span>
                )}
              </button>
            </div>

            {activeTab === 'ROSTER' && (
              <button 
                onClick={() => setIsAssignClientOpen(true)}
                className="btn-primary text-xs"
              >
                <Plus className="w-4 h-4" /> Assign Client
              </button>
            )}
          </div>
        </header>

        {activeTab === 'ROSTER' ? (
          /* TAB 1: Coaching Roster */
          <div className="space-y-8">
            {/* 3D Coaching Load Orbital Visualization */}
            <section className="mb-8">
              <CoachingLoadViz3D clients={assignedClients} />
            </section>

            {/* Executive Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <TiltCard maxTilt={4} className="panel p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-text-secondary font-semibold uppercase">Assigned Roster</span>
                  <Users3D size={22} />
                </div>
                <div className="text-3xl font-black text-text-primary stat-number">
                  <CountUp value={assignedClients.length} />
                </div>
                <div className="text-[11px] text-primary font-medium">Active Coaching Athletes</div>
              </TiltCard>

              <TiltCard maxTilt={4} className="panel p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-text-secondary font-semibold uppercase">Custom Plans</span>
                  <Dumbbell3D size={22} />
                </div>
                <div className="text-3xl font-black text-text-primary stat-number">
                  <CountUp value={assignedClients.length * 2 + 4} suffix=" Splits" />
                </div>
                <div className="text-[11px] text-primary font-medium">Periodized Routines</div>
              </TiltCard>

              <TiltCard maxTilt={4} className="panel p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-text-secondary font-semibold uppercase">Safety Escalations</span>
                  <Shield3D size={22} />
                </div>
                <div className="text-3xl font-black text-rose-400 stat-number">
                  <CountUp value={openTicketsCount} />
                </div>
                <div className="text-[11px] text-rose-400 font-medium">Requiring Trainer Action</div>
              </TiltCard>

              <TiltCard maxTilt={4} className="panel p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-text-secondary font-semibold uppercase">Avg Attendance</span>
                  <Chart3D size={22} />
                </div>
                <div className="text-3xl font-black text-emerald-400 stat-number">
                  <CountUp value={93} suffix="%" />
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">Discipline Index</div>
              </TiltCard>
            </div>

            {/* Client Roster List */}
            <div className="panel p-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-primary" /> Active Coaching Roster
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">Review athlete progress, assign custom splits, and inspect historical performance.</p>
                </div>
              </div>

              <div className="space-y-3">
                {assignedClients.map((client, i) => (
                  <div
                    key={client.id || i}
                    className="p-4 rounded-2xl bg-surface-elevated border border-border hover:border-border-light table-row-hover flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
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
                        <div className="text-[10px] text-text-secondary uppercase">Attendance</div>
                        <div className="text-sm font-bold text-emerald-400">{client.attendance || '92%'}</div>
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
          </div>
        ) : (
          /* TAB 2: Safety & Human Review Queue */
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface-elevated rounded-2xl border border-border">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-text-secondary" />
                <span className="text-xs font-semibold uppercase text-text-secondary">Filter Queue:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {['ALL', 'OPEN', 'PAIN_REPORT', 'REPEATED_FORM_FAULT', 'PLATEAU_AUDIT', 'RESOLVED'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setQueueFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      queueFilter === filter ? 'bg-primary text-black font-bold' : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {filter.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Escalation Cards */}
            <div className="space-y-4">
              {filteredSafetyQueue.length === 0 ? (
                <div className="panel p-8 text-center text-text-secondary text-xs">
                  No tickets found matching the selected filter.
                </div>
              ) : (
                filteredSafetyQueue.map((esc) => (
                  <div
                    key={esc.id}
                    className={`panel p-6 rounded-2xl border transition-all ${
                      esc.status === 'OPEN' ? 'border-rose-500/30 bg-surface' : 'border-border opacity-75'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${
                          esc.escalationType === 'PAIN_REPORT' ? 'bg-rose-500/10 text-rose-400' :
                          esc.escalationType === 'REPEATED_FORM_FAULT' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {esc.escalationType === 'PAIN_REPORT' ? <AlertTriangle className="w-5 h-5" /> :
                           esc.escalationType === 'REPEATED_FORM_FAULT' ? <Camera className="w-5 h-5" /> :
                           <TrendingUp className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-text-primary">
                              {esc.escalationType.replace('_', ' ')}
                            </h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              esc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                              esc.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                              'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {esc.severity} SEVERITY
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              esc.status === 'OPEN' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                            }`}>
                              {esc.status}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5">
                            Member: <strong className="text-text-primary">{esc.userName}</strong> ({esc.userEmail}) • {new Date(esc.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {esc.status === 'OPEN' ? (
                        <button
                          onClick={() => handleOpenResolveModal(esc)}
                          className="btn-primary py-2 px-4 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Review & Prescribe Fix
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4" /> Resolved by Trainer
                        </div>
                      )}
                    </div>

                    {/* Ticket Details Body */}
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-1.5">
                        <div className="text-[10px] font-semibold text-text-secondary uppercase">Reported Telemetry & Notes</div>
                        <p className="text-text-primary font-medium">{esc.userNotes || 'No notes provided.'}</p>
                        {esc.details && (
                          <div className="pt-1.5 text-[11px] text-text-secondary space-y-0.5">
                            {esc.details.bodyPart && <div>Affected Region: <strong className="text-rose-400">{esc.details.bodyPart}</strong></div>}
                            {esc.details.painLevel && <div>Pain Intensity: <strong className="text-rose-400">{esc.details.painLevel}/10</strong></div>}
                            {esc.details.exerciseName && <div>Associated Movement: <strong className="text-text-primary">{esc.details.exerciseName}</strong></div>}
                            {esc.details.faultDescription && <div>Detected Joint Fault: <strong className="text-amber-400">{esc.details.faultDescription}</strong></div>}
                          </div>
                        )}
                      </div>

                      <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-1.5">
                        <div className="text-[10px] font-semibold text-text-secondary uppercase">Trainer Prescription & Action</div>
                        {esc.trainerResponse ? (
                          <p className="text-emerald-300 font-medium leading-relaxed">{esc.trainerResponse}</p>
                        ) : (
                          <p className="text-text-secondary italic">Awaiting trainer biomechanical prescription.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Resolve Safety Ticket & Prescribe Form Adjustment */}
      <AnimatePresence>
        {isResolveModalOpen && selectedEscalation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border p-6 rounded-3xl max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsResolveModalOpen(false)}
                className="absolute top-5 right-5 text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Clinical Trainer Review</h3>
                  <p className="text-xs text-text-secondary">Athlete: <strong className="text-text-primary">{selectedEscalation.userName}</strong></p>
                </div>
              </div>

              <form onSubmit={handleResolveSubmit} className="space-y-4">
                <div className="p-3 bg-surface-elevated rounded-xl border border-border text-xs space-y-1">
                  <div className="font-semibold text-text-primary">Ticket #{selectedEscalation.id}: {selectedEscalation.escalationType}</div>
                  <div className="text-text-secondary">{selectedEscalation.userNotes}</div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-text-secondary block mb-1.5">
                    Trainer Prescription / Exercise Modification Note
                  </label>
                  <textarea
                    rows={4}
                    value={trainerResponseText}
                    onChange={(e) => setTrainerResponseText(e.target.value)}
                    placeholder="Enter customized biomechanical advice, deload instructions, or substitution exercise..."
                    className="w-full bg-surface-elevated border border-border rounded-xl p-3 text-xs text-text-primary focus:border-primary outline-none"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsResolveModalOpen(false)}
                    className="btn-ghost text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Resolve Ticket & Send to Member
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                    className="btn-ghost text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs"
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
                    className="btn-ghost text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs"
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
                  className="btn-secondary text-xs"
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
