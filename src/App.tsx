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

import { GitBranch } from 'lucide-react';
import { useEngineStore } from './store/useEngineStore';
import { StudioCanvas } from './components/StudioCanvas';

export default function App() {
  const { isStudioExpanded, setStudioExpanded } = useEngineStore();

  return (
    <div className="h-screen w-screen flex flex-col bg-black selection:bg-ame-accent selection:text-black font-sans relative overflow-hidden">
      {/* Aesthetic Overlays */}
      <div className="ame-grain" />
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ame-accent/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <TopBar />
        
        <div className="flex-1 flex overflow-hidden relative">
          {isStudioExpanded ? (
            <div className="absolute inset-0 z-50 flex flex-col bg-black">
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
            </div>
          ) : null}

          <PanelGroup orientation="horizontal">
          
          {/* Left Panel: Scene Tree */}
          <Panel defaultSize={20} minSize={10} className="border-r border-ame-border">
            <SceneTree />
          </Panel>
          
          <ResizeHandle direction="horizontal" />
          
          {/* Main Area: Viewport + Console */}
          <Panel defaultSize={55} minSize={30}>
            <PanelGroup orientation="vertical">
              
              {/* Main Viewport */}
              <Panel defaultSize={70} minSize={20} className="border-b border-ame-border">
                <Viewport />
              </Panel>
              
              <ResizeHandle direction="vertical" />
              
              {/* Bottom Tray */}
              <Panel defaultSize={30} minSize={10}>
                <BottomPanel />
              </Panel>
            </PanelGroup>
          </Panel>
          
          <ResizeHandle direction="horizontal" />
          
          {/* Right Panel: Inspector */}
          <Panel defaultSize={25} minSize={15} className="border-l border-ame-border">
            <Inspector />
          </Panel>
          
        </PanelGroup>
      </div>
    </div>
  </div>
);
}

