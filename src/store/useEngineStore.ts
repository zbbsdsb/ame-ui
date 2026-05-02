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
  updateStats: (updates: Partial<EngineStats>) => void;
}

const INITIAL_NODES: SceneNode[] = [
  {
    id: 'root',
    name: 'root_scene',
    type: 'root',
    parentId: null,
    properties: { visible: true, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'cam_01',
    name: 'main_camera',
    type: 'camera',
    parentId: 'root',
    properties: { visible: true, position: [0, 1.42, -5], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'light_01',
    name: 'global_light',
    type: 'light',
    parentId: 'root',
    properties: { visible: true, position: [10, 10, 10], rotation: [0, 0, 0], scale: [1, 1, 1] }
  },
  {
    id: 'mesh_01',
    name: '3dgs_mesh_data_01',
    type: 'mesh',
    parentId: 'root',
    properties: { 
      visible: true, 
      position: [0, 1.42, -0.12], 
      rotation: [0, 90, 0], 
      scale: [1, 1, 1],
      params: { pointScale: 1.05, shDegree: 3, opacityThreshold: 0.05 }
    }
  }
];

export const useEngineStore = create<EngineState>((set) => ({
  nodes: INITIAL_NODES,
  selectedNodeId: 'mesh_01',
  selectNode: (id) => set({ selectedNodeId: id }),
  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map(node => node.id === id ? { ...node, ...updates } : node)
  })),
  
  logs: [
    { id: '1', timestamp: '14:20:11', source: 'SYSTEM', level: 'INFO', message: 'AME Engine core successfully initialized.' },
    { id: '2', timestamp: '14:20:12', source: 'VULKAN', level: 'INFO', message: 'Found physical device: NVIDIA GeForce RTX 4090 (24564 MB)' },
    { id: '3', timestamp: '14:20:13', source: 'RENDER', level: 'INFO', message: 'Allocating 3.2M gaussians to GPU buffers...' },
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
    status: 'READY'
  },
  updateStats: (updates) => set((state) => ({
    stats: { ...state.stats, ...updates }
  }))
}));
