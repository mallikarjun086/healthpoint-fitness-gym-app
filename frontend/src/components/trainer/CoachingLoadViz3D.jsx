import React, { useRef, useEffect } from 'react';
import * as THREE from '../../lib/three.module.js';

/**
 * CoachingLoadViz3D — Trainer Dashboard 3D Hero Moment
 *
 * A solar-system orbital visualization where:
 *   - Central large sphere = the trainer
 *   - Each orbiting sphere = an active client
 *   - Orbital radius, speed, inclination vary per client
 *   - Client name chips float over the canvas via absolute positioning
 *
 * This is a REAL data visualization — clientCount changes the visual.
 * Same material/lighting contract as HeroCanvas3D.
 *
 * Props:
 *   clients   Array<{ name: string, goal: string }>
 */
const CoachingLoadViz3D = ({ clients = [] }) => {
  const containerRef = useRef(null);
  const chipsRef = useRef([]);

  // Pre-define orbital parameters for up to 8 clients
  const ORBITS = [
    { radius: 3.2, speed: 0.45, inclination: 0.4,  phase: 0,    color: 0x5B6EFF },
    { radius: 2.5, speed: 0.70, inclination: -0.6, phase: 2.1,  color: 0xA855F7 },
    { radius: 3.8, speed: 0.30, inclination: 0.9,  phase: 1.05, color: 0xC084FC },
    { radius: 2.9, speed: 0.55, inclination: -0.3, phase: 3.2,  color: 0x7E8EFF },
    { radius: 4.1, speed: 0.38, inclination: 0.7,  phase: 0.6,  color: 0x5B6EFF },
    { radius: 3.0, speed: 0.62, inclination: -0.8, phase: 4.2,  color: 0xA855F7 },
    { radius: 3.5, speed: 0.50, inclination: 0.2,  phase: 1.8,  color: 0xC084FC },
    { radius: 2.7, speed: 0.75, inclination: -0.5, phase: 2.8,  color: 0x7E8EFF },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth || 800;
    const H = container.clientHeight || 280;

    // ── Scene ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 2.5, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // ── Central Trainer Sphere ───────────────────────────────────
    const trainerGeo = new THREE.SphereGeometry(0.85, 64, 64);
    const trainerMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x1a1a28),
      metalness: 0.95,
      roughness: 0.10,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: new THREE.Color(0x5B6EFF),
      emissiveIntensity: 0.3,
    });
    const trainerSphere = new THREE.Mesh(trainerGeo, trainerMat);
    scene.add(trainerSphere);

    // ── Client Orbital Spheres ───────────────────────────────────
    const clientCount = Math.min(clients.length || 3, ORBITS.length);
    const clientSpheres = [];
    const clientAngles  = [];

    for (let i = 0; i < clientCount; i++) {
      const orb = ORBITS[i];

      // Orbit ring (visual guide)
      const ringGeo = new THREE.TorusGeometry(orb.radius, 0.012, 8, 128);
      const ringMat = new THREE.MeshBasicMaterial({
        color: orb.color,
        transparent: true,
        opacity: 0.15,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = orb.inclination;
      scene.add(ring);

      // Client sphere
      const cGeo = new THREE.SphereGeometry(0.28, 32, 32);
      const cMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x1a1a28),
        metalness: 0.90,
        roughness: 0.12,
        clearcoat: 0.9,
        emissive: new THREE.Color(orb.color),
        emissiveIntensity: 0.25,
      });
      const cSphere = new THREE.Mesh(cGeo, cMat);
      scene.add(cSphere);

      // Connecting line (updated each frame)
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0, 0),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: orb.color,
        transparent: true,
        opacity: 0.12,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);

      clientSpheres.push({ mesh: cSphere, line, lineGeo, orb, ring });
      clientAngles.push(orb.phase);
    }

    // ── Particle field ───────────────────────────────────────────
    const pCount = 80;
    const pGeo   = new THREE.BufferGeometry();
    const pPos   = new Float32Array(pCount * 3);
    const pCol   = new Float32Array(pCount * 3);
    const c1 = new THREE.Color(0x5B6EFF), c2 = new THREE.Color(0xA855F7);
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random()-0.5)*18;
      pPos[i*3+1] = (Math.random()-0.5)*10;
      pPos[i*3+2] = (Math.random()-0.5)*8 - 3;
      const mc = c1.clone().lerp(c2, Math.random());
      pCol[i*3] = mc.r; pCol[i*3+1] = mc.g; pCol[i*3+2] = mc.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending });
    scene.add(new THREE.Points(pGeo, pMat));

    // ── Lighting rig (identical to HeroCanvas3D) ─────────────────
    scene.add(new THREE.AmbientLight(0x0a0a10, 1.2));
    const kl = new THREE.DirectionalLight(0xffffff, 2.8);
    kl.position.set(-6, 8, 5); scene.add(kl);
    const fl = new THREE.DirectionalLight(0x404050, 1.0);
    fl.position.set(4, -4, 3); scene.add(fl);
    const cobalt = new THREE.DirectionalLight(0x5B6EFF, 4.2);
    cobalt.position.set(7, 3, -4); scene.add(cobalt);
    const violet = new THREE.PointLight(0xA855F7, 3.8, 15);
    violet.position.set(-5, -4, -2); scene.add(violet);
    scene.add(new THREE.PointLight(0x5B6EFF, 1.5, 10));

    // ── Mouse parallax ───────────────────────────────────────────
    let mx = 0, my = 0;
    const onMM = (e) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMM, { passive: true });

    const onResize = () => {
      const nW = container.clientWidth;
      const nH = container.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener('resize', onResize);

    // ── Chip positioning helper ───────────────────────────────────
    const toScreen = (v3, cam, rect) => {
      const v = v3.clone().project(cam);
      return {
        x: (( v.x + 1) / 2) * rect.width,
        y: ((-v.y + 1) / 2) * rect.height,
      };
    };

    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Trainer sphere pulse (emissive breathe)
      trainerMat.emissiveIntensity = 0.2 + Math.sin(t * 1.2) * 0.15;
      trainerSphere.rotation.y = t * 0.15;

      // Camera gentle parallax
      camera.position.x += (mx * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (-my * 0.8 + 2.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Orbit client spheres
      const rect = container.getBoundingClientRect();
      clientSpheres.forEach(({ mesh, line, lineGeo, orb, ring }, i) => {
        clientAngles[i] += orb.speed * 0.008;
        const angle = clientAngles[i];

        // Inclined elliptical orbit
        const x = Math.cos(angle) * orb.radius;
        const z = Math.sin(angle) * orb.radius;
        const y = Math.sin(angle + orb.inclination) * orb.radius * 0.3;

        mesh.position.set(x, y, z);
        mesh.rotation.y = t * 0.8;

        // Update connecting line
        const pts = [new THREE.Vector3(0,0,0), new THREE.Vector3(x, y, z)];
        lineGeo.setFromPoints(pts);

        // Float ring to match inclination drift
        ring.rotation.z = Math.sin(t * 0.1 + i) * 0.04;

        // Position chip via projected coords
        if (chipsRef.current[i] && rect.width > 0) {
          const s = toScreen(mesh.position, camera, rect);
          chipsRef.current[i].style.left = `${s.x}px`;
          chipsRef.current[i].style.top  = `${Math.max(s.y - 28, 8)}px`;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      trainerGeo.dispose(); trainerMat.dispose();
      clientSpheres.forEach(({ mesh, lineGeo, orb }) => {
        mesh.geometry.dispose(); mesh.material.dispose();
        lineGeo.dispose();
      });
      pGeo.dispose(); pMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [clients.length]);

  const displayClients = clients.length > 0
    ? clients.slice(0, 8)
    : [{ name: 'Client A', goal: 'Hypertrophy' }, { name: 'Client B', goal: 'Weight Loss' }, { name: 'Client C', goal: 'Strength' }];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-surface" style={{ height: 280 }}>
      {/* Three.js canvas */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Gradient vignette edges */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to right, #0D0D12 0%, transparent 18%, transparent 82%, #0D0D12 100%)'
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(13,13,18,0.5) 0%, transparent 30%, transparent 70%, rgba(13,13,18,0.7) 100%)'
      }} />

      {/* Floating client name chips — positioned via JS in animate loop */}
      {displayClients.slice(0, Math.min(displayClients.length, 8)).map((c, i) => (
        <div
          key={i}
          ref={el => chipsRef.current[i] = el}
          className="absolute pointer-events-none"
          style={{ transform: 'translateX(-50%)', zIndex: 10 }}
        >
          <div className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-semibold text-white whitespace-nowrap">
            {c.name}
          </div>
        </div>
      ))}

      {/* Top-left label */}
      <div className="absolute top-4 left-4 pointer-events-none z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            Live Coaching Load · {displayClients.length} Active Clients
          </span>
        </div>
      </div>

      {/* Center trainer label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest" style={{ marginTop: -2 }}>
          You
        </div>
      </div>
    </div>
  );
};

export default CoachingLoadViz3D;
