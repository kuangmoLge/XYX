import { create } from 'zustand';
import type { CubeState, GameState, Move, Face, Direction, AnimationState } from '../types/cube';
import { CUBE_COLORS } from '../types/cube';
import { initializeCubies, areAllFacesSolved } from '../utils/cubeLogic';

interface CubeStore extends CubeState, GameState {
  rotateFace: (face: Face, direction: Direction) => void;
  applyRotation: (face: Face, direction: Direction) => void;
  setAnimation: (animation: AnimationState) => void;
  scramble: () => void;
  reset: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  updateTimer: (time: number) => void;
  incrementMoveCount: () => void;
  setStatus: (status: GameState['status']) => void;
  loadBestTime: () => void;
  saveBestTime: (time: number) => void;
  enableCameraControls: boolean;
  toggleCameraControls: () => void;
}

const initialCubeState: CubeState = {
  cubies: initializeCubies(),
  isSolved: true,
  moveCount: 0,
  elapsedTime: 0,
  isPlaying: false,
  isScrambled: false,
  animation: { isAnimating: false, face: null, direction: null },
};

const initialGameState: GameState = {
  status: 'idle',
  startTime: null,
  endTime: null,
  moves: [],
  bestTime: null,
  averageTime: null,
};

export const useCubeStore = create<CubeStore>((set, get) => ({
  ...initialCubeState,
  ...initialGameState,
  enableCameraControls: true,

  toggleCameraControls: () => {
    set((state) => ({ enableCameraControls: !state.enableCameraControls }));
  },

  rotateFace: (face: Face, direction: Direction) => {
    const state = get();
    if (state.animation.isAnimating) return;

    if (!state.isScrambled && state.status === 'idle') {
      set({ isScrambled: true });
    }
    
    if (state.isScrambled && state.status === 'scrambled') {
      set({
        isPlaying: true,
        status: 'playing',
        startTime: Date.now(),
      });
    }

    const newMoves: Move[] = [
      ...state.moves,
      { face, direction, timestamp: Date.now() }
    ];

    set({
      moveCount: state.moveCount + 1,
      moves: newMoves,
      animation: { isAnimating: true, face, direction },
    });
  },

  applyRotation: (face: Face, direction: Direction) => {
    const state = get();

    const newCubies = rotateFace(state.cubies, face, direction);

    set({
      cubies: newCubies,
      animation: { isAnimating: false, face: null, direction: null },
    });

    if (state.isScrambled && areAllFacesSolved(newCubies)) {
      get().stopTimer();
      set({ status: 'solved', isSolved: true });
      
      const finalTime = get().elapsedTime;
      if (finalTime > 0 && 
          (!state.bestTime || finalTime < state.bestTime)) {
        get().saveBestTime(finalTime);
      }
    }
  },

  setAnimation: (animation: AnimationState) => {
    set({ animation });
  },

  scramble: () => {
    const { cubies } = get();
    const scrambledCubies = performScramble(cubies);
    
    set({
      cubies: scrambledCubies,
      isScrambled: true,
      isSolved: false,
      moveCount: 0,
      elapsedTime: 0,
      status: 'scrambled',
      moves: [],
    });
  },

  reset: () => {
    set({
      ...initialCubeState,
      ...initialGameState,
      bestTime: get().bestTime,
      enableCameraControls: get().enableCameraControls,
    });
  },

  startTimer: () => {
    set({
      isPlaying: true,
      status: 'playing',
      startTime: Date.now(),
    });
  },

  stopTimer: () => {
    const state = get();
    set({
      isPlaying: false,
      endTime: Date.now(),
    });
  },

  updateTimer: (time: number) => {
    set({ elapsedTime: time });
  },

  incrementMoveCount: () => {
    set((state) => ({ moveCount: state.moveCount + 1 }));
  },

  setStatus: (status: GameState['status']) => {
    set({ status });
  },

  loadBestTime: () => {
    const bestTime = localStorage.getItem('rubiksCubeBestTime');
    if (bestTime) {
      set({ bestTime: parseFloat(bestTime) });
    }
  },

  saveBestTime: (time: number) => {
    const currentBest = localStorage.getItem('rubiksCubeBestTime');
    if (!currentBest || time < parseFloat(currentBest)) {
      localStorage.setItem('rubiksCubeBestTime', time.toString());
      set({ bestTime: time });
    }
  },
}));

