import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Info, 
  Dumbbell, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ExerciseVideoModal = ({ exercise, isOpen, onClose }) => {
  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card w-full max-w-5xl overflow-hidden flex flex-col md:flex-row h-[80vh]"
      >
        {/* Left: Animated Demonstration */}
        <div className="flex-[2] bg-black relative flex items-center justify-center min-h-[300px] p-4">
          <img 
            src={exercise.videoUrl} 
            alt={exercise.name}
            className="w-full h-full object-contain rounded-2xl shadow-2xl"
          />
          <div className="absolute top-6 left-6 flex gap-2">
            <div className="bg-primary text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Animated Form</div>
            <div className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">Live Loop</div>
          </div>
        </div>

        {/* Right: Insights */}
        <div className="flex-1 bg-surface p-8 overflow-y-auto border-l border-white/5">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold">{exercise.name}</h2>
              <p className="text-primary text-sm font-bold mt-1">Perfect Form Guide</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X />
            </button>
          </div>

          {/* Muscle Impact Visualization */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Muscle Impact Map
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {(exercise.muscleImpact || "").split(',').filter(m => m.trim()).map((muscle, i) => (
                  <div key={i} className="relative h-12 bg-white/5 rounded-xl overflow-hidden border border-white/5">
                    <div className="absolute inset-0 flex items-center px-4 justify-between z-10">
                      <span className="text-sm font-bold">{muscle.trim()}</span>
                      <span className="text-[10px] font-black text-primary">PRIMARY</span>
                    </div>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: i === 0 ? '90%' : '60%' }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/20 to-primary/40"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Form Cues */}
            <div>
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" /> Execution Cues
              </h3>
              <div className="space-y-4">
                {(exercise.formCues || "").split('.').filter(c => c.trim()).map((cue, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed italic">"{cue.trim()}."</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 mt-10">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <h4 className="font-bold">Trainer Recommendation</h4>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Perform this movement with a controlled tempo (2s up, 2s down). Focus on the mind-muscle connection for maximum fiber recruitment.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExerciseVideoModal;
