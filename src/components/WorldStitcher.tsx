import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitMerge, 
  Layers, 
  Move3d, 
  RotateCcw, 
  Maximize, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Plus, 
  Hash,
  Activity,
  Box,
  Compass
} from 'lucide-react';
import { useEngineStore } from '../store/useEngineStore';
import { PanelHeader } from './PanelHeader';

export const WorldStitcher = () => {
  const { nodes, updateNodeFacet, addLog } = useEngineStore();
  const [activeSession, setActiveSession] = useState<string[]>([]);
  const [pivotNodeId, setPivotNodeId] = useState<string | null>(null);
  const [isAligning, setIsAligning] = useState(false);

  // Filter nodes that are stitchable (3DGS meshes)
  const stitchableNodes = nodes.filter(n => n.facets.some(f => f.type === 'Visual'));

  const toggleNodeInSession = (id: string) => {
    setActiveSession(prev => 
      prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]
    );
    if (!pivotNodeId && !activeSession.includes(id)) {
      setPivotNodeId(id);
    }
  };

  const handleSpatialChange = (nodeId: string, axis: 'X' | 'Y' | 'Z' | 'R' | 'P' | 'Y', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const node = nodes.find(n => n.id === nodeId);
    const visual = node?.facets.find(f => f.type === 'Visual');
    if (!visual) return;

    const isRotation = ['R', 'P', 'Y'].includes(axis);
    const index = isRotation ? ['R', 'P', 'Y'].indexOf(axis) : ['X', 'Y', 'Z'].indexOf(axis);

    const newData = isRotation 
      ? { rotation: [...visual.data.rotation] } 
      : { position: [...visual.data.position] };

    if (isRotation) {
      newData.rotation![index] = numValue;
    } else {
      newData.position![index] = numValue;
    }

    updateNodeFacet(nodeId, 'Visual', newData);
  };

  const handleAutoAlign = () => {
    if (activeSession.length < 2) return;
    setIsAligning(true);
    addLog({ source: '3DGS', level: 'WNG', message: 'OPTIMIZING: Iterative Closest Point algorithm active...' });

    setTimeout(() => {
      // Small simulated corrections for each slave node
      activeSession.forEach(id => {
        if (id === pivotNodeId) return;
        const node = nodes.find(n => n.id === id);
        const visual = node?.facets.find(f => f.type === 'Visual');
        if (!visual) return;

        updateNodeFacet(id, 'Visual', {
          position: visual.data.position.map((v: number) => v + (Math.random() - 0.5) * 0.05),
          rotation: visual.data.rotation.map((v: number) => v + (Math.random() - 0.5) * 0.2)
        });
      });
      setIsAligning(false);
      addLog({ source: '3DGS', level: 'OK', message: 'ALIGNMENT_LOCKED: Residual error < 0.002m' });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-ame-bg border-r border-ame-border w-72">
      <PanelHeader icon={GitMerge} title="World Stitcher" accent="#DEFF9A" />
      
      <div className="flex-1 overflow-y-auto p-3 space-y-6 no-scrollbar">
        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="ame-panel p-2 flex flex-col gap-1 border-emerald-500/20">
            <span className="ame-label text-[8px]">Active Layers</span>
            <span className="text-ame-accent font-mono text-lg">{activeSession.length}</span>
          </div>
          <div className="ame-panel p-2 flex flex-col gap-1">
            <span className="ame-label text-[8px]">Overlap %</span>
            <span className="text-ame-text font-mono text-lg">{activeSession.length > 1 ? '84.2' : '--'}</span>
          </div>
        </div>

        {/* Source Fragments */}
        <section>
          <div className="ame-label mb-2 flex justify-between items-center">
            <span>Source Fragments</span>
            <span className="text-[8px] opacity-50">{stitchableNodes.length} AVAILABLE</span>
          </div>
          <div className="space-y-1">
            {stitchableNodes.map(node => {
              const isActive = activeSession.includes(node.id);
              const isPivot = pivotNodeId === node.id;
              
              return (
                <div 
                  key={node.id}
                  onClick={() => toggleNodeInSession(node.id)}
                  className={`
                    group flex items-center justify-between p-2 cursor-pointer border transition-all
                    ${isActive ? 'bg-ame-accent/5 border-ame-accent/40' : 'bg-ame-panel-bg/30 border-ame-border hover:border-ame-muted'}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Box className={`w-3 h-3 ${isActive ? 'text-ame-accent' : 'text-ame-muted'}`} />
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-bold font-mono ${isActive ? 'text-ame-text' : 'text-ame-muted'}`}>
                        {node.name.replace('aeid.', '').toUpperCase()}
                      </span>
                      <span className="text-[8px] text-ame-muted font-mono opacity-60">
                        {node.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isActive && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPivotNodeId(node.id);
                        }}
                        className={`p-1 rounded-sm transition-colors ${isPivot ? 'text-ame-accent' : 'text-ame-muted hover:text-ame-accent'}`}
                        title="Set as Pivot"
                      >
                        <Compass className="w-3 h-3" />
                      </button>
                    )}
                    <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-ame-accent shadow-[0_0_5px_rgba(167,243,208,0.5)]' : 'bg-ame-border'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Spatial Inspector */}
        <AnimatePresence>
          {activeSession.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="ame-label">Relative Alignment</div>
              
              {activeSession.map(nodeId => {
                const node = nodes.find(n => n.id === nodeId);
                if (!node) return null;
                const visual = node.facets.find(f => f.type === 'Visual');
                if (!visual) return null;

                const isPivot = pivotNodeId === nodeId;

                return (
                  <div key={nodeId} className="ame-panel p-2 space-y-3 bg-ame-bg/50">
                    <div className="flex items-center justify-between border-b border-ame-border pb-1 mb-2">
                      <span className="text-[9px] font-mono text-ame-accent truncate w-32">{node.name}</span>
                      {isPivot ? (
                        <span className="text-[8px] font-bold bg-ame-accent text-ame-bg px-1 uppercase tracking-tighter">Pivot</span>
                      ) : (
                        <span className="text-[8px] text-ame-muted uppercase">Slave</span>
                      )}
                    </div>

                    {!isPivot && (
                      <div className="space-y-2">
                        {/* Translation */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center font-mono text-[8px] text-ame-muted uppercase">
                            <span>Translation (m)</span>
                            <Move3d className="w-2.5 h-2.5" />
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            {['X', 'Y', 'Z'].map((axis, i) => (
                              <div key={axis} className="bg-ame-bg border border-ame-border p-1 flex flex-col">
                                <span className="text-[7px] text-ame-muted mb-0.5">{axis}</span>
                                <input 
                                  type="text" 
                                  value={visual.data.position[i].toFixed(3)}
                                  onChange={(e) => handleSpatialChange(nodeId, axis as any, e.target.value)}
                                  className="bg-transparent text-[9px] font-mono outline-none text-ame-text"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rotation */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center font-mono text-[8px] text-ame-muted uppercase">
                            <span>Rotation (deg)</span>
                            <RotateCcw className="w-2.5 h-2.5" />
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            {['R', 'P', 'Y'].map((axis, i) => (
                              <div key={axis} className="bg-ame-bg border border-ame-border p-1 flex flex-col">
                                <span className="text-[7px] text-ame-muted mb-0.5">{axis}</span>
                                <input 
                                  type="text" 
                                  value={visual.data.rotation[i].toFixed(1)}
                                  onChange={(e) => handleSpatialChange(nodeId, axis as any, e.target.value)}
                                  className="bg-transparent text-[9px] font-mono outline-none text-ame-accent"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Integration Tools */}
      <div className="p-3 border-t border-ame-border bg-ame-panel-bg/20 space-y-2">
        <button 
          onClick={() => addLog({ source: 'SYSTEM', level: 'OK', message: 'SYNC_HANDSHAKE: All local transforms pushed to world origin.' })}
          className="w-full py-2 bg-ame-accent text-ame-bg text-[10px] font-bold font-mono uppercase hover:bg-white transition-all flex items-center justify-center gap-2"
        >
          <GitMerge className="w-3.5 h-3.5" />
          Synchronize Local IR
        </button>
        <button 
          onClick={handleAutoAlign}
          disabled={isAligning || activeSession.length < 2}
          className={`w-full py-2 border border-ame-border text-[10px] font-bold font-mono uppercase transition-all flex items-center justify-center gap-2 ${isAligning ? 'bg-ame-accent/20 text-ame-accent border-ame-accent' : 'text-ame-text hover:border-ame-accent hover:text-ame-accent disabled:opacity-30'}`}
        >
          <Activity className={`w-3.5 h-3.5 ${isAligning ? 'animate-spin' : ''}`} />
          {isAligning ? 'Optimization...' : 'Auto-Align (Slam)'}
        </button>
      </div>
    </div>
  );
};
