import { useCubeStore } from '../../store/cubeStore';
import { Button } from './Button';
import { Shuffle, RotateCcw, Unlock, Lock } from 'lucide-react';

export function ActionButtons() {
  const { 
    scramble, 
    reset, 
    status,
    enableCameraControls,
    toggleCameraControls
  } = useCubeStore();
  
  const handleScramble = () => {
    scramble();
  };
  
  const handleReset = () => {
    reset();
  };
  
  return (
    <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
      <Button
        variant="primary"
        size="md"
        onClick={handleScramble}
        disabled={status === 'solved'}
        title="打乱魔方"
      >
        <Shuffle className="w-5 h-5" />
        <span>打乱</span>
      </Button>
      
      <Button
        variant="ghost"
        size="md"
        onClick={handleReset}
        title="重置"
      >
        <RotateCcw className="w-5 h-5" />
        <span>重置</span>
      </Button>
      
      <Button
        variant={enableCameraControls ? "ghost" : "secondary"}
        size="md"
        onClick={toggleCameraControls}
        title={enableCameraControls ? "锁定视角" : "解锁视角"}
      >
        {enableCameraControls ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        <span>{enableCameraControls ? "视角" : "固定"}</span>
      </Button>
    </div>
  );
}
