import React, { useId } from 'react';

/**
 * Custom 3D Metallic Icon System
 * Each component uses a unique prefix (via React.useId or Math.random fallback)
 * so gradient IDs don't collide when multiple icons render on the same page.
 */

// Unique suffix per component mount
const uid = () => Math.random().toString(36).slice(2, 8);

// Shared 3D Lighting Gradients & Filters — parameterized by a unique ID prefix
const SharedDefs = ({ p }) => (
  <defs>
    <linearGradient id={`${p}tG`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#434354" />
      <stop offset="35%" stopColor="#252532" />
      <stop offset="70%" stopColor="#181822" />
      <stop offset="100%" stopColor="#2A2A38" />
    </linearGradient>

    <linearGradient id={`${p}sE`} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
      <stop offset="50%" stopColor="#8F9CAE" stopOpacity="0.3" />
      <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
    </linearGradient>

    <linearGradient id={`${p}cL`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#7E8EFF" />
      <stop offset="60%" stopColor="#5B6EFF" />
      <stop offset="100%" stopColor="#3B4BC4" />
    </linearGradient>

    <linearGradient id={`${p}vR`} x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#C084FC" />
      <stop offset="70%" stopColor="#A855F7" />
      <stop offset="100%" stopColor="#7E22CE" />
    </linearGradient>

    <linearGradient id={`${p}hM`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#7082FF" />
      <stop offset="45%" stopColor="#5B6EFF" />
      <stop offset="80%" stopColor="#A855F7" />
      <stop offset="100%" stopColor="#C084FC" />
    </linearGradient>

    <filter id={`${p}sh`} x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.6" />
    </filter>

    <filter id={`${p}gc`} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
);

// Helper: returns the url() refs for a given prefix
const u = (p, name) => `url(#${p}${name})`;

// 1. 3D Dumbbell
export const Dumbbell3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <rect x="6" y="14" width="5" height="20" rx="2.5" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="1" />
        <rect x="12" y="10" width="5" height="28" rx="2.5" fill={u(p,'hM')} />
        <rect x="17" y="21" width="14" height="6" rx="2" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="0.8" />
        <path d="M21 21v6M24 21v6M27 21v6" stroke={u(p,'cL')} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <rect x="31" y="10" width="5" height="28" rx="2.5" fill={u(p,'hM')} />
        <rect x="37" y="14" width="5" height="20" rx="2.5" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="1" />
        <circle cx="14.5" cy="14" r="1.5" fill="#FFF" opacity="0.8" />
        <circle cx="33.5" cy="14" r="1.5" fill="#FFF" opacity="0.8" />
      </g>
    </svg>
  );
};

// 2. 3D Flame
export const Flame3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <path d="M26 6C26 6 38 18 38 29C38 36.732 31.732 43 24 43C16.268 43 10 36.732 10 29C10 22 15 16 19 11C19 16 23 18 25 15C27 12 26 6 26 6Z" fill={u(p,'hM')} />
        <path d="M24 19C24 19 31 26 31 32C31 35.866 27.866 39 24 39C20.134 39 17 35.866 17 32C17 28 20 24 22 21.5C22 24 23.5 24.5 24 23C24.5 21.5 24 19 24 19Z" fill={u(p,'sE')} opacity="0.9" />
        <circle cx="24" cy="33" r="3.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

// 3. 3D Chart / TrendingUp
export const Chart3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <rect x="8" y="26" width="6" height="16" rx="2" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="0.8" />
        <rect x="18" y="18" width="6" height="24" rx="2" fill={u(p,'cL')} />
        <rect x="28" y="11" width="6" height="31" rx="2" fill={u(p,'hM')} />
        <path d="M10 22L20 14L28 17L38 7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 7H38V13" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="38" cy="7" r="2.5" fill="#FFF" filter={u(p,'gc')} />
      </g>
    </svg>
  );
};

// 4. 3D Heart
export const Heart3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <path d="M24 41.5L21.1 38.86C10.8 29.52 4 23.36 4 15.75C4 9.5 8.85 4.65 15.1 4.65C18.62 4.65 21.99 6.29 24 8.86C26.01 6.29 29.38 4.65 32.9 4.65C39.15 4.65 44 9.5 44 15.75C44 23.36 37.2 29.52 26.9 38.9L24 41.5Z" fill={u(p,'hM')} />
        <path d="M10 22H17L20 14L25 30L29 19L32 22H38" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="14" cy="12" rx="4" ry="2" transform="rotate(-30 14 12)" fill="#FFF" opacity="0.6" />
      </g>
    </svg>
  );
};

