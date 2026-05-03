import React, { useState } from 'react';
import { Terminal, Cpu, Radio } from 'lucide-react';
import { Console } from './Console';
import { ModelRouterDashboard } from './ModelRouterDashboard';
import { SensorBridgeDashboard } from './SensorBridgeDashboard';

export const BottomPanel = () => {
  const [activeTab, setActiveTab] = useState<'CONSOLE' | 'MODELS' | 'SENSORS'>('CONSOLE');

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex bg-slate-950 border-b border-ame-border">
        <TabButton 
          active={activeTab === 'CONSOLE'} 
          onClick={() => setActiveTab('CONSOLE')} 
          icon={Terminal} 
          label="Terminal" 
        />
        <TabButton 
          active={activeTab === 'MODELS'} 
          onClick={() => setActiveTab('MODELS')} 
          icon={Cpu} 
          label="Model Router" 
        />
        <TabButton 
          active={activeTab === 'SENSORS'} 
          onClick={() => setActiveTab('SENSORS')} 
          icon={Radio} 
          label="Sensor Bridge" 
        />
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'CONSOLE' && <Console />}
        {activeTab === 'MODELS' && <ModelRouterDashboard />}
        {activeTab === 'SENSORS' && <SensorBridgeDashboard />}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 border-r border-ame-border transition-all
      ${active ? 'bg-black text-ame-accent' : 'text-slate-600 hover:text-slate-400'}
    `}
  >
    <Icon className="w-3.5 h-3.5" />
    <span className="font-mono text-[10px] uppercase font-bold tracking-widest">{label}</span>
  </button>
);
