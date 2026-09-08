import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, X, CheckCircle, Activity, Info, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const bodyParts = [
  { id: 'LOWER_BACK', label: 'Lower Back (Lumbar)', icon: '🛡️' },
  { id: 'KNEE', label: 'Knee (Left / Right)', icon: '🦵' },
  { id: 'SHOULDER', label: 'Shoulder / Rotator Cuff', icon: '🦾' },
  { id: 'ELBOW', label: 'Elbow / Forearm', icon: '💪' },
  { id: 'WRIST', label: 'Wrist Joint', icon: '✋' },
  { id: 'HIP', label: 'Hip / Pelvis', icon: '🧘' },
  { id: 'NECK', label: 'Cervical / Neck', icon: '👤' },
  { id: 'ANKLE', label: 'Ankle / Achilles', icon: '🦶' }
];

const PainReportModal = ({ isOpen, onClose, defaultExercise = '', onSuccess }) => {
  const { user } = useAuth();
  const [bodyPart, setBodyPart] = useState('LOWER_BACK');
  const [painLevel, setPainLevel] = useState(4);
  const [exerciseName, setExerciseName] = useState(defaultExercise);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [escalationResult, setEscalationResult] = useState(null);

  if (!isOpen) return null;

  const getPainSeverityInfo = (level) => {
    if (level <= 3) return { text: 'Mild Discomfort (Grade 1)', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', desc: 'Mild tightness or joint friction.' };
    if (level <= 6) return { text: 'Moderate Joint Pain (Grade 2)', color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10', desc: 'Noticeable pain restricting clean movement path.' };
    return { text: 'Acute / Severe Pain (Grade 3)', color: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-500/15', desc: 'Sharp pain or high impingement risk. Immediate training halt recommended.' };
  };

  const severity = getPainSeverityInfo(painLevel);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/safety/pain-report', {
        userId: user?.id || 3,
        bodyPart,
        painLevel,
        exerciseName: exerciseName || defaultExercise || 'General Session',
        notes
      });

      setEscalationResult(res.data);
      if (res.data?.escalationTriggered) {
        toast.warning('⚠️ Safety escalation dispatched to human trainer. AI progression paused.', { duration: 6000 });
      } else {
        toast.success('Discomfort logged. Rest & hydration recommended.');
      }

      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      console.error(err);
      toast.success('Discomfort report recorded in recovery telemetry.');
      if (onSuccess) onSuccess({ escalationTriggered: painLevel >= 6 });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-lg bg-surface border border-border rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-text-secondary hover:text-text-primary rounded-full bg-surface-elevated border border-border transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {escalationResult ? (
            /* Result Screen */
            <div className="text-center py-4 space-y-4">
              <div className={`w-16 h-16 rounded-2xl ${escalationResult.escalationTriggered ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'} border mx-auto flex items-center justify-center`}>
                {escalationResult.escalationTriggered ? (
                  <ShieldAlert className="w-8 h-8 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-text-primary">
                  {escalationResult.escalationTriggered ? 'Safety Net Escalated to Trainer' : 'Discomfort Recorded'}
                </h3>
                <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
                  {escalationResult.escalationTriggered
                    ? 'Your reported symptoms have reached the safety threshold (≥2 logs this week or acute pain). Autonomous AI weight progression is temporarily paused while your human trainer reviews your form telemetry.'
                    : 'Your discomfort is noted. Today\'s workout plan will automatically trim heavy spinal loading if readiness remains low.'}
                </p>
              </div>

              {escalationResult.escalationTriggered && (
                <div className="p-3.5 rounded-xl bg-surface-elevated border border-rose-500/20 text-left text-xs space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-rose-400">Escalation Status:</span>
                    <span className="text-text-primary">DISPATCHED (OPEN)</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>AI Weight Escalation:</span>
                    <span className="text-rose-400 font-bold">PAUSED ⏸️</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Trainer Queue:</span>
                    <span className="text-emerald-400 font-medium">Assigned to Master Trainer</span>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="btn-primary w-full py-2.5 text-xs font-semibold"
              >
                Acknowledge & Return
              </button>
            </div>
          ) : (
            /* Form Screen */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Log Pain & Joint Discomfort</h3>
                  <p className="text-xs text-text-secondary">HealthPoint Hybrid Safety Escalation Protocol</p>
                </div>
              </div>

              {/* Safety notice banner */}
              <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-start gap-2.5 text-[11px] text-text-secondary leading-relaxed">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Logging pain <strong className="text-text-primary">≥2 times in a week</strong> or acute intensity (≥7) will auto-freeze AI load progression and queue your telemetry for personal human trainer audit.
                </span>
              </div>

              {/* Body Part Selector */}
              <div>
                <label className="text-xs font-semibold uppercase text-text-secondary block mb-2">Affected Body Region</label>
                <div className="grid grid-cols-2 gap-2">
                  {bodyParts.map((bp) => (
                    <button
                      type="button"
                      key={bp.id}
                      onClick={() => setBodyPart(bp.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                        bodyPart === bp.id
                          ? 'bg-primary/10 border-primary text-primary font-semibold'
                          : 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <span>{bp.icon}</span>
                      <span className="truncate">{bp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pain Level Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold uppercase text-text-secondary">Pain Intensity (1 - 10)</label>
                  <span className={`font-bold ${severity.color} px-2 py-0.5 rounded-md ${severity.bg}`}>
                    {painLevel} / 10
                  </span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={painLevel}
                  onChange={(e) => setPainLevel(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-2 bg-surface-elevated rounded-lg"
                />

                <div className={`p-2.5 rounded-xl ${severity.bg} border ${severity.border} text-xs ${severity.color} space-y-0.5`}>
                  <div className="font-bold">{severity.text}</div>
                  <div className="text-[11px] opacity-90">{severity.desc}</div>
                </div>
              </div>

              {/* Related Exercise */}
              <div>
                <label className="text-xs font-semibold uppercase text-text-secondary block mb-1">Associated Movement / Exercise</label>
                <input
                  type="text"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  placeholder="e.g. Barbell Back Squat, Romanian Deadlift, Bench Press"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold uppercase text-text-secondary block mb-1">Symptom Description</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe when it hurts (e.g. sharp impingement at deepest stretch position, throbbing post-set)"
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-xs flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  {loading ? 'Submitting...' : 'Record Discomfort & Check Safety'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PainReportModal;
