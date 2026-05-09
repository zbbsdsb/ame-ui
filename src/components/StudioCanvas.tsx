import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Group, Rect, Text, Path, Circle } from 'react-konva';
import { useEngineStore } from '../store/useEngineStore';
import { nanoid } from 'nanoid';
import { WorkflowNode, WorkflowEdge, WorkflowPort } from '../types';
import { 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Settings2, 
  Database, 
  Zap, 
  Activity, 
  GitBranch, 
  Sparkles, 
  Terminal,
  Search
} from 'lucide-react';

const NODE_WIDTH = 180;
const PORT_RADIUS = 5;
const HEADER_HEIGHT = 24;

const MenuButton = ({ onClick, label, accent, icon: Icon }: { onClick: () => void, label: string, accent?: string, icon?: any }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 bg-ame-panel-bg/80 border px-3 py-1.5 text-[9px] font-bold font-mono hover:text-black transition-colors uppercase group whitespace-nowrap"
    style={{ 
      borderColor: accent || 'var(--ame-border)', 
      color: accent || 'var(--ame-text)',
      backgroundColor: 'rgba(2, 2, 2, 0.8)'
    }}
    onMouseEnter={(e) => {
      if (accent) e.currentTarget.style.backgroundColor = accent;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(2, 2, 2, 0.8)';
    }}
  >
    {Icon && <Icon className="w-3 h-3 group-hover:scale-110 transition-transform" style={{ color: accent }} />}
    {label}
  </button>
);

