import React from 'react';
import { motion } from 'motion/react';
import { useEngineStore } from '../store/useEngineStore';

export const Gizmo = () => {
  const { gizmoMode, nodes, selectedNodeId, theme } = useEngineStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const isSnow = theme === 'SNOW';
  
  if (!selectedNode || gizmoMode === 'SELECT') return null;

  const colors = {
    x: '#ef4444', // Red
    y: '#22c55e', // Green
    z: '#3b82f6', // Blue
    center: isSnow ? '#0f172a' : '#ffffff'
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* X Axis */}
        <motion.div 
          className="absolute h-[2px] w-24 bg-red-500 origin-left left-1/2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transform: 'rotate(0deg)' }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rotate-45" />
          <span className="absolute -right-4 top-1/2 -translate-y-1/2 font-mono text-[8px] text-red-500 font-bold">X</span>
        </motion.div>

        {/* Y Axis */}
        <motion.div 
          className="absolute h-[2px] w-24 bg-emerald-500 origin-left left-1/2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rotate-45" />
          <span className="absolute -right-4 top-1/2 -translate-y-1/2 font-mono text-[8px] text-emerald-500 font-bold">Y</span>
        </motion.div>

        {/* Z Axis (Perspective) */}
        <motion.div 
          className="absolute h-[2px] w-16 bg-blue-500 origin-left left-1/2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transform: 'rotate(135deg)' }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rotate-45" />
          <span className="absolute -right-4 top-1/2 -translate-y-1/2 font-mono text-[8px] text-blue-500 font-bold">Z</span>
        </motion.div>

        {/* Mode Specific Elements */}
        {gizmoMode === 'ROTATE' && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            className="absolute w-40 h-40 border-2 border-ame-accent rounded-full border-dashed"
          />
        )}

        {gizmoMode === 'SCALE' && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            className="absolute w-20 h-20 bg-ame-accent/20 border border-ame-accent"
          />
        )}

        {/* Center Pivot */}
        <div className={`w-2 h-2 rounded-full z-20 transition-colors`} 
          style={{ 
            backgroundColor: colors.center,
            boxShadow: `0 0 10px ${colors.center}` 
          }} 
        />
      </div>
      
      {/* Transformation Label */}
      <div className="absolute top-[60%] font-mono text-[9px] text-ame-accent uppercase tracking-[0.3em] ame-glow">
        {gizmoMode}_MODE ACTIVE
      </div>
    </div>
  );
};
