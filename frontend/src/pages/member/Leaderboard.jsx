import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Users, 
  CheckCircle2, 
  Zap
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { toast } from 'sonner';
import TiltCard from '../../components/ui/TiltCard';
import CountUp from '../../components/ui/CountUp';
import { Trophy3D, Flame3D, Dumbbell3D, Shield3D } from '../../components/ui/Icon3D';

const volumeLeaderboard = [
  { rank: 1, name: 'Michael Vance', volumeKg: 148500, streak: 28, badge: 'Power Titan', avatar: 'M' },
  { rank: 2, name: 'Alex Rivers (You)', volumeKg: 129400, streak: 7, badge: 'Hypertrophy Beast', avatar: 'AR' },
  { rank: 3, name: 'Vikram Sethi', volumeKg: 118200, streak: 21, badge: 'Iron Veteran', avatar: 'V' },
  { rank: 4, name: 'Sarah Jenkins', volumeKg: 94800, streak: 14, badge: 'Conditioning Pro', avatar: 'S' },
  { rank: 5, name: 'Rohan Verma', volumeKg: 86300, streak: 12, badge: 'Rising Athlete', avatar: 'R' },
  { rank: 6, name: 'Priya Sharma', volumeKg: 78900, streak: 18, badge: 'Cardio Specialist', avatar: 'P' }
];

const streakLeaderboard = [
  { rank: 1, name: 'Michael Vance', streak: 28, visits: 28, badge: 'Unstoppable', avatar: 'M' },
  { rank: 2, name: 'Vikram Sethi', streak: 21, visits: 24, badge: '3-Week Iron Club', avatar: 'V' },
  { rank: 3, name: 'Priya Sharma', streak: 18, visits: 22, badge: 'Discipline Master', avatar: 'P' },
  { rank: 4, name: 'Sarah Jenkins', streak: 14, visits: 19, badge: 'Consistency Lead', avatar: 'S' },
  { rank: 5, name: 'Alex Rivers (You)', streak: 7, visits: 18, badge: '7-Day Streak', avatar: 'AR' }
];

