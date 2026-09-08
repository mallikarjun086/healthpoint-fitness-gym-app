import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Search, 
  Filter, 
  Sparkles, 
  Dumbbell, 
  Activity,
  Plus,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
  Flame,
  ListPlus
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import AiChatWidget from '../../components/ai/AiChatWidget';
import ExerciseDetailModal from '../../components/member/ExerciseDetailModal';
import CustomWorkoutBuilderDrawer from '../../components/member/CustomWorkoutBuilderDrawer';
import { exercises as fallbackExercises, muscleTaxonomy } from '../../data/exerciseDatabase';
import api from '../../api';

const VideoLibrary = () => {
  const [exerciseList, setExerciseList] = useState(fallbackExercises);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeSubMuscle, setActiveSubMuscle] = useState('ALL');
  const [selectedEquipment, setSelectedEquipment] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedCategoryType, setSelectedCategoryType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Drawers
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [queuedExercises, setQueuedExercises] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch from backend API on mount
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        const res = await api.get('/exercises');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          // Merge API fields with fallback icons/thumbnails if needed
          setExerciseList(res.data);
        }
      } catch (err) {
        console.warn("Using local fallback exercise database", err);
      } finally {
        setLoading(false);
      }
    };
    loadExercises();
  }, []);

  // Show transient toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Add exercise to custom workout builder
  const handleAddToWorkout = (exercise) => {
    if (!queuedExercises.find(e => (e.id === exercise.id || (e.name && e.name === exercise.name)))) {
      setQueuedExercises(prev => [...prev, exercise]);
      showToast(`Added "${exercise.name || exercise.title}" to workout builder!`);
    } else {
      showToast(`"${exercise.name || exercise.title}" is already in your routine.`);
    }
  };

  const handleRemoveQueuedExercise = (exerciseId) => {
    setQueuedExercises(prev => prev.filter(e => e.id !== exerciseId));
  };

  // Available sub-muscles for current category
  const activeTaxonomy = useMemo(() => {
    return muscleTaxonomy.find(t => t.id === activeCategory);
  }, [activeCategory]);

  const filteredExercises = useMemo(() => {
    return exerciseList.filter(ex => {
      const muscle = (ex.primaryMuscleGroup || ex.category || '').toUpperCase();
      const matchesCategory = activeCategory === 'ALL' || muscle === activeCategory;
      
      const sub = (ex.subMuscle || ex.muscleImpact || '').toLowerCase();
      const matchesSub = activeSubMuscle === 'ALL' || sub.includes(activeSubMuscle.toLowerCase());
      
      const equip = (ex.equipmentRequired || ex.equipment || '').toUpperCase();
      const matchesEquip = selectedEquipment === 'ALL' || equip === selectedEquipment.toUpperCase();
      
      const diff = (ex.difficulty || '').toUpperCase();
      const matchesDiff = selectedDifficulty === 'ALL' || diff === selectedDifficulty.toUpperCase();
      
      const catType = (ex.category || '').toUpperCase();
      const matchesCatType = selectedCategoryType === 'ALL' || catType === selectedCategoryType.toUpperCase();

      const q = searchQuery.toLowerCase();
      const name = (ex.name || ex.title || '').toLowerCase();
      const target = (ex.targetMuscles || ex.muscleImpact || ex.instructions || '').toLowerCase();
      const matchesSearch = !q || name.includes(q) || target.includes(q) || equip.toLowerCase().includes(q);

      return matchesCategory && matchesSub && matchesEquip && matchesDiff && matchesCatType && matchesSearch;
    });
  }, [exerciseList, activeCategory, activeSubMuscle, selectedEquipment, selectedDifficulty, selectedCategoryType, searchQuery]);

  return (
    <div className="min-h-screen bg-hp-canvas flex">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-6 sm:p-8 relative overflow-hidden">
        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-indigo-400/30"
            >
              <Check className="w-4 h-4" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="badge-accent">Biomechanical Video Vault</span>
              <span className="text-[11px] text-slate-400 font-medium">100% Balanced Muscle Coverage</span>
            </div>
            <h1 className="heading-xl text-white">Biomechanical Exercise & Animated Motion Rig Library</h1>
            <p className="body-sm text-slate-400 mt-1">
              Explore precision joint kinematics, computer vision safe angle ranges, and custom routine building across all 12 muscle groups.
            </p>
          </div>

          {/* Search & Custom Workout Queue Action */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search exercise, muscle, or equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-hp-surface border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              onClick={() => setIsBuilderOpen(true)}
              className="relative btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shrink-0"
            >
              <ListPlus className="w-4 h-4" />
              <span>Workout Builder</span>
              {queuedExercises.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-indigo-900 font-mono text-[10px] font-bold flex items-center justify-center ml-1">
                  {queuedExercises.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Primary Muscle Group Tabs (12 Exhaustive Categories) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <button
            onClick={() => { setActiveCategory('ALL'); setActiveSubMuscle('ALL'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
              activeCategory === 'ALL'
                ? 'bg-indigo-600 text-white font-semibold shadow-md'
                : 'bg-hp-surface text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            All Muscle Groups ({exerciseList.length})
          </button>
          {muscleTaxonomy.map((m) => {
            const count = exerciseList.filter(e => (e.primaryMuscleGroup || e.category || '').toUpperCase() === m.id).length;
            return (
              <button
                key={m.id}
                onClick={() => { setActiveCategory(m.id); setActiveSubMuscle('ALL'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                  activeCategory === m.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'bg-hp-surface text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                <span>{m.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeCategory === m.id ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                }`}>
                  {count || 5}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Sub-Muscle & Equipment Filter Bar */}
        <div className="p-3.5 rounded-2xl bg-hp-surface border border-white/5 mb-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Sub-muscles pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-indigo-400" /> Focus Sub-Region:
            </span>
            <button
              onClick={() => setActiveSubMuscle('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                activeSubMuscle === 'ALL'
                  ? 'bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Sub-Regions
            </button>
            {activeTaxonomy?.subMuscles.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubMuscle(sub.split(' ')[0])}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                  activeSubMuscle === sub.split(' ')[0]
                    ? 'bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Quick Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedCategoryType}
              onChange={(e) => setSelectedCategoryType(e.target.value)}
              className="bg-hp-surface-card border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Categories</option>
              <option value="STRENGTH">Strength</option>
              <option value="HIIT">HIIT</option>
              <option value="MOBILITY">Mobility</option>
              <option value="HOME_WORKOUT">Home Workout</option>
              <option value="CORE">Core</option>
            </select>

            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="bg-hp-surface-card border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Equipment</option>
              <option value="Barbell">Barbell</option>
              <option value="Dumbbells">Dumbbells</option>
              <option value="Cables">Cables</option>
              <option value="Machine">Machine</option>
              <option value="Bodyweight">Bodyweight</option>
              <option value="Kettlebell">Kettlebell</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-hp-surface-card border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Taxonomy Insight */}
        <div className="flex justify-between items-center mb-5 text-xs text-slate-400">
          <div>
            Showing <strong className="text-white font-semibold">{filteredExercises.length}</strong> biomechanical movements
          </div>
          {activeTaxonomy && (
            <div className="text-[11px] text-slate-400 italic hidden sm:block">
              {activeTaxonomy.description}
            </div>
          )}
        </div>

        {/* Exercise Video & Skeletal Animation Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((ex, idx) => {
            const isQueued = queuedExercises.some(e => e.id === ex.id);
            return (
              <motion.div
                key={ex.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="panel-card p-0 overflow-hidden flex flex-col justify-between group hover:border-indigo-500/30 transition-all cursor-pointer"
                onClick={() => setSelectedExercise(ex)}
              >
                <div>
                  {/* Thumbnail / Animated Preview Header */}
                  <div className="relative h-44 bg-hp-surface-card overflow-hidden">
                    <img 
                      src={ex.thumbnailUrl || ex.thumbnail || 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'} 
                      alt={ex.name || ex.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-hp-surface via-black/40 to-transparent" />

                    {/* Play Motion Rig Trigger */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Activity className="w-5 h-5 text-white animate-pulse" />
                      </div>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="badge-accent">{ex.primaryMuscleGroup || ex.category}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/70 text-slate-200 border border-white/10 font-mono">
                        {ex.equipmentRequired || ex.equipment}
                      </span>
                    </div>

                    {/* Safe Angles indicator badge */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-black/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Safe Angles
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-4 space-y-2">
                    <div className="text-[10px] text-indigo-400 font-medium tracking-wide">
                      {ex.subMuscle || ex.muscleImpact || 'Target Musculature'}
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {ex.name || ex.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {ex.formCues || ex.cues || ex.instructions}
                    </p>
                  </div>
                </div>

                {/* Card Footer with Quick Add Button */}
                <div className="p-4 pt-2 border-t border-white/5 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-mono">
                    Tempo: <strong className="text-slate-200">{ex.tempo || '3-0-1-0'}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWorkout(ex);
                      }}
                      className={`p-1.5 rounded-lg border text-[11px] font-medium transition-colors flex items-center gap-1 ${
                        isQueued 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                      }`}
                      title="Add to Custom Workout"
                    >
                      {isQueued ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Add
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedExercise(ex)}
                      className="text-indigo-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Kinematics</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Exercise Detail Modal with Animated Skeletal Rig */}
        {selectedExercise && (
          <ExerciseDetailModal
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
            onAddToWorkout={(ex) => {
              handleAddToWorkout(ex);
              setSelectedExercise(null);
              setIsBuilderOpen(true);
            }}
          />
        )}

        {/* Custom Workout Builder Slide-Over Drawer */}
        <CustomWorkoutBuilderDrawer
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          selectedExercises={queuedExercises}
          onRemoveExercise={handleRemoveQueuedExercise}
          onClearAll={() => setQueuedExercises([])}
          onSaveSuccess={(savedWorkout) => {
            showToast(`"${savedWorkout.title}" successfully saved to your profile!`);
            setQueuedExercises([]);
          }}
        />

        {/* Floating AI Coach Widget */}
        <AiChatWidget />
      </main>
    </div>
  );
};

export default VideoLibrary;