const NodeLibrary = ({ onAdd, accentColor }: { onAdd: (node: any) => void, accentColor: string }) => {
  const [search, setSearch] = useState('');
  
  const nodes = [
    { type: 'AI_INFERENCE', category: 'AI', name: 'Gemini Lens', icon: Sparkles, color: accentColor, inputs: [{name: 'Prompt', dataType: 'DATA'}], outputs: [{name: 'Result', dataType: 'DATA'}]},
    { type: 'MATH_THRESHOLD', category: 'MATH', name: 'Threshold', icon: Zap, color: '#fb923c', inputs: [{name: 'In', dataType: 'SIGNAL'}], outputs: [{name: 'Above', dataType: 'SIGNAL'}, {name: 'Below', dataType: 'SIGNAL'}]},
    { type: 'LOGIC_AND', category: 'LOGIC', name: 'Logic AND', icon: GitBranch, color: '#a855f7', inputs: [{name: 'A', dataType: 'SIGNAL'}, {name: 'B', dataType: 'SIGNAL'}], outputs: [{name: 'Out', dataType: 'SIGNAL'}]},
    { type: 'LOGIC_OR', category: 'LOGIC', name: 'Logic OR', icon: GitBranch, color: '#a855f7', inputs: [{name: 'A', dataType: 'SIGNAL'}, {name: 'B', dataType: 'SIGNAL'}], outputs: [{name: 'Out', dataType: 'SIGNAL'}]},
    { type: 'SENSOR_LIDAR', category: 'SENSOR', name: 'Lidar Input', icon: Database, color: '#3b82f6', inputs: [], outputs: [{name: 'Cloud', dataType: 'SENSOR'}]},
    { type: 'ACTION_BRAKE', category: 'ACTION', name: 'Brake Cmd', icon: Activity, color: '#f43f5e', inputs: [{name: 'Trigger', dataType: 'SIGNAL'}], outputs: []},
  ];

  const filtered = nodes.filter(n => n.name.toLowerCase().includes(search.toLowerCase()) || n.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-3 w-64">
      <div className="bg-ame-panel-bg/90 border border-ame-border p-3 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Terminal className="w-3 h-3 text-ame-accent" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-ame-text">Node Library</span>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-ame-muted" />
          <input 
            type="text" 
            placeholder="Search nodes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-ame-bg/50 border border-ame-border px-7 py-1.5 text-[9px] font-mono text-ame-text outline-none focus:border-ame-accent transition-colors"
          />
        </div>
        <div className="space-y-1 max-h-60 overflow-y-auto no-scrollbar">
          {filtered.map(node => (
            <MenuButton 
              key={node.type}
              onClick={() => onAdd({
                type: node.type,
                category: node.category,
                name: node.name,
                position: { x: 400, y: 300 },
                inputs: node.inputs.map(i => ({ ...i, id: nanoid(), type: 'IN' })),
                outputs: node.outputs.map(o => ({ ...o, id: nanoid(), type: 'OUT' })),
                data: {}
              })}
              label={node.name}
              accent={node.color}
              icon={node.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const StudioCanvas = () => {
  const { 
    workflowNodes, 
    workflowEdges, 
    updateWorkflowNode, 
    connectPorts, 
    deleteWorkflowEdge, 
    deleteWorkflowNode,
    isStudioExpanded, 
    setStudioExpanded, 
    addWorkflowNode,
    isWorkflowRunning,
    setWorkflowRunning,
    theme,
    workflowViewport,
    setWorkflowViewport,
    selectedWorkflowNodeId,
    setSelectedWorkflowNodeCard
  } = useEngineStore();

  const CATEGORY_COLORS = {
    SENSOR: '#3b82f6', // Blue
    LOGIC: '#a855f7', // Purple
    MATH: '#fb923c', // Orange
    ACTION: '#f43f5e', // Red
    OUTPUT: '#10b981', // Emerald
    AI: '#DEFF9A'      // Theme Accent (Emerald)
  };

  const themeColors = {
    EMERALD: '#A7F3D0',
    SPACE_BLUE: '#38BDF8',
    ONIX: '#94A3B8',
    SNOW: '#0F172A',
    ROSE_RED: '#F43F5E',
    OASIS_GREEN: '#10B981',
  };

  const accentColor = themeColors[theme] || themeColors.EMERALD;
  const isSnow = theme === 'SNOW';
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragEdge, setDragEdge] = useState<{fromNodeId: string, fromPortId: string, startX: number, startY: number, currentX: number, currentY: number} | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredPort, setHoveredPort] = useState<{nodeId: string, portId: string} | null>(null);
  const [dashOffset, setDashOffset] = useState(0);

  // Animation Loop for Flow
  useEffect(() => {
    let animId: number;
    const animate = () => {
      if (isWorkflowRunning) {
        setDashOffset(prev => (prev + 1) % 40);
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isWorkflowRunning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        if (selectedId.startsWith('node_')) {
          deleteWorkflowNode(selectedId);
        } else if (selectedId.startsWith('edge_')) {
          deleteWorkflowEdge(selectedId);
        }
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, deleteWorkflowNode, deleteWorkflowEdge]);

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const getPortPos = (node: WorkflowNode, portId: string) => {
    const isInput = node.inputs.find(p => p.id === portId);
    const index = isInput 
      ? node.inputs.findIndex(p => p.id === portId)
      : node.outputs.findIndex(p => p.id === portId);
    
    const x = isInput ? node.position.x : node.position.x + NODE_WIDTH;
    const y = node.position.y + HEADER_HEIGHT + 15 + index * 20;
    return { x, y };
  };

  const handleDragMove = (id: string, e: any) => {
    const x = Math.round(e.target.x() / 10) * 10;
    const y = Math.round(e.target.y() / 10) * 10;
    updateWorkflowNode(id, { position: { x, y } });
  };

  const drawBezier = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x2 - x1) * 0.5;
    return `M ${x1} ${y1} C ${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
  };

  const onPortMouseDown = (nodeId: string, portId: string, e: any) => {
    const node = workflowNodes.find(n => n.id === nodeId);
    if (!node) return;
    const pos = getPortPos(node, portId);
    setDragEdge({
      fromNodeId: nodeId,
      fromPortId: portId,
      startX: pos.x,
      startY: pos.y,
      currentX: pos.x,
      currentY: pos.y
    });
  };

  const onMouseMove = (e: any) => {
    if (dragEdge) {
      const stage = e.target.getStage();
      const pointerPos = stage.getPointerPosition();
      // Adjust for stage transform
      const x = (pointerPos.x - stage.x()) / stage.scaleX();
      const y = (pointerPos.y - stage.y()) / stage.scaleY();
      setDragEdge({ ...dragEdge, currentX: x, currentY: y });
    }
  };

  const handleZoom = (e: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const scaleBy = 1.05;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.min(Math.max(newScale, 0.2), 3);

    setWorkflowViewport({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
      zoom: clampedScale,
    });
  };

  const onMouseUp = () => {
    if (dragEdge && hoveredPort) {
      // Connect
      if (dragEdge.fromNodeId !== hoveredPort.nodeId) {
        connectPorts(dragEdge.fromNodeId, dragEdge.fromPortId, hoveredPort.nodeId, hoveredPort.portId);
      }
    }
    setDragEdge(null);
  };

  return (
    <div ref={containerRef} className="flex-1 bg-ame-bg relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(circle, ${accentColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px' 
        }} 
      />

      <Stage 
        width={dimensions.width} 
        height={dimensions.height} 
        draggable={!dragEdge}
        scaleX={workflowViewport.zoom}
        scaleY={workflowViewport.zoom}
        x={workflowViewport.x}
        y={workflowViewport.y}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onWheel={handleZoom}
        onDragEnd={(e) => {
          setWorkflowViewport({
            x: e.target.x(),
            y: e.target.y(),
            zoom: e.target.scaleX(),
          });
        }}
        onClick={() => {
          setSelectedId(null);
          setSelectedWorkflowNodeCard(null);
        }}
      >
        <Layer>
          {/* Edges */}
          {workflowEdges.map(edge => {
            const fromNode = workflowNodes.find(n => n.id === edge.fromNodeId);
            const toNode = workflowNodes.find(n => n.id === edge.toNodeId);
            if (!fromNode || !toNode) return null;

            const fromPos = getPortPos(fromNode, edge.fromPortId);
            const toPos = getPortPos(toNode, edge.toPortId);

            return (
              <Group key={edge.id}>
                <Path
                  data={drawBezier(fromPos.x, fromPos.y, toPos.x, toPos.y)}
                  stroke={selectedId === edge.id ? accentColor : `${accentColor}22`}
                  strokeWidth={2}
                  dash={isWorkflowRunning ? [8, 4] : undefined}
                  dashOffset={-dashOffset}
                  onClick={(e) => {
                    e.cancelBubble = true;
                    setSelectedId(edge.id);
                  }}
                />
                {isWorkflowRunning && (
                  <Path
                    data={drawBezier(fromPos.x, fromPos.y, toPos.x, toPos.y)}
                    stroke={accentColor}
                    strokeWidth={2}
                    dash={[4, 16]}
                    dashOffset={-dashOffset}
                    opacity={0.8}
                    listening={false}
                  />
                )}
                {isWorkflowRunning && [0, 0.33, 0.66].map((offset, idx) => (
                  <Circle 
                    key={idx}
                    radius={2}
                    fill={isSnow ? accentColor : "#fff"}
                    shadowBlur={5}
                    shadowColor={accentColor}
                    opacity={0.4}
                    listening={false}
                    ref={(circleRef) => {
                      if (circleRef) {
                        const pathData = drawBezier(fromPos.x, fromPos.y, toPos.x, toPos.y);
                        // progress tied to dashOffset plus per-packet offset
                        const progress = (((dashOffset + (offset * 40)) * 2) % 100) / 100;
                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', pathData);
                        const len = path.getTotalLength();
                        const p = path.getPointAtLength(len * progress);
                        circleRef.position({ x: p.x, y: p.y });
                        circleRef.opacity(0.1 + Math.sin(progress * Math.PI) * 0.5);
                      }
                    }}
                  />
                ))}
              </Group>
            );
          })}

          {/* Active Drag Edge */}
          {dragEdge && (
            <Path
              data={drawBezier(dragEdge.startX, dragEdge.startY, dragEdge.currentX, dragEdge.currentY)}
              stroke={accentColor}
              strokeWidth={2}
              dash={[5, 5]}
            />
          )}

          {/* Nodes */}
          {workflowNodes.map(node => {
            const isSelected = selectedId === node.id || selectedWorkflowNodeId === node.id;
            const categoryColor = CATEGORY_COLORS[node.category || 'LOGIC'] || '#64748b';

            return (
              <Group
                key={node.id}
                x={node.position.x}
                y={node.position.y}
                draggable
                onDragMove={(e) => handleDragMove(node.id, e)}
                onClick={(e) => {
                  e.cancelBubble = true;
                  setSelectedId(node.id);
                  setSelectedWorkflowNodeCard(node.id);
                }}
              >
                {/* Box */}
                <Rect
                  width={NODE_WIDTH}
                  height={60 + Math.max(node.inputs.length, node.outputs.length) * 20}
                  fill={isSnow ? "#f1f5f9" : "#0a0a0a"}
                  stroke={isSelected ? accentColor : (isSnow ? '#e2e8f0' : '#1e293b')}
                  strokeWidth={isSelected ? 2 : 1}
                  cornerRadius={2}
                  shadowBlur={isSelected ? 20 : 0}
                  shadowColor={`${accentColor}33`}
                  opacity={0}
                  onMouseEnter={(e) => {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = 'move';
                  }}
                  onMouseLeave={(e) => {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = 'default';
                  }}
                  ref={(nodeRef) => {
                    if (nodeRef && nodeRef.opacity() === 0) {
                      nodeRef.to({
                        opacity: 1,
                        duration: 0.5,
                        easing: (t: any) => t * (2 - t)
                      });
                    }
                  }}
                />
                
                {/* Category Indicator Accent */}
                <Rect
                  width={2}
                  height={60 + Math.max(node.inputs.length, node.outputs.length) * 20}
                  fill={categoryColor}
                  cornerRadius={[2, 0, 0, 2]}
                  opacity={0.8}
                />

                {/* Header */}
                <Rect
                  width={NODE_WIDTH}
                  height={HEADER_HEIGHT}
                  fill={isSelected ? `${accentColor}22` : (isSnow ? '#e2e8f0' : '#0f172a')}
                  cornerRadius={[2, 2, 0, 0]}
                  opacity={0.5}
                />
                <Text
                  text={node.name}
                  fontSize={9}
                  fontStyle="bold"
                  fill={isSelected ? accentColor : (isSnow ? '#0f172a' : '#cbd5e1')}
                  x={10}
                  y={8}
                  fontFamily="monospace"
                  letterSpacing={1}
                />

                {/* Ports */}
                {node.inputs.map((p, i) => (
                  <Group key={p.id} y={HEADER_HEIGHT + 15 + i * 20}>
                    <Circle 
                      x={0} 
                      radius={PORT_RADIUS} 
                      fill={categoryColor} 
                      stroke="#000" 
                      strokeWidth={1}
                      onMouseEnter={() => setHoveredPort({nodeId: node.id, portId: p.id})}
                      onMouseLeave={() => setHoveredPort(null)}
                      onMouseDown={(e) => onPortMouseDown(node.id, p.id, e)}
                    />
                    <Text text={p.name} fontSize={8} fill="#64748b" x={10} y={-3} fontFamily="monospace" />
                  </Group>
                ))}

                {node.outputs.map((p, i) => (
                  <Group key={p.id} y={HEADER_HEIGHT + 15 + i * 20}>
                    <Circle 
                      x={NODE_WIDTH} 
                      radius={PORT_RADIUS} 
                      fill={categoryColor} 
                      stroke="#000" 
                      strokeWidth={1}
                      onMouseEnter={() => setHoveredPort({nodeId: node.id, portId: p.id})}
                      onMouseLeave={() => setHoveredPort(null)}
                      onMouseDown={(e) => onPortMouseDown(node.id, p.id, e)}
                    />
                    <Text text={p.name} fontSize={8} fill="#64748b" x={NODE_WIDTH - 60} y={-3} align="right" width={50} fontFamily="monospace" />
                  </Group>
                ))}
              </Group>
            );
          })}
        </Layer>
      </Stage>

      {/* Control Overlay */}
      <NodeLibrary 
        onAdd={(n) => addWorkflowNode(n)} 
        accentColor={accentColor} 
      />

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="flex gap-2">
          {!isStudioExpanded && (
            <button 
              onClick={() => setStudioExpanded(true)}
              className="bg-ame-panel-bg/80 border border-ame-border px-3 py-1 text-[10px] text-ame-text font-bold font-mono hover:bg-ame-text hover:text-ame-bg transition-colors uppercase"
            >
              Expand Studio
            </button>
          )}
          <div className="bg-ame-panel-bg/60 px-3 py-1 border border-ame-border text-[9px] text-ame-muted font-mono flex items-center gap-3 uppercase">
            Workflow Status: 
            <span className={`font-bold ${isWorkflowRunning ? 'text-emerald-500' : 'text-amber-500'}`}>
              {isWorkflowRunning ? 'Streaming' : 'Paused'}
            </span>
            <button 
              onClick={() => setWorkflowRunning(!isWorkflowRunning)}
              className="ml-2 px-2 py-0.5 border border-ame-border hover:border-ame-text transition-colors bg-ame-bg text-ame-text"
            >
              {isWorkflowRunning ? 'STOP' : 'RUN'}
            </button>
          </div>
          <div className="bg-ame-panel-bg/60 px-3 py-1 border border-ame-border text-[9px] text-ame-muted font-mono flex items-center gap-2 uppercase">
             Zoom: <span className="text-ame-accent">{(workflowViewport.zoom * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Mini Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4 text-[8px] font-mono text-slate-600 uppercase tracking-widest">
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Input</div>
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Output</div>
      </div>
    </div>
  );
};
