import { useRef } from 'react';
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import BodyModel from './BodyModel';

// ─── Camera animator ────────────────────────────────────────────────────────
// Smoothly moves camera to frame a selected muscle group.
function CameraController({ targetPosition, controlsRef }) {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (!targetPosition) return;
    const dest = new THREE.Vector3(...targetPosition);
    currentTarget.current.lerp(dest, 0.06);
    camera.lookAt(currentTarget.current);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(dest, 0.06);
    }
    invalidate();
  });

  return null;
}

// ─── Side flip controller ───────────────────────────────────────────────────
function SideFlipController({ side, controlsRef }) {
  const targetAzimuth = side === 'back' ? Math.PI : 0;

  useFrame(() => {
    if (!controlsRef.current) return;
    const current = controlsRef.current.getAzimuthalAngle();
    const diff = targetAzimuth - current;
    // Normalize to [-PI, PI] for shortest-path rotation
    const normalized = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
    if (Math.abs(normalized) < 0.005) return;
    controlsRef.current.setAzimuthalAngle(current + normalized * 0.1);
    controlsRef.current.update();
    invalidate();
  });
  return null;
}

// ─── Auto-rotation controller ───────────────────────────────────────────────
function AutoRotate({ enabled, controlsRef }) {
  const elapsed = useRef(0);

  useFrame((state, delta) => {
    if (!controlsRef.current || !enabled) return;
    elapsed.current += delta;
    controlsRef.current.setAzimuthalAngle(
      controlsRef.current.getAzimuthalAngle() + delta * 0.25
    );
    controlsRef.current.update();
    invalidate();
  });
  return null;
}

// ─── Entrance animation ──────────────────────────────────────────────────────
function EntranceGroup({ children }) {
  const groupRef = useRef();
  const progress = useRef(0);
  const startY = -0.25;

  useFrame((_, delta) => {
    if (progress.current >= 1) return;
    progress.current = Math.min(1, progress.current + delta * 1.4);
    const t = easeOutSpring(progress.current);
    if (groupRef.current) {
      groupRef.current.scale.setScalar(0.65 + 0.35 * t);
      groupRef.current.position.y = startY * (1 - t);
      groupRef.current.rotation.y = (1 - t) * 0.5;
    }
    invalidate();
  });

  return <group ref={groupRef}>{children}</group>;
}

function easeOutSpring(t) {
  // Overshoot spring approximation
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

// ─── Scene lighting ──────────────────────────────────────────────────────────
function SceneLighting() {
  return (
    <>
      {/* Soft ambient */}
      <ambientLight intensity={0.35} color="#C8C8E0" />
      {/* Warm key from top-right */}
      <directionalLight
        position={[2.5, 3.5, 2]}
        intensity={1.2}
        color="#FFE8C8"
        castShadow
        shadow-mapSize={[512, 512]}
      />
      {/* Cool fill from left */}
      <directionalLight position={[-2, 1.5, -1]} intensity={0.5} color="#8090CC" />
      {/* Subtle rim from behind */}
      <directionalLight position={[0, 0.5, -3]} intensity={0.3} color="#6070A0" />
    </>
  );
}

// ─── Inner scene ─────────────────────────────────────────────────────────────
function Scene({
  gender,
  selectedGroups,
  hoveredGroup,
  mode,
  heatData,
  onMuscleClick,
  onMuscleHover,
  autoRotate,
  cameraFocusTarget,
  controlsRef,
  side,
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.15, 2.8]} fov={38} near={0.1} far={30} />
      <SceneLighting />
      <Environment preset="city" />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={1.8}
        maxDistance={4.5}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        enableDamping
        dampingFactor={0.08}
        touches={{ ONE: 1 /* ROTATE */, TWO: 2 /* DOLLY_PAN */ }}
      />

      <AutoRotate enabled={autoRotate} controlsRef={controlsRef} />
      <SideFlipController side={side} controlsRef={controlsRef} />
      <CameraController targetPosition={cameraFocusTarget} controlsRef={controlsRef} />

      <EntranceGroup>
        <BodyModel
          gender={gender}
          selectedGroups={selectedGroups}
          hoveredGroup={hoveredGroup}
          mode={mode}
          heatData={heatData}
          onMuscleClick={onMuscleClick}
          onMuscleHover={onMuscleHover}
        />
      </EntranceGroup>
    </>
  );
}

// ─── BodyScene (exported) ─────────────────────────────────────────────────────
export default function BodyScene({
  gender,
  selectedGroups,
  hoveredGroup,
  mode,
  heatData,
  onMuscleClick,
  onMuscleHover,
  autoRotate,
  cameraFocusTarget,
  side = 'front',
}) {
  const controlsRef = useRef();

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <Scene
        gender={gender}
        selectedGroups={selectedGroups}
        hoveredGroup={hoveredGroup}
        mode={mode}
        heatData={heatData}
        onMuscleClick={onMuscleClick}
        onMuscleHover={onMuscleHover}
        autoRotate={autoRotate}
        cameraFocusTarget={cameraFocusTarget}
        controlsRef={controlsRef}
        side={side}
      />
    </Canvas>
  );
}

