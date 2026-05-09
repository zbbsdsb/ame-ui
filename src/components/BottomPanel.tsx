import React, { useState } from 'react';
import { Terminal, Cpu, Radio, GitBranch } from 'lucide-react';
import { Console } from './Console';
import { ModelRouterDashboard } from './ModelRouterDashboard';
import { SensorBridgeDashboard } from './SensorBridgeDashboard';
import { StudioCanvas } from './StudioCanvas';

export const BottomPanel = () => {
  const [activeTab, setActiveTab] = useState<'CONSOLE' | 'MODELS' | 'SENSORS' | 'STUDIO'>('CONSOLE');

  return (
    <div className="flex flex-col h-full bg-ame-bg">
      <div className="flex bg-ame-panel-bg border-b border-ame-border">
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
        <TabButton 
          active={activeTab === 'STUDIO'} 
          onClick={() => setActiveTab('STUDIO')} 
          icon={GitBranch} 
          label="Workflow Studio" 
        />
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'CONSOLE' && <Console />}
        {activeTab === 'MODELS' && <ModelRouterDashboard />}
        {activeTab === 'SENSORS' && <SensorBridgeDashboard />}
        {activeTab === 'STUDIO' && <StudioCanvas />}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 border-r border-ame-border transition-all
      ${active ? 'bg-ame-bg text-ame-accent' : 'text-ame-muted hover:text-ame-text'}
    `}
  >
    <Icon className="w-3.5 h-3.5" />
    <span className="font-mono text-[10px] uppercase font-bold tracking-widest">{label}</span>
  </button>
);
