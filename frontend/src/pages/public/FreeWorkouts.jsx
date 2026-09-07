import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Search, 
  Filter, 
  Clock, 
  Dumbbell, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { exercises } from '../../data/exerciseDatabase';

const FreeWorkouts = () => {
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedEquipment, setSelectedEquipment] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const locations = ['ALL', 'Gym', 'Home', 'Outdoor'];
  const equipments = ['ALL', 'Bodyweight', 'Dumbbells', 'Barbell', 'Cables', 'Machine'];

  const filteredWorkouts = exercises.filter(w => {
    const matchLoc = selectedLocation === 'ALL' || w.location === selectedLocation;
    const matchEq = selectedEquipment === 'ALL' || w.equipment === selectedEquipment;
    const matchSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) || w.targetMuscles.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLoc && matchEq && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full relative">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-text-secondary text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Open Exercise & Video Vault
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Biomechanical Exercise Library
          </h1>
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">
            Curated exercise tutorials, form execution cues, and injury prevention guides across all muscle groups.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="panel p-5 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search exercises or target muscle..."
                className="w-full bg-surface-elevated border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto text-xs">
              <span className="text-[11px] font-medium text-text-secondary mr-1">Location:</span>
              {locations.map(loc => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedLocation === loc ? 'bg-primary text-white font-semibold' : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-border text-xs">
            <span className="text-[11px] font-medium text-text-secondary mr-1">Equipment:</span>
            {equipments.map(eq => (
              <button
                key={eq}
                onClick={() => setSelectedEquipment(eq)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedEquipment === eq ? 'bg-surface-elevated text-primary font-semibold border border-primary/30' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {eq}
              </button>
            ))}
          </div>
        </div>

        {/* Workout Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkouts.map((w, idx) => (
            <div
              key={w.id}
              onClick={() => setActiveVideo(w)}
              className="panel-interactive overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-surface-elevated">
                  <img
                    src={w.thumbnail}
                    alt={w.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-black/20 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <span className="badge-accent">{w.category}</span>
                    <span className="badge-muted">{w.difficulty}</span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-text-primary bg-black/80 px-2 py-0.5 rounded-md">
                    {w.duration}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="text-[10px] text-primary font-medium">{w.subMuscle}</div>
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                    {w.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {w.cues}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-border flex justify-between items-center text-xs text-text-secondary">
                <span className="text-[11px] font-medium">{w.equipment}</span>
                <span className="text-primary font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform text-[11px]">
                  Watch Form <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        <AnimatePresence>
          {activeVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="panel bg-surface border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="badge-accent">{activeVideo.category}</span>
                    <h3 className="text-sm font-bold text-text-primary">{activeVideo.title}</h3>
                  </div>
                  <button onClick={() => setActiveVideo(null)} className="p-1.5 rounded-lg bg-surface-elevated text-text-secondary hover:text-text-primary">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="aspect-video w-full bg-black">
                  <iframe
                    src={activeVideo.videoUrl}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="p-5 space-y-4">
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                    <div className="text-xs font-semibold text-primary">Key Execution Cues</div>
                    <p className="text-xs text-text-primary leading-relaxed">{activeVideo.cues}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-elevated border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="font-semibold text-xs text-text-primary">Want AI calibrated training splits?</h4>
                      <p className="text-[11px] text-text-secondary">Generate periodized progression tracking and live volume charts.</p>
                    </div>
                    <Link to="/register" className="btn-primary text-xs shrink-0">
                      Join HealthPoint →
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default FreeWorkouts;
