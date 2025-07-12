import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Copy, 
  Scissors, 
  Clipboard, 
  Play, 
  Power, 
  Trash2, 
  Settings,
  MoreHorizontal,
  Square
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NodeActionMenuProps {
  nodeId: string;
  nodeType: string;
  isVisible: boolean;
  isEnabled: boolean;
  onCopy: () => void;
  onDuplicate: () => void;
  onCut: () => void;
  onPaste: () => void;
  onRunFromHere: () => void;
  onToggleEnabled: () => void;
  onDelete: () => void;
  onSettings: () => void;
  className?: string;
}

const NodeActionMenu = memo(({
  nodeId,
  nodeType,
  isVisible,
  isEnabled,
  onCopy,
  onDuplicate,
  onCut,
  onPaste,
  onRunFromHere,
  onToggleEnabled,
  onDelete,
  onSettings,
  className
}: NodeActionMenuProps) => {
  const isMobile = useIsMobile();

  const quickActions = [
    { icon: Copy, action: onCopy, label: 'Copy', shortcut: 'Ctrl+C' },
    { icon: Settings, action: onSettings, label: 'Settings', shortcut: 'S' },
    { icon: Play, action: onRunFromHere, label: 'Run', shortcut: 'R' },
    { icon: isEnabled ? Square : Play, action: onToggleEnabled, label: isEnabled ? 'Disable' : 'Enable', shortcut: 'E' }
  ];

  const moreActions = [
    { icon: Copy, action: onDuplicate, label: 'Duplicate', shortcut: 'Ctrl+D' },
    { icon: Scissors, action: onCut, label: 'Cut', shortcut: 'Ctrl+X' },
    { icon: Clipboard, action: onPaste, label: 'Paste', shortcut: 'Ctrl+V' },
    { icon: Trash2, action: onDelete, label: 'Delete', shortcut: 'Del', destructive: true }
  ];

  if (!isVisible) return null;

  return (
    <div className={cn(
      "absolute -top-12 left-1/2 transform -translate-x-1/2",
      "flex items-center gap-1 p-1 rounded-lg glass-strong border border-border/50",
      "animate-fade-in z-50",
      className
    )}>
      {/* Quick Actions */}
      {quickActions.slice(0, isMobile ? 2 : 4).map((action, index) => (
        <Button
          key={index}
          size="sm"
          variant="ghost"
          className="w-8 h-8 p-0 hover:bg-accent/20"
          onClick={(e) => {
            e.stopPropagation();
            action.action();
          }}
          title={`${action.label} (${action.shortcut})`}
        >
          <action.icon className="w-3.5 h-3.5" />
        </Button>
      ))}

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 hover:bg-accent/20"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="center" 
          className="glass-strong border border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Remaining quick actions on mobile */}
          {isMobile && quickActions.slice(2).map((action, index) => (
            <DropdownMenuItem 
              key={`quick-${index}`}
              onClick={action.action}
              className="cursor-pointer"
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
              <span className="ml-auto text-xs text-muted-foreground">{action.shortcut}</span>
            </DropdownMenuItem>
          ))}
          
          {isMobile && <DropdownMenuSeparator />}
          
          {/* More actions */}
          {moreActions.map((action, index) => (
            <DropdownMenuItem 
              key={index}
              onClick={action.action}
              className={cn(
                "cursor-pointer",
                action.destructive && "text-destructive focus:text-destructive"
              )}
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
              <span className="ml-auto text-xs text-muted-foreground">{action.shortcut}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

NodeActionMenu.displayName = 'NodeActionMenu';

export default NodeActionMenu;