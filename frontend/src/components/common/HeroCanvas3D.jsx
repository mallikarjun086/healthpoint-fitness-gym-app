import React, { useRef, useEffect } from 'react';
import * as THREE from '../../lib/three.module.js';

/**
 * HeroCanvas3D - Single Abstract Sculptural Form
 * - Dark Titanium / Brushed Chrome Torus Knot geometry
 * - MeshPhysicalMaterial with high metalness & low roughness
 * - Strong Key Light + Cobalt (#5B6EFF) and Violet (#A855F7) Rim Lighting
 * - Slow continuous rotation + Mouse parallax tracking + Scroll reactivity
 * - Subtle ambient particle field
 */
const HeroCanvas3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();

    let width = container.clientWidth || window.innerWidth * 0.55;
    let height = container.clientHeight || window.innerHeight * 0.85;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);

    // ==========================================
    // 1. SCULPTURAL 3D MESH (Dark Titanium Torus Knot)
    // ==========================================
    // (radius, tube, tubularSegments, radialSegments, p, q)
    const geometry = new THREE.TorusKnotGeometry(2.1, 0.62, 220, 36, 2, 3);

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x1a1a24),
      metalness: 0.92,
      roughness: 0.14,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      envMapIntensity: 1.0,
      wireframe: false
    });

    const knotMesh = new THREE.Mesh(geometry, material);
    scene.add(knotMesh);

    // Subtle inner wireframe accent for high-craft depth
    const wireGeo = new THREE.TorusKnotGeometry(2.11, 0.625, 90, 16, 2, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x5B6EFF),
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    knotMesh.add(wireMesh);

    // ==========================================
    // 2. ETHEREAL AMBIENT PARTICLE FIELD
    // ==========================================
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x5B6EFF);
    const color2 = new THREE.Color(0xA855F7);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 14;
      positions[idx + 1] = (Math.random() - 0.5) * 12;
      positions[idx + 2] = (Math.random() - 0.5) * 8 - 2;

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[idx] = mixedColor.r;
      colors[idx + 1] = mixedColor.g;
      colors[idx + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==========================================
    // 3. LIGHTING SYSTEM (Key + Cobalt/Violet Rim)
    // ==========================================
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x0a0a10, 1.2);
    scene.add(ambientLight);

    // Strong Key Light (Top-Left, crisp white specular highlight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-6, 8, 5);
    scene.add(keyLight);

    // Fill Light (Soft neutral)
    const fillLight = new THREE.DirectionalLight(0x404050, 1.0);
    fillLight.position.set(4, -4, 3);
    scene.add(fillLight);

    // Rim Light 1: Cobalt Blue (#5B6EFF) from Right-Rear
    const cobaltRimLight = new THREE.DirectionalLight(0x5B6EFF, 4.2);
    cobaltRimLight.position.set(7, 3, -4);
    scene.add(cobaltRimLight);

    // Rim Light 2: Violet (#A855F7) from Bottom-Left
    const violetRimLight = new THREE.PointLight(0xA855F7, 3.8, 15);
    violetRimLight.position.set(-5, -4, -2);
    scene.add(violetRimLight);

    // Front Accent Glow
    const frontAccent = new THREE.PointLight(0x5B6EFF, 1.5, 10);
    frontAccent.position.set(0, 0, 4);
    scene.add(frontAccent);

    // ==========================================
    // 4. INTERACTION & ANIMATION LOOP
    // ==========================================
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.35;
    let targetRotY = 0.45;
    let scrollOffset = 0;

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX = normX;
      mouseY = normY;
    };

    const handleScroll = () => {
      scrollOffset = window.scrollY || window.pageYOffset;
    };

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth * 0.55;
      height = container.clientHeight || window.innerHeight * 0.85;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Continuous slow rotation (1 full turn per ~25 seconds)
      const baseRotY = elapsedTime * 0.25;
      const baseRotX = Math.sin(elapsedTime * 0.2) * 0.2;

      // Mouse Parallax Lerp
      targetRotX = baseRotX + mouseY * 0.35;
      targetRotY = baseRotY + mouseX * 0.5;

      knotMesh.rotation.x += (targetRotX - knotMesh.rotation.x) * 0.05;
      knotMesh.rotation.y += (targetRotY - knotMesh.rotation.y) * 0.05;
      knotMesh.rotation.z = Math.sin(elapsedTime * 0.15) * 0.15;

      // Floating kinetic breathing
      knotMesh.position.y = Math.sin(elapsedTime * 0.7) * 0.12;

      // Scroll-linked reactivity: object rotates extra and translates slightly back
      const scrollFactor = Math.min(scrollOffset / 800, 1.5);
      knotMesh.position.z = -scrollFactor * 1.2;
      knotMesh.rotation.z += scrollFactor * 0.5;

      // Gentle drift for ambient particles
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[500px] lg:min-h-[750px] relative pointer-events-none"
    />
  );
};

export default HeroCanvas3D;
