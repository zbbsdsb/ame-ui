import { create } from 'zustand';
import { SceneNode, LogEntry, EngineStats, WorkflowNode, WorkflowEdge, TelemetryData } from '../types';

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

export interface SensorStream {
  topic: string;
  type: 'Lidar' | 'Radar' | 'Camera';
  hz: number;
  latency: number;
  status: 'ACTIVE' | 'IDLE' | 'STALE';
}

export type Theme = 'EMERALD' | 'SPACE_BLUE' | 'ONIX' | 'SNOW' | 'ROSE_RED' | 'OASIS_GREEN';

interface EngineState {
  // Sensor Bridge
  sensors: SensorStream[];
  mcap: {
    status: 'RECORDING' | 'PLAYBACK' | 'READY';
    recordingTime: number;
    fileSize: string;
    bufferUsage: number;
  };
  updateMcap: (updates: Partial<EngineState['mcap']>) => void;
  toggleRecording: () => void;
  
  // Meta Search & Commands
  assets: Array<{ id: string, name: string, type: 'MESH' | 'TEXTURE' | 'SCRIPT', status: 'LOADED' | 'REMOTE' }>;
  commandHistory: string[];
  processCommand: (input: string) => void;
  
  // Workflow Studio
  workflowNodes: WorkflowNode[];
  workflowEdges: WorkflowEdge[];
  selectedWorkflowNodeId: string | null;
  workflowViewport: { x: number; y: number; zoom: number };
  aiChatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[];
  isAiLoading: boolean;
  isAiCopilotOpen: boolean;
  aiModel: 'gemini-3-flash' | 'gemini-2.0-pro' | 'gemini-1.5-flash';
  setAiModel: (model: 'gemini-3-flash' | 'gemini-2.0-pro' | 'gemini-1.5-flash') => void;
  setAiCopilotOpen: (open: boolean) => void;
  addAiMessage: (message: { role: 'user' | 'model'; parts: { text: string }[] }) => void;
  setAiLoading: (loading: boolean) => void;
  isStudioExpanded: boolean;
  isWorkflowRunning: boolean;
  setWorkflowRunning: (running: boolean) => void;
  setStudioExpanded: (expanded: boolean) => void;
  setSelectedWorkflowNodeCard: (id: string | null) => void;
  setWorkflowViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  addWorkflowNode: (node: Omit<WorkflowNode, 'id'>) => void;
  updateWorkflowNode: (id: string, updates: Partial<WorkflowNode>) => void;
  deleteWorkflowNode: (id: string) => void;
  deleteWorkflowEdge: (id: string) => void;
  connectPorts: (fromNodeId: string, fromPortId: string, toNodeId: string, toPortId: string) => void;
  
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
  gizmoMode: 'SELECT' | 'TRANSLATE' | 'ROTATE' | 'SCALE';
  setGizmoMode: (mode: 'SELECT' | 'TRANSLATE' | 'ROTATE' | 'SCALE') => void;
  stats: EngineStats;
  telemetryHistory: TelemetryData[];
  pushTelemetry: (data: TelemetryData) => void;
  routing: {
    active: boolean;
    lastModel: string;
    targetEntity: string | null;
    path: string;
  };
  updateStats: (updates: Partial<EngineStats>) => void;
  switchAdapter: (adapter: 'UNREAL' | 'UNITY') => void;
  triggerInference: (modelId: string, entityId: string | null) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
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
  // Meta Actions
  assets: [
    { id: 'as_001', name: 'CYBER_CORE_MESH', type: 'MESH', status: 'LOADED' },
    { id: 'as_002', name: 'NEON_EMISSIVE_TEX', type: 'TEXTURE', status: 'LOADED' },
    { id: 'as_003', name: 'ROUTING_HANDLER_JS', type: 'SCRIPT', status: 'REMOTE' },
  ],
  commandHistory: [],
  processCommand: (input: string) => {
    const { addLog, nodes, models, sensors, assets, triggerInference, selectNode } = useEngineStore.getState();
    const cleanInput = input.trim().toLowerCase();
    
    // @ts-ignore - access internal set
    const set = useEngineStore.setState;

    set(state => ({ commandHistory: [input, ...state.commandHistory].slice(0, 50) }));

    if (!input) return;

    // Meta-Search Logic
    if (cleanInput.length > 1 && !cleanInput.startsWith('/')) {
      const results = [
        ...nodes.map(n => ({ type: 'NODE', name: n.name, id: n.id })),
        ...models.map(m => ({ type: 'MODEL', name: m.name, id: m.id })),
        ...assets.map(a => ({ type: 'ASSET', name: a.name, id: a.id })),
        ...sensors.map(s => ({ type: 'SENSOR', name: s.topic, id: s.topic }))
      ].filter(item => item.name.toLowerCase().includes(cleanInput));

      if (results.length > 0) {
        addLog({
          source: 'META_SEARCH',
          level: 'INFO',
          message: `Found ${results.length} matches: ${results.map(r => r.name).join(', ')}`
        });
        return;
      }
    }

    // Command Logic
    if (input.startsWith('/')) {
      const parts = input.slice(1).split(' ');
      const cmd = parts[0];
      const args = parts.slice(1);

      switch(cmd.toLowerCase()) {
        case 'select':
          const target = nodes.find(n => n.name.toLowerCase().includes(args[0]?.toLowerCase()));
          if (target) {
            selectNode(target.id);
            addLog({ source: 'CLI', level: 'OK', message: `SELECTED_NODE: ${target.name}` });
          }
          break;
        case 'infer':
          const mId = args[0] || 'vllm-llama3';
          const nId = args[1] || useEngineStore.getState().selectedNodeId;
          triggerInference(mId, nId);
          break;
        case 'clear':
          useEngineStore.getState().clearLogs();
          break;
        default:
          addLog({ source: 'CLI', level: 'ERR', message: `UNKNOWN_COMMAND: ${cmd}` });
      }
    } else {
      addLog({ source: 'USER', level: 'INFO', message: input });
    }
  },
  nodes: INITIAL_NODES,
  selectedNodeId: 'aeid.3dgs.01',
  selectNode: (id) => set({ selectedNodeId: id }),
  gizmoMode: 'SELECT',
  setGizmoMode: (mode) => set({ gizmoMode: mode }),
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
  telemetryHistory: [],
  pushTelemetry: (data) => set((state) => ({
    telemetryHistory: [...state.telemetryHistory, data].slice(-40) // Keep last 40 points
  })),
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
  
