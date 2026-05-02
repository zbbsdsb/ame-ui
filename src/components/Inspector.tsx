import React from 'react';
import { Settings2 } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { useEngineStore } from '../store/useEngineStore';

export const Inspector = () => {
  const { nodes, selectedNodeId, updateNode } = useEngineStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col bg-black">
        <PanelHeader title="Inspector" icon={Settings2} />
        <div className="flex-1 flex items-center justify-center ame-mono text-slate-600 uppercase">
          No Selection
        </div>
      </div>
    );
  }

  const handlePropertyChange = (category: 'position' | 'rotation' | 'scale', axis: 0 | 1 | 2, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    const currentProps = { ...selectedNode.properties };
    const newVector = [...currentProps[category]] as [number, number, number];
    newVector[axis] = numValue;
    
    updateNode(selectedNode.id, {
      properties: {
        ...currentProps,
        [category]: newVector
      }
    });
  };

  return (
    <div className="h-full flex flex-col bg-black">
      <PanelHeader title={`Inspector: ${selectedNode.name}`} icon={Settings2} />
      <div className="flex-1 overflow-y-auto no-scrollbar">
        
        {/* Transform Section */}
        <div className="border-b border-ame-border p-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Transform</span>
          <div className="mt-3 space-y-2">
            {(['position', 'rotation', 'scale'] as const).map((cat) => (
              <div key={cat} className="grid grid-cols-4 items-center gap-2 font-mono text-[10px]">
                <span className="text-slate-600 uppercase">{cat.slice(0, 3)}</span>
                <div className="col-span-3 grid grid-cols-3 gap-1">
                  {selectedNode.properties[cat].map((val, i) => (
                    <div key={i} className="border border-ame-border px-1 bg-slate-950 flex justify-between gap-1">
                      <span className="text-slate-700 opacity-50">{['X', 'Y', 'Z'][i]}</span>
                      <input 
                        type="text"
                        className="bg-transparent border-none outline-none text-white w-full text-right"
                        value={val}
                        onChange={(e) => handlePropertyChange(cat, i as any, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Splatting Settings (Conditional) */}
        {selectedNode.type === 'mesh' && selectedNode.properties.params && (
          <div className="border-b border-ame-border p-3">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Splatting Settings</span>
            <div className="mt-3 space-y-3">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Point Scale</span>
                <span className="font-mono text-[10px] text-ame-accent">{selectedNode.properties.params.pointScale.toFixed(3)}</span>
              </div>
              <div className="h-1 bg-slate-900 relative">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-ame-accent transition-all duration-300" 
                  style={{ width: `${(selectedNode.properties.params.pointScale / 2) * 100}%` }} 
                />
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Spherical Harmonics</span>
                <span className="font-mono text-[10px] border border-ame-border px-1">L{selectedNode.properties.params.shDegree}_FULL</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Opacity Threshold</span>
                <span className="font-mono text-[10px]">{selectedNode.properties.params.opacityThreshold}</span>
              </div>
            </div>
          </div>
        )}

        {/* Source Manifest (Fixed/Mock) */}
        <div className="p-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Node ID</span>
          <div className="mt-2 p-2 bg-slate-950 border border-ame-border font-mono text-[9px] text-slate-400 break-all leading-tight">
            ID: {selectedNode.id.toUpperCase()}<br/>
            TYPE: {selectedNode.type.toUpperCase()}<br/>
            PARENT: {selectedNode.parentId?.toUpperCase() || 'NONE'}
          </div>
        </div>
        
      </div>
    </div>
  );
};
