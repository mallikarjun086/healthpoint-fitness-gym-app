import { motion } from 'framer-motion';
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
  Layers
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
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase text-primary tracking-widest">Media Control Center</span>
            </div>
            <h1 className="text-3xl font-bold">Content & Video Library</h1>
            <p className="text-gray-400 mt-1">Upload, manage, and categorize workout videos and masterclasses.</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-premium px-6 py-2.5 text-xs flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-black" /> Upload Video
          </button>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search video tutorials..." 
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-primary text-black' : 'bg-surface text-gray-400 hover:text-white border border-border'}`}
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card overflow-hidden group hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="aspect-video bg-surface-elevated rounded-xl mb-4 relative group-hover:scale-[1.02] transition-transform overflow-hidden border border-border">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-surface-elevated flex items-center justify-center" style={{ display: item.thumbnail ? 'none' : 'flex' }}>
                    <Film className="w-8 h-8 text-text-muted" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-hero">
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-[10px] font-bold text-white">
                    {item.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-md">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {item.views} Views
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
              </div>

              <div className="p-4 border-t border-white/5 bg-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-400">Published Live</span>
                <button 
                  onClick={() => handleDeleteContent(item.id, item.title)}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Upload Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card p-8 w-full max-w-md bg-surface border-border">
              <h3 className="text-2xl font-bold mb-4">Publish New Workout Video</h3>
              <form onSubmit={handleAddContent} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Video Title</label>
                  <input 
                    type="text" 
                    value={newVideo.title} 
                    onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                    placeholder="e.g. Master Triceps Pushdowns" 
                    required 
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                  <select 
                    value={newVideo.category}
                    onChange={e => setNewVideo({...newVideo, category: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm text-white outline-none focus:border-primary"
                  >
                    <option value="Strength Training">Strength Training</option>
                    <option value="Fat Loss">Fat Loss</option>
                    <option value="Flexibility">Flexibility</option>
                    <option value="Diet & Nutrition">Diet & Nutrition</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Video Embed / URL</label>
                  <input 
                    type="text" 
                    value={newVideo.videoUrl} 
                    onChange={e => setNewVideo({...newVideo, videoUrl: e.target.value})}
                    placeholder="https://www.youtube.com/embed/..." 
                    required 
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Duration (e.g. 15:30)</label>
                  <input 
                    type="text" 
                    value={newVideo.duration} 
                    onChange={e => setNewVideo({...newVideo, duration: e.target.value})}
                    placeholder="12:00" 
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm text-white outline-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-border text-sm font-bold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-premium text-sm py-3"
                  >
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContentManagement;
