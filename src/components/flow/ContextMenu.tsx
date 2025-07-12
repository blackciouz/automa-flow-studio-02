import { memo } from 'react';
import { nodeTemplates, getNodeTemplatesByCategory } from '@/data/nodeTemplates';
import { ContextMenuPosition } from '@/types/flow';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  StickyNote, 
  Trash2, 
  Copy, 
  Move, 
  Settings,
  MousePointer,
  Layers,
  CheckSquare,
  LayoutGrid
} from 'lucide-react';

interface ContextMenuProps {
  position: ContextMenuPosition;
  onClose: () => void;
  onAddNode: (template: any, position: { x: number; y: number }) => void;
  onAddStickyNote: (position: { x: number; y: number }) => void;
  onTidyWorkflow: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  type: 'canvas' | 'node' | 'edge';
  target?: string;
}

const ContextMenu = memo(({ 
  position, 
  onClose, 
  onAddNode, 
  onAddStickyNote,
  onTidyWorkflow,
  onSelectAll,
  onClearSelection,
  type,
  target 
}: ContextMenuProps) => {
  
  const handleAddNode = (template: any) => {
    onAddNode(template, position);
    onClose();
  };

  const handleAddStickyNote = () => {
    onAddStickyNote(position);
    onClose();
  };

  if (type === 'canvas') {
    return (
      <div
        className="context-menu fixed z-50 w-56 rounded-lg p-2 text-sm animate-in slide-in-from-top-1 glass-strong border border-border/50"
        style={{ left: position.x, top: position.y }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Quick Actions */}
        <div className="space-y-1">
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={handleAddStickyNote}
          >
            <StickyNote className="w-4 h-4" />
            <span>Add sticky note</span>
            <div className="ml-auto flex gap-1">
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">⌘</kbd>
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">S</kbd>
            </div>
          </div>
          
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => { onTidyWorkflow(); onClose(); }}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Auto layout</span>
            <div className="ml-auto flex gap-1">
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">⌘</kbd>
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">L</kbd>
            </div>
          </div>

          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => { onSelectAll(); onClose(); }}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Select all</span>
            <div className="ml-auto flex gap-1">
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">⌘</kbd>
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">A</kbd>
            </div>
          </div>

          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors text-muted-foreground"
            onClick={() => { onClearSelection(); onClose(); }}
          >
            <MousePointer className="w-4 h-4" />
            <span>Clear selection</span>
            <div className="ml-auto">
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Esc</kbd>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Node context menu
  if (type === 'node') {
    return (
      <div
        className="context-menu fixed z-50 w-48 rounded-lg p-2 text-sm animate-in slide-in-from-top-1"
        style={{ left: position.x, top: position.y }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
            <Settings className="w-4 h-4" />
            <span>Configure</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
            <Copy className="w-4 h-4" />
            <span>Duplicate</span>
            <div className="ml-auto flex gap-1">
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Ctrl</kbd>
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">D</kbd>
            </div>
          </div>
          <div className="border-t border-border/50 my-1" />
          <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors">
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
            <div className="ml-auto">
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Del</kbd>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

ContextMenu.displayName = 'ContextMenu';

export default ContextMenu;