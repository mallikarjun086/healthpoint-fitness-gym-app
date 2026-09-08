import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Flame, ShieldCheck, Crown, Sparkles, X, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const getBadgeIcon = (iconName, tier) => {
  const iconProps = { className: "w-12 h-12", strokeWidth: 1.5 };
  switch (iconName) {
    case 'Zap':
      return <Zap {...iconProps} className="w-12 h-12 text-amber-400" />;
    case 'Flame':
      return <Flame {...iconProps} className="w-12 h-12 text-rose-500" />;
    case 'ShieldCheck':
      return <ShieldCheck {...iconProps} className="w-12 h-12 text-emerald-400" />;
    case 'Crown':
      return <Crown {...iconProps} className="w-12 h-12 text-amber-300" />;
    default:
      return <Trophy {...iconProps} className="w-12 h-12 text-amber-400" />;
  }
};

const getTierColor = (tier) => {
  switch (tier?.toUpperCase()) {
    case 'DIAMOND':
      return { border: 'border-cyan-400/60', bg: 'from-cyan-500/20 via-blue-600/10 to-transparent', text: 'text-cyan-300', glow: 'shadow-[0_0_50px_rgba(34,211,238,0.35)]' };
    case 'PLATINUM':
      return { border: 'border-purple-400/60', bg: 'from-purple-500/20 via-indigo-600/10 to-transparent', text: 'text-purple-300', glow: 'shadow-[0_0_50px_rgba(192,132,252,0.35)]' };
    case 'GOLD':
      return { border: 'border-amber-400/60', bg: 'from-amber-500/20 via-orange-600/10 to-transparent', text: 'text-amber-300', glow: 'shadow-[0_0_50px_rgba(251,191,36,0.35)]' };
    case 'SILVER':
      return { border: 'border-slate-300/60', bg: 'from-slate-400/20 via-slate-600/10 to-transparent', text: 'text-slate-200', glow: 'shadow-[0_0_50px_rgba(226,232,240,0.25)]' };
    default:
      return { border: 'border-amber-600/60', bg: 'from-amber-700/20 via-orange-800/10 to-transparent', text: 'text-amber-500', glow: 'shadow-[0_0_50px_rgba(217,119,6,0.3)]' };
  }
};

const AchievementCelebrationModal = ({ isOpen, achievement, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !achievement) return null;

  const tierStyle = getTierColor(achievement.badgeTier);

  const handleShare = () => {
    const text = `🏆 Unlocked "${achievement.title}" on HealthPoint Fitness! +${achievement.points || 100} XP earned. #DisciplineOverMotivation`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Achievement brag copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`relative w-full max-w-md bg-surface border ${tierStyle.border} ${tierStyle.glow} rounded-3xl p-6 sm:p-8 text-center overflow-hidden`}
        >
          {/* Background Ambient Glow */}
          <div className={`absolute inset-0 bg-gradient-to-b ${tierStyle.bg} pointer-events-none`} />
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary rounded-full bg-surface-elevated/80 border border-border transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badge Icon Medallion */}
          <div className="relative z-10 mb-6 flex justify-center">
            <motion.div
              initial={{ rotate: -15, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className={`w-28 h-28 rounded-3xl bg-surface-elevated border-2 ${tierStyle.border} flex items-center justify-center relative shadow-2xl`}
            >
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 to-amber-500/30 blur-sm -z-10" />
              {getBadgeIcon(achievement.iconName, achievement.badgeTier)}
              
              {/* Sparkle Badges */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-primary text-black"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </motion.div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="w-3 h-3" />
              Achievement Unlocked!
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              {achievement.title}
            </h2>

            <p className="text-xs sm:text-sm text-text-secondary max-w-xs mx-auto leading-relaxed">
              {achievement.description}
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-elevated border ${tierStyle.border} ${tierStyle.text}`}>
                {achievement.badgeTier || 'BRONZE'} TIER
              </span>
              <span className="text-xs font-bold text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                +{achievement.points || 100} XP
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 mt-8 space-y-2.5">
            <button
              onClick={handleShare}
              className="w-full py-3 rounded-xl bg-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Brag Snippet Copied!' : 'Share Achievement'}
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 border border-border text-xs font-semibold text-text-secondary hover:text-text-primary transition-all"
            >
              Continue Training
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AchievementCelebrationModal;
