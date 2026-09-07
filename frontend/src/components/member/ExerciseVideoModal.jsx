import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Info, 
  Dumbbell, 
  Activity,
  CheckCircle2,
  AlertTriangle,
  Rotate3d,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';

const ExerciseVideoModal = ({ exercise, isOpen = true, onClose }) => {
  if (!exercise || (isOpen === false)) return null;

  const [activeTab, setActiveTab] = useState('video'); // 'video' or 'biomechanics'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="panel bg-surface border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-surface-elevated/50 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="badge-accent">{exercise.category}</span>
            {exercise.subMuscle && (
              <span className="text-xs text-text-secondary font-medium">
                • {exercise.subMuscle}
              </span>
            )}
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              {exercise.title || exercise.name}
            </h3>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video / Animated Movement Player */}
        <div className="aspect-video w-full bg-black relative">
          {exercise.videoUrl && exercise.videoUrl.includes('youtube') ? (
            <iframe 
              src={exercise.videoUrl} 
              title={exercise.title || exercise.name}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
              <img 
                src={exercise.thumbnail || exercise.videoUrl} 
                alt={exercise.title || exercise.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">Live Movement Guide</div>
                  <h2 className="text-xl font-bold">{exercise.title || exercise.name}</h2>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Execution Details & Biomechanics Grid */}
        <div className="p-6 space-y-5">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3 py-1 rounded-lg bg-surface-elevated border border-border text-text-secondary font-medium">
              Equipment: <strong className="text-text-primary">{exercise.equipment || 'Full Gym'}</strong>
            </div>
            <div className="px-3 py-1 rounded-lg bg-surface-elevated border border-border text-text-secondary font-medium">
              Difficulty: <strong className="text-text-primary">{exercise.difficulty || 'Intermediate'}</strong>
            </div>
            {exercise.tempo && (
              <div className="px-3 py-1 rounded-lg bg-surface-elevated border border-border text-text-secondary font-medium font-mono">
                Tempo: <strong className="text-primary">{exercise.tempo}</strong>
              </div>
            )}
            {exercise.has3dModel && (
              <div className="badge-hero">
                <Rotate3d className="w-3.5 h-3.5" /> 3D Biomechanical Model Available
              </div>
            )}
          </div>

          {/* Coaching Cues vs Common Mistakes */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Cues */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Form Execution Cues
              </div>
              <p className="text-xs text-text-primary leading-relaxed">
                {exercise.cues || exercise.formCues || "Maintain core intra-abdominal tension, plant feet firmly, and control the eccentric descent before explosive concentric drive."}
              </p>
            </div>

            {/* Common Mistakes */}
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
              <div className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Common Biomechanical Errors
              </div>
              <p className="text-xs text-text-primary leading-relaxed">
                {exercise.mistakes || "Using momentum swing rather than pure fiber tension; hyperextending cervical spine; flaring elbows past comfortable glenohumeral plane."}
              </p>
            </div>
          </div>

          {/* Targeted Anatomy Map */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1.5">
            <div className="text-[10px] uppercase font-semibold text-text-secondary tracking-wider">
              Anatomical Muscle Recruitment
            </div>
            <div className="text-xs font-medium text-text-primary">
              {exercise.targetMuscles || exercise.muscleImpact || "Pectoralis Major, Anterior Deltoids, Triceps Brachii, Core Stabilizers"}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExerciseVideoModal;
