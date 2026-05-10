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
- **Scaling**: The stage is draggable and supports coordinate transformation logic (Viewport zoom/pan state).

## 4. AI Copilot Integration (@google/genai)
The AI Copilot is a side-bar overlay that communicates with the AMAR State Store.
- **Function Calling**: Uses Gemini's function calling capability to bridge natural language to system actions. Currently supports `create_node`.
- **Schema Validation**: AI-generated nodes are validated against the `WorkflowNode` interface before being injected into the Zustand store.
- **Context Handling**: Chat history is preserved in chunks to provide context for iterative workflow refinement.
- **Multi-Model Routing**: Supports dynamic switching between Gemini 3 Flash, 2.0 Pro, and 1.5 Flash based on user selection.

## 5. Facet-Based Inspector
The Inspector is modular. Each `SceneNode` has an array of `facets`. 
- **Facet Types**: `Visual`, `Physics`, `Sensor`, `Provenance`.
- **Custom Facets**: To add a new parameter block, define a new `FacetType` in `/src/types.ts` and update the `FacetPanel` component in `/src/components/Inspector.tsx`.

## 5. Development Guidelines
- **Density First**: Avoid large margins. Use `p-1`, `p-2`, or `gap-1`.
- **Transparency**: Use backdrop blurs (`backdrop-blur-md`) and semi-transparent backgrounds to maintain spatial awareness.
- **Animations**: Use `motion` for all non-canvas state transitions. For canvas-based animations (like edge pulsing), use Konva's built-in `Animation` or `Tween` classes.
