import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Dumbbell, Save } from 'lucide-react';
import api from '../../api';

const WorkoutCreatorModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'BEGINNER',
    durationMinutes: 45,
    bodyPart: 'FULL_BODY',
    exercises: [{ name: '', sets: 3, reps: 10, restTime: '60s' }]
  });

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: 3, reps: 10, restTime: '60s' }]
    });
  };

  const removeExercise = (index) => {
    const newExercises = formData.exercises.filter((_, i) => i !== index);
    setFormData({ ...formData, exercises: newExercises });
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index][field] = value;
    setFormData({ ...formData, exercises: newExercises });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workout/create', formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to create workout", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Dumbbell className="text-primary" /> Create Custom Routine
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Routine Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                  placeholder="e.g. Morning Shred"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all h-24"
                  placeholder="What is the goal of this workout?"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Difficulty</label>
                  <select 
                    value={formData.difficulty}
                    onChange={e => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
                  >
                    <option value="BEGINNER" className="bg-surface">Beginner</option>
                    <option value="INTERMEDIATE" className="bg-surface">Intermediate</option>
                    <option value="ADVANCED" className="bg-surface">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Duration (min)</label>
                  <input 
                    type="number"
                    value={formData.durationMinutes}
                    onChange={e => setFormData({...formData, durationMinutes: parseInt(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Focus Area</label>
                <select 
                  value={formData.bodyPart}
                  onChange={e => setFormData({...formData, bodyPart: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="FULL_BODY" className="bg-surface">Full Body</option>
                  <option value="PUSH" className="bg-surface">Push</option>
                  <option value="PULL" className="bg-surface">Pull</option>
                  <option value="LEGS" className="bg-surface">Legs</option>
                  <option value="CORE" className="bg-surface">Core</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Exercises</h3>
              <button 
                type="button"
                onClick={addExercise}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {formData.exercises.map((ex, index) => (
                <div key={index} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex justify-between gap-4">
                    <input 
                      required
                      placeholder="Exercise Name (e.g. Squats)"
                      value={ex.name}
                      onChange={e => updateExercise(index, 'name', e.target.value)}
                      className="flex-1 bg-transparent border-b border-white/10 focus:border-primary outline-none py-1"
                    />
                    {formData.exercises.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeExercise(index)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Sets</span>
                      <input 
                        type="number"
                        value={ex.sets}
                        onChange={e => updateExercise(index, 'sets', parseInt(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Reps</span>
                      <input 
                        type="number"
                        value={ex.reps}
                        onChange={e => updateExercise(index, 'reps', parseInt(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Rest</span>
                      <input 
                        value={ex.restTime}
                        onChange={e => updateExercise(index, 'restTime', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-bold">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="btn-premium px-8 py-2 text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Routine
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkoutCreatorModal;
