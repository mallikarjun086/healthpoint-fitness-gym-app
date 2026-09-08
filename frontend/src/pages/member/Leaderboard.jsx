import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Users, 
  CheckCircle2, 
  Zap,
  Flame,
  Trophy,
  ShieldCheck,
  Share2,
  Sparkles,
  Lock,
  Calendar,
  ChevronRight,
  TrendingUp,
  Snowflake
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { toast } from 'sonner';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Trophy3D, Flame3D, Dumbbell3D, Shield3D } from '../../components/ui/Icon3D';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import ShareableRecapModal from '../../components/common/ShareableRecapModal';
import AchievementCelebrationModal from '../../components/common/AchievementCelebrationModal';

const fallbackFriendsLeaderboard = [
  { rank: 1, name: 'Vikram Sethi', email: 'vikram@example.com', currentStreak: 21, longestStreak: 21, totalWorkouts: 38, consistencyIndex: 96.5, isCurrentUser: false, isFrozen: false },
  { rank: 2, name: 'Alex Rivers (You)', email: 'alex@example.com', currentStreak: 14, longestStreak: 21, totalWorkouts: 29, consistencyIndex: 94.2, isCurrentUser: true, isFrozen: true, freezeReason: 'Recovery Protected (<50 Readiness Score)' },
  { rank: 3, name: 'Sarah Jenkins', email: 'sarah@example.com', currentStreak: 12, longestStreak: 18, totalWorkouts: 25, consistencyIndex: 89.0, isCurrentUser: false, isFrozen: false },
  { rank: 4, name: 'Michael Vance', email: 'michael@example.com', currentStreak: 8, longestStreak: 30, totalWorkouts: 42, consistencyIndex: 85.5, isCurrentUser: false, isFrozen: false }
];

const fallbackBadges = [
  { id: 1, code: 'FIRST_WORKOUT', title: 'First Step Titan (Day 1)', description: 'Completed your first recorded workout session at HealthPoint.', iconName: 'Zap', badgeTier: 'BRONZE', points: 100, isUnlocked: true, unlockedAt: '2026-09-01' },
  { id: 2, code: 'STREAK_7_DAY', title: '7-Day Discipline Master', description: 'Maintained an unbroken 7-day training consistency streak.', iconName: 'Flame', badgeTier: 'SILVER', points: 250, isUnlocked: true, unlockedAt: '2026-09-08' },
  { id: 3, code: 'FORM_PERFECTIONIST', title: 'Precision Biomechanics 95%', description: 'Completed a live camera form coaching set with >95% accuracy score.', iconName: 'ShieldCheck', badgeTier: 'GOLD', points: 400, isUnlocked: true, unlockedAt: '2026-09-05' },
  { id: 4, code: 'STREAK_30_DAY', title: '30-Day Iron Legend', description: 'Achieved 30 days of consistent athletic dedication.', iconName: 'Trophy', badgeTier: 'GOLD', points: 750, isUnlocked: false },
  { id: 5, code: 'CENTURY_LIFTER', title: 'Century Lifter (100 Sessions)', description: 'Logged 100 total verified training sessions.', iconName: 'Crown', badgeTier: 'PLATINUM', points: 1500, isUnlocked: false },
  { id: 6, code: 'RECOVERY_SCHOLAR', title: 'Autonomic Balance Master', description: 'Completed a 0.1Hz coherence breathing session during low readiness.', iconName: 'Zap', badgeTier: 'BRONZE', points: 150, isUnlocked: false }
];

const fallbackChallenges = [
  {
    id: 1,
    code: 'SQUAT_30_DAY',
    title: '30-Day Olympic Squat & Mobility Challenge',
    description: 'Accumulate 1,000 deep squats with calibrated camera joint angles over 30 days.',
    targetMetric: 'SQUATS_COMPLETED',
    targetValue: 1000,
    currentProgress: 420,
    percentComplete: 42,
    isEnrolled: true,
    isCompleted: false,
    durationDays: 30,
    rewardBadgeCode: 'FORM_PERFECTIONIST'
  },
  {
    id: 2,
    code: 'CORE_21_DAY',
    title: '21-Day Core & Postural Stability Sprint',
    description: 'Complete 21 consecutive days of core bracing and rotational stiffness training.',
    targetMetric: 'DAYS_ACTIVE',
    targetValue: 21,
    currentProgress: 14,
    percentComplete: 67,
    isEnrolled: true,
    isCompleted: false,
    durationDays: 21,
    rewardBadgeCode: 'STREAK_7_DAY'
  },
  {
    id: 3,
    code: 'VOLUME_100K',
    title: '100,000 kg Hypertrophy Volume Quest',
    description: 'Accumulate 100 metric tons of total load in compound movements this month.',
    targetMetric: 'VOLUME_KG',
    targetValue: 100000,
    currentProgress: 0,
    percentComplete: 0,
    isEnrolled: false,
    isCompleted: false,
    durationDays: 30,
    rewardBadgeCode: 'CENTURY_LIFTER'
  }
];

const Leaderboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('FRIENDS_CONSISTENCY');
  const [friendsLeaderboard, setFriendsLeaderboard] = useState(fallbackFriendsLeaderboard);
  const [badges, setBadges] = useState(fallbackBadges);
  const [challenges, setChallenges] = useState(fallbackChallenges);
  const [streakData, setStreakData] = useState({ currentStreak: 14, longestStreak: 21, totalWorkouts: 29, consistencyIndex: 94.2 });
  const [loading, setLoading] = useState(true);

  // Modals
  const [isRecapOpen, setIsRecapOpen] = useState(false);
  const [selectedCelebrationBadge, setSelectedCelebrationBadge] = useState(null);

  useEffect(() => {
    fetchGamificationData();
  }, [user]);

  const fetchGamificationData = async () => {
    try {
      setLoading(true);
      const userId = user?.id || 3;
      const [summaryRes, friendsRes] = await Promise.all([
        api.get(`/gamification/summary/${userId}`).catch(() => null),
        api.get(`/gamification/leaderboard/friends/${userId}`).catch(() => null)
      ]);

      if (summaryRes?.data) {
        if (summaryRes.data.badges?.length > 0) setBadges(summaryRes.data.badges);
        if (summaryRes.data.challenges?.length > 0) setChallenges(summaryRes.data.challenges);
        if (summaryRes.data.streak) {
          setStreakData({
            currentStreak: summaryRes.data.streak.currentStreak || 14,
            longestStreak: summaryRes.data.streak.longestStreak || 21,
            totalWorkouts: summaryRes.data.streak.totalWorkoutsCompleted || 29,
            consistencyIndex: summaryRes.data.streak.consistencyIndex || 94.2,
            isFrozen: summaryRes.data.streak.isFrozen,
            freezeReason: summaryRes.data.streak.freezeReason
          });
        }
      }

      if (friendsRes?.data && friendsRes.data.length > 0) {
        setFriendsLeaderboard(friendsRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollChallenge = async (challengeId, title) => {
    try {
      const userId = user?.id || 3;
      await api.post(`/gamification/challenges/${challengeId}/enroll?userId=${userId}`).catch(() => null);
      setChallenges(challenges.map(c => c.id === challengeId ? { ...c, isEnrolled: true, currentProgress: 1, percentComplete: Math.round((1 / c.targetValue) * 100) } : c));
      toast.success(`Enrolled in challenge: ${title}!`);
    } catch (err) {
      toast.success(`Enrolled in challenge: ${title}!`);
      setChallenges(challenges.map(c => c.id === challengeId ? { ...c, isEnrolled: true } : c));
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-6 sm:p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent flex items-center gap-1.5">
                <Trophy3D size={18} /> Gamification & Discipline Hub
              </span>
            </div>
            <h1 className="heading-xl text-text-primary">Consistency Standings & Badges</h1>
            <p className="body-sm text-text-secondary mt-0.5">
              Ranked by workout <strong className="text-text-primary">consistency & adherence</strong> (not raw ego weight) with automatic recovery streak protection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsRecapOpen(true)}
              className="btn-secondary py-2 px-3.5 text-xs flex items-center gap-2"
            >
              <Share2 className="w-4 h-4 text-primary" /> Share Monthly Recap
            </button>

            <div className="flex bg-surface-elevated border border-border p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('FRIENDS_CONSISTENCY')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'FRIENDS_CONSISTENCY' ? 'bg-primary text-black font-bold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Friends Consistency
              </button>
              <button
                onClick={() => setActiveTab('BADGES')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'BADGES' ? 'bg-primary text-black font-bold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Badges ({badges.filter(b => b.isUnlocked).length}/{badges.length})
              </button>
              <button
                onClick={() => setActiveTab('CHALLENGES')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'CHALLENGES' ? 'bg-primary text-black font-bold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                30-Day Challenges
              </button>
            </div>
          </div>
        </header>

        {/* Executive Streak Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <TiltCard maxTilt={3} className="panel p-5 space-y-1.5 border-primary/30">
            <div className="flex justify-between items-start">
              <span className="text-xs text-text-secondary font-semibold uppercase">Current Streak</span>
              <Flame3D size={22} />
            </div>
            <div className="text-3xl font-black text-rose-500 stat-number flex items-baseline gap-1.5">
              <CountUp value={streakData.currentStreak} />
              <span className="text-sm font-normal text-text-secondary">Days</span>
            </div>
            {streakData.isFrozen ? (
              <div className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                <Snowflake className="w-3 h-3" /> Streak Protected (Recovery Day)
              </div>
            ) : (
              <div className="text-[11px] text-emerald-400 font-medium">Active & Unbroken</div>
            )}
          </TiltCard>

          <TiltCard maxTilt={3} className="panel p-5 space-y-1.5">
            <div className="flex justify-between items-start">
              <span className="text-xs text-text-secondary font-semibold uppercase">Consistency Index</span>
              <Shield3D size={22} />
            </div>
            <div className="text-3xl font-black text-primary stat-number">
              <CountUp value={streakData.consistencyIndex} suffix="%" />
            </div>
            <div className="text-[11px] text-text-secondary font-medium">Adherence Score</div>
          </TiltCard>

          <TiltCard maxTilt={3} className="panel p-5 space-y-1.5">
            <div className="flex justify-between items-start">
              <span className="text-xs text-text-secondary font-semibold uppercase">Total Sessions</span>
              <Dumbbell3D size={22} />
            </div>
            <div className="text-3xl font-black text-text-primary stat-number">
              <CountUp value={streakData.totalWorkouts} />
            </div>
            <div className="text-[11px] text-text-secondary font-medium">Verified Workouts</div>
          </TiltCard>

          <TiltCard maxTilt={3} className="panel p-5 space-y-1.5">
            <div className="flex justify-between items-start">
              <span className="text-xs text-text-secondary font-semibold uppercase">Discipline Badges</span>
              <Trophy3D size={22} />
            </div>
            <div className="text-3xl font-black text-amber-400 stat-number">
              <CountUp value={badges.filter(b => b.isUnlocked).length} suffix={` / ${badges.length}`} />
            </div>
            <div className="text-[11px] text-amber-400 font-medium">Milestones Unlocked</div>
          </TiltCard>
        </div>

        {/* TAB 1: Friends Consistency Leaderboard */}
        {activeTab === 'FRIENDS_CONSISTENCY' && (
          <div className="space-y-6">
            {/* Explanatory Safety Card */}
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Safe Social Ranking System</h4>
                  <p className="text-xs text-text-secondary">
                    HealthPoint ranks members strictly on <strong className="text-text-primary">Discipline & Consistency</strong>. Your streak is never penalized on biometric recovery or deload days.
                  </p>
                </div>
              </div>
              <span className="badge-accent shrink-0">Friends Only</span>
            </div>

            {/* Complete Ranking Table */}
            <div className="panel p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Friends Consistency Standings
                </h3>
                <span className="badge-accent text-[11px]">Ranked by Adherence %</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-text-secondary font-semibold text-[11px]">
                      <th className="py-3 px-3">Rank</th>
                      <th className="py-3 px-3">Friend / Athlete</th>
                      <th className="py-3 px-3">Consistency Index</th>
                      <th className="py-3 px-3">Discipline Streak</th>
                      <th className="py-3 px-3">Total Workouts</th>
                      <th className="py-3 px-3">Streak Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {friendsLeaderboard.map((row) => (
                      <tr key={row.rank} className={`table-row-hover ${row.isCurrentUser ? 'bg-primary/10 font-semibold' : ''}`}>
                        <td className="py-3 px-3 font-mono text-text-secondary">
                          {row.rank === 1 ? '🥇 #1' : row.rank === 2 ? '🥈 #2' : row.rank === 3 ? '🥉 #3' : `#${row.rank}`}
                        </td>
                        <td className="py-3 px-3 text-text-primary font-medium">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center font-bold text-xs text-primary">
                              {row.name.charAt(0)}
                            </div>
                            <div>
                              <div>{row.name}</div>
                              <div className="text-[10px] text-text-secondary">{row.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 stat-number text-primary font-bold text-sm">
                          {row.consistencyIndex}%
                        </td>
                        <td className="py-3 px-3 font-mono text-rose-400 font-semibold">
                          {row.currentStreak} Days
                        </td>
                        <td className="py-3 px-3 text-text-secondary">
                          {row.totalWorkouts} sessions
                        </td>
                        <td className="py-3 px-3">
                          {row.isFrozen ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-medium">
                              <Snowflake className="w-3 h-3" /> Recovery Protected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                              <CheckCircle2 className="w-3 h-3" /> Active Unbroken
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Badges & Achievements */}
        {activeTab === 'BADGES' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {badges.map((b) => (
                <TiltCard
                  key={b.id || b.code}
                  maxTilt={3}
                  className={`panel p-5 flex flex-col justify-between space-y-4 cursor-pointer transition-all ${
                    b.isUnlocked ? 'border-primary/40 bg-surface' : 'opacity-60 bg-surface-elevated/50'
                  }`}
                  onClick={() => b.isUnlocked && setSelectedCelebrationBadge(b)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-2xl ${b.isUnlocked ? 'bg-primary/10 border border-primary/30' : 'bg-surface-elevated border border-border'}`}>
                        {b.isUnlocked ? (
                          <Sparkles className="w-6 h-6 text-primary" />
                        ) : (
                          <Lock className="w-6 h-6 text-text-secondary" />
                        )}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        b.badgeTier === 'GOLD' ? 'text-amber-300 border-amber-500/30 bg-amber-500/10' :
                        b.badgeTier === 'PLATINUM' ? 'text-purple-300 border-purple-500/30 bg-purple-500/10' :
                        b.badgeTier === 'SILVER' ? 'text-slate-200 border-slate-400/30 bg-slate-500/10' :
                        'text-amber-500 border-amber-700/30 bg-amber-700/10'
                      }`}>
                        {b.badgeTier}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-text-primary">{b.title}</h4>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">{b.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
                    <span className="font-semibold text-amber-400">+{b.points || 100} XP</span>
                    {b.isUnlocked ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-text-secondary font-medium">Locked Milestone</span>
                    )}
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 30-Day Challenges */}
        {activeTab === 'CHALLENGES' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {challenges.map((c) => (
                <TiltCard key={c.id || c.code} maxTilt={3} className="panel p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="badge-accent text-[10px] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {c.durationDays} Days Duration
                      </span>
                      {c.isCompleted && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          COMPLETED
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-text-primary">{c.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed bg-surface-elevated p-3 rounded-xl border border-border">
                      {c.description}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-text-secondary">Progress: {c.currentProgress} / {c.targetValue}</span>
                        <span className="text-primary font-bold">{c.percentComplete}%</span>
                      </div>
                      <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden border border-border">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${c.percentComplete}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={c.isEnrolled}
                    onClick={() => handleEnrollChallenge(c.id, c.title)}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      c.isEnrolled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'btn-primary'
                    }`}
                  >
                    {c.isEnrolled ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Active in Challenge
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" /> Enroll in Challenge
                      </>
                    )}
                  </button>
                </TiltCard>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Shareable Recap Modal */}
      <ShareableRecapModal
        isOpen={isRecapOpen}
        onClose={() => setIsRecapOpen(false)}
        recapData={{
          userName: user?.name || 'Alex Rivers',
          period: 'Monthly Review - September 2026',
          totalWorkoutsCompleted: streakData.totalWorkouts,
          currentStreakDays: streakData.currentStreak,
          longestStreakDays: streakData.longestStreak,
          consistencyIndex: streakData.consistencyIndex,
          achievementsUnlockedCount: badges.filter(b => b.isUnlocked).length,
          muscleBalanceDistribution: {
            'Chest & Push': 28,
            'Back & Pull': 27,
            'Legs & Posterior': 25,
            'Core & Mobility': 20
          }
        }}
      />

      {/* Achievement Celebration Modal */}
      <AchievementCelebrationModal
        isOpen={Boolean(selectedCelebrationBadge)}
        achievement={selectedCelebrationBadge}
        onClose={() => setSelectedCelebrationBadge(null)}
      />
    </div>
  );
};

export default Leaderboard;
