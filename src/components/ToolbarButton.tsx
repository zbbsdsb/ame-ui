import React from 'react';

interface ToolbarButtonProps {
  icon: any;
  active?: boolean;
  tip: string;
  onClick?: () => void;
}

export const ToolbarButton = ({ icon: Icon, active, tip, onClick }: ToolbarButtonProps) => (
  <button 
    onClick={onClick}
    className={`
      w-8 h-8 flex items-center justify-center border transition-all duration-150 relative group
      ${active ? 'bg-ame-accent border-ame-accent text-black shadow-[0_0_10px_rgba(167,243,208,0.5)]' : 'bg-black border-ame-border text-slate-500 hover:border-ame-accent hover:text-white'}
    `}
  >
    <Icon className="w-4 h-4" />
    <div className="absolute right-full mr-2 px-2 py-1 bg-black border border-ame-border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
      <span className="font-mono text-[9px] uppercase tracking-widest text-white whitespace-nowrap">{tip}</span>
    </div>
  </button>
);
