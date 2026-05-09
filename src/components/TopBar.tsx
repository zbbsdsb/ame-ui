import React from 'react';
import { useEngineStore, Theme } from '../store/useEngineStore';
import { Palette, Sparkles } from 'lucide-react';

const themes: { id: Theme; color: string; bg?: string }[] = [
  { id: 'EMERALD', color: '#DEFF9A' },
  { id: 'SPACE_BLUE', color: '#38BDF8' },
  { id: 'ONIX', color: '#94A3B8' },
  { id: 'SNOW', color: '#0F172A', bg: '#F8FAFC' },
  { id: 'ROSE_RED', color: '#F43F5E' },
  { id: 'OASIS_GREEN', color: '#10B981' },
];

export const TopBar = () => {
  const stats = useEngineStore((state) => state.stats);
  const { theme, setTheme, isAiCopilotOpen, setAiCopilotOpen } = useEngineStore();

  return (
    <header className="h-10 border-ame-border border-b flex items-center justify-between px-3 bg-ame-panel-bg z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tighter text-sm text-ame-text">AME ENGINE</span>
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
                <div className="w-1 h-1 rounded-full bg-ame-accent shadow-[0_0_8px_var(--ame-accent)]" />
                <span className="text-[10px] font-bold text-ame-text font-mono tracking-tighter">THREAD_0_OK</span>
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

      <div className="flex flex-col items-center">
        <span className="text-[7px] text-slate-600 font-mono tracking-[0.4em] uppercase mb-0.5">METRIC_TIME_CORE</span>
        <span className="text-[10px] font-mono font-bold text-ame-accent tabular-nums tracking-widest opacity-80">
          {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 border border-ame-border/40 bg-slate-900/40 px-2 py-1">
          <Palette className="w-3 h-3 text-slate-500" />
          <div className="flex gap-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`w-3 h-3 border border-white/10 transition-transform hover:scale-125 ${theme === t.id ? 'ring-1 ring-ame-accent ring-offset-1 ring-offset-black' : ''}`}
                style={{ backgroundColor: t.id === 'SNOW' ? '#fff' : t.color }}
                title={t.id}
              />
            ))}
          </div>
        </div>

        <button 
          onClick={() => setAiCopilotOpen(!isAiCopilotOpen)}
          className={`flex items-center gap-1.5 px-2 py-1 border transition-all ${isAiCopilotOpen ? 'bg-ame-accent/20 border-ame-accent text-ame-accent shadow-[0_0_10px_rgba(167,243,208,0.1)]' : 'bg-slate-900/40 border-ame-border/40 text-slate-500 hover:text-ame-text hover:border-ame-border'}`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAiCopilotOpen ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-bold font-mono tracking-tighter uppercase">AI Copilot</span>
        </button>

        <div className="flex gap-3 font-mono text-[10px] uppercase">
          <div className="flex gap-1"><span className="text-slate-500">FPS</span><span className="text-ame-accent">{stats.fps}</span></div>
          <div className="flex gap-1"><span className="text-slate-500">GPU</span><span className="text-ame-accent">{stats.gpuUsage}%</span></div>
          <div className="flex gap-1"><span className="text-slate-500">MEM</span><span className="text-ame-accent">{stats.memory}</span></div>
        </div>
        <div className={`h-2 w-2 ${stats.status === 'READY' ? 'bg-ame-accent shadow-[0_0_8px_var(--ame-accent)]' : 'bg-red-500 animate-pulse'}`}></div>
      </div>
    </header>
  );
};