function rotateFace(cubies: CubeState['cubies'], face: Face, direction: Direction): CubeState['cubies'] {
  return cubies.map((cubie) => {
    const [x, y, z] = cubie.position;
    let isOnFace = false;
    
    if (face === 'U' && y === 1) isOnFace = true;
    else if (face === 'D' && y === -1) isOnFace = true;
    else if (face === 'R' && x === 1) isOnFace = true;
    else if (face === 'L' && x === -1) isOnFace = true;
    else if (face === 'F' && z === 1) isOnFace = true;
    else if (face === 'B' && z === -1) isOnFace = true;
    else if (face === 'E' && y === 0) isOnFace = true;
    else if (face === 'M' && x === 0) isOnFace = true;
    else if (face === 'S' && z === 0) isOnFace = true;

    if (!isOnFace) return cubie;

    const newPosition = rotatePosition([x, y, z], face, direction);
    const newColors = rotateColors(cubie.colors, face, direction);

    return {
      ...cubie,
      position: newPosition,
      colors: newColors,
    };
  });
}

function rotatePosition(position: [number, number, number], face: Face, direction: Direction): [number, number, number] {
  const [x, y, z] = position;
  const clockwise = direction === 'clockwise';

  switch (face) {
    case 'U':
      return clockwise ? [z, y, -x] : [-z, y, x];
    case 'D':
      return clockwise ? [-z, y, x] : [z, y, -x];
    case 'R':
      return clockwise ? [x, z, -y] : [x, -z, y];
    case 'L':
      return clockwise ? [x, -z, y] : [x, z, -y];
    case 'F':
      return clockwise ? [y, -x, z] : [-y, x, z];
    case 'B':
      return clockwise ? [-y, x, z] : [y, -x, z];
    case 'E':
      return clockwise ? [z, y, -x] : [-z, y, x];
    case 'M':
      return clockwise ? [x, z, -y] : [x, -z, y];
    case 'S':
      return clockwise ? [y, -x, z] : [-y, x, z];
    default:
      return position;
  }
}

function rotateColors(colors: CubeState['cubies'][0]['colors'], face: Face, direction: Direction): CubeState['cubies'][0]['colors'] {
  const { top, bottom, left, right, front, back } = colors;
  const clockwise = direction === 'clockwise';

  switch (face) {
    case 'U':
      return clockwise 
        ? { ...colors, front: left, left: back, back: right, right: front }
        : { ...colors, front: right, right: back, back: left, left: front };
    case 'D':
      return clockwise 
        ? { ...colors, front: right, right: back, back: left, left: front }
        : { ...colors, front: left, left: back, back: right, right: front };
    case 'R':
      return clockwise 
        ? { ...colors, top: front, front: bottom, bottom: back, back: top }
        : { ...colors, top: back, back: bottom, bottom: front, front: top };
    case 'L':
      return clockwise 
        ? { ...colors, top: back, back: bottom, bottom: front, front: top }
        : { ...colors, top: front, front: bottom, bottom: back, back: top };
    case 'F':
      return clockwise 
        ? { ...colors, top: left, right: top, bottom: right, left: bottom }
        : { ...colors, top: right, right: bottom, bottom: left, left: top };
    case 'B':
      return clockwise 
        ? { ...colors, top: right, right: bottom, bottom: left, left: top }
        : { ...colors, top: left, left: bottom, bottom: right, right: top };
    case 'E':
      return clockwise 
        ? { ...colors, front: left, left: back, back: right, right: front }
        : { ...colors, front: right, right: back, back: left, left: front };
    case 'M':
      return clockwise 
        ? { ...colors, top: front, front: bottom, bottom: back, back: top }
        : { ...colors, top: back, back: bottom, bottom: front, front: top };
    case 'S':
      return clockwise 
        ? { ...colors, top: left, right: top, bottom: right, left: bottom }
        : { ...colors, top: right, right: bottom, bottom: left, left: top };
    default:
      return colors;
  }
}

function performScramble(cubies: CubeState['cubies']): CubeState['cubies'] {
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  const directions: Direction[] = ['clockwise', 'counterclockwise'];
  let result = [...cubies];
  
  const scrambleLength = 15 + Math.floor(Math.random() * 11);
  
  for (let i = 0; i < scrambleLength; i++) {
    const face = faces[Math.floor(Math.random() * faces.length)];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    result = rotateFace(result, face, direction);
  }
  
  return result;
}
