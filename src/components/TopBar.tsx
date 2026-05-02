import React from 'react';

export const TopBar = () => (
  <header className="h-10 border-ame-border border-b flex items-center justify-between px-3 bg-black z-20">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="font-bold tracking-tighter text-sm text-white">AME ENGINE</span>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">v0.8.2-alpha</span>
      </div>
      <div className="h-4 w-px bg-slate-800"></div>
      <nav className="flex gap-4">
        <span className="text-[11px] text-slate-300 hover:text-white cursor-default">PROJECT_X_SCAN_01</span>
        <span className="text-[11px] text-slate-500">/</span>
        <span className="text-[11px] text-slate-300">SCENE_MAIN</span>
      </nav>
    </div>
    
    <div className="flex items-center gap-4">
      <div className="flex gap-3 font-mono text-[10px] uppercase">
        <div className="flex gap-1"><span className="text-slate-500">FPS</span><span className="text-ame-accent">144</span></div>
        <div className="flex gap-1"><span className="text-slate-500">GPU</span><span className="text-ame-accent">42%</span></div>
        <div className="flex gap-1"><span className="text-slate-500">MEM</span><span className="text-ame-accent">2.4GB</span></div>
      </div>
      <div className="h-2 w-2 bg-ame-accent"></div>
    </div>
  </header>
);
