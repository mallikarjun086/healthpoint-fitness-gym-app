import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle } from 'lucide-react';

export default function WorkoutAdaptationModal({ isOpen, onClose, adaptationData, onAccept }) {
  if (!isOpen || !adaptationData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative inline-block overflow-hidden text-left align-bottom transition-all transform bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="px-6 pt-6 pb-4 border-b border-neutral-800 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">⚡</span> AI Plan Adaptation
            </h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-4">
            <div className="mb-6">
              <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-2">Coach's Reasoning</h4>
              <p className="text-neutral-200 text-sm leading-relaxed bg-neutral-800/50 p-4 rounded-xl border border-neutral-800/80">
                "{adaptationData.adaptation_reason}"
              </p>
            </div>

            <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3">Proposed Changes</h4>
            <div className="space-y-3">
              {adaptationData.exercises?.map((ex, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-neutral-950 p-3 rounded-lg border border-neutral-800/50">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-400">{ex.name}</p>
                    <p className="text-xs text-neutral-500">{ex.sets} sets × {ex.reps} reps</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 bg-neutral-950/50 border-t border-neutral-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Decline
            </button>
            <button
              onClick={() => {
                onAccept(adaptationData);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-black bg-emerald-400 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Accept Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
