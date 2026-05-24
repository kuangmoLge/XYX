import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CubeGuideGrid() {
  const gridGroupRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={gridGroupRef}>
      <group position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <gridHelper args={[3, 3, '#666666', '#444444']} />
      </group>
      
      <group position={[0, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <gridHelper args={[3, 3, '#666666', '#444444']} />
      </group>
      
      <group position={[1.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <gridHelper args={[3, 3, '#666666', '#444444']} />
      </group>
      
      <group position={[-1.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <gridHelper args={[3, 3, '#666666', '#444444']} />
      </group>
      
      <group position={[0, 0, 1.5]} rotation={[0, 0, 0]}>
        <gridHelper args={[3, 3, '#666666', '#444444']} />
      </group>
      
      <group position={[0, 0, -1.5]} rotation={[0, Math.PI, 0]}>
        <gridHelper args={[3, 3, '#666666', '#444444']} />
      </group>
    </group>
  );
}
