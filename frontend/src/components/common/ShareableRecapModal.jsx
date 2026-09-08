import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Download, Share2, X, Check, Dumbbell, ShieldCheck, Activity, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const ShareableRecapModal = ({ isOpen, onClose, recapData }) => {
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  if (!isOpen) return null;

  const data = recapData || {
    userName: 'Alex Rivers',
    period: 'Monthly Athletic Recap',
    totalWorkoutsCompleted: 18,
    currentStreakDays: 14,
    longestStreakDays: 21,
    consistencyIndex: 94.5,
    achievementsUnlockedCount: 5,
    muscleBalanceDistribution: {
      'Chest & Push': 28,
      'Back & Pull': 27,
      'Legs & Posterior': 25,
      'Core & Mobility': 20
    }
  };

  const handleDownloadImage = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1080;
      canvas.height = 1350; // 4:5 Instagram Portrait Ratio

      // 1. Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
      bgGrad.addColorStop(0, '#0a0d14');
      bgGrad.addColorStop(0.5, '#0f172a');
      bgGrad.addColorStop(1, '#05070a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1350);

      // 2. Accent radial glows
      const radial1 = ctx.createRadialGradient(200, 200, 20, 200, 200, 450);
      radial1.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
      radial1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial1;
      ctx.fillRect(0, 0, 1080, 1350);

      const radial2 = ctx.createRadialGradient(880, 1150, 20, 880, 1150, 500);
      radial2.addColorStop(0, 'rgba(234, 179, 8, 0.12)');
      radial2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial2;
      ctx.fillRect(0, 0, 1080, 1350);

      // 3. Header branding
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('HEALTHPOINT FITNESS', 90, 120);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px sans-serif';
      ctx.fillText('BIOMETRIC RETENTION & PERFORMANCE PROTOCOL', 90, 160);

      // 4. Athlete Name & Month
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(data.userName, 90, 260);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '30px sans-serif';
      ctx.fillText(data.period, 90, 310);

      // 5. Stat Panels (2x2 Grid)
      const drawPanel = (x, y, w, h, title, val, sub) => {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(title.toUpperCase(), x + 35, y + 55);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 54px sans-serif';
        ctx.fillText(val, x + 35, y + 130);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '20px sans-serif';
        ctx.fillText(sub, x + 35, y + 175);
      };

      drawPanel(90, 380, 430, 210, 'Total Workouts', `${data.totalWorkoutsCompleted}`, 'Completed Sessions');
      drawPanel(560, 380, 430, 210, 'Active Streak', `${data.currentStreakDays} Days`, `Best: ${data.longestStreakDays} Days`);
      drawPanel(90, 620, 430, 210, 'Consistency Score', `${data.consistencyIndex}%`, 'Adherence Metric');
      drawPanel(560, 620, 430, 210, 'Badges Earned', `${data.achievementsUnlockedCount}`, 'Milestones Achieved');

      // 6. Muscle Balance Distribution Bar
      ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
      ctx.beginPath();
      ctx.roundRect(90, 860, 900, 340, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('MUSCLE VOLUME BALANCE BREAKDOWN', 130, 920);

      let barY = 970;
      const colors = ['#38bdf8', '#818cf8', '#34d399', '#f59e0b'];
      let cIdx = 0;

      for (const [group, pct] of Object.entries(data.muscleBalanceDistribution || {})) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '22px sans-serif';
        ctx.fillText(group, 130, barY);

        ctx.fillStyle = colors[cIdx % colors.length];
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(`${pct}%`, 920, barY);

        // Progress bar track
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.beginPath();
        ctx.roundRect(130, barY + 12, 820, 16, 8);
        ctx.fill();

        // Progress bar fill
        ctx.fillStyle = colors[cIdx % colors.length];
        ctx.beginPath();
        ctx.roundRect(130, barY + 12, (820 * pct) / 100, 16, 8);
        ctx.fill();

        barY += 56;
        cIdx++;
      }

      // 7. Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '20px sans-serif';
      ctx.fillText('Generated with HealthPoint Adaptive AI Engine • Verified Biometric History', 90, 1260);

      // Trigger download
      const link = document.createElement('a');
      link.download = `HealthPoint_Recap_${data.userName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast.success('High-res Recap Card downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate image card');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-surface border border-border rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary rounded-full bg-surface-elevated border border-border transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Card Preview Container */}
          <div
            ref={cardRef}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-primary/30 space-y-6 shadow-inner relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> HealthPoint Biometric Recap
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{data.userName}</h3>
                <p className="text-xs text-slate-400">{data.period}</p>
              </div>

              <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                {data.consistencyIndex}% Consistency
              </div>
            </div>

            {/* Metrics 2x2 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                  <Dumbbell className="w-3 h-3 text-primary" /> Total Workouts
                </div>
                <div className="text-2xl font-black text-white mt-1">{data.totalWorkoutsCompleted}</div>
                <div className="text-[10px] text-slate-400">Sessions Completed</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-500" /> Active Streak
                </div>
                <div className="text-2xl font-black text-white mt-1">{data.currentStreakDays} Days</div>
                <div className="text-[10px] text-emerald-400">Best: {data.longestStreakDays} Days</div>
              </div>
            </div>

            {/* Muscle Group Breakdown */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-primary" /> Muscle Volume Balance
              </div>
              
              {Object.entries(data.muscleBalanceDistribution || {}).map(([group, pct], i) => (
                <div key={group} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">{group}</span>
                    <span className="text-slate-200 font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        i === 0 ? 'bg-primary' : i === 1 ? 'bg-indigo-400' : i === 2 ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              disabled={downloading}
              onClick={handleDownloadImage}
              className="flex-1 py-3 rounded-xl bg-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Rendering...' : 'Download Card (PNG)'}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 border border-border text-xs font-semibold text-text-secondary hover:text-text-primary transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShareableRecapModal;
