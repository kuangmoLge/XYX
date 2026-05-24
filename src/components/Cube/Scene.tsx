import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Cube } from './Cube';
import { CubeGestureHandler } from './CubeGestureHandler';
import { CubeGuideGrid } from './CubeGuideGrid';
import { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useCubeStore } from '../../store/cubeStore';

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 3, -2]} intensity={0.5} />
      <pointLight position={[3, -3, 3]} intensity={0.3} />
    </>
  );
}

function CameraController() {
  const { camera } = useThree();
  const enableCameraControls = useCubeStore((state) => state.enableCameraControls);
  const prevEnabled = useRef(true);
  const targetPos = useRef(new THREE.Vector3(4, 3, 5));
  const animating = useRef(false);

  useEffect(() => {
    if (!enableCameraControls && prevEnabled.current) {
      const cameraDir = new THREE.Vector3();
      camera.getWorldDirection(cameraDir);
      
      const toCamera = cameraDir.negate();
      
      const absX = Math.abs(toCamera.x);
      const absY = Math.abs(toCamera.y);
      const absZ = Math.abs(toCamera.z);
      
      let targetDirection: THREE.Vector3;
      
      if (absX >= absY && absX >= absZ) {
        targetDirection = new THREE.Vector3(toCamera.x > 0 ? 1 : -1, 0, 0);
      } else if (absY >= absX && absY >= absZ) {
        targetDirection = new THREE.Vector3(0, toCamera.y > 0 ? 1 : -1, 0);
      } else {
        targetDirection = new THREE.Vector3(0, 0, toCamera.z > 0 ? 1 : -1);
      }
      
      targetPos.current.copy(targetDirection.multiplyScalar(6));
      animating.current = true;
    }
    prevEnabled.current = enableCameraControls;
  }, [enableCameraControls, camera]);

  useFrame(() => {
    if (animating.current && !enableCameraControls) {
      camera.position.lerp(targetPos.current, 0.12);
      camera.lookAt(0, 0, 0);
      
      if (camera.position.distanceTo(targetPos.current) < 0.01) {
        camera.position.copy(targetPos.current);
        camera.lookAt(0, 0, 0);
        animating.current = false;
      }
    }
  });

  return null;
}

function SceneContent() {
  const enableCameraControls = useCubeStore((state) => state.enableCameraControls);
  
  return (
    <>
      <Lights />
      <CameraController />
      <Cube />
      <CubeGestureHandler />
      {!enableCameraControls && <CubeGuideGrid />}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={enableCameraControls}
        minDistance={4}
        maxDistance={12}
        autoRotate={false}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
}

export function Scene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [4, 3, 5], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: false,
          pixelRatio: Math.min(window.devicePixelRatio, 2)
        }}
        shadows
      >
        <color attach="background" args={['#1a1a2e']} />
        <fog attach="fog" args={['#1a1a2e', 10, 30]} />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
