import React from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { useEngineStore } from '../store/useEngineStore';

export const SceneTree = () => {
  const { nodes, selectedNodeId, selectNode, routing } = useEngineStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex flex-col h-full bg-ame-bg">
      <PanelHeader title="Scene Tree" icon={Layers} />
      <div className="flex-1 overflow-y-auto no-scrollbar text-[11px] py-2">
        {nodes.map((node, index) => {
          const isSelected = selectedNodeId === node.id;
          const isTarget = routing.active && routing.targetEntity === node.id;
          const depth = node.parentId ? 1 : 0;
          
          return (
            <motion.div 
              key={node.id} 
              initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ x: 2, background: 'color-mix(in srgb, var(--color-ame-accent) 5%, transparent)' }}
              onClick={() => selectNode(node.id)}
              className={`
                py-2 border-b border-ame-border/20 cursor-pointer transition-all flex items-center justify-between group relative overflow-hidden
                ${isSelected ? 'text-ame-text font-bold bg-ame-accent/5' : 'text-ame-muted'}
                ${depth === 0 ? 'px-3 bg-ame-panel-bg/20 text-ame-accent font-bold' : 'px-6'}
              `}
            >
              {/* Scanline for selected */}
              {isSelected && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-ame-accent/10 to-transparent w-1/3 z-0"
                  animate={{ left: ['-30%', '110%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              )}

              {isTarget && (
                 <motion.div 
                   layoutId="flow-line"
                   className="absolute left-0 top-0 bottom-0 w-1 bg-ame-accent z-10"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                 />
              )}
              <div className="flex items-center">
                <span className="text-slate-600 mr-2 font-mono">{node.parentId ? '├' : '●'}</span>
                <span className="tracking-tight">{node.name}</span>
              </div>
              <div className="flex gap-2 px-2 relative z-10">
                {node.facets.map(f => (
                  <motion.div 
                    key={f.type} 
                    title={`${f.type}: ${f.status}`}
                    animate={f.status !== 'SYNCHRONIZED' ? { opacity: [0.2, 0.8, 0.2] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-1.5 h-1.5 rounded-full ${
                      f.status === 'SYNCHRONIZED' ? 'bg-ame-accent' : 
                      f.status === 'DIRTY' ? 'bg-amber-500' : 'bg-red-500'
                    } opacity-20 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_currentColor]`} 
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
