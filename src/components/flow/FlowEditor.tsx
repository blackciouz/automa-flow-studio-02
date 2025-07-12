import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  ReactFlowProvider,
  useReactFlow,
  ReactFlowInstance,
  BackgroundVariant,
  ConnectionLineType,
  MarkerType
} from '@xyflow/react';
import { NodeTemplate, WorkflowNode, ContextMenuPosition } from '@/types/flow';
import { getNodeTemplateByType } from '@/data/nodeTemplates';
import FlowNode from './FlowNode';
import ContextMenu from './ContextMenu';
import NodeSidebar from './NodeSidebar';
import NodePropertiesModal from './NodePropertiesModal';
import StickyNote from './StickyNote';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, LayoutGrid, StickyNote as StickyNoteIcon } from 'lucide-react';

import '@xyflow/react/dist/style.css';

// Remove this as we're now defining nodeTypes inline

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

interface FlowEditorInnerProps {
  className?: string;
}

const FlowEditorInner = ({ className }: FlowEditorInnerProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    position: ContextMenuPosition;
    type: 'canvas' | 'node' | 'edge';
    target?: string;
  }>({ visible: false, position: { x: 0, y: 0 }, type: 'canvas' });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [showPropertiesModal, setShowPropertiesModal] = useState(false);
  const [stickyNotes, setStickyNotes] = useState<any[]>([]);
  const [showStickyMenu, setShowStickyMenu] = useState(false);
  const [clipboard, setClipboard] = useState<Node[]>([]);
  
  const flowRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow();
  const isMobile = useIsMobile();

  // Handle connections between nodes with smooth curves
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        type: 'default',
        animated: true,
        style: { 
          stroke: 'hsl(var(--accent))',
          strokeWidth: 3,
          strokeDasharray: '0',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'hsl(var(--accent))',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      
      toast({
        title: "Connection created",
        description: "Nodes connected successfully",
      });
    },
    [setEdges]
  );

  // Handle auto layout
  const handleAutoLayout = useCallback(() => {
    const isVertical = isMobile;
    const spacing = isVertical ? { x: 250, y: 150 } : { x: 300, y: 120 };
    
    setNodes((nds) =>
      nds.map((node, index) => {
        if (isVertical) {
          return {
            ...node,
            position: {
              x: 50 + (index % 2) * spacing.x,
              y: 50 + Math.floor(index / 2) * spacing.y,
            },
          };
        } else {
          return {
            ...node,
            position: {
              x: 50 + (index % 4) * spacing.x,
              y: 50 + Math.floor(index / 4) * spacing.y,
            },
          };
        }
      })
    );
    
    setTimeout(() => fitView({ padding: 0.1 }), 100);
    
    toast({
      title: "Auto Layout Applied",
      description: "Workflow has been automatically organized",
    });
  }, [setNodes, isMobile, fitView]);

  // Node management functions
  const handleEditNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node as WorkflowNode);
      setShowPropertiesModal(true);
    }
  }, [nodes]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter(n => n.id !== nodeId));
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    
    toast({
      title: "Node Deleted",
      description: "Node removed from workflow",
    });
  }, [setNodes, setEdges]);

  const handleCopyNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setClipboard([node]);
      navigator.clipboard.writeText(JSON.stringify(node, null, 2));
      toast({
        title: "Node Copied",
        description: "Node copied to clipboard",
      });
    }
  }, [nodes]);

  const handleCutNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setClipboard([node]);
      navigator.clipboard.writeText(JSON.stringify(node, null, 2));
      handleDeleteNode(nodeId);
      toast({
        title: "Node Cut",
        description: "Node cut to clipboard",
      });
    }
  }, [nodes, handleDeleteNode]);

  const handleDuplicateNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const newNode = {
        ...node,
        id: `node-${Date.now()}`,
        position: { 
          x: node.position.x + 50, 
          y: node.position.y + 50 
        },
        selected: false
      };
      setNodes((nds) => [...nds, newNode]);
      toast({
        title: "Node Duplicated",
        description: "Node duplicated successfully",
      });
    }
  }, [nodes, setNodes]);

  const handleSaveNodeProperties = useCallback((nodeId: string, properties: any) => {
    setNodes((nds) =>
      nds.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...properties } }
          : node
      )
    );
    
    toast({
      title: "Properties Saved",
      description: "Node properties updated successfully",
    });
  }, [setNodes]);

  // Handle context menu - simplified for quick actions
  const onContextMenu = useCallback((event: React.MouseEvent) => {
    if (isMobile) return; // Disable context menu on mobile
    
    event.preventDefault();
    
    const rect = flowRef.current?.getBoundingClientRect();
    if (!rect) return;

    setContextMenu({
      visible: true,
      position: { x: event.clientX, y: event.clientY },
      type: 'canvas'
    });
  }, [isMobile]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  // Handle node addition
  const handleAddNode = useCallback((template: NodeTemplate, position: { x: number; y: number }) => {
    const flowPosition = screenToFlowPosition(position);
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'flowNode',
      position: flowPosition,
      data: {
        ...template,
        status: 'idle',
        enabled: true
      }
    };

    setNodes((nds) => [...nds, newNode]);
    
    // Auto-close sidebar on mobile after adding node
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
    
    toast({
      title: "Node added",
      description: `${template.name} node added to workflow`,
    });
  }, [setNodes, screenToFlowPosition, isMobile, sidebarCollapsed]);

  // Handle sticky note addition
  const handleAddStickyNote = useCallback((position: { x: number; y: number }) => {
    const newNote = {
      id: `sticky-${Date.now()}`,
      position: position,
      content: 'Click to edit...',
      color: '#fef3c7'
    };

    setStickyNotes((notes) => [...notes, newNote]);
    
    toast({
      title: "Sticky note added",
      description: "Note added to workflow",
    });
  }, []);

  // Sticky note management
  const handleUpdateStickyNote = useCallback((id: string, updates: any) => {
    setStickyNotes((notes) =>
      notes.map(note => note.id === id ? { ...note, ...updates } : note)
    );
  }, []);

  const handleDeleteStickyNote = useCallback((id: string) => {
    setStickyNotes((notes) => notes.filter(note => note.id !== id));
  }, []);

  // Handle workflow cleanup - replaced by handleAutoLayout
  const handleTidyWorkflow = handleAutoLayout;

  // Handle select all
  const handleSelectAll = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: true,
      }))
    );
  }, [setNodes]);

  // Handle clear selection
  const handleClearSelection = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: false,
      }))
    );
  }, [setNodes]);

  // Handle node drag from sidebar
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = flowRef.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const templateData = event.dataTransfer.getData('application/reactflow');
      if (!templateData) return;

      try {
        const template: NodeTemplate = JSON.parse(templateData);
        const position = screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        handleAddNode(template, { x: event.clientX, y: event.clientY });
      } catch (error) {
        console.error('Error parsing dropped node:', error);
      }
    },
    [screenToFlowPosition, handleAddNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + L for auto layout
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        handleAutoLayout();
      }
      // Cmd/Ctrl + S for sticky note
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleAddStickyNote({ x: 100, y: 100 });
      }
      // Cmd/Ctrl + A for select all
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        handleSelectAll();
      }
      // Escape for clear selection
      if (e.key === 'Escape') {
        handleClearSelection();
        closeContextMenu();
      }
    };

    const handleClick = (e: MouseEvent) => {
      closeContextMenu();
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [closeContextMenu, handleAutoLayout, handleAddStickyNote, handleSelectAll, handleClearSelection, setNodes]);

  return (
    <div className={cn("flex h-full w-full bg-background relative", className)}>
      {/* Sidebar Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "absolute top-4 z-50 glass-strong border border-border/50 transition-all duration-300",
          sidebarCollapsed ? "left-4" : (isMobile ? "left-4" : "left-84")
        )}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      >
        {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      {/* Sticky Notes Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 z-50 glass-strong border border-border/50"
        onClick={() => setShowStickyMenu(!showStickyMenu)}
      >
        <StickyNoteIcon className="w-4 h-4" />
      </Button>

      {/* Auto Layout Button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-16 right-4 z-50 glass-strong border border-border/50"
        onClick={handleAutoLayout}
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        Auto Layout
      </Button>

      {/* Node Sidebar */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-0 overflow-hidden" : (isMobile ? "fixed inset-y-0 left-0 w-80 z-40 bg-background/95 backdrop-blur-md" : "w-80")
      )}>
        <NodeSidebar 
          onAddNode={handleAddNode}
          onClose={() => isMobile && setSidebarCollapsed(true)}
        />
      </div>
      
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Flow Canvas */}
      <div className="flex-1 relative">
        <div
          ref={flowRef}
          className="w-full h-full"
          onContextMenu={onContextMenu}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            // nodeTypes defined inline above
            fitView
            fitViewOptions={{
              padding: 0.2,
            }}
            defaultEdgeOptions={{
              type: 'default',
              animated: true,
              style: { 
                stroke: 'hsl(var(--accent))',
                strokeWidth: 3,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: 'hsl(var(--accent))',
              },
            }}
            connectionLineType={ConnectionLineType.Bezier}
            connectionLineStyle={{
              stroke: 'hsl(var(--accent))',
              strokeWidth: 3,
              strokeDasharray: '5,5',
              strokeOpacity: 0.8,
            }}
            deleteKeyCode={['Backspace', 'Delete']}
            multiSelectionKeyCode={['Meta', 'Ctrl']}
            panOnScroll={false}
            zoomOnScroll={true}
            zoomOnPinch={true}
            zoomOnDoubleClick={false}
            selectionOnDrag
            panOnDrag={[1, 2]}
            zoomActivationKeyCode={null}
            className="bg-background"
            nodeTypes={{
              flowNode: (props) => (
                <FlowNode
                  {...props}
                  onEditNode={handleEditNode}
                  onCopyNode={handleCopyNode}
                  onCutNode={handleCutNode}
                  onDuplicateNode={handleDuplicateNode}
                  onDeleteNode={handleDeleteNode}
                />
              )
            }}
          >
            <Background 
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="hsla(var(--flow-grid))"
            />
            <Controls 
              className="!bg-card !border-border"
              showZoom={true}
              showFitView={true}
              showInteractive={true}
            />
            <MiniMap
              className={cn(
                "!bg-card/90 !border !border-border/30 !backdrop-blur-md !rounded-lg",
                "!shadow-lg transition-all duration-300",
                isMobile && "!w-20 !h-12 !bottom-20 !right-2",
                !isMobile && "!w-48 !h-32 !bottom-4 !right-4"
              )}
              nodeColor={(node) => {
                const nodeType = typeof node.data?.type === 'string' ? node.data.type : '';
                const template = getNodeTemplateByType(nodeType);
                return template?.color || '#64748b';
              }}
              nodeStrokeWidth={2}
              nodeBorderRadius={8}
              nodeStrokeColor="rgba(255, 255, 255, 0.2)"
              pannable
              zoomable
              inversePan={false}
              zoomStep={10}
              position="bottom-right"
            />
          </ReactFlow>
        </div>

        {/* Context Menu */}
        {contextMenu.visible && !isMobile && (
          <ContextMenu
            position={contextMenu.position}
            type={contextMenu.type}
            target={contextMenu.target}
            onClose={closeContextMenu}
            onAddNode={handleAddNode}
            onAddStickyNote={handleAddStickyNote}
            onTidyWorkflow={handleTidyWorkflow}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
          />
        )}

        {/* Sticky Notes */}
        {stickyNotes.map((note) => (
          <StickyNote
            key={note.id}
            id={note.id}
            position={note.position}
            content={note.content}
            color={note.color}
            onUpdate={handleUpdateStickyNote}
            onDelete={handleDeleteStickyNote}
          />
        ))}

        {/* Quick Sticky Note Menu */}
        {showStickyMenu && (
          <div className="absolute top-16 right-4 z-40 p-2 glass-strong border border-border/50 rounded-lg">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                handleAddStickyNote({ x: 100, y: 100 });
                setShowStickyMenu(false);
              }}
            >
              Add Sticky Note
            </Button>
          </div>
        )}
      </div>

      {/* Node Properties Modal */}
      <NodePropertiesModal
        isOpen={showPropertiesModal}
        onClose={() => setShowPropertiesModal(false)}
        node={selectedNode}
        onSave={handleSaveNodeProperties}
      />
    </div>
  );
};

interface FlowEditorProps {
  className?: string;
}

const FlowEditor = ({ className }: FlowEditorProps) => {
  return (
    <ReactFlowProvider>
      <FlowEditorInner className={className} />
    </ReactFlowProvider>
  );
};

export default FlowEditor;