import React from 'react';
import { Layers } from 'lucide-react';
import { PanelHeader } from './PanelHeader';

export const SceneTree = () => {
  const items = [
    { name: 'main_camera', depth: 1 },
    { name: 'global_light', depth: 1 },
    { name: '3dgs_mesh_data_01', depth: 1, active: true },
    { name: 'splat_cloud_high_res', depth: 2, sub: true },
    { name: 'bounding_volume', depth: 2, sub: true },
    { name: 'env_probe_01', depth: 1, italic: true },
    { name: 'grid_helper', depth: 1 },
  ];

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Scene Tree" icon={Layers} />
      <div className="flex-1 overflow-y-auto no-scrollbar text-[11px]">
        <div className="py-1 px-3 bg-slate-900/40 text-ame-accent border-b border-ame-border cursor-pointer">● root_scene</div>
        {items.map((item) => (
          <div key={item.name} className={`
            py-1 border-b border-ame-border cursor-pointer hover:bg-slate-900 transition-colors
            ${item.active ? 'text-white font-bold' : 'text-slate-400'}
            ${item.depth === 1 ? 'px-6' : 'px-9'}
          `}>
            <span className="text-slate-600 mr-2">{item.sub ? '-' : '∟'}</span>
            <span className={item.italic ? 'italic opacity-50' : ''}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
