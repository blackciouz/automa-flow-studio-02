import { memo, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote as StickyNoteIcon, X, Edit3, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StickyNoteProps {
  id: string;
  position: { x: number; y: number };
  content: string;
  color: string;
  onUpdate: (id: string, updates: { content?: string; color?: string; position?: { x: number; y: number } }) => void;
  onDelete: (id: string) => void;
}

const STICKY_COLORS = [
  { name: 'Yellow', value: '#fef3c7', text: '#92400e' },
  { name: 'Pink', value: '#fce7f3', text: '#be185d' },
  { name: 'Blue', value: '#dbeafe', text: '#1e40af' },
  { name: 'Green', value: '#d1fae5', text: '#065f46' },
  { name: 'Purple', value: '#e9d5ff', text: '#6b21a8' },
  { name: 'Gray', value: '#f3f4f6', text: '#374151' },
];

const StickyNote = memo(({ id, position, content, color, onUpdate, onDelete }: StickyNoteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const currentColor = STICKY_COLORS.find(c => c.value === color) || STICKY_COLORS[0];

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(id, { content: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleColorChange = (newColor: string) => {
    onUpdate(id, { color: newColor });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    const rect = noteRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };

    onUpdate(id, { position: newPosition });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleClick = () => {
    if (!isMobile) {
      handleEdit();
    }
  };

  const handleDoubleClick = () => {
    if (isMobile) {
      handleEdit();
    }
  };

  // Parse markdown-like formatting
  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div
      ref={noteRef}
      className={cn(
        "absolute w-48 min-h-32 p-3 rounded-lg glass cursor-move select-none",
        "border-l-4 border-l-yellow-400 shadow-lg z-40",
        isDragging && "scale-105 rotate-1 shadow-xl"
      )}
      style={{
        left: position.x,
        top: position.y,
        backgroundColor: currentColor.value,
        color: currentColor.text,
        transform: isDragging ? 'scale(1.05) rotate(1deg)' : 'none',
        transition: isDragging ? 'none' : 'transform 0.2s ease'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <StickyNoteIcon className="w-4 h-4 opacity-60" />
        <div className="flex items-center gap-1">
          {/* Color Picker */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="w-6 h-6 p-0 opacity-60 hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <Palette className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {STICKY_COLORS.map((colorOption) => (
                <DropdownMenuItem
                  key={colorOption.value}
                  onClick={() => handleColorChange(colorOption.value)}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: colorOption.value }}
                  />
                  {colorOption.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Edit Button */}
          <Button
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0 opacity-60 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
          >
            <Edit3 className="w-3 h-3" />
          </Button>

          {/* Delete Button */}
          <Button
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0 opacity-60 hover:opacity-100 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Write your note... (supports **bold** and *italic*)"
            className="min-h-20 text-xs resize-none border-none bg-transparent p-0 focus:ring-0"
            style={{ color: currentColor.text }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              className="h-6 text-xs px-2"
              style={{ backgroundColor: currentColor.text, color: currentColor.value }}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="h-6 text-xs px-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="text-xs leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatContent(content || 'Click to edit...') }}
        />
      )}
    </div>
  );
});

StickyNote.displayName = 'StickyNote';

export default StickyNote;