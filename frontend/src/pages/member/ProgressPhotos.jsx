import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Sparkles, 
  Calendar, 
  Scale, 
  Plus, 
  X, 
  Layers
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { toast } from 'sonner';

const defaultTimelinePhotos = [
  {
    id: 1,
    date: 'Jun 01, 2026',
    stage: 'Day 1 (Initial Baseline)',
    weightKg: 82.0,
    bodyFat: '22.5%',
    photoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600',
    notes: 'Starting baseline, 82kg bodyweight. Target: 75kg lean hypertrophy.'
  },
  {
    id: 2,
    date: 'Jul 15, 2026',
    stage: 'Week 6 (Mid-Phase)',
    weightKg: 78.5,
    bodyFat: '20.2%',
    photoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600',
    notes: 'Shoulder cap definition and waist reduction from 88cm to 83.5cm.'
  },
  {
    id: 3,
    date: 'Sep 01, 2026',
    stage: 'Week 12 (Current Phase)',
    weightKg: 75.0,
    bodyFat: '18.8%',
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    notes: 'Goal reached. Clavicular chest definition and forearm vascularity.'
  }
];

const ProgressPhotos = () => {
  const [photos, setPhotos] = useState(defaultTimelinePhotos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comparisonBeforeIdx, setComparisonBeforeIdx] = useState(0);
  const [comparisonAfterIdx, setComparisonAfterIdx] = useState(defaultTimelinePhotos.length - 1);

  const [newPhoto, setNewPhoto] = useState({
    stage: '',
    weightKg: '',
    bodyFat: '',
    photoUrl: '',
    notes: ''
  });

  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!newPhoto.photoUrl) {
      toast.error('Please enter a photo image URL');
      return;
    }

    const created = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      stage: newPhoto.stage || 'Week Transformation',
      weightKg: parseFloat(newPhoto.weightKg) || 75.0,
      bodyFat: newPhoto.bodyFat ? `${newPhoto.bodyFat}%` : '18.5%',
      photoUrl: newPhoto.photoUrl,
      notes: newPhoto.notes || 'Logged photo update'
    };

    setPhotos([...photos, created]);
    setComparisonAfterIdx(photos.length);
    setIsModalOpen(false);
    toast.success('Transformation photo logged');
    setNewPhoto({ stage: '', weightKg: '', bodyFat: '', photoUrl: '', notes: '' });
  };

  const beforePhoto = photos[comparisonBeforeIdx] || photos[0];
  const afterPhoto = photos[comparisonAfterIdx] || photos[photos.length - 1];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-6 sm:p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent">Visual Telemetry</span>
            </div>
            <h1 className="heading-xl text-text-primary">Progress Photos & Timeline</h1>
            <p className="body-sm text-text-secondary mt-0.5">Side-by-side physique comparison and sequential transformation timeline.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Camera className="w-4 h-4" /> Upload Photo
          </button>
        </header>

        {/* Interactive Comparison Showcase */}
        <div className="panel-card p-6 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="badge-accent mb-1 inline-block">Comparison</span>
              <h3 className="heading-md text-text-primary">Before vs. After Analysis</h3>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-text-secondary">Before:</span>
                <select
                  value={comparisonBeforeIdx}
                  onChange={e => setComparisonBeforeIdx(parseInt(e.target.value))}
                  className="bg-surface-elevated border border-border rounded-lg px-2.5 py-1 text-xs text-text-primary outline-none focus:border-primary"
                >
                  {photos.map((p, i) => (
                    <option key={p.id} value={i}>{p.date} ({p.weightKg} kg)</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-text-secondary">After:</span>
                <select
                  value={comparisonAfterIdx}
                  onChange={e => setComparisonAfterIdx(parseInt(e.target.value))}
                  className="bg-surface-elevated border border-border rounded-lg px-2.5 py-1 text-xs text-text-primary outline-none focus:border-primary"
                >
                  {photos.map((p, i) => (
                    <option key={p.id} value={i}>{p.date} ({p.weightKg} kg)</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Side by side cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Before Photo */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="badge-accent">Before ({beforePhoto.date})</span>
                <span className="font-mono text-text-secondary">{beforePhoto.weightKg} kg • {beforePhoto.bodyFat}</span>
              </div>

              <div className="aspect-[3/4] max-h-80 rounded-xl overflow-hidden bg-surface relative">
                <img
                  src={beforePhoto.photoUrl}
                  alt="Before"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs text-text-secondary italic">"{beforePhoto.notes}"</p>
            </div>

            {/* After Photo */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-primary/40 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="badge-accent">After ({afterPhoto.date})</span>
                <span className="font-mono text-primary font-medium">{afterPhoto.weightKg} kg • {afterPhoto.bodyFat}</span>
              </div>

              <div className="aspect-[3/4] max-h-80 rounded-xl overflow-hidden bg-surface relative">
                <img
                  src={afterPhoto.photoUrl}
                  alt="After"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs text-text-secondary italic">"{afterPhoto.notes}"</p>
            </div>
          </div>
        </div>

        {/* Transformation Gallery Timeline */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" /> Historical Timeline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {photos.map((item) => (
              <div
                key={item.id}
                className="panel overflow-hidden group"
              >
                <div className="aspect-[4/5] overflow-hidden bg-surface-elevated relative">
                  <img
                    src={item.photoUrl}
                    alt={item.stage}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

                  <span className="absolute top-2.5 left-2.5 badge-accent text-[10px]">{item.stage}</span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between items-center text-xs font-mono">
                    <span className="text-text-primary">{item.date}</span>
                    <span className="text-primary font-medium">{item.weightKg} kg ({item.bodyFat})</span>
                  </div>
                </div>

                <div className="p-3.5 text-xs text-text-secondary">
                  {item.notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Upload Photo Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="panel bg-surface border border-border p-6 rounded-2xl max-w-lg w-full shadow-2xl relative space-y-4"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-elevated">
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20"><Camera className="w-4 h-4" /></div>
                <h3 className="text-base font-bold text-text-primary">Log Transformation Photo</h3>
              </div>

              <form onSubmit={handleAddPhoto} className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-text-secondary block mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newPhoto.photoUrl}
                    onChange={e => setNewPhoto({ ...newPhoto, photoUrl: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 75.0"
                      value={newPhoto.weightKg}
                      onChange={e => setNewPhoto({ ...newPhoto, weightKg: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-text-secondary block mb-1">Body Fat %</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 18.5"
                      value={newPhoto.bodyFat}
                      onChange={e => setNewPhoto({ ...newPhoto, bodyFat: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-text-secondary block mb-1">Phase Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Week 12 Hypertrophy Cut"
                    value={newPhoto.stage}
                    onChange={e => setNewPhoto({ ...newPhoto, stage: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-text-secondary block mb-1">Progress Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Notes on energy, definition, and measurements..."
                    value={newPhoto.notes}
                    onChange={e => setNewPhoto({ ...newPhoto, notes: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Photo Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressPhotos;
