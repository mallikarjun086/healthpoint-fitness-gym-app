import React, { useRef, useEffect } from 'react';
import * as THREE from '../../lib/three.module.js';

/**
 * ProgressOrb3D — Member Dashboard 3D Hero Moment
 *
 * A tightly-wound torus knot sculpted from the same material/lighting
 * as the landing hero, binding weekly volume + streak data to visual
 * rotation speed and a SVG progress ring overlay.
 *
 * Props:
 *   progress    0-1   fill of the SVG ring (e.g. 0.72 = 72% weekly goal)
 *   streakDays  int   label shown in ring center
 *   weeklyVolume int  kg lifted this week
 */
const ProgressOrb3D = ({ progress = 0.72, streakDays = 7, weeklyVolume = 12900 }) => {
  const containerRef = useRef(null);

  // SVG ring math
  const R = 70;
  const C = 2 * Math.PI * R;
  const dashOffset = C - C * progress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth || 320;
    const H = container.clientHeight || 320;

    // ── Scene ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // ── Torus Knot (tighter than landing hero — inner orb feel) ──
    const geo = new THREE.TorusKnotGeometry(1.6, 0.42, 200, 32, 2, 3);
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x1a1a24),
      metalness: 0.92,
      roughness: 0.14,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
    });
    const knot = new THREE.Mesh(geo, mat);
    scene.add(knot);

    // Wireframe accent
    const wGeo = new THREE.TorusKnotGeometry(1.61, 0.425, 80, 14, 2, 3);
    const wMat = new THREE.MeshBasicMaterial({ color: 0x5B6EFF, wireframe: true, transparent: true, opacity: 0.08 });
    knot.add(new THREE.Mesh(wGeo, wMat));

    // Particle field (lighter version — smaller canvas)
    const pCount = 60;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(pCount * 3);
    const col = new Float32Array(pCount * 3);
    const c1 = new THREE.Color(0x5B6EFF);
    const c2 = new THREE.Color(0xA855F7);
    for (let i = 0; i < pCount; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 10;
      pos[i*3+1] = (Math.random() - 0.5) * 10;
      pos[i*3+2] = (Math.random() - 0.5) * 6 - 2;
      const mc = c1.clone().lerp(c2, Math.random());
      col[i*3] = mc.r; col[i*3+1] = mc.g; col[i*3+2] = mc.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Lighting rig (identical to HeroCanvas3D) ─────────────────
    scene.add(new THREE.AmbientLight(0x0a0a10, 1.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-6, 8, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x404050, 1.0);
    fillLight.position.set(4, -4, 3);
    scene.add(fillLight);
    const cobalt = new THREE.DirectionalLight(0x5B6EFF, 4.2);
    cobalt.position.set(7, 3, -4);
    scene.add(cobalt);
    const violet = new THREE.PointLight(0xA855F7, 3.8, 15);
    violet.position.set(-5, -4, -2);
    scene.add(violet);
    const front = new THREE.PointLight(0x5B6EFF, 1.5, 10);
    front.position.set(0, 0, 4);
    scene.add(front);

    // ── Interaction ───────────────────────────────────────────────
    let mx = 0, my = 0;
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      my = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      const nW = container.clientWidth || W;
      const nH = container.clientHeight || H;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener('resize', onResize);

    // Rotation speed scales with progress (more progress = slightly faster orb)
    const baseSpeed = 0.18 + progress * 0.12;

    const clock = new THREE.Clock();
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      knot.rotation.y += (baseSpeed * 0.04 + mx * 0.008 - knot.rotation.y * 0.005) * 0.6;
      knot.rotation.x += (-my * 0.25 + Math.sin(t * 0.2) * 0.15 - knot.rotation.x * 0.005) * 0.05;
      knot.rotation.z  = Math.sin(t * 0.15) * 0.12;
      knot.position.y  = Math.sin(t * 0.7) * 0.08;

      particles.rotation.y = t * 0.03;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      geo.dispose(); mat.dispose(); wGeo.dispose(); wMat.dispose();
      pGeo.dispose(); pMat.dispose(); renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [progress]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl" style={{ minHeight: 260 }}>
      {/* Three.js canvas fills the container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* SVG Progress Ring — rendered over canvas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
            {/* Track */}
            <circle
              cx="80" cy="80" r={R}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            {/* Progress fill */}
            <circle
              cx="80" cy="80" r={R}
              fill="none"
              stroke="url(#orbRingGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)' }}
            />
            <defs>
              <linearGradient id="orbRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5B6EFF" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black stat-number text-white leading-none">{streakDays}</span>
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mt-0.5">Day Streak</span>
          </div>
        </div>
      </div>

      {/* Bottom-left progress % badge */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs font-semibold text-white">
          {Math.round(progress * 100)}% weekly goal
        </div>
      </div>
    </div>
  );
};

export default ProgressOrb3D;
