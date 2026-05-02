export interface SceneNode {
  id: string;
  name: string;
  type: 'root' | 'camera' | 'light' | 'mesh' | 'group';
  parentId: string | null;
  properties: {
    visible: boolean;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    params?: Record<string, any>;
  };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'SYSTEM' | 'VULKAN' | '3DGS' | 'RENDER' | 'CORE';
  level: 'INFO' | 'OK' | 'WNG' | 'ERR';
  message: string;
}

export interface EngineStats {
  fps: number;
  gpuUsage: number;
  memory: string;
  version: string;
  status: 'READY' | 'LOADING' | 'ERROR';
}
