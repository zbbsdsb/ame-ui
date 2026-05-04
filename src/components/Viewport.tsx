import React from 'react';
import { useEngineStore } from '../store/useEngineStore';
import { 
  Move, 
  Rotate3d, 
  Maximize, 
  MousePointer2,
  Minimize2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ToolbarButton } from './ToolbarButton';
import { Gizmo } from './Gizmo';

export const Viewport = () => {
  const { nodes, selectedNodeId, routing, stats, mcap, gizmoMode, setGizmoMode } = useEngineStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const visualFacet = selectedNode?.facets.find(f => f.type === 'Visual');
  const sensorFacet = selectedNode?.facets.find(f => f.type === 'Sensor');
  const position = visualFacet?.data.position || [0, 0, 0];

  return (
    <div className="relative h-full bg-[#020202] overflow-hidden group">
      {/* Gizmo Overlay */}
      <Gizmo />

      {/* MCAP Recording Indicator */}
      {mcap.status === 'RECORDING' && (
        <div className="absolute top-6 right-6 z-30 flex items-center gap-3 bg-red-600 px-3 py-1.5 rounded-sm shadow-lg shadow-red-900/40">
           <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
           <span className="font-mono text-[11px] font-bold text-white tracking-widest">MCAP_REC</span>
           <div className="h-4 w-px bg-white/30" />
           <span className="font-mono text-[11px] text-white tabular-nums">0.1GB</span>
        </div>
      )}

      {/* Sensor Radar Overlay */}
      {sensorFacet && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px] border border-ame-accent/20 rounded-full relative">
            <div className="absolute inset-0 border border-ame-accent/10 rounded-full scale-75" />
            <div className="absolute inset-0 border border-ame-accent/5 rounded-full scale-50" />
            <motion.div 
              className="absolute inset-0 origin-center bg-gradient-to-tr from-ame-accent/20 to-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            {/* Random "Points" */}
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                className="absolute w-1 h-1 bg-ame-accent shadow-[0_0_10px_#A7F3D0]"
                style={{ 
                  left: `${50 + (Math.random() - 0.5) * 60}%`,
                  top: `${50 + (Math.random() - 0.5) * 60}%`
                }}
              />
            ))}
          </div>
        </div>
      )}
      {/* Patching Overlay */}
      {stats.status === 'PATCHING' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
        >
          <div className="w-12 h-12 border-2 border-ame-accent border-t-transparent animate-spin mb-4" />
          <div className="font-mono text-xs text-ame-accent tracking-widest animate-pulse">
            PATCH SYNCING WORLD IR TO {stats.activeAdapter}...
          </div>
          <div className="mt-2 font-mono text-[8px] text-slate-500 uppercase">
            Handshaking with Adapter / Sending Delta Patch v0.1.0
          </div>
        </motion.div>
      )}

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
      <div className="absolute top-6 left-6 flex flex-col gap-1 z-20 mix-blend-screen">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/90 border border-ame-border px-2 py-1 flex items-center gap-2 relative overflow-hidden"
        >
          <div className={`w-1 h-1 ${routing.active ? 'bg-ame-accent animate-ping' : 'bg-ame-accent'}`} />
          <span className="font-mono text-[10px] uppercase text-white tracking-[0.2em] leading-none ame-glow">Perspective</span>
          {/* Subtle Chromatic Line */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500/50 translate-x-[-1px]" />
        </motion.div>
        
        {routing.active && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-0.5"
          >
            <div className="bg-ame-accent px-2 py-0.5 font-mono text-[8px] font-bold text-black uppercase shadow-[0_0_15px_rgba(167,243,208,0.3)]">
              Routing: {routing.lastModel}
            </div>
            <div className="bg-black/60 border border-ame-accent/30 px-2 py-0.5 font-mono text-[7px] text-ame-accent uppercase tracking-tighter">
              Path: {routing.path}
            </div>
          </motion.div>
        )}
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/30 border border-ame-border/50 px-2 py-1 font-mono text-[9px] uppercase text-slate-500 leading-none backdrop-blur-md"
        >
          FOV: 90.0°
        </motion.div>
      </div>

      {/* Center Reticle Decor */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="relative w-24 h-24">
           <motion.div 
             animate={{ rotate: 90 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 border border-t-ame-accent/40 border-l-transparent border-r-transparent border-b-transparent rounded-full" 
           />
           <div className="absolute inset-[45%] bg-ame-accent/40 rounded-full" />
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
        <ToolbarButton 
          icon={MousePointer2} 
          active={gizmoMode === 'SELECT'} 
          tip="Select" 
          onClick={() => setGizmoMode('SELECT')}
        />
        <div className="h-px w-full bg-ame-border my-1" />
        <ToolbarButton 
          icon={Move} 
          active={gizmoMode === 'TRANSLATE'} 
          tip="Translate" 
          onClick={() => setGizmoMode('TRANSLATE')}
        />
        <ToolbarButton 
          icon={Rotate3d} 
          active={gizmoMode === 'ROTATE'} 
          tip="Rotate" 
          onClick={() => setGizmoMode('ROTATE')}
        />
        <ToolbarButton 
          icon={Maximize} 
          active={gizmoMode === 'SCALE'} 
          tip="Scale" 
          onClick={() => setGizmoMode('SCALE')}
        />
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
        <GizmoViewport />
      </div>
    </div>
  );
};

const GizmoViewport = () => (
  <div className="w-24 h-24 border border-ame-border border-dashed flex flex-col items-center justify-center group/gizmo hover:border-ame-accent transition-colors cursor-crosshair">
    <Minimize2 className="w-3 h-3 text-slate-600 mb-1 group-hover/gizmo:text-ame-accent" />
    <span className="font-mono text-[9px] text-slate-600 group-hover/gizmo:text-ame-accent uppercase">GIZMO_VIEW</span>
  </div>
);
