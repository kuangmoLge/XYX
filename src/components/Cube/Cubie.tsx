import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { CubieState } from '../../types/cube';

interface CubieProps {
  cubie: CubieState;
  size?: number;
}

export function Cubie({ cubie, size = 0.9 }: CubieProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [x, y, z] = cubie.position;
  const targetPos = new THREE.Vector3(x * (size + 0.1), y * (size + 0.1), z * (size + 0.1));
  
  const materials = useMemo(() => {
    return [
      new THREE.MeshStandardMaterial({ 
        color: cubie.colors.right,
        roughness: 0.4,
        metalness: 0.15
      }),
      new THREE.MeshStandardMaterial({ 
        color: cubie.colors.left,
        roughness: 0.4,
        metalness: 0.15
      }),
      new THREE.MeshStandardMaterial({ 
        color: cubie.colors.top,
        roughness: 0.4,
        metalness: 0.15
      }),
      new THREE.MeshStandardMaterial({ 
        color: cubie.colors.bottom,
        roughness: 0.4,
        metalness: 0.15
      }),
      new THREE.MeshStandardMaterial({ 
        color: cubie.colors.front,
        roughness: 0.4,
        metalness: 0.15
      }),
      new THREE.MeshStandardMaterial({ 
        color: cubie.colors.back,
        roughness: 0.4,
        metalness: 0.15
      }),
    ];
  }, [cubie.colors]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.lerp(targetPos, 0.15);
  });
  
  return (
    <group ref={groupRef} position={[x * (size + 0.1), y * (size + 0.1), z * (size + 0.1)]}>
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <primitive object={materials} attach="material" />
      </mesh>
      <mesh scale={[size + 0.02, size + 0.02, size + 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#111111" wireframe={false} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
