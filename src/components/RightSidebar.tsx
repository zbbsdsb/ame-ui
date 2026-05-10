import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings2, 
  BrainCircuit, 
  Terminal, 
  Activity,
  ChevronRight,
  Database
} from 'lucide-react';
import { useEngineStore } from '../store/useEngineStore';
import { Inspector } from './Inspector';
import { AICopilot } from './AICopilot';

export const RightSidebar = () => {
  const { 
    rightSidebarTab: activeTab, 
    setRightSidebarTab: setActiveTab,
    isWorkflowRunning,
    executingNodeIds,
    workflowNodes,
    workflowEdges
  } = useEngineStore();
  
  const tabs = [
    { id: 'PROPERTIES', icon: Settings2, label: 'Prop' },
    { id: 'AI_COPILOT', icon: BrainCircuit, label: 'Copilot' },
    { id: 'DIAGNOSTICS', icon: Activity, label: 'Diag' },
  ];

  return (
    <div className="w-80 h-full flex flex-col bg-ame-bg border-l border-ame-border relative">
      {/* Industrial Tab Switcher */}
      <div className="flex bg-ame-panel-bg/20 border-b border-ame-border p-1 gap-1">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex-1 flex items-center justify-center gap-1.5 py-1.5 border transition-all relative group
                ${isActive 
                  ? 'bg-ame-accent/10 border-ame-accent/50 text-ame-accent shadow-[0_0_10px_rgba(167,243,208,0.05)]' 
                  : 'bg-transparent border-transparent text-ame-muted hover:border-ame-border/40 hover:text-ame-text'
                }
              `}
            >
              <Icon className={`w-3 h-3 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-[9px] font-bold font-mono tracking-tighter uppercase">{tab.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-[1px] bg-ame-accent shadow-[0_0_5px_rgba(167,243,208,0.5)]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'PROPERTIES' && (
            <motion.div
              key="properties"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <Inspector />
            </motion.div>
          )}

          {activeTab === 'AI_COPILOT' && (
            <motion.div
              key="copilot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="h-full border-0"
            >
              <AICopilot />
            </motion.div>
          )}

          {activeTab === 'DIAGNOSTICS' && (
            <motion.div
              key="diagnostics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="h-full p-4 p-space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-ame-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest">System Diagnostics</span>
              </div>
              
              <div className="space-y-3">
                {[
                  { label: 'Neural Throughput', value: '1.24 GB/s', color: 'text-ame-accent' },
                  { label: 'Spatial Buffer', value: '84%', color: 'text-ame-text' },
                  { label: 'Nodes Active', value: `${executingNodeIds.size}/${workflowNodes.length}`, color: isWorkflowRunning ? 'text-ame-accent' : 'text-ame-muted' },
                  { label: 'Compute Latency', value: isWorkflowRunning ? '240ms' : '0.0ms', color: isWorkflowRunning ? 'text-ame-accent' : 'text-ame-muted' },
                ].map(stat => (
                  <div key={stat.label} className="ame-panel p-2 flex justify-between items-center bg-ame-bg/40">
                    <span className="ame-label text-[8px] uppercase">{stat.label}</span>
                    <span className={`font-mono text-[10px] ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="ame-label mb-2 text-[8px] uppercase opacity-50">Local Pipeline Status</div>
                <div className="space-y-1">
                  {['Buffer_01', 'Buffer_02', 'Lidar_Sync', 'Depth_Map'].map(item => (
                    <div key={item} className="flex items-center justify-between text-[9px] font-mono p-1 border-b border-ame-border/20">
                      <span className="text-ame-muted">{item}</span>
                      <span className="text-emerald-500/80">OK</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Industrial Bottom Info */}
      <div className="h-6 border-t border-ame-border bg-ame-panel-bg flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <Database className="w-2.5 h-2.5 text-ame-muted" />
          <span className="text-[8px] font-mono text-ame-muted uppercase">RT_DATA_LINK: ESTABLISHED</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-mono text-emerald-500">READY</span>
        </div>
      </div>
    </div>
  );
};
