import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Group, Rect, Text, Path, Circle } from 'react-konva';
import { useEngineStore } from '../store/useEngineStore';
import { nanoid } from 'nanoid';
import { WorkflowNode, WorkflowEdge, WorkflowPort } from '../types';

const NODE_WIDTH = 180;
const PORT_RADIUS = 5;
const HEADER_HEIGHT = 24;

export const StudioCanvas = () => {
  const { workflowNodes, workflowEdges, updateWorkflowNode, connectPorts, isStudioExpanded, setStudioExpanded, addWorkflowNode } = useEngineStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragEdge, setDragEdge] = useState<{fromNodeId: string, fromPortId: string, x: number, y: number} | null>(null);

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

  const handleDragMove = (id: string, e: any) => {
    updateWorkflowNode(id, { position: { x: e.target.x(), y: e.target.y() } });
  };

  const drawBezier = (x1: number, y1: number, x2: number, y2: number) => {
    const cp1x = x1 + (x2 - x1) / 2;
    const cp2x = x1 + (x2 - x1) / 2;
    return `M ${x1} ${y1} C ${cp1x} ${y1} ${cp2x} ${y2} ${x2} ${y2}`;
  };

  return (
    <div ref={containerRef} className="flex-1 bg-[#050505] relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #A7F3D0 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} 
      />

      <Stage width={dimensions.width} height={dimensions.height} draggable>
        <Layer>
          {/* Edges */}
          {workflowEdges.map(edge => {
            const fromNode = workflowNodes.find(n => n.id === edge.fromNodeId);
            const toNode = workflowNodes.find(n => n.id === edge.toNodeId);
            if (!fromNode || !toNode) return null;

            const fromY = fromNode.position.y + HEADER_HEIGHT + 20; // Simplified port pos
            const toY = toNode.position.y + HEADER_HEIGHT + 20;

            return (
              <Path
                key={edge.id}
                data={drawBezier(
                  fromNode.position.x + NODE_WIDTH, fromY,
                  toNode.position.x, toY
                )}
                stroke="#A7F3D0"
                strokeWidth={2}
                opacity={0.5}
              />
            );
          })}

          {/* Active Drag Edge */}
          {dragEdge && (
            <Path
              data={drawBezier(dragEdge.x, dragEdge.y, dragEdge.x + 50, dragEdge.y)} // Dummy
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
            >
              {/* Box */}
              <Rect
                width={NODE_WIDTH}
                height={60 + (node.inputs.length + node.outputs.length) * 15}
                fill="#111"
                stroke="#333"
                strokeWidth={1}
                cornerRadius={4}
                shadowBlur={10}
                shadowColor="black"
                shadowOpacity={0.5}
              />
              
              {/* Header */}
              <Rect
                width={NODE_WIDTH}
                height={HEADER_HEIGHT}
                fill="#1a1a1a"
                cornerRadius={[4, 4, 0, 0]}
              />
              <Text
                text={node.name}
                fontSize={10}
                fontStyle="bold"
                fill="#A7F3D0"
                x={10}
                y={7}
                fontFamily="monospace"
              />

              {/* Ports */}
              {node.inputs.map((p, i) => (
                <Group key={p.id} y={HEADER_HEIGHT + 15 + i * 20}>
                  <Circle x={0} radius={PORT_RADIUS} fill="#3b82f6" stroke="#000" strokeWidth={1} />
                  <Text text={p.name} fontSize={8} fill="#666" x={10} y={-4} fontFamily="monospace" />
                </Group>
              ))}

              {node.outputs.map((p, i) => (
                <Group key={p.id} y={HEADER_HEIGHT + 15 + i * 20}>
                  <Circle x={NODE_WIDTH} radius={PORT_RADIUS} fill="#10b981" stroke="#000" strokeWidth={1} />
                  <Text text={p.name} fontSize={8} fill="#666" x={NODE_WIDTH - 60} y={-4} align="right" width={50} fontFamily="monospace" />
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
