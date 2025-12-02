import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { StatsOverview } from "@/components/StatsOverview";
import { StatusPieChart } from "@/components/StatusPieChart";
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
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const { data, error } = await supabase
        .from('requirements')
        .select('*')
        .order('updated_at', { ascending: false });

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
        <div className="grid gap-6 md:grid-cols-2">
          <StatusPieChart 
            requirements={requirements}
            selectedStage={selectedStage}
            onStageSelect={setSelectedStage}
          />
          <StatsOverview requirements={requirements} onMembersChange={fetchRequirements} />
        </div>
        
        <WorkflowStages 
          requirements={requirements} 
          selectedStage={selectedStage}
          onStageSelect={setSelectedStage}
        />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              {selectedStage ? `Projects: ${selectedStage}` : "Your Projects"}
            </h2>
            <div className="flex items-center gap-2">
              {selectedStage && (
                <button 
                  onClick={() => setSelectedStage(null)}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Show All
                </button>
              )}
              <NewProjectDialog onSuccess={fetchRequirements} />
            </div>
          </div>
          
          {(() => {
            const filteredRequirements = selectedStage 
              ? requirements.filter(req => req.stage === selectedStage)
              : requirements;
            
            return filteredRequirements.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>{selectedStage ? `No projects in ${selectedStage}` : "No projects yet. Create your first one!"}</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredRequirements.map((req, index) => (
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
            );
          })()}
        </div>
      </main>
    </div>
  );
};

export default Index;
