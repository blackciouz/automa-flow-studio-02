import { NodeTemplate } from "@/types/flow";
import { 
  Zap, 
  Play, 
  Clock, 
  Download, 
  Upload, 
  Image, 
  Video, 
  Music, 
  Type, 
  Palette, 
  Layers, 
  Share2, 
  FileText, 
  Scissors, 
  Wand2, 
  Camera, 
  Mic, 
  Instagram, 
  Youtube,
  CloudUpload,
  Calendar,
  Sparkles,
  Brush,
  Volume2,
  Database,
  ExternalLink,
  FileVideo,
  ImageIcon,
  Settings,
  Filter
} from "lucide-react";

export const nodeTemplates: NodeTemplate[] = [
  // 🚀 TRIGGERS (Vert émeraude #10B981)
  {
    id: "manual-trigger",
    type: "trigger",
    category: "trigger",
    name: "Manual Trigger",
    description: "Démarrage manuel du workflow",
    icon: Play,
    color: "#10B981",
    outputs: 1,
    configurable: false
  },
  {
    id: "schedule-trigger",
    type: "trigger", 
    category: "trigger",
    name: "Schedule",
    description: "Exécution programmée",
    icon: Clock,
    color: "#10B981",
    outputs: 1,
    configurable: true
  },
  {
    id: "content-upload-trigger",
    type: "trigger",
    category: "trigger", 
    name: "Content Upload",
    description: "Déclenchement par upload",
    icon: Upload,
    color: "#10B981",
    outputs: 1,
    configurable: true
  },

  // 🎨 MEDIA (Bleu cyan #06B6D4)
  {
    id: "ai-image-generator",
    type: "media",
    category: "media",
    name: "AI Image Generator", 
    description: "Génération d'images (DALL-E 3)",
    icon: Sparkles,
    color: "#06B6D4",
    inputs: 1,
    outputs: 1,
    configurable: true
  },
  {
    id: "ai-video-generator",
    type: "media",
    category: "media",
    name: "AI Video Generator",
    description: "Génération vidéo (Runway ML)",
    icon: Video,
    color: "#06B6D4", 
    inputs: 1,
    outputs: 1,
    configurable: true
  },
  {
    id: "ai-audio-generator", 
    type: "media",
    category: "media",
    name: "AI Audio Generator",
    description: "Génération audio (Mubert)",
    icon: Volume2,
    color: "#06B6D4",
    inputs: 1,
    outputs: 1,
    configurable: true
  },

  // ⚡ ACTIONS (Violet indigo #8B5CF6)
  {
    id: "video-editor",
    type: "action",
    category: "action", 
    name: "Video Editor",
    description: "Édition et composition vidéo",
    icon: Scissors,
    color: "#8B5CF6",
    inputs: 2,
    outputs: 1,
    configurable: true
  },
  {
    id: "image-editor",
    type: "action",
    category: "action",
    name: "Image Editor", 
    description: "Édition d'images",
    icon: Brush,
    color: "#8B5CF6",
    inputs: 1,
    outputs: 1,
    configurable: true
  },
  {
    id: "text-logo-overlay",
    type: "action",
    category: "action",
    name: "Text/Logo Overlay",
    description: "Ajout de texte et logos",
    icon: Type,
    color: "#8B5CF6",
    inputs: 2,
    outputs: 1,
    configurable: true
  },
  {
    id: "ai-upscaler",
    type: "action", 
    category: "action",
    name: "AI Upscaler",
    description: "Amélioration qualité IA",
    icon: Wand2,
    color: "#8B5CF6",
    inputs: 1,
    outputs: 1,
    configurable: true
  },
  {
    id: "ai-style-filter",
    type: "action",
    category: "action",
    name: "AI Style Filter",
    description: "Filtres artistiques IA", 
    icon: Filter,
    color: "#8B5CF6",
    inputs: 1,
    outputs: 1,
    configurable: true
  },

  // 💾 DATA (Orange ambre #F59E0B)
  {
    id: "instagram-publish",
    type: "data",
    category: "data",
    name: "Instagram Publish",
    description: "Publication Instagram",
    icon: Instagram,
    color: "#F59E0B",
    inputs: 1,
    outputs: 0,
    configurable: true
  },
  {
    id: "youtube-publish",
    type: "data", 
    category: "data",
    name: "YouTube Publish",
    description: "Publication YouTube",
    icon: Youtube,
    color: "#F59E0B",
    inputs: 1,
    outputs: 0,
    configurable: true
  },
  {
    id: "multi-platform-publish",
    type: "data",
    category: "data",
    name: "Multi-Platform Publish",
    description: "Publication multi-plateformes",
    icon: Share2,
    color: "#F59E0B",
    inputs: 1,
    outputs: 0,
    configurable: true
  },
  {
    id: "cloud-storage",
    type: "data",
    category: "data",
    name: "Cloud Storage",
    description: "Sauvegarde cloud",
    icon: Database,
    color: "#F59E0B",
    inputs: 1,
    outputs: 1,
    configurable: true
  },
  {
    id: "export-media",
    type: "data",
    category: "data", 
    name: "Export Media",
    description: "Export multi-formats",
    icon: Download,
    color: "#F59E0B",
    inputs: 1,
    outputs: 0,
    configurable: true
  }
];

export const getNodeTemplateByType = (type: string): NodeTemplate | undefined => {
  return nodeTemplates.find(template => template.type === type);
};

export const getNodeTemplatesByCategory = (category: 'trigger' | 'media' | 'action' | 'data'): NodeTemplate[] => {
  return nodeTemplates.filter(template => template.category === category);
};