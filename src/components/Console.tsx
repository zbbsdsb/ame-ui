import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { useEngineStore } from '../store/useEngineStore';

export const Console = () => {
  const { logs, addLog } = useEngineStore();
  const [input, setInput] = useState('');

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      addLog({
        source: 'CORE',
        level: 'INFO',
        message: `EXECUTE: ${input}`
      });
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      <PanelHeader 
        title="Console Output" 
        icon={Terminal} 
        extra={
          <div className="flex gap-2 font-mono text-[9px]">
            <span className="text-ame-accent">[{logs.length}] LOGS</span>
            <span className="text-white">[0] WARNINGS</span>
            <span className="text-red-500">[0] ERRORS</span>
          </div>
        }
      />
      <div className="flex-1 p-2 font-mono text-[10px] overflow-y-auto leading-relaxed text-slate-300 no-scrollbar">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4">
            <span className="text-slate-600">[{log.timestamp}]</span>
            <span className={`
              ${log.level === 'ERR' ? 'text-red-500' : log.level === 'WNG' ? 'text-yellow-500' : 'text-ame-accent'}
            `}>{log.source}:</span>
            <span>{log.message}</span>
          </div>
        ))}
        <div className="flex gap-4 mt-1">
          <span className="text-ame-accent">{'>'}</span>
          <input 
            className="bg-transparent border-none outline-none text-white w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};
