import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { WorkflowNode } from '@/types/flow';
import { getNodeTemplateByType } from '@/data/nodeTemplates';
import { cn } from '@/lib/utils';
import { Settings, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NodeActionMenu from './NodeActionMenu';
import { useIsMobile } from '@/hooks/use-mobile';

interface FlowNodeProps extends NodeProps {
  data: WorkflowNode['data'] & {
    category: 'trigger' | 'media' | 'action' | 'data';
    name: string;
    description: string;
    icon: any;
    inputs?: number;
    outputs?: number;
    status?: 'idle' | 'running' | 'completed' | 'error';
    enabled?: boolean;
  };
  onEditNode?: (nodeId: string) => void;
  onCopyNode?: (nodeId: string) => void;
  onCutNode?: (nodeId: string) => void;
  onDuplicateNode?: (nodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
}

const FlowNode = memo(({ id, data, selected, onEditNode, onCopyNode, onCutNode, onDuplicateNode, onDeleteNode }: FlowNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showTriggerBar, setShowTriggerBar] = useState(false);
  const template = getNodeTemplateByType(data.type);
  const isMobile = useIsMobile();
  
  if (!template) return null;

  const IconComponent = template.icon;
  const hasInputs = (template.inputs ?? 0) > 0;
  const hasOutputs = (template.outputs ?? 0) > 0;

  const getCategoryClass = () => {
    switch (data.category) {
      case 'trigger': return 'node-trigger';
      case 'media': return 'node-media';
      case 'action': return 'node-action';
      case 'data': return 'node-data';
      default: return '';
    }
  };

  const getStatusIndicator = () => {
    const baseClass = "w-2 h-2 rounded-full";
    if (!data.enabled) return <div className={`${baseClass} bg-gray-400`} />;
    
    switch (data.status) {
      case 'running': return <div className={`${baseClass} bg-yellow-400 animate-pulse`} />;
      case 'completed': return <div className={`${baseClass} bg-green-400`} />;
      case 'error': return <div className={`${baseClass} bg-red-400`} />;
      default: return <div className={`${baseClass} bg-gray-500`} />;
    }
  };

  const handleNodeClick = useCallback((e: React.MouseEvent) => {
    if (isMobile) {
      setShowActions(!showActions);
    } else if (e.detail === 2) { // Double click
      onEditNode?.(id);
    }
    // Keep trigger bar visible if clicked on node
    if (data.category === 'trigger' && !showTriggerBar) {
      setShowTriggerBar(true);
    }
  }, [isMobile, showActions, onEditNode, id, data.category, showTriggerBar]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (data.category === 'trigger') {
      setShowTriggerBar(true);
    }
    if (!isMobile) {
      setShowActions(true);
    }
  }, [data.category, isMobile]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (!selected && !showTriggerBar) {
      setShowActions(false);
    }
  }, [selected, showTriggerBar]);

  // Node action handlers
  const handleCopy = useCallback(() => onCopyNode?.(id), [onCopyNode, id]);
  const handleDuplicate = useCallback(() => onDuplicateNode?.(id), [onDuplicateNode, id]);
  const handleCut = useCallback(() => onCutNode?.(id), [onCutNode, id]);
  const handlePaste = useCallback(() => console.log('Paste node', id), [id]);
  const handleRunFromHere = useCallback(() => console.log('Run from here', id), [id]);
  const handleToggleEnabled = useCallback(() => console.log('Toggle enabled', id), [id]);
  const handleDelete = useCallback(() => onDeleteNode?.(id), [onDeleteNode, id]);
  const handleSettings = useCallback(() => onEditNode?.(id), [onEditNode, id]);

  return (
    <div
      className={cn(
        "flow-node",
        getCategoryClass(),
        "relative min-w-[200px] p-4 rounded-xl",
        "border-2 transition-all duration-300 cursor-pointer",
        selected && "selected",
        !data.enabled && "opacity-50",
        isHovered && "scale-105"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleNodeClick}
    >
      {/* Input Handles */}
      {hasInputs && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id="input-1"
            className="w-3 h-3 !bg-foreground/20 !border-2 !border-foreground/40 hover:!border-accent"
          />
          {(template.inputs ?? 0) > 1 && (
            <Handle
              type="target"
              position={Position.Left}
              id="input-2"
              style={{ top: '70%' }}
              className="w-3 h-3 !bg-foreground/20 !border-2 !border-foreground/40 hover:!border-accent"
            />
          )}
        </>
      )}

      {/* Node Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg",
            data.category === 'trigger' && "bg-trigger/20",
            data.category === 'media' && "bg-media/20", 
            data.category === 'action' && "bg-action/20",
            data.category === 'data' && "bg-data/20"
          )}>
            <IconComponent className="w-4 h-4" style={{ color: template.color }} />
          </div>
          {getStatusIndicator()}
        </div>
        
        {(isHovered || selected) && (
          <div className="flex items-center gap-1">
            {template.configurable && (
              <Button
                size="sm"
                variant="ghost"
                className="w-6 h-6 p-0 hover:bg-foreground/10"
                onClick={(e) => {
                  e.stopPropagation();
                  // Open config modal
                }}
              >
                <Settings className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Node Content */}
      <div className="space-y-1">
        <h3 className="font-medium text-sm text-foreground truncate">
          {data.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {data.description}
        </p>
      </div>

      {/* Trigger Bar */}
      {data.category === 'trigger' && showTriggerBar && (
        <div className="absolute -bottom-10 left-0 right-0 flex justify-center z-30">
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs glass-strong border border-border/50"
            onClick={(e) => {
              e.stopPropagation();
              // Trigger execution
              console.log('Running trigger:', id);
            }}
          >
            <Play className="w-3 h-3 mr-1" />
            Run Trigger
          </Button>
        </div>
      )}

      {/* Action Menu */}
      <NodeActionMenu
        nodeId={id}
        nodeType={data.type}
        isVisible={showActions && !isMobile}
        isEnabled={data.enabled ?? true}
        onCopy={handleCopy}
        onDuplicate={handleDuplicate}
        onCut={handleCut}
        onPaste={handlePaste}
        onRunFromHere={handleRunFromHere}
        onToggleEnabled={handleToggleEnabled}
        onDelete={handleDelete}
        onSettings={handleSettings}
      />

      {/* Mobile Action Menu */}
      {isMobile && showActions && (
        <NodeActionMenu
          nodeId={id}
          nodeType={data.type}
          isVisible={showActions}
          isEnabled={data.enabled ?? true}
          onCopy={handleCopy}
          onDuplicate={handleDuplicate}
          onCut={handleCut}
          onPaste={handlePaste}
          onRunFromHere={handleRunFromHere}
          onToggleEnabled={handleToggleEnabled}
          onDelete={handleDelete}
          onSettings={handleSettings}
          className="relative top-0 left-0 transform-none mt-2"
        />
      )}

      {/* Output Handles */}
      {hasOutputs && (
        <Handle
          type="source"
          position={Position.Right}
          id="output-1"
          className="w-3 h-3 !bg-foreground/20 !border-2 !border-foreground/40 hover:!border-accent"
        />
      )}

      {/* Selection Ring */}
      {selected && (
        <div className="absolute inset-0 rounded-xl ring-2 ring-accent/50 ring-offset-2 ring-offset-background pointer-events-none" />
      )}
    </div>
  );
});

FlowNode.displayName = 'FlowNode';

export default FlowNode;