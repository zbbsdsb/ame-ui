import React from 'react';
import { Layers } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { useEngineStore } from '../store/useEngineStore';

export const SceneTree = () => {
  const { nodes, selectedNodeId, selectNode } = useEngineStore();

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Scene Tree" icon={Layers} />
      <div className="flex-1 overflow-y-auto no-scrollbar text-[11px]">
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const depth = node.parentId ? 1 : 0;
          
          return (
            <div 
              key={node.id} 
              onClick={() => selectNode(node.id)}
              className={`
                py-1 border-b border-ame-border cursor-pointer hover:bg-slate-900 transition-colors
                ${isSelected ? 'text-white font-bold bg-slate-900' : 'text-slate-400'}
                ${depth === 0 ? 'px-3 bg-slate-900/40 text-ame-accent' : 'px-6'}
              `}
            >
              <span className="text-slate-600 mr-2">{node.parentId ? '∟' : '●'}</span>
              <span>{node.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
