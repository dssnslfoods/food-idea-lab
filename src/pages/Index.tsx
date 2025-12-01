import { Hero } from "@/components/Hero";
import { StatsOverview } from "@/components/StatsOverview";
import { WorkflowStages } from "@/components/WorkflowStages";
import { RequirementCard } from "@/components/RequirementCard";
import { NewProjectDialog } from "@/components/NewProjectDialog";

const sampleRequirements = [
  {
    title: "Plant-Based Protein Alternative",
    description: "Develop new plant-based protein formula with improved texture and taste profile",
    stage: "Design",
    priority: "high" as const,
    assignee: "Dr. Sarah Chen",
    dueDate: "2025-12-15",
  },
  {
    title: "Sustainable Packaging Solution",
    description: "Research biodegradable packaging materials for frozen food products",
    stage: "Development",
    priority: "medium" as const,
    assignee: "Mike Johnson",
    dueDate: "2025-12-20",
  },
  {
    title: "Clean Label Preservatives",
    description: "Identify natural preservation methods to extend shelf life",
    stage: "Testing",
    priority: "high" as const,
    assignee: "Dr. Lisa Wang",
    dueDate: "2025-12-10",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <main className="container mx-auto max-w-7xl space-y-12 px-6 py-12">
        <StatsOverview />
        
        <WorkflowStages />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Recent Requirements</h2>
            <NewProjectDialog />
          </div>
          
          <div className="grid gap-6">
            {sampleRequirements.map((req, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <RequirementCard {...req} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
