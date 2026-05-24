import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCubeStore } from '../../store/cubeStore';
import { Cubie } from './Cubie';
import type { Face, Direction } from '../../types/cube';

const ANIMATION_DURATION = 0.25;

function getFaceAxis(face: Face): THREE.Vector3 {
  switch (face) {
    case 'U': return new THREE.Vector3(0, 1, 0);
    case 'D': return new THREE.Vector3(0, -1, 0);
    case 'R': return new THREE.Vector3(1, 0, 0);
    case 'L': return new THREE.Vector3(-1, 0, 0);
    case 'F': return new THREE.Vector3(0, 0, 1);
    case 'B': return new THREE.Vector3(0, 0, -1);
    case 'E': return new THREE.Vector3(0, -1, 0); // E层使用负Y轴，方向与D层一致
    case 'M': return new THREE.Vector3(1, 0, 0);  // M层使用正X轴，方向与R层一致
    case 'S': return new THREE.Vector3(0, 0, 1);  // S层使用正Z轴，方向与F层一致
    default: return new THREE.Vector3(0, 1, 0);
  }
}

function getTargetAngle(face: Face, direction: Direction): number {
  const clockwise = direction === 'clockwise';
  const clockwiseAngles: Record<Face, number> = {
    'U': Math.PI / 2,
    'D': Math.PI / 2,
    'R': -Math.PI / 2,
    'L': -Math.PI / 2,
    'F': -Math.PI / 2,
    'B': -Math.PI / 2,
    'E': Math.PI / 2, // E层顺时针和U层方向相同
    'M': -Math.PI / 2, // M层顺时针和R层方向相同
    'S': -Math.PI / 2, // S层顺时针和F层方向相同
  };
  return clockwise ? clockwiseAngles[face] : -clockwiseAngles[face];
}

function isCubieOnFace(position: [number, number, number], face: Face): boolean {
  const [x, y, z] = position;
  switch (face) {
    case 'U': return y === 1;
    case 'D': return y === -1;
    case 'R': return x === 1;
    case 'L': return x === -1;
    case 'F': return z === 1;
    case 'B': return z === -1;
    case 'E': return y === 0;
    case 'M': return x === 0;
    case 'S': return z === 0;
    default: return false;
  }
}

export function Cube() {
  const cubies = useCubeStore((state) => state.cubies);
  const animation = useCubeStore((state) => state.animation);
  const applyRotation = useCubeStore((state) => state.applyRotation);
  
  const groupRef = useRef<THREE.Group>(null);
  const animProgress = useRef(0);
  const hasApplied = useRef(false);

  useEffect(() => {
    if (animation.isAnimating) {
      animProgress.current = 0;
      hasApplied.current = false;
    }
  }, [animation.isAnimating, animation.face, animation.direction]);

  useFrame((_, delta) => {
    if (!animation.isAnimating || !animation.face || !animation.direction || !groupRef.current) return;

    animProgress.current += delta / ANIMATION_DURATION;

    if (animProgress.current >= 1) {
      animProgress.current = 1;
      
      const axis = getFaceAxis(animation.face);
      const angle = getTargetAngle(animation.face, animation.direction);
      
      const quat = new THREE.Quaternion();
      quat.setFromAxisAngle(axis, angle);
      groupRef.current.quaternion.premultiply(quat);
      groupRef.current.quaternion.identity();

      if (!hasApplied.current) {
        hasApplied.current = true;
        applyRotation(animation.face, animation.direction);
      }
    } else {
      const t = easeOutCubic(animProgress.current);
      const axis = getFaceAxis(animation.face);
      const angle = getTargetAngle(animation.face, animation.direction) * t;
      
      groupRef.current.quaternion.setFromAxisAngle(axis, angle);
    }
  });

  const animatingFace = animation.isAnimating ? animation.face : null;

  const staticCubies = animatingFace
    ? cubies.filter((c) => !isCubieOnFace(c.position, animatingFace))
    : cubies;

  const animatingCubies = animatingFace
    ? cubies.filter((c) => isCubieOnFace(c.position, animatingFace))
    : [];

  return (
    <group>
      {staticCubies.map((cubie) => (
        <Cubie key={cubie.id} cubie={cubie} />
      ))}
      
      {animatingFace && (
        <group ref={groupRef}>
          {animatingCubies.map((cubie) => (
            <Cubie key={cubie.id} cubie={cubie} />
          ))}
        </group>
      )}
    </group>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
