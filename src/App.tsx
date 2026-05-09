/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Panel, 
  Group as PanelGroup, 
} from 'react-resizable-panels';

import { TopBar } from './components/TopBar';
import { ResizeHandle } from './components/ResizeHandle';
import { SceneTree } from './components/SceneTree';
import { Viewport } from './components/Viewport';
import { BottomPanel } from './components/BottomPanel';
import { Inspector } from './components/Inspector';

import { motion, AnimatePresence } from 'motion/react';
import { useEngineStore } from './store/useEngineStore';
import { StudioCanvas } from './components/StudioCanvas';
import { GitBranch } from 'lucide-react';

export default function App() {
  const { isStudioExpanded, setStudioExpanded } = useEngineStore();

  return (
    <div className="h-screen w-screen flex flex-col bg-ame-bg text-ame-text selection:bg-ame-accent selection:text-ame-bg font-sans relative overflow-hidden">
      {/* Aesthetic Overlays */}
      <div className="ame-grain" />
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ame-accent/20 blur-[150px] rounded-full transition-colors duration-1000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay" 
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} 
      />
      
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#111_0%,_#000_100%)] opacity-80" />
        <div className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'linear-gradient(var(--ame-accent) 1px, transparent 1px), linear-gradient(90deg, var(--ame-accent) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent)'
          }} 
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <TopBar />
        </motion.div>
        
        <div className="flex-1 flex overflow-hidden relative">
          <AnimatePresence mode="wait">
            {isStudioExpanded && (
              <motion.div 
                key="studio"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 z-50 flex flex-col bg-black"
              >
                <div className="h-10 border-b border-ame-border flex items-center px-4 justify-between bg-black/80 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <GitBranch className="w-4 h-4 text-ame-accent" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Workflow Studio / Studio_Core_01</span>
                  </div>
                  <button 
                    onClick={() => setStudioExpanded(false)}
                    className="px-3 py-1 bg-ame-accent text-black font-mono text-[9px] font-bold uppercase hover:bg-white transition-colors"
                  >
                    Exit Studio
                  </button>
                </div>
                <div className="flex-1">
                  <StudioCanvas />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className="flex-1 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <PanelGroup orientation="horizontal">
              {/* Left Panel: Scene Tree */}
              <Panel defaultSize={20} minSize={10} className="border-r border-ame-border">
                <motion.div 
                  className="h-full"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SceneTree />
                </motion.div>
              </Panel>
              
              <ResizeHandle direction="horizontal" />
              
              {/* Main Area: Viewport + Console */}
              <Panel defaultSize={55} minSize={30}>
                <PanelGroup orientation="vertical">
                  
                  {/* Main Viewport */}
                  <Panel defaultSize={70} minSize={20} className="border-b border-ame-border">
                    <motion.div 
                      className="h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 1 }}
                    >
                      <Viewport />
                    </motion.div>
                  </Panel>
                  
                  <ResizeHandle direction="vertical" />
                  
                  {/* Bottom Tray */}
                  <Panel defaultSize={30} minSize={10}>
                    <motion.div 
                      className="h-full"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <BottomPanel />
                    </motion.div>
                  </Panel>
                </PanelGroup>
              </Panel>
              
              <ResizeHandle direction="horizontal" />
              
              {/* Right Panel: Inspector */}
              <Panel defaultSize={25} minSize={15} className="border-l border-ame-border">
                <motion.div 
                  className="h-full"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Inspector />
                </motion.div>
              </Panel>
            </PanelGroup>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

