import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { useEngineStore } from '../store/useEngineStore';

export const Console = () => {
  const { logs, processCommand, nodes, models, assets, sensors } = useEngineStore();
  const [input, setInput] = useState('');

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      processCommand(input);
      setInput('');
    }
  };

  // Live Meta-Search Preview
  const searchResults = input.trim().length > 1 && !input.startsWith('/') 
    ? [
        ...nodes.map(n => ({ type: 'NODE', name: n.name, id: n.id })),
        ...models.map(m => ({ type: 'MODEL', name: m.name, id: m.id })),
        ...assets.map(a => ({ type: 'ASSET', name: a.name, id: a.id })),
        ...sensors.map(s => ({ type: 'SENSOR', name: s.topic, id: s.topic }))
      ].filter(item => item.name.toLowerCase().includes(input.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="h-full flex flex-col bg-black relative">
      <PanelHeader 
        title="Meta Console" 
        icon={Terminal} 
        extra={
          <div className="flex gap-2 font-mono text-[9px]">
            <span className="text-ame-accent">[{logs.length}] LOGS</span>
            <span className="text-white hover:text-ame-accent cursor-pointer" onClick={() => useEngineStore.getState().clearLogs()}>[CLEAR]</span>
          </div>
        }
      />
      <div className="flex-1 p-2 font-mono text-[10px] overflow-y-auto leading-relaxed text-slate-300 no-scrollbar pb-12 relative">
        {/* Hex Data Stream Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden flex flex-wrap content-start">
          {[...Array(20)].map((_, i) => (
            <motion.div 
              key={i}
              className="whitespace-nowrap text-[8px] tracking-widest text-ame-accent"
              animate={{ x: [0, -100] }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear' }}
            >
              {[...Array(50)].map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ')}
            </motion.div>
          ))}
        </div>

        {/* Scanning Bar Effect */}
        <motion.div 
          className="absolute inset-x-0 h-px bg-ame-accent/20 z-0 pointer-events-none"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        {logs.map((log, index) => (
          <motion.div 
            key={log.id} 
            initial={{ opacity: 0, x: -10, filter: 'blur(2px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex gap-4 group/log mb-0.5 relative z-10"
          >
            <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
            <span className={`
              font-bold shrink-0 ${log.level === 'ERR' ? 'text-red-500' : log.level === 'WNG' ? 'text-yellow-500' : 'text-ame-accent'}
            `}>{log.source}:</span>
            <span className="flex-1 whitespace-pre-wrap">{log.message}</span>
          </motion.div>
        ))}
      </div>

      {/* Meta Search Suggestions */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-12 left-2 right-2 bg-slate-900 border border-ame-accent/30 p-1 rounded-sm z-50 shadow-2xl backdrop-blur-xl"
          >
            <div className="px-2 py-1 border-b border-ame-border mb-1">
              <span className="text-[8px] text-slate-500 uppercase font-bold">Meta-Search Suggestions</span>
            </div>
            {searchResults.map(item => (
              <div 
                key={item.id} 
                className="flex items-center justify-between px-2 py-1 hover:bg-ame-accent/10 cursor-pointer group/item"
                onClick={() => setInput(item.name)}
              >
                <div className="flex items-center gap-3">
                   <span className="text-[9px] text-ame-accent font-bold">[{item.type}]</span>
                   <span className="text-[10px] text-slate-200">{item.name}</span>
                </div>
                <span className="text-[8px] text-slate-600 opacity-0 group-hover/item:opacity-100 uppercase">Click to Autofill</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Tray */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black border-t border-ame-border flex items-center gap-3 group">
        <div className="flex items-center gap-1">
          <span className="text-ame-accent font-bold font-mono text-xs">{input.startsWith('/') ? 'λ' : '>'}</span>
          {input.startsWith('/') && <div className="w-1 h-3 bg-ame-accent animate-pulse" />}
        </div>
        <input 
          className="bg-transparent border-none outline-none text-white w-full font-mono text-xs placeholder:text-slate-800"
          placeholder="Type to search nodes, assets... or / to execute command"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          autoFocus
        />
        <div className="flex items-center gap-2 px-2 bg-slate-900 border border-ame-border font-mono text-[8px] text-slate-600 uppercase">
          Ins
        </div>
      </div>
    </div>
  );
};
