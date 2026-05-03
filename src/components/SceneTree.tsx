import React from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { useEngineStore } from '../store/useEngineStore';

export const SceneTree = () => {
  const { nodes, selectedNodeId, selectNode, routing } = useEngineStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex flex-col h-full bg-black">
      <PanelHeader title="Scene Tree" icon={Layers} />
      <div className="flex-1 overflow-y-auto no-scrollbar text-[11px] py-2">
        {nodes.map((node, index) => {
          const isSelected = selectedNodeId === node.id;
          const isTarget = routing.active && routing.targetEntity === node.id;
          const depth = node.parentId ? 1 : 0;
          
          return (
            <motion.div 
              key={node.id} 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => selectNode(node.id)}
              className={`
                py-1.5 border-b border-ame-border/30 cursor-pointer hover:bg-slate-900/60 transition-colors flex items-center justify-between group relative overflow-hidden
                ${isSelected ? 'text-white font-bold bg-slate-900/60' : 'text-slate-400'}
                ${depth === 0 ? 'px-3 bg-slate-900/40 text-ame-accent font-bold' : 'px-6'}
              `}
            >
              {isTarget && (
                 <motion.div 
                   layoutId="flow-line"
                   className="absolute left-0 top-0 bottom-0 w-1 bg-ame-accent z-10"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                 />
              )}
              <div className="flex items-center">
                <span className="text-slate-600 mr-2">{node.parentId ? '∟' : '●'}</span>
                <span>{node.name}</span>
              </div>
              <div className="flex gap-1.5 px-2">
                {node.facets.map(f => (
                  <div 
                    key={f.type} 
                    title={`${f.type}: ${f.status}`}
                    className={`w-1 h-1 rounded-full ${
                      f.status === 'SYNCHRONIZED' ? 'bg-ame-accent' : 
                      f.status === 'DIRTY' ? 'bg-yellow-500' : 'bg-red-500'
                    } opacity-20 group-hover:opacity-80 transition-opacity shadow-[0_0_8px_currentColor]`} 
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
