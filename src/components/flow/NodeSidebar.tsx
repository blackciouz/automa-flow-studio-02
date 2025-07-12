import { memo, useState } from 'react';
import { nodeTemplates, getNodeTemplatesByCategory } from '@/data/nodeTemplates';
import { NodeTemplate } from '@/types/flow';
import { cn } from '@/lib/utils';
import { Search, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NodeSidebarProps {
  onAddNode: (template: NodeTemplate, position: { x: number; y: number }) => void;
  onClose?: () => void;
  className?: string;
}

const NodeSidebar = memo(({ onAddNode, onClose, className }: NodeSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    trigger: true,
    media: true,
    action: true,
    data: true
  });

  const categories = [
    { key: 'trigger', name: 'Triggers', color: '#10B981', description: 'Start your workflows' },
    { key: 'media', name: 'Media', color: '#06B6D4', description: 'Generate content' },
    { key: 'action', name: 'Actions', color: '#8B5CF6', description: 'Process and edit' },
    { key: 'data', name: 'Data', color: '#F59E0B', description: 'Save and publish' }
  ] as const;

  const filteredTemplates = nodeTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleDragStart = (event: React.DragEvent, template: NodeTemplate) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddNode = (template: NodeTemplate) => {
    // Add node at center of viewport
    onAddNode(template, { x: 100, y: 100 });
    // Close sidebar on mobile after adding node
    onClose?.();
  };

  return (
    <div className={cn("w-80 bg-card border-r border-border flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">Node Library</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categories.map((category) => {
          const categoryTemplates = searchQuery 
            ? filteredTemplates.filter(t => t.category === category.key)
            : getNodeTemplatesByCategory(category.key as any);
          
          if (searchQuery && categoryTemplates.length === 0) return null;

          return (
            <div key={category.key} className="space-y-2">
              {/* Category Header */}
              <div
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => toggleCategory(category.key)}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <div className="font-medium text-sm" style={{ color: category.color }}>
                      {category.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {category.description}
                    </div>
                  </div>
                </div>
                {expandedCategories[category.key] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>

              {/* Category Nodes */}
              {expandedCategories[category.key] && (
                <div className="space-y-1 ml-4">
                  {categoryTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="group relative flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border cursor-pointer transition-all duration-200 hover:shadow-md"
                      draggable
                      onDragStart={(e) => handleDragStart(e, template)}
                      onClick={() => handleAddNode(template)}
                    >
                      {/* Node Icon */}
                      <div 
                        className={cn(
                          "p-2 rounded-lg flex-shrink-0",
                          template.category === 'trigger' && "bg-trigger/20",
                          template.category === 'media' && "bg-media/20",
                          template.category === 'action' && "bg-action/20",
                          template.category === 'data' && "bg-data/20"
                        )}
                      >
                        <template.icon 
                          className="w-4 h-4" 
                          style={{ color: template.color }} 
                        />
                      </div>

                      {/* Node Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground truncate">
                          {template.name}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </div>
                      </div>

                      {/* Add Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddNode(template);
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>

                      {/* Drag Handle Indicator */}
                      <div className="absolute top-1 right-1 w-2 h-2 bg-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {searchQuery && filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No nodes found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
});

NodeSidebar.displayName = 'NodeSidebar';

export default NodeSidebar;