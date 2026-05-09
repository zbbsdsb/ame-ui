import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useEngineStore } from '../store/useEngineStore';
import { Activity, Cpu, Zap, Database } from 'lucide-react';

export const TelemetryDashboard = () => {
  const { telemetryHistory, stats } = useEngineStore();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-ame-bg overflow-hidden p-4 space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard 
          icon={Activity} 
          label="Engine FPS" 
          value={stats.fps} 
          unit="fps" 
          color="text-ame-accent" 
        />
        <MetricCard 
          icon={Cpu} 
          label="GPU Usage" 
          value={stats.gpuUsage} 
          unit="%" 
          color="text-blue-400" 
        />
        <MetricCard 
          icon={Zap} 
          label="CPU Load" 
          value={telemetryHistory[telemetryHistory.length - 1]?.cpu || 0} 
          unit="%" 
          color="text-amber-400" 
        />
        <MetricCard 
          icon={Database} 
          label="Memory" 
          value={stats.memory} 
          unit="" 
          color="text-emerald-400" 
        />
      </div>

      {/* Main Charts */}
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <div className="bg-ame-panel-bg/40 border border-ame-border p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2">
             <span className="text-[10px] font-bold text-ame-muted uppercase tracking-widest">Temporal Performance (FPS)</span>
             <span className="text-[9px] font-mono text-ame-accent">{stats.fps} AVG</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory}>
                <defs>
                  <linearGradient id="colorFps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--ame-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--ame-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ame-border)" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  hide={true}
                />
                <YAxis 
                  domain={[0, 200]} 
                  stroke="var(--ame-muted)" 
                  fontSize={8} 
                  tickFormatter={(val) => `${val}`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--ame-panel-bg)', border: '1px solid var(--ame-border)', fontSize: '10px' }}
                  itemStyle={{ color: 'var(--ame-accent)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="fps" 
                  stroke="var(--ame-accent)" 
                  fillOpacity={1} 
                  fill="url(#colorFps)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-ame-panel-bg/40 border border-ame-border p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2">
             <span className="text-[10px] font-bold text-ame-muted uppercase tracking-widest">Resource Allocation (GPU/CPU)</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory}>
                <defs>
                  <linearGradient id="colorGpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ame-border)" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  hide={true}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="var(--ame-muted)" 
                  fontSize={8} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--ame-panel-bg)', border: '1px solid var(--ame-border)', fontSize: '10px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="gpu" 
                  stroke="#38BDF8" 
                  fillOpacity={1} 
                  fill="url(#colorGpu)" 
                  stackId="1"
                  isAnimationActive={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#fbbf24" 
                  fillOpacity={1} 
                  fill="url(#colorCpu)" 
                  stackId="2"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, unit, color }: any) => (
  <div className="bg-ame-panel-bg/20 border border-ame-border p-3 flex flex-col gap-1 transition-all hover:bg-ame-panel-bg/40">
    <div className="flex items-center gap-2 mb-1">
      <Icon className={`w-3 h-3 ${color}`} />
      <span className="text-[8px] font-bold text-ame-muted uppercase tracking-tighter">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className={`text-xl font-mono font-bold ${color} tracking-tighter`}>{value}</span>
      <span className="text-[9px] text-ame-muted uppercase">{unit}</span>
    </div>
  </div>
);
