import { create } from 'zustand';
import { SceneNode, LogEntry, EngineStats } from '../types';

export interface ModelEntry {
  id: string;
  name: string;
  tier: 'P0' | 'P1' | 'P2'; // P0: Local/Private, P1: Controlled Commercial, P2: Public
  status: 'ONLINE' | 'OFFLINE' | 'LATENCY_HIGH';
  latency: number;
}

export interface InferenceLog {
  id: string;
  timestamp: string;
  modelId: string;
  entityId: string | null;
  latency: number;
  tokens: number;
  routingPath: string;
}

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
  
  // Model Router
  models: ModelEntry[];
  inferenceHistory: InferenceLog[];
  
  // Engine
  stats: EngineStats;
  routing: {
    active: boolean;
    lastModel: string;
    targetEntity: string | null;
    path: string;
  };
  updateStats: (updates: Partial<EngineStats>) => void;
  switchAdapter: (adapter: 'UNREAL' | 'UNITY') => void;
  triggerInference: (modelId: string, entityId: string | null) => void;
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
  models: [
    { id: 'gpt-4o', name: 'OpenAI GPT-4o', tier: 'P1', status: 'ONLINE', latency: 450 },
    { id: 'vllm-llama3', name: 'vLLM Llama-3-70B', tier: 'P0', status: 'ONLINE', latency: 42 },
    { id: 'gemini-1.5', name: 'Gemini 1.5 Pro', tier: 'P1', status: 'ONLINE', latency: 280 },
    { id: 'deepseek-coder', name: 'DeepSeek Coder', tier: 'P2', status: 'ONLINE', latency: 1200 },
  ],
  inferenceHistory: [],
  routing: {
    active: false,
    lastModel: 'GPT-4o',
    targetEntity: null,
    path: 'DIRECT_ROUTE'
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
  triggerInference: (modelId, entityId) => {
    const { models, addLog } = useEngineStore.getState();
    const model = models.find(m => m.id === modelId) || models[0];
    const path = model.tier === 'P0' ? 'LOCAL_SECURE_BYPASS' : model.tier === 'P1' ? 'MANAGED_PROXY_SAAS' : 'PUBLIC_GATEWAY';

    set({ routing: { active: true, lastModel: model.name, targetEntity: entityId, path }});
    
    addLog({
      source: 'METACLASS',
      level: 'INFO',
      message: `ROUTING: [${model.tier}] ${model.name} -> ${path}`
    });

    setTimeout(() => {
      const historyEntry: InferenceLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString('en-GB'),
        modelId,
        entityId,
        latency: model.latency + Math.random() * 50,
        tokens: Math.floor(Math.random() * 1000),
        routingPath: path
      };

      set((state) => ({ 
        routing: { ...state.routing, active: false },
        inferenceHistory: [historyEntry, ...state.inferenceHistory].slice(0, 50)
      }));
      
      addLog({
        source: 'METACLASS',
        level: 'OK',
        message: `INFERENCE_COMPLETE: ${model.name} (${historyEntry.latency.toFixed(1)}ms)`
      });
    }, 1000);
  }
}));
