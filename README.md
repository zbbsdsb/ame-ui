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
- **Layout**: `react-resizable-panels` for flexible workstation configuration.
- **Icons**: Lucide React (Industrial subset)

---

## 📐 Design Specifications

| Dimension | Specification |
| :--- | :--- |
| **Grid** | 8px stepping system |
| **Typography** | Sans: Inter / Mono: JetBrains Mono |
| **Colors** | BG: #000000 / Border: #1E293B / Accent: #DEFF9A |
| **Radius** | 0px (Strictly prohibited) |
| **Borders** | 1px Solid |

---

## 🧩 Module Architecture

The interface is divided into five primary functional slots:
1. **TopBar**: Global engine status and project metadata.
2. **SceneTree**: Hierarchical visibility and object management.
3. **Viewport**: The primary 3D rendering canvas with HUD overlays.
4. **Inspector**: High-density parameter tuning and manifest checking.
5. **Console**: Real-time VULKAN/3DGS logs and command-line input.

---

## 🌐 Powered by
AME UI is part of the **Oasis Company** ecosystem for the next generation of world-building tools.
[View on GitHub](https://github.com/Oasis-Company)
