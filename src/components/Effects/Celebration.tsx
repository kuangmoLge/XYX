import { motion, AnimatePresence } from 'framer-motion';
import { useCubeStore } from '../../store/cubeStore';
import { Button } from '../GameUI/Button';
import { Trophy } from 'lucide-react';
import { formatTime } from '../../utils/validation';

export function Celebration() {
  const { status, elapsedTime, moveCount, bestTime, reset } = useCubeStore();
  const isSolved = status === 'solved';
  
  const handlePlayAgain = () => {
    reset();
  };
  
  const isNewBest = bestTime && elapsedTime === bestTime;
  
  return (
    <AnimatePresence>
      {isSolved && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
          >
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                className="flex justify-center"
              >
                <Trophy className="w-20 h-20 text-yellow-400" />
              </motion.div>
              
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  恭喜还原成功！🎉
                </h2>
                {isNewBest && (
                  <p className="text-yellow-400 font-semibold">
                    ⭐ 新纪录！
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-white">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">用时</div>
                  <div className="text-2xl font-mono font-bold">
                    {formatTime(elapsedTime)}
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">步数</div>
                  <div className="text-2xl font-mono font-bold">
                    {moveCount}
                  </div>
                </div>
              </div>
              
              {bestTime && !isNewBest && (
                <div className="text-white/60">
                  当前最佳: <span className="text-yellow-400 font-bold">{formatTime(bestTime)}</span>
                </div>
              )}
              
              <Button
                variant="primary"
                size="lg"
                onClick={handlePlayAgain}
                className="w-full"
              >
                再来一局
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
