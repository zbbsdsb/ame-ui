import React from 'react';
import { useEngineStore } from '../store/useEngineStore';

export const TopBar = () => {
  const stats = useEngineStore((state) => state.stats);

  return (
    <header className="h-10 border-ame-border border-b flex items-center justify-between px-3 bg-black z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tighter text-sm text-white">AME ENGINE</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stats.version}</span>
        </div>
        <div className="h-4 w-px bg-slate-800"></div>
        <nav className="flex gap-4">
          <div className="flex items-center gap-2 group/nav relative">
            <span className="text-[11px] text-slate-500 uppercase font-mono tracking-tighter">Project</span>
            <span className="text-[11px] text-slate-300 hover:text-white cursor-default">SCAN_01</span>
          </div>
          <div className="h-4 w-px bg-slate-800"></div>
          <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest leading-none mb-1">AMAR Master</span>
              <div className="flex items-center gap-1.5 leading-none">
                <div className="w-1 h-1 rounded-full bg-ame-accent shadow-[0_0_8px_#A7F3D0]" />
                <span className="text-[10px] font-bold text-white font-mono tracking-tighter">THREAD_0_OK</span>
              </div>
            </div>
            
            <div className="h-6 w-px bg-slate-800"></div>

            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest leading-none mb-1">Active Exporters</span>
              <div className="flex gap-1">
                {['UE5_LIVELINK', 'UNITY_SDK', 'USD_SPOOL'].map(target => (
                  <div key={target} className="px-1.5 py-0.5 border border-ame-border/40 bg-slate-900/40 text-[8px] font-mono text-ame-accent/80 hover:text-ame-accent transition-colors cursor-default">
                    {target}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex gap-3 font-mono text-[10px] uppercase">
          <div className="flex gap-1"><span className="text-slate-500">FPS</span><span className="text-ame-accent">{stats.fps}</span></div>
          <div className="flex gap-1"><span className="text-slate-500">GPU</span><span className="text-ame-accent">{stats.gpuUsage}%</span></div>
          <div className="flex gap-1"><span className="text-slate-500">MEM</span><span className="text-ame-accent">{stats.memory}</span></div>
        </div>
        <div className={`h-2 w-2 ${stats.status === 'READY' ? 'bg-ame-accent' : 'bg-red-500 animate-pulse'}`}></div>
      </div>
    </header>
  );
};
