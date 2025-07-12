import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Share2, 
  MoreHorizontal,
  Zap,
  Clock,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface FlowHeaderProps {
  workflowName?: string;
  isRunning?: boolean;
  lastSaved?: Date;
  collaborators?: number;
  onSave?: () => void;
  onRun?: () => void;
  onStop?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
  className?: string;
}

const FlowHeader = memo(({
  workflowName = "Untitled Workflow",
  isRunning = false,
  lastSaved,
  collaborators = 1,
  onSave,
  onRun,
  onStop,
  onExport,
  onImport,
  onShare,
  onSettings,
  className
}: FlowHeaderProps) => {
  const [isAutoSave, setIsAutoSave] = useState(true);

  return (
    <header className={cn(
      "glass border-b border-border/50 px-6 py-4 flex items-center justify-between",
      className
    )}>
      {/* Left Section - Branding & Workflow Info */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Automaciouz
          </span>
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Workflow Info */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-semibold text-foreground">{workflowName}</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {lastSaved && (
                <>
                  <Clock className="w-3 h-3" />
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  {isAutoSave && <Badge variant="secondary" className="text-xs">Auto-save</Badge>}
                </>
              )}
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-2">
            {isRunning && (
              <Badge variant="default" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-1" />
                Running
              </Badge>
            )}
            
            {collaborators > 1 && (
              <Badge variant="outline" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {collaborators}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Primary Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="hover:bg-primary/10"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          <Button
            variant={isRunning ? "destructive" : "default"}
            size="sm"
            onClick={isRunning ? onStop : onRun}
            className={cn(
              "transition-all",
              !isRunning && "bg-gradient-to-r from-primary to-accent hover:opacity-90"
            )}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Workflow
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="hover:bg-accent/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onImport}>
              <Upload className="w-4 h-4 mr-2" />
              Import Workflow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Workflow
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSettings}>
              <Settings className="w-4 h-4 mr-2" />
              Workflow Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setIsAutoSave(!isAutoSave)}
              className="justify-between"
            >
              <span>Auto-save</span>
              <Badge variant={isAutoSave ? "default" : "secondary"} className="text-xs">
                {isAutoSave ? "On" : "Off"}
              </Badge>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});

FlowHeader.displayName = 'FlowHeader';

export default FlowHeader;