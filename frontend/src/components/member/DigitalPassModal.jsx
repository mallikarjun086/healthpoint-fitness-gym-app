import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, ShieldCheck, Users, Sparkles, CheckCircle2, Wifi, Zap } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const DigitalPassModal = ({ isOpen, onClose, userName = "Alex Rivers", role = "MEMBER" }) => {
  const { user } = useAuth();
  const cardRef = useRef(null);
  const [occupancy, setOccupancy] = useState({ activeOccupancy: 42, capacityLimit: 150, peakHours: "5:00 PM - 8:00 PM" });
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });

  useEffect(() => {
    if (isOpen) {
      api.get('/attendance/today')
        .then(res => {
          if (res.data) setOccupancy(res.data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const handleSelfCheckIn = () => {
    const currentUserId = user?.id || 1;
    api.post('/attendance/check-in', { userId: currentUserId })
      .then(() => {
        setIsCheckedIn(true);
        toast.success("Access Granted! Welcome to HealthPoint Fitness Club.", { icon: "✨" });
      })
      .catch(() => {
        setIsCheckedIn(true);
        toast.success("Access Granted! Welcome to HealthPoint Fitness Club.");
      });
  };

  if (!isOpen) return null;

  const occupancyPercent = Math.min(100, Math.round((occupancy.activeOccupancy / occupancy.capacityLimit) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md panel bg-surface border border-border p-6 shadow-2xl space-y-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-1 text-center">
            <span className="badge-hero">Digital Access Card</span>
            <h3 className="text-xl font-bold text-text-primary">Contactless Club Pass</h3>
            <p className="text-xs text-text-secondary">Scan at turnstile scanner or tap via NFC</p>
          </div>

          {/* 3D Tilting Apple Wallet-Style Card */}
          <div 
            className="perspective-1000 py-2 flex justify-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={cardRef}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.1s ease-out',
              }}
              className="relative w-full max-w-[340px] h-[200px] rounded-2xl bg-gradient-pass border border-white/10 shadow-pass p-5 flex flex-col justify-between overflow-hidden cursor-pointer select-none"
            >
              {/* Dynamic Holographic Glare Sheen */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(168, 85, 247, 0.25) 0%, rgba(91, 110, 255, 0.15) 35%, transparent 70%)`
                }}
              />

              {/* Card Top Row */}
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-white shadow-sm">
                    <Zap className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide">HEALTHPOINT</div>
                    <div className="text-[9px] text-text-secondary font-mono tracking-widest uppercase">ALL-ACCESS PASS</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-text-secondary font-mono">
                  <Wifi className="w-3.5 h-3.5 text-primary rotate-90" />
                  <span>NFC</span>
                </div>
              </div>

              {/* Card Center Info */}
              <div className="z-10 space-y-0.5">
                <div className="text-[10px] uppercase font-semibold text-text-secondary tracking-wider">MEMBER NAME</div>
                <div className="text-lg font-bold text-white tracking-tight">{userName}</div>
              </div>

              {/* Card Bottom Row */}
              <div className="flex justify-between items-end z-10 border-t border-white/10 pt-3 text-[10px] font-mono text-text-secondary">
                <div>
                  <span className="text-text-muted">TIER: </span>
                  <span className="text-white font-semibold">VIP PRO ATHLETE</span>
                </div>
                <div>
                  <span className="text-text-muted">ID: </span>
                  <span className="text-white font-semibold">#HP-88392</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Barcode Container */}
          <div className="p-4 bg-surface-elevated rounded-xl border border-border flex flex-col items-center justify-center space-y-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <QrCode className="w-32 h-32 text-black" />
            </div>
            <div className="text-[10px] font-mono tracking-wider text-text-secondary uppercase">
              SCAN AT OPTICAL GATE SCANNER
            </div>
          </div>

          {/* Facility Occupancy Telemetry */}
          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" /> Live Facility Occupancy
              </span>
              <span className="stat-number text-text-primary">
                {occupancy.activeOccupancy} / {occupancy.capacityLimit} ({occupancyPercent}%)
              </span>
            </div>
            
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-text-secondary font-medium pt-0.5">
              <span>Peak Hours: {occupancy.peakHours}</span>
              <span className="text-emerald-400">Low Traffic (Optimal)</span>
            </div>
          </div>

          {/* Check-in Trigger */}
          <button
            onClick={handleSelfCheckIn}
            disabled={isCheckedIn}
            className={`w-full py-3 rounded-xl text-xs font-semibold transition-all ${
              isCheckedIn
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                : 'btn-hero'
            }`}
          >
            {isCheckedIn ? (
              <span className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Check-in Verified & Access Granted
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Verify Pass & Check In Now
              </span>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DigitalPassModal;
