# AME UI Architecture Guide

This document outlines the internal architecture and patterns of the AME UI Workbench to assist in future refactoring and integration with production backends.

## 1. State Management (Zustand)
The core engine state resides in `/src/store/useEngineStore.ts`. 

### Key State Domains:
- **Scene State**: `nodes`, `selectedNodeId`. Follows a USD-adjacent flat structure for performance.
- **Inference State**: `models`, `inferenceHistory`, `routing`. Manages AI model selection and routing logic.
- **Telemetry State**: `sensors` and `mcap` recording status.
- **Workflow State**: `workflowNodes` and `workflowEdges` for the Studio Canvas.

### Integration Path:
To connect to a real backend (e.g., WebSocket or gRPC-web), inject a middleware or an effect within the store initialization to sync local state with remote updates.

## 2. Command Console Pattern
The **Meta Console** uses a command-processing architecture. 
- **Universal Search**: Fuzzy matching against nodes, models, and assets.
- **Slash Commands**: Extensible via `processCommand` in the store.
- **Adding Commands**: 
  To add a new command, update the `switch` statement in `/src/store/useEngineStore.ts`:
  ```typescript
  case 'deploy':
    // Trigger deployment logic
    break;
  ```

## 3. Workflow Studio (Konva Engine)
The Canvas uses `react-konva` for a declarative approach to the 2D scene.
- **Coordinate System**: Uses absolute canvas coordinates.
- **Port Logic**: Ports are defined within `WorkflowNode`. Edges connect `fromNodeId:fromPortId` to `toNodeId:toPortId`.
- **Scaling**: The stage is draggable and supports coordinate transformation logic.

## 4. Facet-Based Inspector
The Inspector is modular. Each `SceneNode` has an array of `facets`. 
- **Facet Types**: `Visual`, `Physics`, `Sensor`, `Provenance`.
- **Custom Facets**: To add a new parameter block, define a new `FacetType` in `/src/types.ts` and update the `FacetPanel` component in `/src/components/Inspector.tsx`.

## 5. Development Guidelines
- **Density First**: Avoid large margins. Use `p-1`, `p-2`, or `gap-1`.
- **Transparency**: Use backdrop blurs (`backdrop-blur-md`) and semi-transparent backgrounds to maintain spatial awareness.
- **Animations**: Use `motion` for all non-canvas state transitions. For canvas-based animations (like edge pulsing), use Konva's built-in `Animation` or `Tween` classes.
