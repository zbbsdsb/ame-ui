# AME UI Architecture Guide

This document outlines the internal architecture and patterns of the AME UI Workbench to assist in future refactoring and integration with production backends.

## 1. Core Architecture: AMAR as the Origin
AMAR UI is the command center for the **AMAR Engine Core**. 
- **The Core**: Performs all deterministic logic, physics validation, and generative AI alignment.
- **The Targets**: UE, Unity, and Blender are treated as **Downstream Viewers** or **Export Slots**. 
- **The Protocol**: Data is streamed via AMAR-Native USD or High-Performance RPC to targets, ensuring "Edit Once, Deploy Anywhere" behavior.

## 2. Exporter Pattern (Formerly Adapters)
We treat external engines as deployment targets.
- **Export Manifests**: Each node in the SceneTree can have specific overrides for different targets (e.g., "UE High-Poly", "Mobile Lite").
- **LiveLink Synchronization**: Real-time sync is a *push* service from AMAR to targets, not a bridge between two equals.

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
