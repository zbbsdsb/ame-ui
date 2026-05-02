import React from 'react';
import { Settings2 } from 'lucide-react';
import { PanelHeader } from './PanelHeader';

export const Inspector = () => {
  return (
    <div className="h-full flex flex-col bg-black">
      <PanelHeader title="Inspector: 3dgs_mesh_data_01" icon={Settings2} />
      <div className="flex-1 overflow-y-auto no-scrollbar">
        
        {/* Transform Section */}
        <div className="border-b border-ame-border p-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Transform</span>
          <div className="mt-3 space-y-2">
            <div className="grid grid-cols-4 items-center gap-2 font-mono text-[10px]">
              <span className="text-slate-600">POS</span>
              <div className="col-span-3 grid grid-cols-3 gap-1">
                <div className="border border-ame-border px-1 bg-slate-950 flex justify-between"><span>X</span><span className="text-white">0.00</span></div>
                <div className="border border-ame-border px-1 bg-slate-950 flex justify-between"><span>Y</span><span className="text-white">1.42</span></div>
                <div className="border border-ame-border px-1 bg-slate-950 flex justify-between"><span>Z</span><span className="text-white">-0.12</span></div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-2 font-mono text-[10px]">
              <span className="text-slate-600">ROT</span>
              <div className="col-span-3 grid grid-cols-3 gap-1">
                <div className="border border-ame-border px-1 bg-slate-950">0.00°</div>
                <div className="border border-ame-border px-1 bg-slate-950">90.0°</div>
                <div className="border border-ame-border px-1 bg-slate-950">0.00°</div>
              </div>
            </div>
          </div>
        </div>

        {/* Splatting Settings */}
        <div className="border-b border-ame-border p-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Splatting Settings</span>
          <div className="mt-3 space-y-3">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Point Scale</span>
              <span className="font-mono text-[10px] text-ame-accent">1.050</span>
            </div>
            <div className="h-1 bg-slate-900 relative">
              <div className="absolute left-0 top-0 bottom-0 bg-ame-accent w-[65%]" />
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Spherical Harmonics</span>
              <span className="font-mono text-[10px] border border-ame-border px-1">L3_FULL</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Opacity Threshold</span>
              <span className="font-mono text-[10px]">0.05</span>
            </div>
          </div>
        </div>

        {/* Source Manifest */}
        <div className="p-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Source Manifest</span>
          <div className="mt-2 p-2 bg-slate-950 border border-ame-border font-mono text-[9px] text-slate-400 break-all leading-tight">
            SHA256: 9E32A4...F012C8<br/>
            SIZE: 1.28 GB<br/>
            POINTS: 3,219,482
          </div>
        </div>
        
      </div>
    </div>
  );
};
