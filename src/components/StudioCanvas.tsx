import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Group, Rect, Text, Path, Circle } from 'react-konva';
import { useEngineStore } from '../store/useEngineStore';
import { nanoid } from 'nanoid';
import { WorkflowNode, WorkflowEdge, WorkflowPort } from '../types';

const NODE_WIDTH = 180;
const PORT_RADIUS = 5;
const HEADER_HEIGHT = 24;

export const StudioCanvas = () => {
  const { 
    workflowNodes, 
    workflowEdges, 
    updateWorkflowNode, 
    connectPorts, 
    removeWorkflowEdge, 
    removeWorkflowNode,
    isStudioExpanded, 
    setStudioExpanded, 
    addWorkflowNode 
  } = useEngineStore();
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragEdge, setDragEdge] = useState<{fromNodeId: string, fromPortId: string, startX: number, startY: number, currentX: number, currentY: number} | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredPort, setHoveredPort] = useState<{nodeId: string, portId: string} | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        if (selectedId.startsWith('node_')) {
          removeWorkflowNode(selectedId);
        } else if (selectedId.startsWith('edge_')) {
          removeWorkflowEdge(selectedId);
        }
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, removeWorkflowNode, removeWorkflowEdge]);

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
    <div ref={containerRef} className="flex-1 bg-[#020202] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #A7F3D0 1px, transparent 1px)',
          backgroundSize: '20px 20px' 
        }} 
      />

      <Stage 
        width={dimensions.width} 
        height={dimensions.height} 
        draggable={!dragEdge}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={() => setSelectedId(null)}
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
              <Path
                key={edge.id}
                data={drawBezier(fromPos.x, fromPos.y, toPos.x, toPos.y)}
                stroke={selectedId === edge.id ? '#A7F3D0' : '#A7F3D066'}
                strokeWidth={selectedId === edge.id ? 3 : 2}
                onClick={(e) => {
                  e.cancelBubble = true;
                  setSelectedId(edge.id);
                }}
              />
            );
          })}

          {/* Active Drag Edge */}
          {dragEdge && (
            <Path
              data={drawBezier(dragEdge.startX, dragEdge.startY, dragEdge.currentX, dragEdge.currentY)}
              stroke="#A7F3D0"
              strokeWidth={2}
              dash={[5, 5]}
            />
          )}

          {/* Nodes */}
          {workflowNodes.map(node => (
            <Group
              key={node.id}
              x={node.position.x}
              y={node.position.y}
              draggable
              onDragMove={(e) => handleDragMove(node.id, e)}
              onClick={(e) => {
                e.cancelBubble = true;
                setSelectedId(node.id);
              }}
            >
              {/* Box */}
              <Rect
                width={NODE_WIDTH}
                height={60 + Math.max(node.inputs.length, node.outputs.length) * 20}
                fill="#0a0a0a"
                stroke={selectedId === node.id ? '#A7F3D0' : '#1e293b'}
                strokeWidth={selectedId === node.id ? 2 : 1}
                cornerRadius={2}
                shadowBlur={selectedId === node.id ? 20 : 0}
                shadowColor="#A7F3D033"
              />
              
              {/* Header */}
              <Rect
                width={NODE_WIDTH}
                height={HEADER_HEIGHT}
                fill={selectedId === node.id ? '#A7F3D011' : '#0f172a'}
                cornerRadius={[2, 2, 0, 0]}
              />
              <Text
                text={node.name}
                fontSize={9}
                fontStyle="bold"
                fill={selectedId === node.id ? '#A7F3D0' : '#cbd5e1'}
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
                    fill="#3b82f6" 
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
                    fill="#10b981" 
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
          ))}
        </Layer>
      </Stage>

      {/* Control Overlay */}
      <div className="absolute top-4 left-4 flex gap-2">
        <button 
          onClick={() => addWorkflowNode({
            type: 'LOGIC',
            name: `Logic_Gate_${nanoid(4)}`,
            position: { x: 50, y: 50 },
            inputs: [{ id: nanoid(), name: 'IN', type: 'IN', dataType: 'DATA' }],
            outputs: [{ id: nanoid(), name: 'OUT', type: 'OUT', dataType: 'DATA' }],
            data: {}
          })}
          className="bg-black/80 border border-ame-accent/30 px-3 py-1 text-[10px] text-ame-accent font-bold font-mono hover:bg-ame-accent hover:text-black transition-colors uppercase"
        >
          + Add Node
        </button>
        {!isStudioExpanded && (
          <button 
            onClick={() => setStudioExpanded(true)}
            className="bg-black/80 border border-ame-border px-3 py-1 text-[10px] text-white font-bold font-mono hover:bg-white hover:text-black transition-colors uppercase"
          >
            Expand Studio
          </button>
        )}
        <div className="bg-black/60 px-3 py-1 border border-ame-border text-[9px] text-slate-500 font-mono flex items-center gap-2 uppercase">
          Workflow Status: <span className="text-emerald-500">Active</span>
        </div>
      </div>
    </div>
  );
};
