import React from 'react';
import { Settings2, Activity, Database, Zap } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { useEngineStore } from '../store/useEngineStore';
import { Facet } from '../types';

export const Inspector = () => {
  const { nodes, selectedNodeId, updateNode } = useEngineStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col bg-black">
        <PanelHeader title="Inspector" icon={Settings2} />
        <div className="flex-1 flex items-center justify-center font-mono text-[10px] text-slate-700 uppercase">
          No Entity Selected
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
    <div className="h-full flex flex-col bg-black">
      <PanelHeader title={`Inspector: ${selectedNode.name}`} icon={Settings2} />
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        
        {/* Metaclass Header */}
        <div className="px-3 py-4 border-b border-ame-border bg-slate-900/10">
          <div className="ame-label mb-1">Entity Identity (AEID)</div>
          <div className="font-mono text-xs text-white mb-3 break-all">{selectedNode.id}</div>
          <div className="flex gap-2">
            {selectedNode.facets.map(f => (
              <div key={f.type} className="px-1.5 py-0.5 border border-ame-border bg-slate-950 font-mono text-[8px] text-slate-500 uppercase">
                {f.type}
              </div>
            ))}
          </div>
        </div>

        {/* Facet Sections */}
        {selectedNode.facets.map((facet) => (
          <FacetPanel 
            key={facet.type} 
            facet={facet} 
            onUpdate={(field, val) => updateFacetData(facet.type, field, val)} 
          />
        ))}
        
      </div>
    </div>
  );
};

const FacetPanel = ({ facet, onUpdate }: { facet: Facet, onUpdate: (field: string, val: any) => void }) => {
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
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-200">{facet.type} Facet</span>
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
            <div className="flex justify-between items-center bg-slate-950 p-1 border border-ame-border">
              <span className="text-[9px] text-slate-600 font-mono">CLASS</span>
              <span className="text-[10px] text-white font-mono uppercase">{facet.data.class}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {facet.data.tags?.map((tag: string) => (
                <span key={tag} className="px-1 border border-dashed border-ame-border text-[9px] text-slate-500">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Sensor Facet */}
        {facet.type === 'Sensor' && (
           <div className="bg-slate-950 p-2 border border-ame-border border-l-2 border-l-ame-accent">
             <div className="flex items-center gap-2 mb-1">
               <Activity className="w-3 h-3 text-ame-accent animate-pulse" />
               <span className="text-[10px] text-white font-mono uppercase">Streaming active</span>
             </div>
             <div className="text-[9px] text-slate-500 font-mono">Topic: {facet.data.topic}</div>
             <div className="text-[9px] text-slate-500 font-mono">Latency: 12ms</div>
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
      <span className="text-slate-600 uppercase font-bold">{label}</span>
      <div className="col-span-3 grid grid-cols-3 gap-1">
        {values.map((v, i) => (
          <div key={i} className="border border-ame-border px-1 bg-slate-950 flex justify-between gap-1 group/input">
            <span className="text-slate-700 opacity-50 group-focus-within/input:text-ame-accent">{['X', 'Y', 'Z'][i]}</span>
            <input 
              type="text"
              className="bg-transparent border-none outline-none text-white w-full text-right"
              defaultValue={v.toFixed(2)}
              onBlur={(e) => handleChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
