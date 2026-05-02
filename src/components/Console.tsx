import React from 'react';
import { Terminal } from 'lucide-react';
import { PanelHeader } from './PanelHeader';

export const Console = () => {
  return (
    <div className="h-full flex flex-col bg-black">
      <PanelHeader 
        title="Console Output" 
        icon={Terminal} 
        extra={
          <div className="flex gap-2 font-mono text-[9px]">
            <span className="text-ame-accent">[6] LOGS</span>
            <span className="text-white">[0] WARNINGS</span>
            <span className="text-red-500">[0] ERRORS</span>
          </div>
        }
      />
      <div className="flex-1 p-2 font-mono text-[10px] overflow-y-auto leading-relaxed text-slate-300 no-scrollbar">
        <div className="flex gap-4">
          <span className="text-slate-600">[14:20:11]</span>
          <span className="text-ame-accent">SYSTEM:</span>
          <span>AME Engine core successfully initialized.</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-600">[14:20:12]</span>
          <span className="text-ame-accent">VULKAN:</span>
          <span>Found physical device: NVIDIA GeForce RTX 4090 (24564 MB)</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-600">[14:20:13]</span>
          <span className="text-ame-accent">RENDER:</span>
          <span>Allocating 3.2M gaussians to GPU buffers...</span>
        </div>
        <div className="flex gap-4 mt-1">
          <span className="text-ame-accent">{'>'}</span>
          <span className="text-white animate-pulse w-2 h-4 bg-white/50 block ml-1" />
        </div>
      </div>
    </div>
  );
};
