import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MUSCLE_GROUPS } from './muscleData';
import MuscleMesh from './MuscleMesh';

/**
 * Torso skeleton — non-interactive structural geometry so the model reads
 * clearly as a human body. Rendered with a very dark base material.
 */
function TorsoSkeleton({ gender }) {
  const torsoScale = gender === 'female' ? [0.88, 1, 0.85] : [1, 1, 1];
  const hipScale   = gender === 'female' ? [1.08, 1, 0.9] : [0.9, 1, 0.85];

  const skeletonMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#18191E'),
    roughness: 0.75,
    metalness: 0.05,
  }), []);

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.72, 0]} material={skeletonMat}>
        <sphereGeometry args={[0.135, 14, 14]} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.18, 0]} scale={torsoScale} material={skeletonMat}>
        <capsuleGeometry args={[0.2, 0.38, 10, 12]} />
      </mesh>

      {/* Hips / Pelvis */}
      <mesh position={[0, 0.82, 0]} scale={hipScale} material={skeletonMat}>
        <capsuleGeometry args={[0.18, 0.12, 8, 10]} />
      </mesh>

      {/* Upper arms */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.44, 1.22, 0]} rotation={[0.12, 0, 0]} material={skeletonMat}>
          <capsuleGeometry args={[0.055, 0.24, 6, 8]} />
        </mesh>
      ))}

      {/* Lower legs */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.155, 0.18, 0]} material={skeletonMat}>
          <capsuleGeometry args={[0.05, 0.24, 6, 8]} />
        </mesh>
      ))}

      {/* Feet */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.155, 0.0, 0.045]} rotation={[-0.35, 0, 0]} material={skeletonMat}>
          <capsuleGeometry args={[0.04, 0.1, 5, 6]} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * BodyModel — assembles the full segmented body out of MuscleMesh instances.
 *
 * Props:
 *  - gender        : 'male' | 'female'
 *  - selectedGroups: Set<string> (muscle IDs)
 *  - hoveredGroup  : string | null
 *  - mode          : 'select' | 'heatmap'
 *  - heatData      : { [muscleId]: number } — days since last trained
 *  - onMuscleClick : (id: string) => void
 *  - onMuscleHover : (id: string | null) => void
 */
export default function BodyModel({
  gender = 'male',
  selectedGroups = new Set(),
  hoveredGroup = null,
  mode = 'select',
  heatData = {},
  onMuscleClick,
  onMuscleHover,
}) {
  const groupRef = useRef();

  // Female proportions: slightly narrower shoulders, wider hips
  const genderScale = gender === 'female' ? [0.9, 1, 0.9] : [1, 1, 1];

  return (
    <group ref={groupRef} scale={genderScale} position={[0, -0.9, 0]}>
      {/* Structural skeleton (dark, non-interactive) */}
      <TorsoSkeleton gender={gender} />

      {/* Interactive muscle meshes */}
      {MUSCLE_GROUPS.map((muscle) => (
        <MuscleMesh
          key={muscle.id}
          segmentDef={muscle}
          isHovered={hoveredGroup === muscle.id}
          isSelected={selectedGroups.has(muscle.id)}
          mode={mode}
          heatValue={heatData[muscle.id] ?? null}
          showLabel={true}
          onClick={() => onMuscleClick?.(muscle.id)}
          onPointerOver={() => onMuscleHover?.(muscle.id)}
          onPointerOut={() => onMuscleHover?.(null)}
        />
      ))}
    </group>
  );
}
