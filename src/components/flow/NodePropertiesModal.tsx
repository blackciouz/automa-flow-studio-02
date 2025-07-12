import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Save, RotateCcw } from 'lucide-react';
import { WorkflowNode } from '@/types/flow';
import { getNodeTemplateByType } from '@/data/nodeTemplates';

interface NodePropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: WorkflowNode | null;
  onSave: (nodeId: string, properties: any) => void;
}

const NodePropertiesModal = memo(({ isOpen, onClose, node, onSave }: NodePropertiesModalProps) => {
  const [properties, setProperties] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);

  if (!node) return null;

  const template = getNodeTemplateByType(node.data.type);
  if (!template) return null;

  const handlePropertyChange = (key: string, value: any) => {
    setProperties(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(node.id, properties);
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    setProperties({});
    setHasChanges(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <DialogContent 
        className="max-w-2xl max-h-[90vh] glass-strong border-2 relative z-50" 
        style={{
          borderColor: template.color,
          boxShadow: `0 0 20px ${template.color}40`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="border-b border-border/20 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background/50">
                <template.icon className="w-5 h-5" style={{ color: template.color }} />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">{template.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-96 pr-4">
          <div className="space-y-6 py-4">
            {/* Basic Properties */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Basic Configuration</h3>
              
              <div className="space-y-2">
                <Label htmlFor="node-name">Node Name</Label>
                <Input
                  id="node-name"
                  value={properties.name || node.data.name}
                  onChange={(e) => handlePropertyChange('name', e.target.value)}
                  placeholder="Enter node name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="node-description">Description</Label>
                <Textarea
                  id="node-description"
                  value={properties.description || node.data.description}
                  onChange={(e) => handlePropertyChange('description', e.target.value)}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="node-enabled">Enabled</Label>
                <Switch
                  id="node-enabled"
                  checked={properties.enabled ?? node.data.enabled ?? true}
                  onCheckedChange={(checked) => handlePropertyChange('enabled', checked)}
                />
              </div>
            </div>

            {/* Category-specific Properties */}
            {template.category === 'trigger' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Trigger Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="trigger-interval">Interval (seconds)</Label>
                  <Input
                    id="trigger-interval"
                    type="number"
                    value={properties.interval || 60}
                    onChange={(e) => handlePropertyChange('interval', parseInt(e.target.value))}
                    min={1}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-trigger">Auto Trigger</Label>
                  <Switch
                    id="auto-trigger"
                    checked={properties.autoTrigger ?? false}
                    onCheckedChange={(checked) => handlePropertyChange('autoTrigger', checked)}
                  />
                </div>
              </div>
            )}

            {template.category === 'media' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Media Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="output-format">Output Format</Label>
                  <select
                    id="output-format"
                    className="w-full p-2 rounded-md border border-border bg-background"
                    value={properties.outputFormat || 'mp4'}
                    onChange={(e) => handlePropertyChange('outputFormat', e.target.value)}
                  >
                    <option value="mp4">MP4</option>
                    <option value="mov">MOV</option>
                    <option value="avi">AVI</option>
                    <option value="webm">WebM</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <select
                    id="quality"
                    className="w-full p-2 rounded-md border border-border bg-background"
                    value={properties.quality || 'high'}
                    onChange={(e) => handlePropertyChange('quality', e.target.value)}
                  >
                    <option value="low">Low (720p)</option>
                    <option value="medium">Medium (1080p)</option>
                    <option value="high">High (1440p)</option>
                    <option value="ultra">Ultra (4K)</option>
                  </select>
                </div>
              </div>
            )}

            {template.category === 'action' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Action Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="processing-mode">Processing Mode</Label>
                  <select
                    id="processing-mode"
                    className="w-full p-2 rounded-md border border-border bg-background"
                    value={properties.processingMode || 'auto'}
                    onChange={(e) => handlePropertyChange('processingMode', e.target.value)}
                  >
                    <option value="auto">Auto</option>
                    <option value="manual">Manual</option>
                    <option value="batch">Batch</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="preserve-metadata">Preserve Metadata</Label>
                  <Switch
                    id="preserve-metadata"
                    checked={properties.preserveMetadata ?? true}
                    onCheckedChange={(checked) => handlePropertyChange('preserveMetadata', checked)}
                  />
                </div>
              </div>
            )}

            {template.category === 'data' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Data Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={properties.destination || ''}
                    onChange={(e) => handlePropertyChange('destination', e.target.value)}
                    placeholder="Enter destination path or URL"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="compress">Compress Output</Label>
                  <Switch
                    id="compress"
                    checked={properties.compress ?? false}
                    onCheckedChange={(checked) => handlePropertyChange('compress', checked)}
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t border-border/20">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!hasChanges}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges}
              style={{ backgroundColor: template.color }}
              className="text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

NodePropertiesModal.displayName = 'NodePropertiesModal';

export default NodePropertiesModal;