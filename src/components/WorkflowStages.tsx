import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

const stages = [
  { name: "Concept", count: 8, status: "active" },
  { name: "Design", count: 5, status: "active" },
  { name: "Development", count: 12, status: "active" },
  { name: "Testing", count: 7, status: "active" },
  { name: "Launch", count: 3, status: "pending" },
];

export const WorkflowStages = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Workflow Stages</h2>
        <Badge variant="outline" className="text-sm">
          35 Active Requirements
        </Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-5">
        {stages.map((stage, index) => (
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
              <p className="text-sm text-muted-foreground">requirements</p>
            </CardContent>
            
            {index < stages.length - 1 && (
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
