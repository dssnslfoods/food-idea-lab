import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface Requirement {
  id: string;
  stage: string;
}

interface WorkflowStagesProps {
  requirements: Requirement[];
}

const stageOrder = ["Product Concept", "Screen Test", "Testing Validation", "First Batch", "Post Launch", "Project Close"];

export const WorkflowStages = ({ requirements }: WorkflowStagesProps) => {
  // Count requirements by stage
  const stageCounts = stageOrder.map(stageName => {
    const count = requirements.filter(req => req.stage === stageName).length;
    return {
      name: stageName,
      count,
      status: count > 0 ? "active" : "pending"
    };
  });

  const totalActive = requirements.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gate Status</h2>
        <Badge variant="outline" className="text-sm">
          {totalActive} Active Projects
        </Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-6">
        {stageCounts.map((stage, index) => (
          <Card 
            key={stage.name}
            className="relative overflow-hidden transition-all hover:shadow-elevated hover:-translate-y-1"
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{stage.name}</span>
                {stage.status === "active" ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stage.count}</div>
              <p className="text-sm text-muted-foreground">projects</p>
            </CardContent>
            
            {index < stageCounts.length - 1 && (
              <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 md:block">
                <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
