import type { CubeState, Face, Direction, CubieState } from '../types/cube';

export function checkSolved(
  cubies: CubeState['cubies'],
  lastFace: Face,
  lastDirection: Direction
): boolean {
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  
  for (const face of faces) {
    if (!isFaceSolved(cubies, face)) {
      return false;
    }
  }
  
  return true;
}

function isFaceSolved(cubies: CubeState['cubies'], face: Face): boolean {
  const faceCubies = getCubiesOnFace(cubies, face);
  
  if (faceCubies.length !== 9) {
    return false;
  }
  
  const targetColor = getFaceColor(faceCubies[0], face);
  
  for (const cubie of faceCubies) {
    const cubieColor = getFaceColor(cubie, face);
    if (cubieColor !== targetColor) {
      return false;
    }
  }
  
  return true;
}

function getCubiesOnFace(cubies: CubeState['cubies'], face: Face): CubieState[] {
  return cubies.filter((cubie) => {
    const [x, y, z] = cubie.position;
    switch (face) {
      case 'U': return y === 1;
      case 'D': return y === -1;
      case 'R': return x === 1;
      case 'L': return x === -1;
      case 'F': return z === 1;
      case 'B': return z === -1;
      default: return false;
    }
  });
}

function getFaceColor(cubie: CubieState, face: Face): string {
  let colorKey: keyof CubieState['colors'];
  
  switch (face) {
    case 'U': colorKey = 'top'; break;
    case 'D': colorKey = 'bottom'; break;
    case 'R': colorKey = 'right'; break;
    case 'L': colorKey = 'left'; break;
    case 'F': colorKey = 'front'; break;
    case 'B': colorKey = 'back'; break;
    default: return '#1a1a1a';
  }
  
  return cubie.colors[colorKey];
}

export function calculateScore(time: number, moves: number): number {
  if (moves === 0) return 0;
  
  const timePenalty = time * 0.5;
  const movePenalty = moves * 2;
  
  return Math.max(0, 1000 - timePenalty - movePenalty);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }
  
  return `${secs}.${ms.toString().padStart(2, '0')}`;
}
