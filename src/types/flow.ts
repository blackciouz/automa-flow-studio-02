import { LucideIcon } from "lucide-react";

export interface NodeTemplate {
  id: string;
  type: string;
  category: 'trigger' | 'media' | 'action' | 'data';
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  inputs?: number;
  outputs?: number;
  configurable?: boolean;
}

export interface WorkflowNode {
  id: string;
  type: string;
  category: 'trigger' | 'media' | 'action' | 'data';
  name: string;
  description: string;
  icon: LucideIcon;
  position: { x: number; y: number };
  data: Record<string, any>;
  inputs?: number;
  outputs?: number;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  animated?: boolean;
  style?: Record<string, any>;
}

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface FlowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodes: string[];
  selectedEdges: string[];
  contextMenu: {
    visible: boolean;
    position: ContextMenuPosition;
    type: 'canvas' | 'node' | 'edge';
    target?: string;
  };
}