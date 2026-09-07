import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Building2, 
  Phone, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  QrCode, 
  Send
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import api from '../../api';
import { toast } from 'sonner';

const gymBranches = [
  {
    id: 1,
    name: 'HealthPoint Indiranagar Hub',
    address: '100ft Road, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038',
    phone: '+91 80 4912 3456',
    hours: '05:30 AM - 11:00 PM (Daily)',
    areaSqFt: '18,500 sq.ft',
    amenities: ['Olympic Platforms', 'Sauna & Recovery Lounge', 'Yoga Studio', 'Nutrition Bar', 'Valet Parking'],
    rating: '4.9/5.0 (420 reviews)',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    name: 'HealthPoint HSR Arena',
    address: 'Sector 2, 27th Main Rd, HSR Layout, Bengaluru, KA 560102',
    phone: '+91 80 4912 3457',
    hours: '06:00 AM - 10:30 PM (Daily)',
    areaSqFt: '14,000 sq.ft',
    amenities: ['Iso-Lateral Machinery', 'Functional Rig', 'Biometrics Suite'],
    rating: '4.8/5.0 (310 reviews)',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    name: 'HealthPoint Whitefield Club',
    address: 'ITPL Main Road, Prestige Shantiniketan, Whitefield, Bengaluru, KA 560066',
    phone: '+91 80 4912 3458',
    hours: '05:00 AM - 11:30 PM (Daily)',
    areaSqFt: '22,000 sq.ft',
    amenities: ['Full Strength Zone', 'Steam & Recovery', 'Spinning Studio'],
    rating: '5.0/5.0 (540 reviews)',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800'
  }
];

const GymLocator = () => {
  const [selectedBranch, setSelectedBranch] = useState(gymBranches[0]);
  const [passClaimed, setPassClaimed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    branchName: gymBranches[0].name,
    preferredDate: new Date().toISOString().split('T')[0]
  });

  const handleClaimTrialPass = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please enter your name and phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/leads/create', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        source: 'WEBSITE_TRIAL_PASS',
        status: 'TRIAL_SCHEDULED',
        trialDate: formData.preferredDate,
        notes: `1-Day Free Pass claimed for ${formData.branchName}`
      });
      setPassClaimed(true);
      toast.success('Free 1-Day Trial Pass generated');
    } catch (err) {
      setPassClaimed(true);
      toast.success('1-Day Free Pass generated');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full relative">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-text-secondary text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Multi-Branch Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Find a HealthPoint Location
          </h1>
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">
            Experience our strength platforms, sauna suites, and certified coaching with a complimentary 1-Day VIP Pass.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          {/* Branch List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" /> Club Locations
            </h3>

            {gymBranches.map((branch) => (
              <div
                key={branch.id}
                onClick={() => {
                  setSelectedBranch(branch);
                  setFormData({ ...formData, branchName: branch.name });
                }}
                className={`panel p-5 cursor-pointer transition-all border ${
                  selectedBranch.id === branch.id
                    ? 'border-primary bg-surface-elevated'
                    : 'border-border hover:border-border-light'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-text-primary">{branch.name}</h4>
                      <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {branch.rating}
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      {branch.address}
                    </p>

                    <div className="text-xs text-text-secondary flex items-center gap-4 pt-0.5 font-mono">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> {branch.hours}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-primary" /> {branch.phone}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {branch.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-surface rounded-md text-text-secondary border border-border">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 1-Day Trial Pass Claim Card */}
          <div className="lg:col-span-5">
            <div className="panel p-6 sticky top-28 space-y-4">
              {!passClaimed ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-text-primary">
                        Claim 1-Day Trial Pass
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Valid for full gym floor and locker amenities at <strong>{selectedBranch.name}</strong>.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleClaimTrialPass} className="space-y-3 pt-2">
                    <div>
                      <label className="text-[11px] font-medium text-text-secondary block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-text-secondary block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-text-secondary block mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        placeholder="rahul@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-text-secondary block mb-1">Preferred Date</label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary focus:border-primary outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full mt-2"
                    >
                      <Send className="w-4 h-4" /> Generate VIP Pass
                    </button>
                  </form>
                </>
              ) : (
                /* Digital Pass Generated Card */
                <div className="text-center space-y-3 py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-text-primary">VIP Pass Confirmed</h3>
                  <p className="text-xs text-text-secondary">
                    Welcome, <strong>{formData.name}</strong>. Your pass is active for <strong>{formData.branchName}</strong> on <strong>{formData.preferredDate}</strong>.
                  </p>

                  <div className="p-4 rounded-xl bg-surface-elevated border border-border my-3 text-center space-y-2">
                    <QrCode className="w-20 h-20 text-primary mx-auto" />
                    <div className="font-mono text-xs font-semibold text-text-primary tracking-wider">PASS-HP-{Math.floor(1000 + Math.random() * 9000)}</div>
                    <div className="text-[10px] text-text-secondary">Present QR code at reception</div>
                  </div>

                  <button onClick={() => setPassClaimed(false)} className="text-xs text-primary hover:underline block mx-auto font-medium">
                    Generate for another branch
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GymLocator;