// 5. 3D Shield
export const Shield3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <path d="M24 4L8 10V22C8 32.5 14.8 42.2 24 44.5C33.2 42.2 40 32.5 40 22V10L24 4Z" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="1.2" />
        <path d="M24 7L11 12V22C11 30.5 16.5 38.5 24 41C31.5 38.5 37 30.5 37 22V12L24 7Z" fill={u(p,'hM')} opacity="0.85" />
        <path d="M17 23L22 28L31 18" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

// 6. 3D Trophy
export const Trophy3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <rect x="14" y="38" width="20" height="5" rx="2" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="0.8" />
        <path d="M20 33H28V38H20V33Z" fill={u(p,'tG')} />
        <path d="M12 7H36V18C36 24.627 30.627 30 24 30C17.373 30 12 24.627 12 18V7Z" fill={u(p,'hM')} />
        <path d="M12 11H7C5.343 11 4 12.343 4 14V16C4 19.314 6.686 22 10 22H12" stroke={u(p,'cL')} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M36 11H41C42.657 11 44 12.343 44 14V16C44 19.314 41.314 22 38 22H36" stroke={u(p,'vR')} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="18" r="3.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

// 7. 3D Users
export const Users3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <circle cx="32" cy="16" r="6" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="0.8" />
        <path d="M26 38C26 32 30 28 36 28C42 28 46 32 46 38" stroke={u(p,'tG')} strokeWidth="3" strokeLinecap="round" />
        <circle cx="18" cy="15" r="7" fill={u(p,'hM')} />
        <ellipse cx="16" cy="13" rx="2" ry="1" fill="#FFF" opacity="0.8" />
        <path d="M8 40C8 33 13 28 20 28C27 28 32 33 32 40" stroke={u(p,'cL')} strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
};

// 8. 3D Sparkles
export const Sparkles3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <path d="M24 4C24 14 30 20 40 20C30 20 24 26 24 36C24 26 18 20 8 20C18 20 24 14 24 4Z" fill={u(p,'hM')} />
        <circle cx="24" cy="20" r="3.5" fill="#FFFFFF" filter={u(p,'gc')} />
        <path d="M36 28C36 32 38 34 42 34C38 34 36 36 36 40C36 36 34 34 30 34C34 34 36 32 36 28Z" fill={u(p,'cL')} />
      </g>
    </svg>
  );
};

// 9. 3D Dollar / Revenue
export const Dollar3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <circle cx="24" cy="24" r="19" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="1.2" />
        <circle cx="24" cy="24" r="16" fill={u(p,'hM')} opacity="0.9" />
        <text x="24" y="31" fontSize="22" fontWeight="900" fontFamily="'Outfit', sans-serif" fill="#FFFFFF" textAnchor="middle">₹</text>
        <ellipse cx="18" cy="14" rx="4" ry="2" transform="rotate(-30 18 14)" fill="#FFF" opacity="0.6" />
      </g>
    </svg>
  );
};

// 10. 3D Zap
export const Zap3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <path d="M27 3L8 27H23L20 45L39 21H24L27 3Z" fill={u(p,'hM')} stroke={u(p,'sE')} strokeWidth="1" />
        <path d="M25 7L13 25H23L21 38L34 23H24L25 7Z" fill="#FFFFFF" opacity="0.4" />
      </g>
    </svg>
  );
};

// 11. 3D Calendar
export const Calendar3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <rect x="7" y="10" width="34" height="32" rx="6" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="1" />
        <path d="M7 18H41V14C41 11.791 39.209 10 37 10H11C8.791 10 7 11.791 7 14V18Z" fill={u(p,'hM')} />
        <rect x="14" y="6" width="4" height="8" rx="2" fill="#FFFFFF" />
        <rect x="30" y="6" width="4" height="8" rx="2" fill="#FFFFFF" />
        <circle cx="15" cy="26" r="2" fill="#5B6EFF" />
        <circle cx="24" cy="26" r="2" fill="#A855F7" />
        <circle cx="33" cy="26" r="2" fill="#FFF" />
        <circle cx="15" cy="34" r="2" fill="#FFF" />
        <circle cx="24" cy="34" r="2" fill="#5B6EFF" />
        <circle cx="33" cy="34" r="2" fill="#A855F7" />
      </g>
    </svg>
  );
};

// 12. 3D Clock
export const Clock3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <circle cx="24" cy="24" r="19" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="1.2" />
        <circle cx="24" cy="24" r="15" fill={u(p,'hM')} opacity="0.8" />
        <path d="M24 13V24L31 28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="2.5" fill="#FFF" />
      </g>
    </svg>
  );
};

// 13. 3D Utensils
export const Utensils3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <path d="M14 6V18C14 20.209 15.791 22 18 22V42" stroke={u(p,'hM')} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 6H22V18C22 20.209 20.209 22 18 22" stroke={u(p,'hM')} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 6V16" stroke={u(p,'hM')} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 6C28 10 28 20 28 26V42H32V6Z" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="0.8" />
      </g>
    </svg>
  );
};

