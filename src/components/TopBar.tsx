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
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 font-mono">ADAPTER:</span>
            <div className="flex bg-slate-900 border border-ame-border p-0.5 rounded-sm">
              <button 
                onClick={() => useEngineStore.getState().switchAdapter('UNREAL')}
                className={`px-2 py-0.5 font-mono text-[9px] font-bold transition-all ${stats.activeAdapter === 'UNREAL' ? 'bg-ame-accent text-black' : 'text-slate-500 hover:text-slate-300'}`}
              >
                UNREAL
              </button>
              <button 
                onClick={() => useEngineStore.getState().switchAdapter('UNITY')}
                className={`px-2 py-0.5 font-mono text-[9px] font-bold transition-all ${stats.activeAdapter === 'UNITY' ? 'bg-ame-accent text-black' : 'text-slate-500 hover:text-slate-300'}`}
              >
                UNITY
              </button>
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
