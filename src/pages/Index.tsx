import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { StatsOverview } from "@/components/StatsOverview";
import { WorkflowStages } from "@/components/WorkflowStages";
import { RequirementCard } from "@/components/RequirementCard";
import { NewProjectDialog } from "@/components/NewProjectDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Requirement = {
  id: string;
  title: string;
  description: string;
  stage: string;
  priority: "low" | "medium" | "high";
  assignee: string;
  due_date: string;
};

const Index = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const { data, error } = await supabase
        .from('requirements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequirements((data || []) as Requirement[]);
    } catch (error: any) {
      console.error('Error fetching requirements:', error);
      toast.error("Failed to load requirements");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <main className="container mx-auto max-w-7xl space-y-12 px-6 py-8">
        <StatsOverview requirements={requirements} />
        
        <WorkflowStages requirements={requirements} />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Your Requirements</h2>
            <NewProjectDialog onSuccess={fetchRequirements} />
          </div>
          
          {requirements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No requirements yet. Create your first one!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {requirements.map((req, index) => (
                <div key={req.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <RequirementCard 
                    id={req.id}
                    title={req.title}
                    description={req.description}
                    stage={req.stage}
                    priority={req.priority}
                    assignee={req.assignee}
                    dueDate={req.due_date}
                    onUpdate={fetchRequirements}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
