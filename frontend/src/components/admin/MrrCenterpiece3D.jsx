import React, { useRef, useEffect } from 'react';
import * as THREE from '../../lib/three.module.js';
import CountUp from '../ui/CountUp';
import { ArrowUpRight } from 'lucide-react';

/**
 * MrrCenterpiece3D — Admin Dashboard 3D Hero Moment
 *
 * Full-width hero banner with:
 * - Three.js canvas: drifting particle field + two rotating torus rings (depth layer)
 * - HTML overlay: giant MRR number (CountUp + gradient clip text + metallic shadow)
 * - Support strip: MoM growth, member count, ARPU — all CountUp
 *
 * Props:
 *   mrr      number  Monthly recurring revenue in ₹
 *   members  number  Total active members
 */
const MrrCenterpiece3D = ({ mrr = 340900, members = 162 }) => {
  const containerRef = useRef(null);
  const arpu = mrr > 0 && members > 0 ? Math.round(mrr / members) : 2104;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth || 1000;
    const H = container.clientHeight || 200;

    const scene   = new THREE.Scene();
    const camera  = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping     = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputEncoding  = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // ── Two large torus rings (behind the number) ────────────────
    const ring1Mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x1a1a28),
      metalness: 0.95, roughness: 0.08, clearcoat: 1.0,
      emissive: new THREE.Color(0x5B6EFF), emissiveIntensity: 0.15,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.18, 24, 120), ring1Mat);
    ring1.rotation.x = 0.6;
    ring1.position.z = -2;
    scene.add(ring1);

    const ring2Mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x1a1a28),
      metalness: 0.95, roughness: 0.08, clearcoat: 1.0,
      emissive: new THREE.Color(0xA855F7), emissiveIntensity: 0.12,
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.12, 24, 120), ring2Mat);
    ring2.rotation.x = -0.9;
    ring2.rotation.y = 0.4;
    ring2.position.z = -1.5;
    scene.add(ring2);

    // ── Particle field ───────────────────────────────────────────
    const pCount = 120;
    const pGeo   = new THREE.BufferGeometry();
    const pPos   = new Float32Array(pCount * 3);
    const pCol   = new Float32Array(pCount * 3);
    const c1 = new THREE.Color(0x5B6EFF), c2 = new THREE.Color(0xA855F7);

    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random()-0.5)*20;
      pPos[i*3+1] = (Math.random()-0.5)*8;
      pPos[i*3+2] = (Math.random()-0.5)*6 - 3;
      const mc = c1.clone().lerp(c2, Math.random());
      pCol[i*3] = mc.r; pCol[i*3+1] = mc.g; pCol[i*3+2] = mc.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.055, vertexColors: true, transparent: true,
      opacity: 0.45, blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Lighting rig ─────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a0a10, 1.2));
    const kl = new THREE.DirectionalLight(0xffffff, 2.8);
    kl.position.set(-6, 8, 5); scene.add(kl);
    const fl = new THREE.DirectionalLight(0x404050, 1.0);
    fl.position.set(4, -4, 3);
    scene.add(fl);
    const cobalt = new THREE.DirectionalLight(0x5B6EFF, 4.2);
    cobalt.position.set(7, 3, -4); scene.add(cobalt);
    const violet = new THREE.PointLight(0xA855F7, 3.8, 15);
    violet.position.set(-5, -4, -2); scene.add(violet);
    scene.add(new THREE.PointLight(0x5B6EFF, 1.5, 10));

    // ── Mouse parallax ───────────────────────────────────────────
    let mx = 0;
    const onMM = (e) => { mx = (e.clientX / window.innerWidth - 0.5) * 2; };
    window.addEventListener('mousemove', onMM, { passive: true });

    const onResize = () => {
      const nW = container.clientWidth;
      const nH = container.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      ring1.rotation.z += 0.003;
      ring1.rotation.x = 0.6 + Math.sin(t * 0.3) * 0.08;
      ring2.rotation.z -= 0.005;
      ring2.rotation.y = 0.4 + Math.sin(t * 0.25 + 1) * 0.06;

      // Rings pulse emissive
      ring1Mat.emissiveIntensity = 0.12 + Math.sin(t * 0.8) * 0.06;
      ring2Mat.emissiveIntensity = 0.10 + Math.sin(t * 1.1 + 1) * 0.05;

      particles.rotation.y = t * 0.025;
      particles.rotation.x = Math.sin(t * 0.015) * 0.04;

      // Camera subtle drift
      camera.position.x += (mx * 0.6 - camera.position.x) * 0.03;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      ring1.geometry.dispose(); ring1Mat.dispose();
      ring2.geometry.dispose(); ring2Mat.dispose();
      pGeo.dispose(); pMat.dispose(); renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border" style={{ height: 210 }}>
      {/* 3D canvas (depth layer) */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Dark gradient wash so text reads cleanly */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 120% at 50% 50%, rgba(13,13,18,0.45) 0%, rgba(13,13,18,0.7) 100%)'
      }} />

      {/* HTML content — absolutely centered over the canvas */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 text-center px-4">
        {/* Label */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary">
            Monthly Recurring Revenue
          </span>
        </div>

        {/* Giant MRR number — gradient text */}
        <div
          className="text-5xl sm:text-6xl font-black stat-number leading-none select-none"
          style={{
            background: 'linear-gradient(135deg, #ffffff 30%, #5B6EFF 65%, #A855F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 32px rgba(91,110,255,0.45))',
          }}
        >
          <CountUp value={mrr} prefix="₹" separator="," />
        </div>

        {/* Support strip */}
        <div className="flex items-center gap-6 mt-1">
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <CountUp value={18.5} suffix="% MoM" decimals={1} />
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="text-xs text-text-secondary">
            <span className="stat-number text-text-primary"><CountUp value={members} /></span> Active Members
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="text-xs text-text-secondary">
            ARPU <span className="stat-number text-text-primary"><CountUp value={arpu} prefix="₹" /></span>
          </div>
        </div>
      </div>

      {/* Corner badges */}
      <div className="absolute top-3 left-4 z-20">
        <span className="badge-accent text-[10px]">System Administration</span>
      </div>
      <div className="absolute top-3 right-4 z-20 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-medium text-emerald-400">Live Telemetry</span>
      </div>
    </div>
  );
};

export default MrrCenterpiece3D;
