import type { Face, Direction } from '../types/cube';

export interface ScrambleMove {
  face: Face;
  direction: Direction;
}

export function generateScramble(length: number = 20): ScrambleMove[] {
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  const directions: Direction[] = ['clockwise', 'counterclockwise'];
  const scramble: ScrambleMove[] = [];
  
  let lastFace: Face | null = null;
  
  for (let i = 0; i < length; i++) {
    let face: Face;
    do {
      face = faces[Math.floor(Math.random() * faces.length)];
    } while (face === lastFace);
    
    const direction = directions[Math.floor(Math.random() * directions.length)];
    
    scramble.push({ face, direction });
    lastFace = face;
  }
  
  return scramble;
}

export function scrambleToString(scramble: ScrambleMove[]): string {
  return scramble.map((move) => {
    const dir = move.direction === 'clockwise' ? '' : "'";
    return `${move.face}${dir}`;
  }).join(' ');
}

export function parseScramble(scrambleString: string): ScrambleMove[] {
  const regex = /([UDRLBF])([']?)/g;
  const moves: ScrambleMove[] = [];
  let match;
  
  while ((match = regex.exec(scrambleString)) !== null) {
    const face = match[1] as Face;
    const direction: Direction = match[2] === "'" ? 'counterclockwise' : 'clockwise';
    moves.push({ face, direction });
  }
  
  return moves;
}

export function invertMove(move: ScrambleMove): ScrambleMove {
  return {
    face: move.face,
    direction: move.direction === 'clockwise' ? 'counterclockwise' : 'clockwise',
  };
}

export function invertScramble(scramble: ScrambleMove[]): ScrambleMove[] {
  return scramble.map(invertMove).reverse();
}
