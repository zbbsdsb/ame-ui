import React from 'react';
import { ChevronDown } from 'lucide-react';

interface PanelHeaderProps {
  title: string;
  icon: React.ElementType;
  extra?: React.ReactNode;
}

export const PanelHeader = ({ title, icon: Icon, extra }: PanelHeaderProps) => (
  <div className="h-8 border-b border-ame-border flex items-center px-2 justify-between bg-slate-900/20">
    <div className="flex items-center gap-2">
      <Icon className="w-3 h-3 text-slate-400" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</span>
    </div>
    {extra || <ChevronDown className="w-3 h-3 text-slate-600" />}
  </div>
);
