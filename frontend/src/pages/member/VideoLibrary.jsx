import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Search, 
  Filter, 
  Crown, 
  ChevronRight, 
  X, 
  Sparkles, 
  Dumbbell, 
  CheckCircle2,
  AlertTriangle,
  Rotate3d,
  Layers,
  MapPin,
  Clock,
  Activity
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import AiChatWidget from '../../components/ai/AiChatWidget';
import ExerciseVideoModal from '../../components/member/ExerciseVideoModal';
import { exercises, muscleTaxonomy } from '../../data/exerciseDatabase';

const VideoLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeSubMuscle, setActiveSubMuscle] = useState('ALL');
  const [selectedEquipment, setSelectedEquipment] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Available sub-muscles for current category
  const activeTaxonomy = useMemo(() => {
    return muscleTaxonomy.find(t => t.id === activeCategory);
  }, [activeCategory]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesCategory = activeCategory === 'ALL' || ex.category === activeCategory;
      const matchesSub = activeSubMuscle === 'ALL' || (ex.subMuscle && ex.subMuscle.includes(activeSubMuscle));
      const matchesEquip = selectedEquipment === 'ALL' || ex.equipment === selectedEquipment;
      const matchesDiff = selectedDifficulty === 'ALL' || ex.difficulty === selectedDifficulty;
      const matchesSearch = 
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ex.targetMuscles.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.subMuscle && ex.subMuscle.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSub && matchesEquip && matchesDiff && matchesSearch;
    });
  }, [activeCategory, activeSubMuscle, selectedEquipment, selectedDifficulty, searchQuery]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent">Biomechanical Video Vault</span>
              <span className="text-[11px] text-text-secondary font-medium">100% Muscle Coverage</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">HD Exercise Video & 3D Execution Library</h1>
            <p className="text-xs text-text-secondary mt-0.5">Master precision execution cues, joint angles, and tempo protocols across all 11 muscle groups.</p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text"
              placeholder="Search exercise, muscle, or equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-xl py-2 pl-9 pr-4 text-xs text-text-primary outline-none focus:border-primary transition-colors"
            />
          </div>
        </header>

        {/* Primary Muscle Group Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <button
            onClick={() => { setActiveCategory('ALL'); setActiveSubMuscle('ALL'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
              activeCategory === 'ALL'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            All Muscle Groups
          </button>
          {muscleTaxonomy.map((m) => (
            <button
              key={m.id}
              onClick={() => { setActiveCategory(m.id); setActiveSubMuscle('ALL'); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                activeCategory === m.id
                  ? 'bg-primary text-white font-semibold shadow-sm'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Secondary Sub-Muscle & Equipment Filter Bar */}
        <div className="p-3 rounded-xl bg-surface-elevated border border-border mb-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Sub-muscles pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-text-secondary font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-primary" /> Sub-Muscle:
            </span>
            <button
              onClick={() => setActiveSubMuscle('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                activeSubMuscle === 'ALL'
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                  : 'text-text-secondary hover:text-text-primary'
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
                    ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Quick Dropdowns */}
          <div className="flex items-center gap-2">
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="bg-surface border border-border rounded-lg px-2.5 py-1 text-[11px] text-text-primary outline-none focus:border-primary"
            >
              <option value="ALL">All Equipment</option>
              <option value="Barbell">Barbell</option>
              <option value="Dumbbells">Dumbbells</option>
              <option value="Cables">Cables</option>
              <option value="Machine">Machine</option>
              <option value="Bodyweight">Bodyweight</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-surface border border-border rounded-lg px-2.5 py-1 text-[11px] text-text-primary outline-none focus:border-primary"
            >
              <option value="ALL">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center mb-4 text-xs text-text-secondary">
          <div>
            Showing <strong className="text-text-primary font-semibold">{filteredExercises.length}</strong> biomechanical video guides
          </div>
          {activeTaxonomy && (
            <div className="text-[11px] text-text-secondary italic">
              {activeTaxonomy.description}
            </div>
          )}
        </div>

        {/* Exercise Video Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((ex, idx) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setSelectedExercise(ex)}
              className="panel-interactive overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Thumbnail Header with Play Button & Badges */}
                <div className="relative h-44 bg-surface-elevated overflow-hidden">
                  <img 
                    src={ex.thumbnail} 
                    alt={ex.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-black/20 to-transparent" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="badge-accent">{ex.category}</span>
                    {ex.has3dModel && (
                      <span className="badge-hero flex items-center gap-1">
                        <Rotate3d className="w-3 h-3" /> 3D Biomechanics
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-text-primary bg-black/80 px-2 py-0.5 rounded-md border border-white/10">
                    {ex.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="text-[10px] text-primary font-medium tracking-wide">
                    {ex.subMuscle}
                  </div>
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                    {ex.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    <strong className="text-text-primary font-medium">Anatomy:</strong> {ex.targetMuscles}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-2 border-t border-border flex justify-between items-center text-[11px] text-text-secondary font-medium">
                <span className="flex items-center gap-1">
                  <Dumbbell className="w-3 h-3 text-primary" /> {ex.equipment}
                </span>
                <span className="text-primary font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  View Biomechanics <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Player Modal */}
        {selectedExercise && (
          <ExerciseVideoModal
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        )}

        {/* Floating AI Assistant */}
        <AiChatWidget />
      </main>
    </div>
  );
};

export default VideoLibrary;
