import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorState = ({
  title = "Telemetry Connection Interrupted",
  description = "An error occurred while communicating with the health telemetry service. Please retry.",
  onRetry,
  className = ""
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`panel p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 rounded-3xl border border-rose-500/20 bg-rose-500/5 ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
        <AlertTriangle className="w-8 h-8 text-rose-400" />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base font-bold text-text-primary tracking-tight">{title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary py-2 px-4 text-xs font-semibold flex items-center gap-1.5 bg-rose-500 hover:bg-rose-400 text-black border-none shadow-md shadow-rose-500/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry Request
          </button>
        )}

        <button
          onClick={() => navigate('/member/dashboard')}
          className="btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-1.5"
        >
          <Home className="w-3.5 h-3.5" />
          Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export default ErrorState;
