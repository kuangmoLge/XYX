export type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B' | 'E' | 'M' | 'S';
export type Direction = 'clockwise' | 'counterclockwise';

export interface CubieState {
  id: string;
  position: [number, number, number];
  colors: {
    front: string;
    back: string;
    left: string;
    right: string;
    top: string;
    bottom: string;
  };
  rotation: [number, number, number];
}

export interface AnimationState {
  isAnimating: boolean;
  face: Face | null;
  direction: Direction | null;
}

export interface CubeState {
  cubies: CubieState[];
  isSolved: boolean;
  moveCount: number;
  elapsedTime: number;
  isPlaying: boolean;
  isScrambled: boolean;
  animation: AnimationState;
}

export interface GameState {
  status: 'idle' | 'scrambled' | 'playing' | 'solved';
  startTime: number | null;
  endTime: number | null;
  moves: Move[];
  bestTime: number | null;
  averageTime: number | null;
}

export interface Move {
  face: Face;
  direction: Direction;
  timestamp: number;
}

export interface GameRecord {
  time: number;
  moves: number;
  date: string;
}

export const CUBE_COLORS = {
  U: '#FFFFFF',   // White - bright white
  D: '#FFD500',   // Yellow - vibrant yellow
  F: '#00A1FF',   // Blue - bright blue
  B: '#009E60',   // Green - vibrant green
  R: '#FF0000',   // Red - bright red
  L: '#FF5800',   // Orange - vibrant orange
} as const;

export type CubeColor = keyof typeof CUBE_COLORS;
