import { useEffect } from 'react';
import { useCubeStore } from '../../store/cubeStore';
import { formatTime } from '../../utils/validation';
import { Timer, Footprints, Trophy } from 'lucide-react';

export function InfoPanel() {
  const { 
    elapsedTime, 
    moveCount, 
    bestTime, 
    isPlaying,
    isScrambled,
    isSolved,
    status,
    updateTimer,
    loadBestTime,
  } = useCubeStore();
  
  useEffect(() => {
    loadBestTime();
  }, [loadBestTime]);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying && status === 'playing') {
      interval = window.setInterval(() => {
        const state = useCubeStore.getState();
        if (state.startTime) {
          const elapsed = (Date.now() - state.startTime) / 1000;
          updateTimer(elapsed);
        }
      }, 10);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, status, updateTimer]);
  
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-5 border border-white/10">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {/* 时间 */}
        <div className="text-center bg-white/5 rounded-lg p-3">
          <div className="flex items-center justify-center gap-1 text-white/60 text-xs mb-1">
            <Timer className="w-3.5 h-3.5" />
            <span className="font-medium">时间</span>
          </div>
          <div className="text-xl md:text-2xl font-mono font-bold text-white">
            {formatTime(elapsedTime)}
          </div>
        </div>
        
        {/* 步数 */}
        <div className="text-center bg-white/5 rounded-lg p-3">
          <div className="flex items-center justify-center gap-1 text-white/60 text-xs mb-1">
            <Footprints className="w-3.5 h-3.5" />
            <span className="font-medium">步数</span>
          </div>
          <div className="text-xl md:text-2xl font-mono font-bold text-white">
            {moveCount}
          </div>
        </div>
        
        {/* 最佳 */}
        <div className="text-center bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-3 border border-yellow-500/20">
          <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span className="font-medium">最佳</span>
          </div>
          <div className="text-xl md:text-2xl font-mono font-bold text-yellow-400">
            {bestTime ? formatTime(bestTime) : '--'}
          </div>
        </div>
      </div>
    </div>
  );
}
