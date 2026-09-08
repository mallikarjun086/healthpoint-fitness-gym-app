import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Plus, 
  Play, 
  Eye, 
  Upload, 
  Trash2, 
  CheckCircle, 
  Search, 
  Film, 
  Layers,
  X
} from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { toast } from 'sonner';

const ContentManagement = () => {
  const [contents, setContents] = useState([
    { id: 1, title: 'Mastering the Barbell Squat', category: 'Strength Training', duration: '12:45', views: '1.2k', videoUrl: 'https://www.youtube.com/embed/g2bOwQ5M-x8', thumbnail: 'https://img.youtube.com/vi/g2bOwQ5M-x8/hqdefault.jpg' },
    { id: 2, title: 'HIIT Cardio Fat Burner', category: 'Fat Loss', duration: '20:00', views: '3.4k', videoUrl: 'https://www.youtube.com/embed/ml6cT4AZdqI', thumbnail: 'https://img.youtube.com/vi/ml6cT4AZdqI/hqdefault.jpg' },
    { id: 3, title: 'Post-Workout Mobility & Recovery', category: 'Flexibility', duration: '15:30', views: '890', videoUrl: 'https://www.youtube.com/embed/L_xrDAtykMI', thumbnail: 'https://img.youtube.com/vi/L_xrDAtykMI/hqdefault.jpg' },
    { id: 4, title: 'Nutrition Masterclass: Macro Counting', category: 'Diet & Nutrition', duration: '25:10', views: '2.1k', videoUrl: 'https://www.youtube.com/embed/3n0F46ZtW9s', thumbnail: 'https://img.youtube.com/vi/3n0F46ZtW9s/hqdefault.jpg' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', category: 'Strength Training', duration: '', videoUrl: '' });

  const categories = ['ALL', 'Strength Training', 'Fat Loss', 'Flexibility', 'Diet & Nutrition'];

  const filteredContents = contents.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddContent = (e) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.videoUrl) {
      toast.error('Please enter title and video URL');
      return;
    }
    const ytId = newVideo.videoUrl.match(/(?:embed\/|v=|youtu\.be\/)([^?&\/]+)/)?.[1] || '';
    const item = {
      id: Date.now(),
      title: newVideo.title,
      category: newVideo.category,
      duration: newVideo.duration || '10:00',
      views: '0',
      videoUrl: newVideo.videoUrl,
      thumbnail: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : ''
    };
    setContents(prev => [item, ...prev]);
    setIsModalOpen(false);
    setNewVideo({ title: '', category: 'Strength Training', duration: '', videoUrl: '' });
    toast.success('New video content published to Member Library!');
  };

  const handleDeleteContent = (id, title) => {
    setContents(prev => prev.filter(c => c.id !== id));
    toast.success(`Video "${title}" deleted.`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="admin" />

      <main className="flex-1 ml-0 md:ml-64 p-6 sm:p-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent">Media Control Center</span>
            </div>
            <h1 className="heading-xl text-text-primary">Content & Video Library</h1>
            <p className="body-sm text-text-secondary mt-1">Upload, manage, and categorize workout videos and masterclasses.</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Upload className="w-4 h-4" /> Upload Video
          </button>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search video tutorials..." 
              className="w-full bg-surface-card border border-border rounded-xl pl-10 pr-4 py-2 text-xs text-text-primary outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'bg-surface-elevated text-text-secondary hover:text-text-primary border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map(item => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel-card overflow-hidden group hover:border-border-light transition-all flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="aspect-video bg-surface-elevated rounded-xl mb-4 relative overflow-hidden border border-border">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.style.display='none'; if (e.target.nextSibling) e.target.nextSibling.style.display='flex'; }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-surface-elevated flex items-center justify-center" style={{ display: item.thumbnail ? 'none' : 'flex' }}>
                    <Film className="w-8 h-8 text-text-muted" />
                  </div>
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-accent">
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-background/80 backdrop-blur-sm rounded-md text-[10px] font-semibold text-text-primary border border-border">
                    {item.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="badge-accent text-[10px]">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {item.views} Views
                  </span>
                </div>

                <h3 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
              </div>

              <div className="p-3.5 border-t border-border bg-surface-elevated/40 flex items-center justify-between">
                <span className="caption">Published Live</span>
                <button 
                  onClick={() => handleDeleteContent(item.id, item.title)}
                  className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="panel bg-surface p-6 w-full max-w-md border-border relative"
              >
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-elevated"
                >
                  <X className="w-4 h-4" />
                </button>

                <h3 className="heading-md text-text-primary mb-1">Publish Video Tutorial</h3>
                <p className="body-sm text-text-secondary mb-4">Add media directly to the member video portal.</p>

                <form onSubmit={handleAddContent} className="space-y-3.5">
                  <div>
                    <label className="caption block mb-1">Video Title *</label>
                    <input 
                      type="text" 
                      value={newVideo.title} 
                      onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                      placeholder="e.g. Master Triceps Pushdowns" 
                      required 
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="caption block mb-1">Category</label>
                    <select 
                      value={newVideo.category}
                      onChange={e => setNewVideo({...newVideo, category: e.target.value})}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary outline-none focus:border-primary"
                    >
                      <option value="Strength Training">Strength Training</option>
                      <option value="Fat Loss">Fat Loss</option>
                      <option value="Flexibility">Flexibility</option>
                      <option value="Diet & Nutrition">Diet & Nutrition</option>
                    </select>
                  </div>
                  <div>
                    <label className="caption block mb-1">Video Embed / URL *</label>
                    <input 
                      type="text" 
                      value={newVideo.videoUrl} 
                      onChange={e => setNewVideo({...newVideo, videoUrl: e.target.value})}
                      placeholder="https://www.youtube.com/embed/..." 
                      required 
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="caption block mb-1">Duration (e.g. 15:30)</label>
                    <input 
                      type="text" 
                      value={newVideo.duration} 
                      onChange={e => setNewVideo({...newVideo, duration: e.target.value})}
                      placeholder="12:00" 
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 btn-primary"
                    >
                      Publish
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ContentManagement;
