import React, { useEffect, useState } from 'react';
import { useEngineStore, SensorStream } from '../store/useEngineStore';
import { Radio, Database, Activity, Clock, Server, Play, Square, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SensorBridgeDashboard = () => {
  const { sensors, mcap, toggleRecording, updateMcap } = useEngineStore();
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: any;
    if (mcap.status === 'RECORDING') {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
        updateMcap({ 
          recordingTime: time + 1,
          bufferUsage: Math.min(100, Math.floor((time / 100) * 100)),
          fileSize: `${((time * 1.2)).toFixed(1)} MB`
        });
      }, 1000);
    } else {
      setTime(0);
    }
    return () => clearInterval(interval);
  }, [mcap.status, time]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-black overflow-hidden select-none">
      <div className="flex border-b border-ame-border h-full">
        
        {/* Left: MCAP Capture Control */}
        <div className="w-[350px] border-r border-ame-border p-4 flex flex-col bg-slate-900/10">
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-4 h-4 text-ame-accent" />
            <span className="ame-label">MCAP Container (HDU)</span>
          </div>

          <div className="flex-1 space-y-4">
            <div className={`p-4 border ${mcap.status === 'RECORDING' ? 'border-red-500/50 bg-red-500/5' : 'border-ame-border bg-slate-950'} transition-colors`}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${mcap.status === 'RECORDING' ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
                  <span className="font-mono text-[10px] text-white uppercase tracking-widest">{mcap.status}</span>
                </div>
                <span className="font-mono text-xl text-white tabular-nums">{formatTime(time)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-600 font-bold uppercase">Stored Data</span>
                  <span className="font-mono text-sm text-slate-300">{mcap.fileSize}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-600 font-bold uppercase">Buffer Flow</span>
                  <span className="font-mono text-sm text-slate-300">{mcap.bufferUsage}%</span>
                </div>
              </div>

              <button 
                onClick={toggleRecording}
                className={`w-full py-3 flex items-center justify-center gap-2 border font-mono text-xs font-bold transition-all
                  ${mcap.status === 'RECORDING' 
                    ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                    : 'border-ame-accent text-ame-accent hover:bg-ame-accent hover:text-black'}
                `}
              >
                {mcap.status === 'RECORDING' ? (
                  <><Square className="w-4 h-4" /> STOP CAPTURE</>
                ) : (
                  <><Play className="w-4 h-4" /> START MCAP SESSION</>
                )}
              </button>
            </div>

            <div className="p-3 border border-ame-border bg-slate-950/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3 h-3 text-slate-500" />
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Temporal Sync</span>
              </div>
              <div className="font-mono text-[10px] text-slate-400">
                Primary Master: <span className="text-ame-accent">ROS2_PTP_DOMAIN_0</span>
              </div>
              <div className="font-mono text-[10px] text-slate-400 mt-1">
                Drift: <span className="text-emerald-500">0.002ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: ROS2 Topic Monitor */}
        <div className="flex-1 p-4 flex flex-col bg-slate-900/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-ame-accent" />
              <span className="ame-label">DDS / ROS2 Endpoint Monitor</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-0.5 border border-ame-border bg-black font-mono text-[9px] text-emerald-500">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              DOMAIN: 10
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-1 space-y-2">
            {sensors.map(sensor => (
              <SensorItem key={sensor.topic} sensor={sensor} />
            ))}
            
            <div className="mt-8 pt-4 border-t border-ame-border/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-3 h-3 text-yellow-500" />
                <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Protocol Warnings</span>
              </div>
              <div className="font-mono text-[9px] text-slate-500 leading-tight">
                [WARN] /ros2/cam_rear: Packet drop detected (3.2%)<br/>
                [INFO] Using RMW: fastrtps
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const SensorItem = ({ sensor }: { sensor: SensorStream, key?: React.Key }) => (
  <div className="flex items-center justify-between p-3 bg-slate-900/40 border border-ame-border hover:border-slate-700 transition-colors group">
    <div className="flex items-center gap-4">
      <div className={`p-2 bg-black border ${sensor.status === 'ACTIVE' ? 'border-ame-accent/50' : 'border-ame-border'}`}>
        <Activity className={`w-4 h-4 ${sensor.status === 'ACTIVE' ? 'text-ame-accent' : 'text-slate-600'}`} />
      </div>
      <div>
        <div className="font-mono text-[11px] text-white mb-0.5">{sensor.topic}</div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] text-slate-500 uppercase">{sensor.type}</span>
          <span className="font-mono text-[9px] text-slate-500 tracking-tighter">[{sensor.type === 'Camera' ? 'H.264' : 'PointCloud2'}]</span>
        </div>
      </div>
    </div>

    <div className="flex gap-6 items-center">
      <div className="flex flex-col items-end">
        <span className="text-[8px] text-slate-600 font-bold uppercase">Rate</span>
        <span className="font-mono text-[10px] text-ame-accent">{sensor.hz} Hz</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[8px] text-slate-600 font-bold uppercase">Latency</span>
        <span className="font-mono text-[10px] text-slate-300">{sensor.latency} ms</span>
      </div>
      <div className="w-24 h-6 bg-slate-950 border border-ame-border overflow-hidden relative">
        <div className="absolute inset-0 flex items-end gap-0.5 px-0.5">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="flex-1 bg-ame-accent/30" 
              style={{ height: `${20 + Math.random() * 80}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);
