import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, FlaskConical, ClipboardCheck, Package, Rocket, Flag, ArrowRight } from "lucide-react";

interface Requirement {
  id: string;
  stage: string;
}

interface WorkflowStagesProps {
  requirements: Requirement[];
}

const stageConfig = [
  { name: "Product Concept", icon: Lightbulb },
  { name: "Screen Test", icon: FlaskConical },
  { name: "Testing Validation", icon: ClipboardCheck },
  { name: "First Batch", icon: Package },
  { name: "Post Launch", icon: Rocket },
  { name: "Project Close", icon: Flag },
];

export const WorkflowStages = ({ requirements }: WorkflowStagesProps) => {
  // Count requirements by stage
  const stageCounts = stageConfig.map(stage => {
    const count = requirements.filter(req => req.stage === stage.name).length;
    return {
      ...stage,
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
      
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stageCounts.map((stage, index) => {
          const IconComponent = stage.icon;
          return (
            <Card 
              key={stage.name}
              className="relative flex-shrink-0 min-w-[160px] transition-all hover:shadow-elevated hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconComponent className={`h-5 w-5 ${stage.status === "active" ? "text-accent" : "text-muted-foreground"}`} />
                  <span className="truncate">{stage.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stage.count}</div>
                <p className="text-sm text-muted-foreground">projects</p>
              </CardContent>
              
              {index < stageCounts.length - 1 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
