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
import { Console } from './components/Console';
import { Inspector } from './components/Inspector';

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-black selection:bg-ame-accent selection:text-black font-sans">
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
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
              
              {/* Bottom Tray: Console */}
              <Panel defaultSize={30} minSize={10}>
                <Console />
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
  );
}

