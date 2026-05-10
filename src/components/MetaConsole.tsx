import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Terminal, 
  Box, 
  Zap, 
  Play, 
  Trash2, 
  Database,
  Hash,
  Command as CommandIcon,
  ChevronRight
} from 'lucide-react';
import { useEngineStore } from '../store/useEngineStore';
import { nanoid } from 'nanoid';

interface ConsoleItem {
  id: string;
  type: 'NODE' | 'COMMAND' | 'ASSET';
  label: string;
  description: string;
  icon: any;
  action: () => void;
  accent?: string;
}

export const MetaConsole = () => {
  const { 
    isMetaConsoleOpen, 
    setMetaConsoleOpen, 
    addWorkflowNode, 
    nodes 
  } = useEngineStore();
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandList: ConsoleItem[] = [
    {
      id: 'cmd.run',
      type: 'COMMAND',
      label: 'Execute Pipeline',
      description: 'Start processing entire workflow DAG',
      icon: Play,
      accent: '#DEFF9A',
      action: () => console.log('Executing...')
    },
    {
      id: 'cmd.clear',
      type: 'COMMAND',
      label: 'Factory Reset Canvas',
      description: 'Destroy all nodes and edges in current workspace',
      icon: Trash2,
      accent: '#f43f5e',
      action: () => console.log('Clearing...')
    },
    {
      id: 'node.ai',
      type: 'NODE',
      label: 'Add: Gemini Inference',
      description: 'Logic gate for multi-modal LLM reasoning',
      icon: Zap,
      accent: '#A7F3D0',
      action: () => addWorkflowNode({
        type: 'AI_INFERENCE',
        category: 'AI',
        name: 'Gemini Lens',
        position: { x: 400, y: 300 },
        inputs: [{ id: nanoid(), name: 'Prompt', type: 'IN', dataType: 'DATA' }],
        outputs: [{ id: nanoid(), name: 'Result', type: 'OUT', dataType: 'DATA' }],
        data: {}
      })
    },
    {
      id: 'asset.scanner',
      type: 'ASSET',
      label: 'Link: Lidar Stream',
      description: 'Synchronize real-time point cloud from hardware',
      icon: Database,
      action: () => console.log('Linking asset...')
    }
  ];

  const filteredItems = commandList.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isMetaConsoleOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isMetaConsoleOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMetaConsoleOpen) return;

      if (e.key === 'Escape') {
        setMetaConsoleOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          setMetaConsoleOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMetaConsoleOpen, filteredItems, selectedIndex]);

  return (
    <AnimatePresence>
      {isMetaConsoleOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="w-full max-w-xl bg-ame-bg border border-ame-border shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Search Header */}
            <div className="relative border-b border-ame-border/50 bg-ame-panel-bg/20 flex items-center px-4 py-4">
              <Search className="w-5 h-5 text-ame-accent mr-3" />
              <input 
                ref={inputRef}
                type="text"
                placeholder="Meta Search: Nodes, Commands, Assets..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="flex-1 bg-transparent border-none outline-none text-ame-text font-mono text-sm placeholder:text-ame-muted"
              />
              <div className="flex items-center gap-1.5 px-2 py-0.5 border border-ame-border text-[9px] font-mono text-ame-muted uppercase">
                <CommandIcon className="w-2.5 h-2.5" />
                <span>K / ESC</span>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[400px] overflow-y-auto p-1 no-scrollbar">
              {filteredItems.length > 0 ? (
                <div className="space-y-px">
                  {filteredItems.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const Icon = item.icon;

                    return (
                      <div 
                        key={item.id}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => {
                          item.action();
                          setMetaConsoleOpen(false);
                        }}
                        className={`
                          flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border
                          ${isSelected ? 'bg-ame-accent/10 border-ame-accent/40 text-ame-text' : 'bg-transparent border-transparent text-ame-muted hover:bg-ame-panel-bg/40'}
                        `}
                      >
                        <div className={`p-1.5 rounded-sm ${isSelected ? 'bg-ame-accent text-ame-bg' : 'bg-ame-bg border border-ame-border'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold font-mono tracking-tight uppercase">{item.label}</span>
                            <span className={`text-[7px] font-bold px-1 py-0.5 border border-current opacity-60 uppercase`}>
                              {item.type}
                            </span>
                          </div>
                          <p className="text-[9px] font-mono opacity-50 truncate">{item.description}</p>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1 text-ame-accent font-mono text-[9px]">
                            <span>EXECUTE</span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-ame-muted">
                  <Terminal className="w-6 h-6 opacity-20" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">No records found matching query</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-ame-panel-bg/30 border-t border-ame-border/50 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[8px] font-mono text-ame-muted uppercase">
                <div className="flex items-center gap-1">
                  <ChevronRight className="w-2.5 h-2.5" />
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <Hash className="w-2.5 h-2.5" />
                  <span>Select</span>
                </div>
              </div>
              <div className="text-[8px] font-mono text-ame-accent/60 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-ame-accent animate-pulse" />
                <span>INDEX_READY: {commandList.length} OPS</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
