import { useRef, useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  BASE_MUSCLE_COLOR,
  HOVER_EMISSIVE,
  SELECT_EMISSIVE,
  heatColor,
} from './muscleData';

/**
 * MuscleMesh — renders one segmented body region as a 3D primitive.
 *
 * Props:
 *  - segmentDef    : muscle group data object from muscleData.js
 *  - isHovered     : boolean
 *  - isSelected    : boolean
 *  - mode          : 'select' | 'heatmap'
 *  - heatValue     : number (days since last trained) — only used in heatmap mode
 *  - onClick       : () => void
 *  - onPointerOver : () => void
 *  - onPointerOut  : () => void
 *  - showLabel     : boolean — whether to show the floating Html label
 */
export default function MuscleMesh({
  segmentDef,
  isHovered,
  isSelected,
  mode,
  heatValue,
  onClick,
  onPointerOver,
  onPointerOut,
  showLabel,
}) {
  const meshRef = useRef();
  const { geometry, position, rotation, scale } = segmentDef.geometry;

  // ── Geometry ────────────────────────────────────────────────
  const geom = useMemo(() => {
    const g = segmentDef.geometry;
    if (g.type === 'capsule') {
      const [rTop, rBot, h, segs] = g.args;
      // THREE.CapsuleGeometry(radius, length, capSegs, radSegs)
      return new THREE.CapsuleGeometry(rTop, h, segs, segs);
    }
    if (g.type === 'sphere') {
      const [r, ws, hs] = g.args;
      return new THREE.SphereGeometry(r, ws, hs);
    }
    if (g.type === 'box') {
      return new THREE.BoxGeometry(...g.args);
    }
    return new THREE.SphereGeometry(0.1, 8, 8);
  }, [segmentDef]);

  // ── Material colors ─────────────────────────────────────────
  const baseColor = useMemo(() => {
    if (mode === 'heatmap') {
      return new THREE.Color(heatColor(heatValue));
    }
    return new THREE.Color(BASE_MUSCLE_COLOR);
  }, [mode, heatValue]);

  const emissiveColor = useMemo(() => {
    if (isSelected) return new THREE.Color(SELECT_EMISSIVE);
    if (isHovered) return new THREE.Color(HOVER_EMISSIVE);
    if (mode === 'heatmap') return new THREE.Color(heatColor(heatValue)).multiplyScalar(0.3);
    return new THREE.Color(0x000000);
  }, [isSelected, isHovered, mode, heatValue]);

  const emissiveIntensity = isSelected ? 0.6 : isHovered ? 0.45 : mode === 'heatmap' ? 0.25 : 0;
  const roughness = isSelected ? 0.25 : isHovered ? 0.3 : 0.55;
  const metalness = isSelected ? 0.25 : isHovered ? 0.15 : 0.05;

  const { position: pos, rotation: rot, scale: sc } = segmentDef.geometry;

  return (
    <group
      position={pos}
      rotation={rot}
      scale={sc}
    >
      <mesh
        ref={meshRef}
        geometry={geom}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        onPointerOver={(e) => { e.stopPropagation(); onPointerOver?.(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); onPointerOut?.(); document.body.style.cursor = 'auto'; }}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={roughness}
          metalness={metalness}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Floating label on hover */}
      {showLabel && (isHovered || isSelected) && (
        <Html
          center
          distanceFactor={3.5}
          position={[0, 0.22, 0]}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[10, 100]}
        >
          <div
            style={{
              background: 'rgba(17,18,22,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(79,70,229,0.45)',
              borderRadius: '999px',
              padding: '3px 10px',
              color: isSelected ? '#A5B4FC' : '#F4F4F6',
              fontSize: '11px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 18px -4px rgba(79,70,229,0.35)',
              userSelect: 'none',
            }}
          >
            {segmentDef.label}
          </div>
        </Html>
      )}
    </group>
  );
}
