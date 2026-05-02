import React from 'react';

export const Viewport = () => {
  return (
    <div className="relative h-full bg-[#020202] overflow-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#1E293B 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} 
      />
      
      <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center">
        <div className="text-slate-900 text-[120px] font-bold tracking-tighter select-none opacity-20 leading-none">AME</div>
        <div className="font-mono text-[10px] text-ame-accent tracking-[0.2em] mt-[-30px] select-none uppercase">RENDERING ACTIVE: 3.2M POINTS</div>
      </div>
      
      {/* Viewport HUD */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
        <div className="bg-black/80 border border-ame-border px-2 py-1 font-mono text-[10px] uppercase text-slate-400">Camera: Perspective</div>
        <div className="bg-black/80 border border-ame-border px-2 py-1 font-mono text-[10px] uppercase text-slate-400">Shading: Gaussian Splat</div>
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <div className="w-24 h-24 border border-ame-border border-dashed flex items-center justify-center">
          <span className="font-mono text-[10px] text-slate-600">PERSPECTIVE_GIZMO</span>
        </div>
      </div>
    </div>
  );
};
