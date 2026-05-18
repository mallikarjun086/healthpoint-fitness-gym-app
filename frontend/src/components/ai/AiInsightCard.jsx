import { motion } from 'framer-motion';
import { Sparkles, Activity } from 'lucide-react';
import { useProgressInsight, useRetentionNudge } from '../../hooks/useAi';

export default function AiInsightCard({ type = 'progress' }) {
  const { data: progressData, isLoading: isProgressLoading } = useProgressInsight();
  const { data: nudgeData, isLoading: isNudgeLoading } = useRetentionNudge();

  if (isProgressLoading || isNudgeLoading) {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-neutral-800 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
      </div>
    );
  }

  const isProgress = type === 'progress';
  const icon = isProgress ? <Activity className="w-5 h-5 text-emerald-400" /> : <Sparkles className="w-5 h-5 text-purple-400" />;
  const title = isProgress ? "Progress Analyst" : "Coach Insight";
  const content = isProgress ? progressData?.insight : nudgeData?.nudge;

  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800/80 rounded-2xl p-6 shadow-xl"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-50"></div>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${isProgress ? 'bg-emerald-500/10' : 'bg-purple-500/10'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-2">{title}</h3>
          <p className="text-neutral-100 leading-relaxed text-sm">{content}</p>
        </div>
      </div>
    </motion.div>
  );
}
