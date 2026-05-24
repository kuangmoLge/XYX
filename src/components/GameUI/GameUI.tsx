import { InfoPanel } from './InfoPanel';
import { ControlPanel } from './ControlPanel';
import { ActionButtons } from './ActionButtons';

export function GameUI() {
  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto px-4">
      <InfoPanel />
      
      <ActionButtons />
      
      <ControlPanel />
    </div>
  );
}
