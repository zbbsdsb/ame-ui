# AME UI: Industrial Core for AMAR Engine

AME UI is the official, industrial-grade interface system for **AMAR Engine**. Unlike generic web component libraries, AME UI is a **productivity system** engineered specifically for world-building, spatial computing, and 3DGS (Gaussian Splatting) workflows.

---

## 🏗 Core Positioning

### 1. Process-Oriented Components
Every component in AME UI represents a specific "production step." It is designed to handle high-density spatial data, complex hierarchical structures, and real-time rendering feedbacks. Components are "bricks" that assemble through strict logical interfaces rather than simple visual nesting.

### 2. Aesthetic Austerity
The design language rejects "internet-style" trends. It fuses **Swiss Minimalism** (rigorous grid systems) with **Hardcore Industrial Aesthetics**.
- **Zero Decoration**: No border-radius, no box-shadows, no gradients.
- **Pure Focus**: Pure black backgrounds (#000000) and slate borders (#1E293B) to ensure the user's focus remains entirely on the rendered scene.

### 3. Maximum Information Density
AME UI prioritizes data visibility and operational velocity over "breathing room." 
- **High Density**: Minimal padding and compact layouts.
- **Monospace Precision**: Critical values, coordinates, and system logs utilize **JetBrains Mono** to ensure legibility and alignment of technical data.

---

## 🛠 Technical Stack
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4.0
- **State Management**: Zustand
- **Graphics & Workflow**: 
  - `motion`: Animation and fluid UI transitions.
  - `konva` / `react-konva`: Canvas-based engine for high-performance node editors.
  - `@google/genai`: Integration for LLM-powered logic assistance and node generation.
- **Layout**: `react-resizable-panels` for flexible workstation configuration.
- **Icons**: Lucide React (Industrial subset)

---

## 📐 Design Specifications

| Dimension | Specification |
| :--- | :--- |
| **Grid** | 4px/8px stepping system |
| **Typography** | Sans: Inter / Mono: JetBrains Mono |
| **Colors** | BG: #000000 / Border: #1E293B / Accent: #A7F3D0 (AME Accent) |
| **Radius** | 0px - 4px (Soft industrial) |
| **Borders** | 1px Solid |

---

## 🧩 Module Architecture

The interface is divided into functional zones:
1. **TopBar**: Global engine status, Project metadata, and Core Mode switching.
2. **SceneTree**: Hierarchical USD-compatible object tree with real-time sync indicators.
3. **Viewport**: 3D rendering zone with interactive HUD, 3D Gizmos (T/R/S), and MCAP recording overlay.
4. **Inspector**: Multi-facet property editor (Visual, Physics, Sensor, Provenance).
5. **Meta Console**: Command-line interface with meta-search capabilities for fast node/asset discovery.
6. **Workflow Studio**: Advanced canvas-based node editor for designing data pipelines and AI logic.
7. **AI Logic Copilot**: Integrated LLM assistant that can understand natural language intent and directly manipulate the workflow canvas by generating nodes and logic gates.

---

## 🤖 AI Capabilities

AME Engine UI is augmented by a multi-model AI Copilot system:
- **Direct Canvas Manipulation**: Create complex logic gates, filters, and AI inference nodes via natural language commands (e.g., "Add a depth threshold filter for the Lidar stream").
- **Multi-Model Support**:
  - **Gemini 3 Flash**: Default high-speed model for instant node generation and logic checks.
  - **Gemini 2.0 Pro**: Advanced experimental model for complex procedural reasoning.
  - **Gemini 1.5 Flash**: Stable legacy model for standard assistance.
- **Context Awareness**: The Copilot understands the current canvas state, including existing nodes and connections, to provide relevant suggestions.

---

## 🌐 Powered by
AME UI is part of the **Oasis Company** ecosystem for the next generation of world-building tools.
[View on GitHub](https://github.com/Oasis-Company)
