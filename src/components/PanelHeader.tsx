import React from 'react';
import { ChevronDown } from 'lucide-react';

interface PanelHeaderProps {
  title: string;
  icon: React.ElementType;
  accent?: string;
  extra?: React.ReactNode;
}

export const PanelHeader = ({ title, icon: Icon, accent, extra }: PanelHeaderProps) => (
  <div className="h-9 border-b border-ame-border flex items-center px-3 justify-between bg-ame-panel-bg/40 backdrop-blur-md relative overflow-hidden group">
    {/* Animated background detail */}
    <div 
      className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" 
      style={{ backgroundImage: `linear-gradient(90deg, transparent, ${accent || 'var(--ame-accent)'}33, transparent)` }}
    />
    
    <div className="flex items-center gap-2.5 relative z-10">
      <div className="p-1 bg-ame-bg border border-ame-border/40">
        <Icon className="w-3 h-3 opacity-70" style={{ color: accent || 'var(--ame-accent)' }} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ame-text/80 leading-none">{title}</span>
        <div className="h-[1px] w-4 mt-1" style={{ backgroundColor: `${accent || 'var(--ame-accent)'}4d` }} />
      </div>
    </div>
    <div className="relative z-10">
      {extra || <ChevronDown className="w-3 h-3 text-ame-muted/40" />}
    </div>
  </div>
);
