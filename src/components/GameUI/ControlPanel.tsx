import { useCubeStore } from '../../store/cubeStore';
import { CUBE_COLORS, type Face } from '../../types/cube';
import { Button } from './Button';
import { RotateCcw, RotateCw } from 'lucide-react';
import { useEffect } from 'react';

interface FaceButtonConfig {
  face: Face;
  label: string;
  color: string;
  key: string;
}

const OUTER_FACE_BUTTONS: FaceButtonConfig[] = [
  { face: 'U', label: '上', color: CUBE_COLORS.U, key: 'i' },
  { face: 'D', label: '下', color: CUBE_COLORS.D, key: 'k' },
  { face: 'L', label: '左', color: CUBE_COLORS.L, key: 'j' },
  { face: 'R', label: '右', color: CUBE_COLORS.R, key: 'l' },
  { face: 'F', label: '前', color: CUBE_COLORS.F, key: 'u' },
  { face: 'B', label: '后', color: CUBE_COLORS.B, key: 'o' },
];

const MIDDLE_FACE_BUTTONS: FaceButtonConfig[] = [
  { face: 'E', label: 'E层', color: '#888888', key: 'e' },
  { face: 'M', label: 'M层', color: '#888888', key: 'm' },
  { face: 'S', label: 'S层', color: '#888888', key: 's' },
];

export function ControlPanel() {
  const { rotateFace, isSolved, status } = useCubeStore();
  const isDisabled = isSolved || status === 'solved';
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDisabled) return;
      
      const key = e.key.toLowerCase();
      const shiftPressed = e.shiftKey;
      
      const allButtons = [...OUTER_FACE_BUTTONS, ...MIDDLE_FACE_BUTTONS];
      const button = allButtons.find(b => b.key === key);
      if (button) {
        rotateFace(button.face, shiftPressed ? 'counterclockwise' : 'clockwise');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDisabled, rotateFace]);
  
  const handleRotate = (face: Face, direction: 'clockwise' | 'counterclockwise') => {
    if (!isDisabled) {
      rotateFace(face, direction);
    }
  };
  
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/10">
      {/* 外层按钮 */}
      <div className="text-center mb-2">
        <div className="text-white/60 text-xs md:text-sm">
          <span className="hidden md:inline">点击按钮旋转 · </span>
          <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">外层: i/k/j/l/u/o</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
        {OUTER_FACE_BUTTONS.map(({ face, label, color, key }) => (
          <div key={face} className="flex flex-col gap-1.5">
            {/* 面标签 */}
            <div 
              className="text-center text-xs font-bold py-1 rounded-md border"
              style={{ 
                backgroundColor: `${color}20`,
                borderColor: `${color}40`,
                color: color
              }}
            >
              {label}面 · {key}
            </div>
            
            {/* 按钮行 */}
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="md"
                onClick={() => handleRotate(face, 'clockwise')}
                disabled={isDisabled}
                className="flex-1 min-h-[40px] md:min-h-[44px] py-2 rounded-lg border-2 border-transparent hover:border-current"
                style={{
                  backgroundColor: `${color}15`,
                  color: color
                }}
                title={`${key} 顺时针`}
              >
                <RotateCw className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="md"
                onClick={() => handleRotate(face, 'counterclockwise')}
                disabled={isDisabled}
                className="flex-1 min-h-[40px] md:min-h-[44px] py-2 rounded-lg border-2 border-transparent hover:border-current"
                style={{
                  backgroundColor: `${color}15`,
                  color: color
                }}
                title={`Shift+${key} 逆时针`}
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 中间层按钮 */}
      <div className="text-center mb-2">
        <div className="text-white/60 text-xs md:text-sm">
          <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">中间层: e/m/s</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {MIDDLE_FACE_BUTTONS.map(({ face, label, color, key }) => (
          <div key={face} className="flex flex-col gap-1.5">
            {/* 面标签 */}
            <div 
              className="text-center text-xs font-bold py-1 rounded-md border"
              style={{ 
                backgroundColor: `${color}20`,
                borderColor: `${color}40`,
                color: color
              }}
            >
              {label} · {key}
            </div>
            
            {/* 按钮行 */}
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="md"
                onClick={() => handleRotate(face, 'clockwise')}
                disabled={isDisabled}
                className="flex-1 min-h-[40px] md:min-h-[44px] py-2 rounded-lg border-2 border-transparent hover:border-current"
                style={{
                  backgroundColor: `${color}15`,
                  color: color
                }}
                title={`${key} 顺时针`}
              >
                <RotateCw className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="md"
                onClick={() => handleRotate(face, 'counterclockwise')}
                disabled={isDisabled}
                className="flex-1 min-h-[40px] md:min-h-[44px] py-2 rounded-lg border-2 border-transparent hover:border-current"
                style={{
                  backgroundColor: `${color}15`,
                  color: color
                }}
                title={`Shift+${key} 逆时针`}
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
