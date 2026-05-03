import React from 'react';
import { useEngineStore } from '../store/useEngineStore';
import { 
  Move, 
  Rotate3d, 
  Maximize, 
  MousePointer2,
  Minimize2,
  Crosshair
} from 'lucide-react';
import { motion } from 'motion/react';

export const Viewport = () => {
  const { nodes, selectedNodeId, routing } = useEngineStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const visualFacet = selectedNode?.facets.find(f => f.type === 'Visual');
  const position = visualFacet?.data.position || [0, 0, 0];

  return (
    <div className="relative h-full bg-[#020202] overflow-hidden group">
      {/* Scan Line Overlay */}
      {routing.active && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div className="w-full h-1 bg-ame-accent/20 blur-sm ame-scan-line" />
        </div>
      )}

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#1E293B 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} 
      />
      
      {/* Corner Frame Pieces */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-ame-border opacity-50 z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-ame-border opacity-50 z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-ame-border opacity-50 z-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-ame-border opacity-50 z-20 pointer-events-none" />

      {/* Central Background Text */}
      <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-slate-900 text-[120px] font-bold tracking-tighter select-none opacity-20 leading-none">AME</div>
        <div className="font-mono text-[10px] text-ame-accent tracking-[0.2em] mt-[-30px] select-none uppercase">RENDERING ACTIVE: 3.2M POINTS</div>
      </div>

      {/* Central Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-10 h-px bg-white" />
        <div className="h-10 w-px bg-white absolute" />
      </div>

      {/* Top Left HUD */}
      <div className="absolute top-6 left-6 flex flex-col gap-1 z-20">
        <div className="bg-black/90 border border-ame-border px-2 py-1 flex items-center gap-2">
          <div className={`w-1 h-1 ${routing.active ? 'bg-ame-accent animate-ping' : 'bg-ame-accent'}`} />
          <span className="font-mono text-[10px] uppercase text-white tracking-widest leading-none">Perspective</span>
        </div>
        {routing.active && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-ame-accent px-2 py-0.5 font-mono text-[8px] font-bold text-black uppercase"
          >
            Routing: {routing.lastModel}
          </motion.div>
        )}
        <div className="bg-black/30 border border-ame-border/50 px-2 py-1 font-mono text-[9px] uppercase text-slate-500 leading-none">
          FOV: 90.0°
        </div>
      </div>

      {/* Selection HUD */}
      {selectedNode && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-24 left-6 z-20 pointer-events-none"
        >
          <div className="flex flex-col border-l border-ame-accent pl-3 overflow-hidden">
            <div className="font-mono text-[10px] text-ame-accent uppercase tracking-tighter mb-1">
              Selected: {selectedNode.name}
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-600 font-bold uppercase">X_COORD</span>
                <span className="font-mono text-[11px] text-white tabular-nums">{position[0].toFixed(3)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-600 font-bold uppercase">Y_COORD</span>
                <span className="font-mono text-[11px] text-white tabular-nums">{position[1].toFixed(3)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-600 font-bold uppercase">Z_COORD</span>
                <span className="font-mono text-[11px] text-white tabular-nums">{position[2].toFixed(3)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Floating Toolbar (Gizmo Selectors) */}
      <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-20 flex flex-col gap-2">
        <ToolbarButton icon={MousePointer2} active tip="Select" />
        <div className="h-px w-full bg-ame-border my-1" />
        <ToolbarButton icon={Move} tip="Translate" />
        <ToolbarButton icon={Rotate3d} tip="Rotate" />
        <ToolbarButton icon={Maximize} tip="Scale" />
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-6 left-6 z-20 flex gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Draw Calls</span>
          <span className="font-mono text-[10px] text-slate-300">12</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Triangles</span>
          <span className="font-mono text-[10px] text-slate-300">0</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20">
        <div className="w-24 h-24 border border-ame-border border-dashed flex flex-col items-center justify-center group/gizmo hover:border-ame-accent transition-colors cursor-crosshair">
          <Minimize2 className="w-3 h-3 text-slate-600 mb-1 group-hover/gizmo:text-ame-accent" />
          <span className="font-mono text-[9px] text-slate-600 group-hover/gizmo:text-ame-accent">GIZMO_VIEW</span>
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon: Icon, active, tip }: { icon: any, active?: boolean, tip: string }) => (
  <button className={`
    w-8 h-8 flex items-center justify-center border transition-all duration-150 relative group
    ${active ? 'bg-ame-accent border-ame-accent text-black' : 'bg-black border-ame-border text-slate-500 hover:border-ame-accent hover:text-white'}
  `}>
    <Icon className="w-4 h-4" />
    <div className="absolute right-full mr-2 px-2 py-1 bg-black border border-ame-border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
      <span className="font-mono text-[9px] uppercase tracking-widest text-white whitespace-nowrap">{tip}</span>
    </div>
  </button>
);
