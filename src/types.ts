export type FacetType = 'Visual' | 'Physics' | 'Semantic' | 'Collision' | 'Sensor' | 'Provenance';

export interface Facet {
  type: FacetType;
  schema: string;
  data: Record<string, any>;
  status: 'SYNCHRONIZED' | 'DIRTY' | 'STALE' | 'ERROR';
}

export interface SceneNode {
  id: string; // AEID
  name: string;
  parentId: string | null;
  facets: Facet[];
}

export interface WorkflowPort {
  id: string;
  name: string;
  type: 'IN' | 'OUT';
  dataType: 'DATA' | 'SIGNAL' | 'MODEL' | 'SENSOR';
}

export interface WorkflowNode {
  id: string;
  type: 'SENSOR_BRIDGE' | 'AI_INFERENCE' | 'LOGIC' | 'OUT_USD';
  name: string;
  position: { x: number; y: number };
  inputs: WorkflowPort[];
  outputs: WorkflowPort[];
  data: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  fromNodeId: string;
  fromPortId: string;
  toNodeId: string;
  toPortId: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'SYSTEM' | 'VULKAN' | '3DGS' | 'RENDER' | 'CORE' | 'METACLASS' | 'USD' | 'CLI' | 'USER' | 'META_SEARCH';
  level: 'INFO' | 'OK' | 'WNG' | 'ERR';
  message: string;
}

export interface EngineStats {
  fps: number;
  gpuUsage: number;
  memory: string;
  version: string;
  status: 'READY' | 'LOADING' | 'ERROR' | 'PATCHING';
  activeAdapter: 'UNREAL' | 'UNITY' | 'SOLVER' | 'NONE';
}