// 14. 3D QrCode
export const QrCode3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <rect x="6" y="6" width="36" height="36" rx="6" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="1" />
        <rect x="11" y="11" width="10" height="10" rx="2" fill={u(p,'cL')} />
        <rect x="14" y="14" width="4" height="4" fill="#FFFFFF" />
        <rect x="27" y="11" width="10" height="10" rx="2" fill={u(p,'vR')} />
        <rect x="30" y="14" width="4" height="4" fill="#FFFFFF" />
        <rect x="11" y="27" width="10" height="10" rx="2" fill={u(p,'hM')} />
        <rect x="14" y="30" width="4" height="4" fill="#FFFFFF" />
        <rect x="27" y="27" width="5" height="5" rx="1" fill="#FFFFFF" />
        <rect x="33" y="33" width="5" height="5" rx="1" fill={u(p,'cL')} />
      </g>
    </svg>
  );
};

// 15. 3D Scale
export const Scale3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <rect x="6" y="8" width="36" height="34" rx="8" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="1" />
        <rect x="16" y="13" width="16" height="10" rx="3" fill="#111116" stroke={u(p,'hM')} strokeWidth="1" />
        <text x="24" y="21" fontSize="8" fontWeight="800" fontFamily="monospace" fill="#5B6EFF" textAnchor="middle">72.0</text>
        <ellipse cx="14" cy="30" rx="3" ry="5" fill={u(p,'hM')} opacity="0.6" />
        <ellipse cx="34" cy="30" rx="3" ry="5" fill={u(p,'hM')} opacity="0.6" />
      </g>
    </svg>
  );
};

// 16. 3D Camera
export const Camera3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <path d="M16 11L18 8H30L32 11H39C41.209 11 43 12.791 43 15V37C43 39.209 41.209 41 39 41H9C6.791 41 5 39.209 5 37V15C5 12.791 6.791 11 9 11H16Z" fill={u(p,'tG')} stroke={u(p,'sE')} strokeWidth="1" />
        <circle cx="24" cy="26" r="10" fill={u(p,'hM')} />
        <circle cx="24" cy="26" r="6" fill="#111116" />
        <circle cx="22" cy="24" r="2" fill="#FFFFFF" opacity="0.8" />
      </g>
    </svg>
  );
};

// 17. 3D Wrench
export const Wrench3D = ({ size = 24, className = '' }) => {
  const p = uid();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`}>
      <SharedDefs p={p} />
      <g filter={u(p,'sh')}>
        <path
          d="M39.4 15.2C38.2 16.4 36.4 16.7 34.9 15.9L22.6 28.2C23.4 29.7 23.1 31.5 21.9 32.7C20.3 34.3 17.8 34.3 16.2 32.7L9.8 39.1C8.2 40.7 5.7 40.7 4.1 39.1C2.5 37.5 2.5 35 4.1 33.4L10.5 27C8.9 25.4 8.9 22.9 10.5 21.3C11.7 20.1 13.5 19.8 15 20.6L27.3 8.3C26.5 6.8 26.8 5 28 3.8C29.6 2.2 32.1 2.2 33.7 3.8L35.8 5.9L32.3 9.4L33.7 10.8L37.2 7.3L39.4 9.5C41 11.1 41 13.6 39.4 15.2Z"
          fill={u(p,'hM')} stroke={u(p,'sE')} strokeWidth="0.8"
        />
      </g>
    </svg>
  );
};

// Aliases
export const Activity3D = Chart3D;
export const Trending3D = Chart3D;
export const Award3D    = Trophy3D;
export const Target3D   = Heart3D;

// Map for universal Icon3D
const ICON_MAP = {
  dumbbell: Dumbbell3D, flame: Flame3D, chart: Chart3D, trending: Chart3D,
  activity: Chart3D, heart: Heart3D, target: Heart3D, shield: Shield3D,
  trophy: Trophy3D, award: Trophy3D, users: Users3D, user: Users3D,
  sparkles: Sparkles3D, dollar: Dollar3D, revenue: Dollar3D, zap: Zap3D,
  calendar: Calendar3D, clock: Clock3D, utensils: Utensils3D, qrcode: QrCode3D,
  scale: Scale3D, camera: Camera3D, wrench: Wrench3D,
};

export const Icon3D = ({ name = 'dumbbell', size = 24, className = '' }) => {
  const normalized = String(name || '').toLowerCase().replace(/[^a-z]/g, '');
  const Component = ICON_MAP[normalized] || Dumbbell3D;
  return <Component size={size} className={className} />;
};

export default Icon3D;
