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

export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'SYSTEM' | 'VULKAN' | '3DGS' | 'RENDER' | 'CORE' | 'METACLASS' | 'USD';
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
