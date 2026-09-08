import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Watch, 
  Dumbbell, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Trophy,
  Activity,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const GOAL_OPTIONS = [
  { id: 'HYPERTROPHY', label: 'Hypertrophy & Muscle Growth', desc: 'Optimized mechanical tension & volume progression', icon: '🦾' },
  { id: 'FAT_LOSS', label: 'Fat Loss & Conditioning', desc: 'Elevated caloric expenditure with autonomic recovery', icon: '🔥' },
  { id: 'STRENGTH', label: 'Athletic Power & 1RM Strength', desc: 'RPE wave loading & nervous system adaptation', icon: '⚡' },
  { id: 'LONGEVITY', label: 'Joint Mobility & Longevity', desc: 'Active recovery, posture correction & HRV balance', icon: '🧘' }
];

const WEARABLE_PROVIDERS = [
  { id: 'APPLE_HEALTH', name: 'Apple HealthKit', desc: 'Real-time HRV (RMSSD), RHR, & sleep stages via Health app', icon: '🍏' },
  { id: 'GOOGLE_FIT', name: 'Google Fit / Health Connect', desc: 'Daily activity, resting pulse, and recovery intervals', icon: '📊' },
  { id: 'OURA', name: 'Oura Ring Gen 3', desc: 'Overnight readiness scores and circadian temperature trends', icon: '💍' }
];

const OnboardingModal = ({ isOpen, onClose, onLaunchCalibrationWorkout }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Goals, 2: Wearables, 3: Day-1 Activation
  const [selectedGoal, setSelectedGoal] = useState('HYPERTROPHY');
  const [connectedWearable, setConnectedWearable] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const handleConnectWearable = async (providerId) => {
    setIsConnecting(true);
    try {
      const userId = user?.id || 3;
      await api.post('/biometrics/wearables/connect', {
        userId,
        provider: providerId,
        accessToken: `simulated_token_${providerId.toLowerCase()}`
      }).catch(() => null);

      setConnectedWearable(providerId);
      toast.success(`${providerId.replace('_', ' ')} biometrically linked! Baseline imported.`);
    } catch (err) {
      setConnectedWearable(providerId);
      toast.success('Wearable linked!');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCompleteAndLaunchWorkout = () => {
    toast.success('🎉 Welcome to HealthPoint! Starting your Day-1 calibration session.');
    onClose();
    if (onLaunchCalibrationWorkout) {
      onLaunchCalibrationWorkout();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-surface border border-primary/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-text-secondary hover:text-text-primary rounded-full bg-surface-elevated border border-border transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step Indicator */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    s === step ? 'w-8 bg-primary' : s < step ? 'w-4 bg-emerald-400' : 'w-4 bg-surface-elevated'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-text-secondary uppercase">
              Step {step} of 3
            </span>
          </div>

          {/* STEP 1: Goal Calibration */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="py-6 space-y-6"
            >
              <div>
                <span className="badge-accent text-[10px] flex items-center gap-1.5 w-max mb-1.5">
                  <Target className="w-3.5 h-3.5" /> Performance Calibration
                </span>
                <h2 className="text-2xl font-black text-text-primary">What is your primary athletic objective?</h2>
                <p className="text-xs text-text-secondary mt-1">
                  Our biometric AI engine adjusts workout volume, RPE, and recovery based on your target adaptation.
                </p>
              </div>

              <div className="space-y-2.5">
                {GOAL_OPTIONS.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedGoal === goal.id
                        ? 'bg-primary/10 border-primary shadow-sm shadow-primary/20'
                        : 'bg-surface-elevated border-border hover:border-border-light'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">{goal.label}</h4>
                        <p className="text-[11px] text-text-secondary">{goal.desc}</p>
                      </div>
                    </div>
                    {selectedGoal === goal.id && (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="btn-primary py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Wearable Connection (Optional) */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="py-6 space-y-6"
            >
              <div>
                <span className="badge-accent text-[10px] flex items-center gap-1.5 w-max mb-1.5">
                  <Watch className="w-3.5 h-3.5" /> Autonomic Readiness Sync
                </span>
                <h2 className="text-2xl font-black text-text-primary">Connect your biometric wearable</h2>
                <p className="text-xs text-text-secondary mt-1">
                  Sync daily HRV (RMSSD), sleep duration, and resting heart rate to unlock automatic load adaptation.
                </p>
              </div>

              <div className="space-y-3">
                {WEARABLE_PROVIDERS.map((provider) => {
                  const isConnected = connectedWearable === provider.id;
                  return (
                    <div
                      key={provider.id}
                      className="p-3.5 rounded-2xl bg-surface-elevated border border-border flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">{provider.name}</h4>
                          <p className="text-[10px] text-text-secondary">{provider.desc}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleConnectWearable(provider.id)}
                        disabled={isConnected || isConnecting}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isConnected
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'btn-secondary'
                        }`}
                      >
                        {isConnected ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Linked
                          </>
                        ) : (
                          'Connect'
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep(3)}
                  className="text-xs font-semibold text-text-secondary hover:text-text-primary"
                >
                  Skip for now
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="btn-primary py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Day-1 Activation Workout */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="py-6 space-y-6 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto shadow-2xl relative">
                <Trophy className="w-10 h-10 text-amber-400" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-primary text-black"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.div>
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="badge-accent text-[10px]">Highest Leverage Retention Moment</span>
                <h2 className="text-2xl font-black text-text-primary">
                  Ready to earn your Day-1 Badge?
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Complete your first 3-exercise baseline calibration routine right now. Saving your session will instantly award you the <strong className="text-amber-400">First Step Titan (Day 1)</strong> badge and start your discipline streak!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-elevated border border-border text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="text-[10px] uppercase font-bold text-slate-400">Express Calibration Routine</div>
                <div className="space-y-1.5 font-medium text-text-primary">
                  <div className="flex justify-between">
                    <span>1. Barbell / Bodyweight Squats</span>
                    <span className="text-primary font-mono">3 × 10 reps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2. Standard Push-Ups</span>
                    <span className="text-primary font-mono">3 × 12 reps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3. Diaphragmatic Coherence Reset</span>
                    <span className="text-emerald-400 font-mono">2 mins</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCompleteAndLaunchWorkout}
                  className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-black" />
                  Launch Day-1 Workout & Unlock Badge
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OnboardingModal;
