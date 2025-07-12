import { useState } from 'react';
import FlowEditor from '@/components/flow/FlowEditor';
import FlowHeader from '@/components/flow/FlowHeader';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const handleSave = () => {
    setLastSaved(new Date());
    toast({
      title: "Workflow saved",
      description: "Your workflow has been saved successfully",
    });
  };

  const handleRun = () => {
    setIsRunning(true);
    toast({
      title: "Workflow started",
      description: "Your automation workflow is now running",
    });
    
    // Simulate workflow execution
    setTimeout(() => {
      setIsRunning(false);
      toast({
        title: "Workflow completed",
        description: "Your automation workflow has finished successfully",
      });
    }, 5000);
  };

  const handleStop = () => {
    setIsRunning(false);
    toast({
      title: "Workflow stopped",
      description: "Your automation workflow has been stopped",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share workflow",
      description: "Sharing functionality will be implemented soon",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export workflow",
      description: "Export functionality will be implemented soon",
    });
  };

  const handleImport = () => {
    toast({
      title: "Import workflow",
      description: "Import functionality will be implemented soon",
    });
  };

  const handleSettings = () => {
    toast({
      title: "Workflow settings",
      description: "Settings panel will be implemented soon",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <FlowHeader
        workflowName="Video Generation Workflow"
        isRunning={isRunning}
        lastSaved={lastSaved}
        collaborators={1}
        onSave={handleSave}
        onRun={handleRun}
        onStop={handleStop}
        onShare={handleShare}
        onExport={handleExport}
        onImport={handleImport}
        onSettings={handleSettings}
      />
      <FlowEditor className="flex-1" />
    </div>
  );
};

export default Index;
