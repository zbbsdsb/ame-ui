import React from 'react';
import { motion } from 'motion/react';
import { Settings2, Activity, Database, Zap, X } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { useEngineStore } from '../store/useEngineStore';
import { Facet } from '../types';

export const Inspector = () => {
  const { nodes, selectedNodeId, updateNode, workflowNodes, selectedWorkflowNodeId, updateWorkflowNode, deleteWorkflowNode } = useEngineStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedWorkflowNode = workflowNodes.find(n => n.id === selectedWorkflowNodeId);

  if (!selectedNode && !selectedWorkflowNode) {
    return (
      <div className="h-full flex flex-col bg-ame-bg">
        <PanelHeader title="Inspector" icon={Settings2} />
        <div className="flex-1 flex items-center justify-center font-mono text-[10px] text-ame-muted uppercase">
          No Selection
        </div>
      </div>
    );
  }

  // Node Inspector View
  if (selectedWorkflowNode) {
    return (
      <div className="h-full flex flex-col bg-ame-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, var(--ame-accent) 1px, transparent 1px)',
            backgroundSize: '24px 24px' 
          }} 
        />
        <div className="relative z-10 flex flex-col h-full">
          <PanelHeader title={`Node: ${selectedWorkflowNode.name}`} icon={Zap} />
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="ame-label mb-1 uppercase tracking-widest text-[9px]">Node ID</div>
              <div className="font-mono text-[10px] text-ame-muted bg-ame-panel-bg p-1.5 border border-ame-border break-all">{selectedWorkflowNode.id}</div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="ame-label mb-1 uppercase tracking-widest text-[9px]">Category</div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryColor(selectedWorkflowNode.category) }} />
                 <span className="font-mono text-xs text-ame-text uppercase">{selectedWorkflowNode.category || 'LOGIC'}</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="ame-label mb-3 uppercase tracking-widest text-[9px]">Properties (Mutable)</div>
              <div className="space-y-4">
                {Object.entries(selectedWorkflowNode.data).map(([key, value]) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-mono text-ame-muted uppercase">{key}</span>
                      <span className="text-[10px] font-mono text-ame-accent">{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
                    </div>
                    {typeof value === 'number' ? (
                       <input 
                        type="range" 
                        min="0" max="10" step="0.1"
                        value={value}
                        onChange={(e) => updateWorkflowNode(selectedWorkflowNode.id, { data: { ...selectedWorkflowNode.data, [key]: parseFloat(e.target.value) }})}
                        className="w-full h-1 bg-slate-900 appearance-none cursor-pointer accent-ame-accent"
                      />
                    ) : typeof value === 'boolean' ? (
                       <button 
                        onClick={() => updateWorkflowNode(selectedWorkflowNode.id, { data: { ...selectedWorkflowNode.data, [key]: !value }})}
                        className="w-full py-1.5 border border-ame-border bg-ame-panel-bg text-[10px] font-mono text-ame-text uppercase hover:border-ame-accent transition-colors"
                      >
                        {String(value)}
                      </button>
                    ) : (
                      <input 
                        type="text"
                        defaultValue={String(value)}
                        onBlur={(e) => updateWorkflowNode(selectedWorkflowNode.id, { data: { ...selectedWorkflowNode.data, [key]: e.target.value }})}
                        className="w-full bg-ame-bg border border-ame-border p-1.5 text-[10px] font-mono text-ame-text outline-none focus:border-ame-accent"
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pt-4 border-t border-ame-border/30">
              <button 
                onClick={() => deleteWorkflowNode(selectedWorkflowNode.id)}
                className="w-full py-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-[10px] font-bold font-mono uppercase hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <X className="w-3 h-3" />
                Destroy Node
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pt-2">
              <div className="ame-label mb-2 uppercase tracking-widest text-[9px]">Port Interface</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[8px] text-ame-muted font-bold block mb-1 uppercase">Inputs</span>
                  {selectedWorkflowNode.inputs.map(p => (
                    <div key={p.id} className="text-[9px] font-mono text-blue-400 bg-blue-400/5 border border-blue-400/20 px-1.5 py-1">[{p.dataType}] {p.name}</div>
                  ))}
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] text-ame-muted font-bold block mb-1 uppercase">Outputs</span>
                  {selectedWorkflowNode.outputs.map(p => (
                    <div key={p.id} className="text-[9px] font-mono text-emerald-400 bg-emerald-400/5 border border-emerald-400/20 px-1.5 py-1">[{p.dataType}] {p.name}</div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const updateFacetData = (facetType: string, field: string, value: any) => {
    const newFacets = selectedNode.facets.map(f => {
      if (f.type === facetType) {
        return { ...f, data: { ...f.data, [field]: value }, status: 'DIRTY' as const };
      }
      return f;
    });
    updateNode(selectedNode.id, { facets: newFacets });
  };

  return (
    <div className="h-full flex flex-col bg-ame-bg relative overflow-hidden">
      {/* Background Blueprint Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, var(--ame-accent) 1px, transparent 1px)',
          backgroundSize: '24px 24px' 
        }} 
      />
      
      <div className="relative z-10 flex flex-col h-full">
        <PanelHeader title={`Inspector: ${selectedNode.name}`} icon={Settings2} />
        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        
        {/* Metaclass Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={selectedNode.id + '_header'}
          className="px-3 py-4 border-b border-ame-border bg-ame-panel-bg/10"
        >
          <div className="ame-label mb-1">Entity Identity (AEID)</div>
          <div className="font-mono text-xs text-ame-text mb-3 break-all">{selectedNode.id}</div>
          <div className="flex gap-2">
            {selectedNode.facets.map(f => (
              <div key={f.type} className="px-1.5 py-0.5 border border-ame-border bg-ame-panel-bg font-mono text-[8px] text-ame-muted uppercase">
                {f.type}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Facet Sections */}
        {selectedNode.facets.map((facet, index) => (
          <motion.div
            key={selectedNode.id + facet.type}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <FacetPanel 
              facet={facet} 
              onUpdate={(field, val) => updateFacetData(facet.type, field, val)} 
            />
          </motion.div>
        ))}

        {/* Target Overrides Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3 py-6 border-t border-ame-border mt-4"
        >
          <div className="ame-label mb-3 text-current opacity-40 font-bold uppercase tracking-widest text-[9px]">Target Exporter Overrides</div>
          <div className="space-y-1.5">
            {['UE5_Livelink', 'Blender_USD'].map((target) => (
              <div key={target} className="flex items-center justify-between p-2 border border-ame-border/10 bg-ame-panel-bg/20 group hover:border-ame-accent/20 transition-all cursor-default">
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-ame-muted group-hover:text-ame-text transition-colors uppercase tracking-tight">{target}</span>
                  <span className="text-[8px] text-ame-muted/60 font-mono tracking-tighter">AMAR_INHERITED</span>
                </div>
                <button className="text-[8px] font-bold text-ame-accent opacity-0 group-hover:opacity-100 uppercase tracking-widest transition-opacity px-2 py-0.5 border border-ame-accent/20 hover:bg-ame-accent hover:text-black">
                  CMD
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </div>
  );
};

const FacetPanel = ({ facet, onUpdate }: { facet: Facet, onUpdate: (field: string, val: any) => void, key?: React.Key }) => {
  const { routing } = useEngineStore();
  const isRoutingActive = routing.active && routing.targetEntity && facet.type !== 'Provenance';

  return (
    <div className="border-b border-ame-border relative">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent pointer-events-none" />
      {isRoutingActive && (
        <div className="absolute inset-0 bg-ame-accent/[0.04] pointer-events-none overflow-hidden">
          <div className="w-full h-px bg-ame-accent/30 ame-scan-line blur-[1.5px]" />
        </div>
      )}
      <div className="px-3 py-2 bg-slate-900/30 flex justify-between items-center group relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-sm bg-ame-accent/10">
            <Database className="w-3 h-3 text-ame-accent" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-ame-text/80">{facet.type} Facet</span>
        </div>
        <div className={`px-1.5 py-0.5 font-mono text-[8px] border backdrop-blur-sm ${
          facet.status === 'SYNCHRONIZED' ? 'border-ame-accent/40 text-ame-accent ame-glow' : 
          facet.status === 'DIRTY' ? 'border-yellow-500/40 text-yellow-500' : 'border-red-500/40 text-red-500'
        }`}>
          {facet.status}
        </div>
      </div>
      
      <div className="p-3 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-slate-500 font-mono uppercase">Schema:</span>
          <span className="text-[9px] text-slate-400 font-mono italic">{facet.schema}</span>
        </div>

        {/* Visual Facet Inputs */}
        {facet.type === 'Visual' && facet.data.position && (
          <div className="space-y-2">
             <TransformRow label="POS" values={facet.data.position} onChange={(v) => onUpdate('position', v)} />
             <TransformRow label="ROT" values={facet.data.rotation} onChange={(v) => onUpdate('rotation', v)} />
             {facet.data.pointScale !== undefined && (
               <div className="mt-4">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-[10px] text-slate-400 uppercase font-mono">Point Scale</span>
                   <span className="text-ame-accent font-mono text-[10px]">{facet.data.pointScale.toFixed(3)}</span>
                 </div>
                 <input 
                   type="range" 
                   min="0" max="2" step="0.001"
                   value={facet.data.pointScale}
                   onChange={(e) => onUpdate('pointScale', parseFloat(e.target.value))}
                   className="w-full h-1 bg-slate-900 appearance-none cursor-pointer accent-ame-accent"
                 />
               </div>
             )}
          </div>
        )}

        {/* Semantic Facet */}
        {facet.type === 'Semantic' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-ame-panel-bg p-1 border border-ame-border">
              <span className="text-[9px] text-ame-muted font-mono">CLASS</span>
              <span className="text-[10px] text-ame-text font-mono uppercase">{facet.data.class}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {facet.data.tags?.map((tag: string) => (
                <span key={tag} className="px-1 border border-dashed border-ame-border text-[9px] text-ame-muted">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Sensor Facet */}
        {facet.type === 'Sensor' && (
           <div className="bg-ame-panel-bg p-2 border border-ame-border border-l-2 border-l-ame-accent">
             <div className="flex items-center gap-2 mb-1">
               <Activity className="w-3 h-3 text-ame-accent animate-pulse" />
               <span className="text-[10px] text-ame-text font-mono uppercase">Streaming active</span>
             </div>
             <div className="text-[9px] text-ame-muted font-mono transition-colors">Topic: {facet.data.topic}</div>
             <div className="text-[9px] text-ame-muted font-mono transition-colors">Latency: 12ms</div>
           </div>
        )}
      </div>
    </div>
  );
};

const TransformRow = ({ label, values, onChange }: { label: string, values: number[], onChange: (v: number[]) => void }) => {
  const handleChange = (index: number, val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const next = [...values];
      next[index] = num;
      onChange(next);
    }
  };

  return (
    <div className="grid grid-cols-4 items-center gap-2 font-mono text-[10px]">
      <span className="text-ame-muted uppercase font-bold">{label}</span>
      <div className="col-span-3 grid grid-cols-3 gap-1">
        {values.map((v, i) => (
          <div key={i} className="border border-ame-border px-1 bg-ame-panel-bg flex justify-between gap-1 group/input">
            <span className="text-ame-muted/40 group-focus-within/input:text-ame-accent">{['X', 'Y', 'Z'][i]}</span>
            <input 
              type="text"
              className="bg-transparent border-none outline-none text-ame-text w-full text-right"
              defaultValue={v.toFixed(2)}
              onBlur={(e) => handleChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'SENSOR': return '#3b82f6';
    case 'LOGIC': return '#a855f7';
    case 'MATH': return '#fb923c';
    case 'ACTION': return '#f43f5e';
    case 'OUTPUT': return '#10b981';
    case 'AI': return '#DEFF9A';
    default: return '#64748b';
  }
};
