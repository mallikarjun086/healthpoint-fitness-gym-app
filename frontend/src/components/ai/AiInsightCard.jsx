import { Activity, Sparkles } from 'lucide-react';
import { useProgressInsight, useRetentionNudge } from '../../hooks/useAi';

export default function AiInsightCard({ type = 'progress' }) {
  const { data: progressData, isLoading: isProgressLoading } = useProgressInsight();
  const { data: nudgeData, isLoading: isNudgeLoading } = useRetentionNudge();

  if (isProgressLoading || isNudgeLoading) {
    return (
      <div className="panel p-5 animate-pulse space-y-2">
        <div className="h-3 bg-surface-elevated rounded w-1/4" />
        <div className="h-3 bg-surface-elevated rounded w-2/3" />
      </div>
    );
  }

  const isProgress = type === 'progress';
  const icon = isProgress ? <Activity className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4 text-primary" />;
  const title = isProgress ? "Progress Telemetry" : "Coach Observation";
  const content = isProgress ? progressData?.insight : nudgeData?.nudge;

  if (!content) return null;

  return (
    <div className="panel p-5 relative overflow-hidden">
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-surface-elevated border border-border shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">{title}</h3>
          <p className="text-text-primary leading-relaxed text-xs">{content}</p>
        </div>
      </div>
    </div>
  );
}
