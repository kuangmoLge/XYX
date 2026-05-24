import { Scene } from '../Cube/Scene';
import { GameUI } from '../GameUI/GameUI';
import { Celebration } from '../Effects/Celebration';
import { ErrorBoundary } from '../ErrorBoundary';
import { InfoPanel } from '../GameUI/InfoPanel';
import { ActionButtons } from '../GameUI/ActionButtons';
import { ControlPanel } from '../GameUI/ControlPanel';
import { useCubeStore } from '../../store/cubeStore';
import { useDeviceInfo } from '../../hooks/useResponsive';
import { motion } from 'framer-motion';
import { Cpu, Info } from 'lucide-react';

export function GameLayout() {
  const { status } = useCubeStore();
  const { isMobile, isLandscape } = useDeviceInfo();
  
  return (
    <div className="h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex flex-col overflow-hidden">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="p-3 md:p-4 flex-shrink-0"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 md:gap-3">
            <Cpu className="w-5 h-5 md:w-7 md:h-7 text-purple-400" />
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              3D魔方达人
            </h1>
          </div>
          <div className="text-xs md:text-sm text-white/60 font-medium">
            {status === 'idle' && '🎯 准备开始'}
            {status === 'scrambled' && '⏱️ 已打乱 - 点击开始'}
            {status === 'playing' && '🔥 还原中...'}
            {status === 'solved' && '🎉 已还原！'}
          </div>
        </div>
      </motion.header>
      
      <main className="flex-1 flex flex-col lg:flex-row items-stretch gap-3 md:gap-5 p-2 md:p-4 w-full h-full">
        {/* 3D魔方区域 - 桌面端占大部分空间 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`
            ${isMobile && !isLandscape 
              ? 'w-full flex-1 min-h-[300px]' 
              : isMobile 
                ? 'w-1/2 min-h-[350px]' 
                : 'flex-[3] min-h-[500px]'
            }
          `}
        >
          <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <ErrorBoundary>
              <Scene />
            </ErrorBoundary>
          </div>
        </motion.div>
        
        {/* 控制面板区域 */}
        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 50 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className={`
            ${isMobile && !isLandscape 
              ? 'w-full flex-shrink-0' 
              : isMobile 
                ? 'w-1/2 flex flex-col' 
                : 'flex-[1] lg:max-w-[360px] flex flex-col gap-3'
            }
          `}
        >
          <div className="space-y-3">
            <InfoPanel />
            <ActionButtons />
            <ControlPanel />
          </div>
        </motion.div>
      </main>
      
      <footer className="p-2 md:p-3 text-center text-white/30 text-xs flex-shrink-0">
        <div className="flex items-center justify-center gap-1">
          <Info className="w-3 h-3" />
          <span>
            {isMobile 
              ? '触摸拖动旋转视角 · 点击按钮旋转魔方 · 支持键盘操作' 
              : '鼠标拖动旋转视角 · 点击按钮旋转魔方 · 支持键盘快捷键 (i/k/j/l/u/o)'
            }
          </span>
        </div>
      </footer>
      
      <Celebration />
    </div>
  );
}
