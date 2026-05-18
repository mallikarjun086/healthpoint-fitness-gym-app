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
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';

const VideoLibrary = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get('/content/all');
      // Adding professional thumbnails since the database only stores URLs for animations
      const enhancedVideos = res.data.map(v => ({
        ...v,
        thumbnail: v.type === 'YOGA' 
          ? "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000"
          : v.type === 'HIIT'
          ? "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000"
          : "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000",
        duration: "25 min",
        level: "Beginner",
        calories: "150"
      }));
      setVideos(enhancedVideos);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch videos", err);
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesTab = activeTab === 'ALL' || video.type === activeTab;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="member" />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Premium Library</span>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">On-Demand Training</h1>
            <p className="text-gray-400 mt-2">Exclusive masterclasses and animated routines for Elite Members.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search masterclasses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface border border-border focus:border-primary px-12 py-3 rounded-2xl outline-none text-sm w-80 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {['ALL', 'HIIT', 'YOGA', 'STRENGTH', 'MOBILITY'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                activeTab === tab 
                ? 'bg-primary text-black' 
                : 'bg-white/5 text-gray-500 border border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredVideos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card group cursor-pointer overflow-hidden flex flex-col"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                    <Play className="w-8 h-8 text-primary fill-current" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
                  <MonitorPlay className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">{video.type}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {video.duration}</span>
                  <span className="flex items-center gap-1.5"><BarChart className="w-3 h-3" /> {video.level}</span>
                  <span className="flex items-center gap-1.5"><Flame className="w-3 h-3 text-orange-500" /> {video.calories} kcal</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{video.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6">
                  {video.description}
                </p>

                <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-2">
                    START TRAINING <ChevronRight className="w-4 h-4" />
                  </span>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-surface bg-gray-800 flex items-center justify-center text-[8px] font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-surface bg-primary text-black flex items-center justify-center text-[8px] font-black">+1k</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Player Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card w-full max-w-5xl overflow-hidden shadow-[0_0_100px_rgba(var(--primary-rgb),0.2)]"
              >
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  <img 
                    src={selectedVideo.url} 
                    alt={selectedVideo.title}
                    className="w-full h-full object-contain"
                  />
                  <button 
                    onClick={() => setSelectedVideo(null)}
                    className="absolute top-6 right-6 p-3 rounded-full bg-black/50 text-white hover:bg-primary hover:text-black transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-primary text-black text-[10px] font-black rounded-full uppercase">Now Playing</span>
                        <span className="text-white/60 text-xs font-bold">{selectedVideo.type} Masterclass</span>
                      </div>
                      <h2 className="text-3xl font-black italic text-white uppercase">{selectedVideo.title}</h2>
                    </div>
                    <div className="flex gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center min-w-[80px]">
                        <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Time Left</div>
                        <div className="text-xl font-mono font-bold text-primary">{selectedVideo.duration}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Section */}
        <section className="mt-20">
          <div className="glass-card p-10 bg-gradient-to-r from-primary/20 via-transparent to-transparent flex flex-col md:flex-row items-center justify-between gap-10 border-l-4 border-l-primary">
            <div className="max-w-xl">
              <h2 className="text-3xl font-black italic uppercase mb-4 leading-tight">Master Your Technique With Our AI-Powered Guidance</h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Our animated library is designed by world-class Olympic athletes and physical therapists. Focus on the mind-muscle connection and let the rhythm of the animation guide your breath.
              </p>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold">100+ Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <MonitorPlay className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold">HD Animated Loops</span>
                </div>
              </div>
            </div>
            <div className="relative group shrink-0">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl group-hover:bg-primary/40 transition-all"></div>
              <div className="relative p-8 rounded-full bg-surface border border-primary/20">
                <MonitorPlay className="w-20 h-20 text-primary animate-pulse" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VideoLibrary;
