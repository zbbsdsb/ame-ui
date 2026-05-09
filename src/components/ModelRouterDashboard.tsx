import React from 'react';
import { useEngineStore, ModelEntry, InferenceLog } from '../store/useEngineStore';
import { Cpu, Globe, Lock, Zap, BarChart3, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ModelRouterDashboard = () => {
  const { models, inferenceHistory, routing, triggerInference, selectedNodeId } = useEngineStore();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-ame-bg overflow-hidden">
      <div className="flex border-b border-ame-border">
        <div className="p-4 flex-1 border-r border-ame-border">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-ame-accent" />
            <span className="ame-label">Endpoint Registry</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {models.map(model => (
              <ModelCard 
                key={model.id} 
                model={model} 
                onTrigger={() => triggerInference(model.id, selectedNodeId)} 
              />
            ))}
          </div>
        </div>

        <div className="w-[400px] p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-ame-accent" />
            <span className="ame-label">Inference Trace</span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
            <AnimatePresence initial={false}>
              {inferenceHistory.map(log => (
                <HistoryItem key={log.id} log={log} />
              ))}
            </AnimatePresence>
            {inferenceHistory.length === 0 && (
              <div className="h-full flex items-center justify-center font-mono text-[9px] text-ame-muted uppercase">
                Waiting for trace...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 bg-ame-panel-bg/20 flex items-center gap-6">
        <div className="flex items-center gap-4">
          <StatItem label="Active Router" value="AMAR-V2" />
          <StatItem label="Avg Latency" value={`${(inferenceHistory.reduce((acc, h) => acc + h.latency, 0) / (inferenceHistory.length || 1)).toFixed(0)} ms`} />
          <StatItem label="Total Tokens" value={inferenceHistory.reduce((acc, h) => acc + h.tokens, 0).toLocaleString()} />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 border border-ame-border bg-ame-panel-bg font-mono text-[10px]">
            <span className="text-ame-muted">PATH:</span>
            <span className="text-ame-accent">{routing.path}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModelCard = ({ model, onTrigger }: { model: ModelEntry, onTrigger: () => void, key?: React.Key }) => {
  const tierIcon = {
    P0: <Lock className="w-3 h-3 text-emerald-500" />,
    P1: <Globe className="w-3 h-3 text-blue-500" />,
    P2: <Zap className="w-3 h-3 text-yellow-500" />
  }[model.tier];

  return (
    <button 
      onClick={onTrigger}
      className="flex items-center justify-between p-2 bg-ame-panel-bg/50 border border-ame-border hover:border-ame-accent transition-colors group text-left"
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-ame-bg border border-ame-border group-hover:border-ame-accent transition-all">
          {tierIcon}
        </div>
        <div>
          <div className="font-mono text-[11px] text-ame-text leading-none mb-1">{model.name}</div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] text-ame-muted">[{model.tier}]</span>
            <span className="font-mono text-[8px] text-ame-muted">{model.latency}ms</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 px-1.5 py-0.5 border border-ame-border bg-ame-bg">
        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-[8px] text-ame-muted">ONLINE</span>
      </div>
    </button>
  );
};

const HistoryItem = ({ log }: { log: InferenceLog, key?: React.Key }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="p-2 border-l-2 border-ame-accent bg-ame-panel-bg border border-ame-border hover:border-ame-accent/20 transition-colors"
  >
    <div className="flex justify-between items-start mb-1">
      <span className="font-mono text-[10px] text-ame-text uppercase tracking-tighter">{log.modelId}</span>
      <span className="font-mono text-[8px] text-ame-muted">{log.timestamp}</span>
    </div>
    <div className="flex gap-3 font-mono text-[9px]">
      <span className="text-emerald-500">{log.latency.toFixed(0)} ms</span>
      <span className="text-blue-400">{log.tokens} tkns</span>
      <span className="text-slate-600 truncate flex-1 text-right">{log.routingPath}</span>
    </div>
  </motion.div>
);

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col">
    <span className="font-mono text-[8px] text-slate-600 uppercase font-bold">{label}</span>
    <span className="font-mono text-[10px] text-slate-300">{value}</span>
  </div>
);
