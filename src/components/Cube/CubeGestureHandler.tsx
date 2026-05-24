import { useRef, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCubeStore } from '../../store/cubeStore';
import type { Face, Direction } from '../../types/cube';

const DRAG_THRESHOLD = 0.08;

type CameraFace = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

function getCameraFace(camera: THREE.Camera): CameraFace {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  const toCamera = dir.negate();
  const absX = Math.abs(toCamera.x);
  const absY = Math.abs(toCamera.y);
  const absZ = Math.abs(toCamera.z);
  if (absX >= absY && absX >= absZ) {
    return toCamera.x > 0 ? 'right' : 'left';
  } else if (absY >= absX && absY >= absZ) {
    return toCamera.y > 0 ? 'top' : 'bottom';
  } else {
    return toCamera.z > 0 ? 'front' : 'back';
  }
}

function getScreenCoords(pos: [number, number, number], cameraFace: CameraFace): { sx: number; sy: number } {
  const [x, y, z] = pos;
  switch (cameraFace) {
    case 'front': return { sx: x, sy: y };
    case 'back': return { sx: -x, sy: y };
    case 'right': return { sx: -z, sy: y };
    case 'left': return { sx: z, sy: y };
    case 'top': return { sx: x, sy: -z };
    case 'bottom': return { sx: x, sy: z };
  }
}

function isOnFace(pos: [number, number, number], face: Face): boolean {
  const [x, y, z] = pos;
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
  }
}

function getPositionAfterRotation(pos: [number, number, number], face: Face, direction: Direction): [number, number, number] {
  const [x, y, z] = pos;
  const cw = direction === 'clockwise';
  switch (face) {
    case 'U': return cw ? [z, y, -x] : [-z, y, x];
    case 'D': return cw ? [-z, y, x] : [z, y, -x];
    case 'R': return cw ? [x, z, -y] : [x, -z, y];
    case 'L': return cw ? [x, -z, y] : [x, z, -y];
    case 'F': return cw ? [y, -x, z] : [-y, x, z];
    case 'B': return cw ? [-y, x, z] : [y, -x, z];
    case 'E': return cw ? [z, y, -x] : [-z, y, x];
    case 'M': return cw ? [x, z, -y] : [x, -z, y];
    case 'S': return cw ? [y, -x, z] : [-y, x, z];
  }
}

export function CubeGestureHandler() {
  const { camera, gl, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const isDragging = useRef(false);
  const startData = useRef<{
    x: number;
    y: number;
    hitX: number | null;
    hitY: number | null;
    hitZ: number | null;
  }>({
    x: 0,
    y: 0,
    hitX: null,
    hitY: null,
    hitZ: null,
  });
  const hasRotated = useRef(false);

  const rotateFace = useCubeStore((state) => state.rotateFace);
  const cubies = useCubeStore((state) => state.cubies);
  const animation = useCubeStore((state) => state.animation);
  const enableCameraControls = useCubeStore((state) => state.enableCameraControls);

  const getIntersectedCubie = useCallback(
    (clientX: number, clientY: number) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(scene.children, true);
      for (const intersect of intersects) {
        if (intersect.object instanceof THREE.Mesh && intersect.face) {
          const cubieGroup = intersect.object.parent;
          if (cubieGroup instanceof THREE.Group) {
            const cubie = cubies.find(
              (c) =>
                Math.abs(c.position[0] - cubieGroup.position.x) < 0.5 &&
                Math.abs(c.position[1] - cubieGroup.position.y) < 0.5 &&
                Math.abs(c.position[2] - cubieGroup.position.z) < 0.5
            );
            if (cubie) {
              return { x: cubie.position[0], y: cubie.position[1], z: cubie.position[2] };
            }
          }
        }
      }
      return null;
    },
    [camera, scene, cubies, gl]
  );

  const determineRotation = useCallback(
    (hitX: number, hitY: number, hitZ: number, deltaX: number, deltaY: number) => {
      const cameraFace = getCameraFace(camera);
      const pos: [number, number, number] = [hitX, hitY, hitZ];
      const before = getScreenCoords(pos, cameraFace);

      const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B', 'E', 'M', 'S'];
      const directions: Direction[] = ['clockwise', 'counterclockwise'];

      let bestMatch: { face: Face; direction: Direction } | null = null;
      let bestDot = -Infinity;

      const swipeLen = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (swipeLen < 1) return null;
      const snx = deltaX / swipeLen;
      const sny = -deltaY / swipeLen;

      for (const face of faces) {
        if (!isOnFace(pos, face)) continue;

        for (const dir of directions) {
          const afterPos = getPositionAfterRotation(pos, face, dir);
          const after = getScreenCoords(afterPos, cameraFace);
          const dsx = after.sx - before.sx;
          const dsy = after.sy - before.sy;

          const dispLen = Math.sqrt(dsx * dsx + dsy * dsy);
          if (dispLen < 0.001) continue;

          const dnx = dsx / dispLen;
          const dny = dsy / dispLen;

          const dot = snx * dnx + sny * dny;
          if (dot > bestDot) {
            bestDot = dot;
            bestMatch = { face, direction: dir };
          }
        }
      }

      if (bestMatch && bestDot > 0.3) {
        return bestMatch;
      }

      return null;
    },
    [camera]
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      if (animation.isAnimating || enableCameraControls) return;
      if (event.button !== 0) return;

      const hit = getIntersectedCubie(event.clientX, event.clientY);
      isDragging.current = true;
      hasRotated.current = false;
      startData.current = {
        x: event.clientX,
        y: event.clientY,
        hitX: hit ? hit.x : 0,
        hitY: hit ? hit.y : 0,
        hitZ: hit ? hit.z : 0,
      };
      gl.domElement.setPointerCapture(event.pointerId);
    },
    [getIntersectedCubie, animation.isAnimating, gl, enableCameraControls]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isDragging.current || hasRotated.current || enableCameraControls) return;

      const deltaX = event.clientX - startData.current.x;
      const deltaY = event.clientY - startData.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > DRAG_THRESHOLD * gl.domElement.clientWidth) {
        hasRotated.current = true;

        const rotation = determineRotation(
          startData.current.hitX!,
          startData.current.hitY!,
          startData.current.hitZ!,
          deltaX,
          deltaY
        );

        if (rotation) {
          rotateFace(rotation.face, rotation.direction);
        }

        isDragging.current = false;
        startData.current = { x: 0, y: 0, hitX: null, hitY: null, hitZ: null };
      }
    },
    [gl, determineRotation, rotateFace, enableCameraControls]
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent) => {
      if (isDragging.current) {
        isDragging.current = false;
        startData.current = { x: 0, y: 0, hitX: null, hitY: null, hitZ: null };
      }
      gl.domElement.releasePointerCapture(event.pointerId);
    },
    [gl]
  );

  const handlePointerCancel = useCallback(
    (event: PointerEvent) => {
      isDragging.current = false;
      startData.current = { x: 0, y: 0, hitX: null, hitY: null, hitZ: null };
      gl.domElement.releasePointerCapture(event.pointerId);
    },
    [gl]
  );

  useEffect(() => {
    const element = gl.domElement;
    element.addEventListener('pointerdown', handlePointerDown);
    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerUp);
    element.addEventListener('pointercancel', handlePointerCancel);
    return () => {
      element.removeEventListener('pointerdown', handlePointerDown);
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerup', handlePointerUp);
      element.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, [gl, handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel]);

  return null;
}