const activeChallenges = [
  {
    id: 1,
    title: '150,000 kg Volume Lifted Club',
    reward: 'HealthPoint Pro Duffel Bag + 1 Complimentary 1-on-1 PT Session',
    target: '150,000 kg',
    current: '129,400 kg',
    percent: 86,
    daysLeft: '8 days left',
    participants: 142,
    joined: true
  },
  {
    id: 2,
    title: '21-Day Unbroken Workout Streak',
    reward: 'Gold Badge Profile Tier + 1-Month Supplement Vault Pass',
    target: '21 days',
    current: '7 days',
    percent: 33,
    daysLeft: '14 days left',
    participants: 98,
    joined: true
  },
  {
    id: 3,
    title: 'Bench Press Bodyweight Ratio',
    reward: 'HealthPoint Hall of Fame Member Spotlight',
    target: '1.25x Bodyweight (95kg)',
    current: '90kg',
    percent: 94,
    daysLeft: '22 days left',
    participants: 64,
    joined: false
  }
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('VOLUME');
  const [challenges, setChallenges] = useState(activeChallenges);

  const handleJoinChallenge = (id, title) => {
    setChallenges(challenges.map(c => c.id === id ? { ...c, joined: true, participants: c.participants + 1 } : c));
    toast.success(`Joined challenge: ${title}`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent flex items-center gap-1.5">
                <Trophy3D size={18} /> Community Standings
              </span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Leaderboard & Challenges</h1>
            <p className="text-xs text-text-secondary mt-0.5">Track cumulative training volume, consistency streaks, and monthly member milestones.</p>
          </div>

          <div className="flex bg-surface-elevated border border-border p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('VOLUME')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'VOLUME' ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Volume Lifted
            </button>
            <button
              onClick={() => setActiveTab('STREAK')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'STREAK' ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Streak Standings
            </button>
            <button
              onClick={() => setActiveTab('CHALLENGES')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'CHALLENGES' ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Active Challenges
            </button>
          </div>
        </header>

        {activeTab === 'CHALLENGES' ? (
          /* Challenges Tab */
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-5">
              {challenges.map((c) => (
                <TiltCard key={c.id} maxTilt={3} className="panel p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="badge-accent text-[10px]">{c.daysLeft}</span>
                      <span className="text-xs text-text-secondary font-medium flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-primary" /> {c.participants}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-text-primary">{c.title}</h3>
                    <p className="text-xs text-text-secondary bg-surface-elevated p-3 rounded-xl border border-border leading-relaxed">
                      <strong className="text-text-primary">Reward:</strong> {c.reward}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-text-secondary">Progress: {c.current}</span>
                        <span className="text-primary stat-number">
                          <CountUp value={c.percent} suffix="%" />
                        </span>
                      </div>
                      <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden border border-border">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${c.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={c.joined}
                    onClick={() => handleJoinChallenge(c.id, c.title)}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      c.joined ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'btn-primary'
                    }`}
                  >
                    {c.joined ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Active in Challenge
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" /> Join Challenge
                      </>
                    )}
                  </button>
                </TiltCard>
              ))}
            </div>
          </div>
        ) : (
          /* Podium + Leaderboard Table */
          <div className="space-y-8">
            {/* Top 3 Podium Cards with 3D Tilt */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {/* Silver #2 */}
              <TiltCard maxTilt={3} className="panel p-5 order-2 md:order-1 text-center flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-elevated text-text-secondary border border-border mx-auto flex items-center justify-center font-bold text-base mb-2">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-text-primary">Alex Rivers (You)</h4>
                  <span className="badge-accent text-[10px] mt-1 inline-block">Hypertrophy Beast</span>
                  <div className="text-2xl stat-number text-primary mt-3">
                    <CountUp value={129400} suffix=" kg" />
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">Total Volume Lifted</div>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium pt-3 border-t border-border">7-Day Active Streak</div>
              </TiltCard>

              {/* Gold #1 */}
              <TiltCard maxTilt={4} className="panel p-5 order-1 md:order-2 text-center flex flex-col justify-between space-y-3 border-primary/40 bg-surface-elevated">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mx-auto flex items-center justify-center font-bold text-xl mb-2">
                    <Crown className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-text-primary">Michael Vance</h4>
                  <span className="badge-accent text-[10px] mt-1 inline-block">Power Titan</span>
                  <div className="text-3xl stat-number text-amber-400 mt-3">
                    <CountUp value={148500} suffix=" kg" />
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">Club Champion Rank #1</div>
                </div>
                <div className="text-[11px] text-amber-400 font-medium pt-3 border-t border-border">28-Day Active Streak</div>
              </TiltCard>

              {/* Bronze #3 */}
              <TiltCard maxTilt={3} className="panel p-5 order-3 text-center flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-elevated text-text-secondary border border-border mx-auto flex items-center justify-center font-bold text-base mb-2">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-text-primary">Vikram Sethi</h4>
                  <span className="badge-accent text-[10px] mt-1 inline-block">Iron Veteran</span>
                  <div className="text-2xl stat-number text-text-primary mt-3">
                    <CountUp value={118200} suffix=" kg" />
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">Total Volume Lifted</div>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium pt-3 border-t border-border">21-Day Active Streak</div>
              </TiltCard>
            </div>

            {/* Complete Ranking Table (Flat, Fast & Responsive) */}
            <div className="panel p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-text-primary">
                  Complete Roster Standings
                </h3>
                <span className="badge-accent">Monthly Period</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-text-secondary font-semibold text-[11px]">
                      <th className="py-2.5 px-3">Rank</th>
                      <th className="py-2.5 px-3">Member Athlete</th>
                      <th className="py-2.5 px-3">{activeTab === 'VOLUME' ? 'Volume Lifted' : 'Check-In Visits'}</th>
                      <th className="py-2.5 px-3">Current Streak</th>
                      <th className="py-2.5 px-3">Achievement Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(activeTab === 'VOLUME' ? volumeLeaderboard : streakLeaderboard).map((row) => (
                      <tr key={row.rank} className={`table-row-hover ${row.name.includes('(You)') ? 'bg-primary/5 font-semibold' : ''}`}>
                        <td className="py-2.5 px-3 font-mono text-text-secondary">
                          {row.rank === 1 ? '🥇 #1' : row.rank === 2 ? '🥈 #2' : row.rank === 3 ? '🥉 #3' : `#${row.rank}`}
                        </td>
                        <td className="py-2.5 px-3 text-text-primary font-medium">
                          {row.name}
                        </td>
                        <td className="py-2.5 px-3 stat-number text-primary">
                          {typeof row.volumeKg === 'number' ? `${row.volumeKg.toLocaleString()} kg` : `${row.visits} Visits`}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-emerald-400">
                          {row.streak} Days
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="badge-accent text-[10px]">{row.badge}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
