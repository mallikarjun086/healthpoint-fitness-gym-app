import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Plus, Sparkles, FolderOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No Records Found",
  description = "Get started by generating your first custom routine or logging an activity.",
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`panel p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed border-border ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-surface-elevated border border-border flex items-center justify-center text-text-secondary shadow-inner relative">
        <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
        <div className="absolute -top-1 -right-1 p-1 rounded-full bg-primary/20 text-primary">
          <Sparkles className="w-3 h-3" />
        </div>
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base font-bold text-text-primary tracking-tight">{title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
      </div>

      {(actionLabel || secondaryLabel) && (
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="btn-primary py-2 px-4 text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-primary/20"
            >
              <Plus className="w-3.5 h-3.5" />
              {actionLabel}
            </button>
          )}

          {secondaryLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="btn-secondary py-2 px-4 text-xs font-semibold"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
