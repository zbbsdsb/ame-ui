import { create } from 'zustand';
import { SceneNode, LogEntry, EngineStats } from '../types';

interface EngineState {
  // Scene
  nodes: SceneNode[];
  selectedNodeId: string | null;
  selectNode: (id: string | null) => void;
  updateNode: (id: string, updates: Partial<SceneNode>) => void;
  
  // Console
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  
  // Engine
  stats: EngineStats;
  routing: {
    active: boolean;
    lastModel: string;
    targetEntity: string | null;
  };
  updateStats: (updates: Partial<EngineStats>) => void;
  switchAdapter: (adapter: 'UNREAL' | 'UNITY') => void;
  triggerInference: (model: string, entityId: string) => void;
}

const INITIAL_NODES: SceneNode[] = [
  {
    id: 'aeid.root',
    name: 'root_scene',
    parentId: null,
    facets: [
      { 
        type: 'Provenance', 
        schema: 'core.prov', 
        status: 'SYNCHRONIZED', 
        data: { author: 'SYSTEM', created: '14:20:11' } 
      }
    ]
  },
  {
    id: 'aeid.3dgs.01',
    name: '3dgs_mesh_data_01',
    parentId: 'aeid.root',
    facets: [
      { 
        type: 'Visual', 
        schema: 'mesh.3dgs', 
        status: 'SYNCHRONIZED', 
        data: { 
          position: [0, 1.42, -0.12], 
          rotation: [0, 90, 0], 
          scale: [1, 1, 1],
          points: 3219482,
          pointScale: 1.050 
        } 
      },
      { 
        type: 'Physics', 
        schema: 'phys.collider', 
        status: 'STALE', 
        data: { mass: 0, gravity: false } 
      },
      { 
        type: 'Semantic', 
        schema: 'os.metaclass', 
        status: 'DIRTY', 
        data: { class: 'Environment', tags: ['Indoor', 'Scan'] } 
      }
    ]
  },
  {
    id: 'aeid.sensor.01',
    name: 'depth_scanner_01',
    parentId: 'aeid.root',
    facets: [
      { 
        type: 'Visual', 
        schema: 'mesh.proxy', 
        status: 'SYNCHRONIZED', 
        data: { position: [0, 2, 0], rotation: [0, 0, 0], scale: [0.1, 0.1, 0.1] } 
      },
      { 
        type: 'Sensor', 
        schema: 'mcap.lidar', 
        status: 'SYNCHRONIZED', 
        data: { topic: '/ros2/lidar', rate: 10 } 
      }
    ]
  }
];

export const useEngineStore = create<EngineState>((set) => ({
  nodes: INITIAL_NODES,
  selectedNodeId: 'aeid.3dgs.01',
  selectNode: (id) => set({ selectedNodeId: id }),
  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map(node => node.id === id ? { ...node, ...updates } : node)
  })),
  
  logs: [
    { id: '1', timestamp: '14:20:11', source: 'SYSTEM', level: 'INFO', message: 'AME Engine core successfully initialized.' },
    { id: '2', timestamp: '14:20:12', source: 'METACLASS', level: 'OK', message: 'Axiomatic Specification v1.0 (Draft) loaded.' },
    { id: '3', timestamp: '14:20:13', source: 'USD', level: 'INFO', message: 'Stage created: World IR / PointCloud2 active.' },
  ],
  addLog: (log) => set((state) => ({
    logs: [...state.logs, { 
      ...log, 
      id: Math.random().toString(36).substr(2, 9), 
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }).split(' ')[0] 
    }]
  })),
  clearLogs: () => set({ logs: [] }),
  
  stats: {
    fps: 144,
    gpuUsage: 42,
    memory: '2.4GB',
    version: 'v0.8.2-alpha',
    status: 'READY',
    activeAdapter: 'UNREAL'
  },
  routing: {
    active: false,
    lastModel: 'GPT-4o',
    targetEntity: null
  },
  updateStats: (updates) => set((state) => ({
    stats: { ...state.stats, ...updates }
  })),
  switchAdapter: (adapter) => {
    const { stats, addLog } = useEngineStore.getState();
    if (stats.activeAdapter === adapter) return;

    set((state) => ({ 
      stats: { ...state.stats, status: 'PATCHING', activeAdapter: adapter } 
    }));

    addLog({
      source: 'SYSTEM',
      level: 'WNG',
      message: `INITIATING RUNTIME HANDSHAKE: Target ${adapter} Engine...`
    });

    // Simulate Patch Syncing
    setTimeout(() => {
      set((state) => ({ 
        stats: { ...state.stats, status: 'READY' } 
      }));
      addLog({
        source: 'CORE',
        level: 'OK',
        message: `PATCH SYNC COMPLETED: World IR projected to ${adapter} Runtime.`
      });
    }, 1500);
  },
  triggerInference: (model, entityId) => {
    set({ routing: { active: true, lastModel: model, targetEntity: entityId }});
    setTimeout(() => {
      set({ routing: { active: false, lastModel: model, targetEntity: entityId }});
    }, 2000);
  }
}));
