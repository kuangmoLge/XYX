import type { CubieState } from '../types/cube';
import { CUBE_COLORS } from '../types/cube';

export function initializeCubies(): CubieState[] {
  const cubies: CubieState[] = [];
  
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        
        const cubie: CubieState = {
          id: `${x},${y},${z}`,
          position: [x, y, z],
          colors: {
            front: z === 1 ? CUBE_COLORS.F : '#1a1a1a',
            back: z === -1 ? CUBE_COLORS.B : '#1a1a1a',
            left: x === -1 ? CUBE_COLORS.L : '#1a1a1a',
            right: x === 1 ? CUBE_COLORS.R : '#1a1a1a',
            top: y === 1 ? CUBE_COLORS.U : '#1a1a1a',
            bottom: y === -1 ? CUBE_COLORS.D : '#1a1a1a',
          },
          rotation: [0, 0, 0],
        };
        
        cubies.push(cubie);
      }
    }
  }
  
  return cubies;
}

export function getCubieOnFace(cubies: CubieState[], face: string): CubieState[] {
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

export function getFaceColor(cubies: CubieState[], face: string): string {
  const faceCubies = getCubieOnFace(cubies, face);
  if (faceCubies.length === 0) return '#1a1a1a';
  
  const [x, y, z] = faceCubies[0].position;
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
  
  return faceCubies[0].colors[colorKey];
}

export function areAllFacesSolved(cubies: CubieState[]): boolean {
  const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
  
  for (const face of faces) {
    const faceColor = getFaceColor(cubies, face);
    const faceCubies = getCubieOnFace(cubies, face);
    
    if (faceCubies.length !== 9) return false;
    
    for (const cubie of faceCubies) {
      let colorKey: keyof CubieState['colors'];
      switch (face) {
        case 'U': colorKey = 'top'; break;
        case 'D': colorKey = 'bottom'; break;
        case 'R': colorKey = 'right'; break;
        case 'L': colorKey = 'left'; break;
        case 'F': colorKey = 'front'; break;
        case 'B': colorKey = 'back'; break;
        default: continue;
      }
      
      if (cubie.colors[colorKey] !== faceColor) {
        return false;
      }
    }
  }
  
  return true;
}