  // Sensor Actions
  sensors: [
    { topic: '/ros2/lidar_front', type: 'Lidar', hz: 10, latency: 12, status: 'ACTIVE' },
    { topic: '/v1/radar/return', type: 'Radar', hz: 20, latency: 8, status: 'ACTIVE' },
    { topic: '/v1/cam/center', type: 'Camera', hz: 30, latency: 45, status: 'IDLE' },
  ],
  mcap: {
    status: 'READY',
    recordingTime: 0,
    fileSize: '0.0 MB',
    bufferUsage: 0,
  },
  updateMcap: (updates) => set((state) => ({
    mcap: { ...state.mcap, ...updates }
  })),
  toggleRecording: () => set((state) => {
    const isRecording = state.mcap.status === 'RECORDING';
    const nextStatus = isRecording ? 'READY' : 'RECORDING';
    
    state.addLog({
      source: 'SYSTEM',
      level: isRecording ? 'OK' : 'WNG',
      message: isRecording ? 'MCAP Session Stopped. File Finalized.' : 'MCAP Session Started. Recording /ros2/ topics...'
    });

    return { mcap: { ...state.mcap, status: nextStatus, recordingTime: 0 } };
  }),

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
  },
  
  // Workflow Studio Initial State & Actions
  workflowNodes: [
    {
      id: 'node_1',
      type: 'SENSOR_BRIDGE',
      category: 'SENSOR',
      name: 'Lidar_Front',
      position: { x: 50, y: 150 },
      inputs: [],
      outputs: [{ id: 'out_pc', name: 'PC2', type: 'OUT', dataType: 'SENSOR' }],
      data: {}
    },
    {
      id: 'node_math',
      type: 'MATH_THRESHOLD',
      category: 'MATH',
      name: 'Depth_Filter',
      position: { x: 300, y: 150 },
      inputs: [{ id: 'in_pc', name: 'IN', type: 'IN', dataType: 'SENSOR' }],
      outputs: [
        { id: 'out_near', name: 'NEAR', type: 'OUT', dataType: 'SIGNAL' },
        { id: 'out_far', name: 'FAR', type: 'OUT', dataType: 'SIGNAL' }
      ],
      data: { threshold: 2.5 }
    },
    {
      id: 'node_logic',
      type: 'CONDITION',
      category: 'LOGIC',
      name: 'Safety_Check',
      position: { x: 550, y: 150 },
      inputs: [{ id: 'in_sig', name: 'TRIG', type: 'IN', dataType: 'SIGNAL' }],
      outputs: [
        { id: 'out_true', name: 'PASS', type: 'OUT', dataType: 'SIGNAL' },
        { id: 'out_false', name: 'FAIL', type: 'OUT', dataType: 'SIGNAL' }
      ],
      data: { invert: false }
    },
    { 
      id: 'node_ex_1', 
      type: 'OUT_USD', 
      category: 'OUTPUT',
      name: 'USD_Exporter', 
      position: { x: 800, y: 150 }, 
      inputs: [{ id: 'p_in', name: 'AMAR_PAYLOAD', type: 'IN', dataType: 'DATA' }], 
      outputs: [
        { id: 'p_ue', name: 'UE5', type: 'OUT', dataType: 'SIGNAL' },
        { id: 'p_unity', name: 'UNITY', type: 'OUT', dataType: 'SIGNAL' }
      ],
      data: { format: 'USD_BINARY' } 
    },
  ],
  workflowEdges: [
    { id: 'edge_1', fromNodeId: 'node_1', fromPortId: 'out_pc', toNodeId: 'node_math', toPortId: 'in_pc' },
    { id: 'edge_2', fromNodeId: 'node_math', fromPortId: 'out_near', toNodeId: 'node_logic', toPortId: 'in_sig' }
  ],
  selectedWorkflowNodeId: null,
  workflowViewport: { x: 0, y: 0, zoom: 1 },
  aiChatHistory: [
    { role: 'model', parts: [{ text: "Hello! I am AMAR Copilot. I can help you build and debug workflows. What logic should we implement today?" }] }
  ],
  isAiLoading: false,
  isAiCopilotOpen: false,
  aiModel: 'gemini-3-flash',
  setAiModel: (model) => set({ aiModel: model }),
  setAiCopilotOpen: (open) => set({ isAiCopilotOpen: open }),
  addAiMessage: (msg) => set((state) => ({ aiChatHistory: [...state.aiChatHistory, msg] })),
  setAiLoading: (loading) => set({ isAiLoading: loading }),
  isStudioExpanded: false,
  isWorkflowRunning: true,
  setWorkflowRunning: (running) => set({ isWorkflowRunning: running }),
  setStudioExpanded: (expanded) => set({ isStudioExpanded: expanded }),
  setSelectedWorkflowNodeCard: (id) => set({ selectedWorkflowNodeId: id }),
  setWorkflowViewport: (viewport) => set({ workflowViewport: viewport }),
  addWorkflowNode: (node) => set((state) => ({
    workflowNodes: [...state.workflowNodes, { ...node, id: `node_${Math.random().toString(36).substr(2, 9)}` }]
  })),
  updateWorkflowNode: (id, updates) => set((state) => ({
    workflowNodes: state.workflowNodes.map(n => n.id === id ? { ...n, ...updates } : n)
  })),
  connectPorts: (fromNodeId, fromPortId, toNodeId, toPortId) => set((state) => ({
    workflowEdges: [...state.workflowEdges, { 
      id: `edge_${Math.random().toString(36).substr(2, 9)}`, 
      fromNodeId, fromPortId, toNodeId, toPortId 
    }]
  })),
  deleteWorkflowEdge: (id) => set((state) => ({
    workflowEdges: state.workflowEdges.filter(e => e.id !== id)
  })),
  deleteWorkflowNode: (id) => set((state) => ({
    workflowNodes: state.workflowNodes.filter(n => n.id !== id),
    workflowEdges: state.workflowEdges.filter(e => e.fromNodeId !== id && e.toNodeId !== id)
  })),
  theme: 'EMERALD',
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
}));
