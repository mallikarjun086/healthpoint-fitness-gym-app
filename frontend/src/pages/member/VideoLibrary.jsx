import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Search, 
  Filter, 
  Crown, 
  Clock, 
  BarChart, 
  ChevronRight,
  MonitorPlay,
  Flame,
  Zap,
  Info,
  X,
  Sparkles,
  Dumbbell,
  CheckCircle2
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import AiChatWidget from '../../components/ai/AiChatWidget';

const initialExerciseVideos = [
  {
    id: 1,
    title: 'Barbell Bench Press Masterclass',
    category: 'CHEST',
    type: 'STRENGTH',
    url: 'https://www.youtube.com/embed/rT7DgCr-3pg',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000',
    duration: '14 min',
    level: 'Intermediate',
    targetMuscles: 'Pectoralis Major, Anterior Deltoids, Triceps',
    cues: 'Retract scapula, maintain 45-degree elbow tuck, explode up through mid-chest.',
    mistakes: 'Flaring elbows to 90 degrees, lifting hips off bench, bouncing bar off sternum.',
    isPremium: false
  },
  {
    id: 2,
    title: 'Conventional Deadlift Biomechanics',
    category: 'BACK',
    type: 'POWERLIFTING',
    url: 'https://www.youtube.com/embed/op9kVnSso6Q',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000',
    duration: '18 min',
    level: 'Advanced',
    targetMuscles: 'Latissimus Dorsi, Erector Spinae, Glutes, Hamstrings',
    cues: 'Pull slack out of bar, wedge hips into bar, push floor away through mid-foot.',
    mistakes: 'Rounding lumbar spine, hitching bar above knees, yank off floor without tension.',
    isPremium: true
  },
  {
    id: 3,
    title: 'High Bar Back Squat Technique',
    category: 'LEGS',
    type: 'HYPERTROPHY',
    url: 'https://www.youtube.com/embed/ultWZbUMPL8',
    thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=1000',
    duration: '16 min',
    level: 'All Levels',
    targetMuscles: 'Quadriceps, Gluteus Maximus, Adductor Magnus',
    cues: 'Brace core with 360-degree intra-abdominal pressure, break at hips and knees simultaneously.',
    mistakes: 'Knees caving inward (valgus), heels coming off floor, butt wink at deep depth.',
    isPremium: false
  },
  {
    id: 4,
    title: 'Strict Overhead Barbell Press (OHP)',
    category: 'SHOULDERS',
    type: 'STRENGTH',
    url: 'https://www.youtube.com/embed/2yjwXTZQDDI',
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=1000',
    duration: '12 min',
    level: 'Intermediate',
    targetMuscles: 'Anterior & Lateral Deltoids, Upper Chest, Triceps',
    cues: 'Squeeze glutes and quads, clear chin path, lock out overhead inline with ears.',
    mistakes: 'Excessive lumbar arching, leaning back to turn into incline press.',
    isPremium: false
  },
  {
    id: 5,
    title: 'Incline Dumbbell Chest Press',
    category: 'CHEST',
    type: 'HYPERTROPHY',
    url: 'https://www.youtube.com/embed/8iPEnn-ltC8',
    thumbnail: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=1000',
    duration: '10 min',
    level: 'Beginner',
    targetMuscles: 'Clavicular Head (Upper Chest), Anterior Deltoid',
    cues: 'Set bench at 30-degree incline, converge dumbbells at top without clacking.',
    mistakes: 'Setting bench angle too high (turns into shoulder press), dropping weights.',
    isPremium: false
  },
  {
    id: 6,
    title: 'Romanian Deadlift (RDL) & Hamstring Fiber Growth',
    category: 'LEGS',
    type: 'HYPERTROPHY',
    url: 'https://www.youtube.com/embed/JCXUYuzwNrM',
    thumbnail: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=1000',
    duration: '15 min',
    level: 'Intermediate',
    targetMuscles: 'Hamstrings, Gluteus Maximus, Erector Spinae',
    cues: 'Hinge hips backwards like closing a door with your butt, soft knee bend, maintain flat spine.',
    mistakes: 'Bending knees into squat, letting bar drift away from shins.',
    isPremium: true
  }
];

const VideoLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState(initialExerciseVideos);

  const categories = ['ALL', 'CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE'];

  const filteredVideos = videos.filter(v => {
    const matchesCategory = activeCategory === 'ALL' || v.category === activeCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.targetMuscles.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="member" />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase text-primary tracking-widest">Exercise Execution Guide</span>
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tight">HD Video Exercise Library</h1>
            <p className="text-gray-400 mt-1">Master biomechanics, execution cues, and safety guidelines for peak hypertrophy & strength.</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search exercise or muscle group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-primary/50"
            />
          </div>
        </header>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <Filter className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
                activeCategory === cat 
                  ? 'bg-primary text-black scale-105 shadow-md shadow-primary/20' 
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid, idx) => (
            <motion.div
              key={vid.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedVideo(vid)}
              className="glass-card-interactive flex flex-col justify-between overflow-hidden group cursor-pointer"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-48 overflow-hidden bg-surface">
                  <img 
                    src={vid.thumbnail} 
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent"></div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="badge-lime">{vid.category}</span>
                    {vid.isPremium && (
                      <span className="badge-blue flex items-center gap-1">
                        <Crown className="w-3 h-3 text-secondary" /> PRO
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 text-[10px] font-mono font-bold bg-black/70 text-white px-2 py-0.5 rounded-md border border-white/10">
                    {vid.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-black italic text-white uppercase group-hover:text-primary transition-colors mb-2">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    <strong className="text-gray-300">Target Muscles:</strong> {vid.targetMuscles}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-border/50 flex justify-between items-center text-xs font-bold text-gray-400">
                <span className="text-[10px] uppercase">{vid.level}</span>
                <span className="text-primary text-[10px] uppercase font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Watch Execution Cues <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-surface border border-border"
            >
              <div className="p-4 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="badge-lime">{selectedVideo.category}</span>
                  <h3 className="text-lg font-black italic uppercase text-white">{selectedVideo.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player iframe */}
              <div className="aspect-video w-full bg-black">
                <iframe 
                  src={selectedVideo.url} 
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Coaching Cues & Execution Details */}
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-card p-5 border-l-4 border-l-primary bg-primary/5">
                    <div className="text-xs font-black uppercase text-primary mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Key Coaching Cues
                    </div>
                    <p className="text-xs text-gray-200 leading-relaxed font-medium">
                      {selectedVideo.cues}
                    </p>
                  </div>

                  <div className="glass-card p-5 border-l-4 border-l-red-500 bg-red-500/5">
                    <div className="text-xs font-black uppercase text-red-400 mb-2 flex items-center gap-1.5">
                      <Info className="w-4 h-4" /> Common Mistakes to Avoid
                    </div>
                    <p className="text-xs text-gray-200 leading-relaxed font-medium">
                      {selectedVideo.mistakes}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">Targeted Muscle Anatomy</div>
                  <div className="p-4 rounded-xl bg-black/40 border border-border text-xs text-white font-semibold">
                    {selectedVideo.targetMuscles}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Floating AI Assistant Coach */}
        <AiChatWidget />
      </main>
    </div>
  );
};

export default VideoLibrary;
