import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Clock, CheckCircle2 } from "lucide-react";

interface Requirement {
  id: string;
  stage: string;
  assignee: string;
  priority: string;
}

interface StatsOverviewProps {
  requirements: Requirement[];
}

export const StatsOverview = ({ requirements }: StatsOverviewProps) => {
  // Calculate real stats
  const totalRequirements = requirements.length;
  const uniqueAssignees = new Set(requirements.map(r => r.assignee)).size;
  const highPriority = requirements.filter(r => r.priority === "high").length;
  const inProduction = requirements.filter(r => r.stage === "Post Launch").length;

  const stats = [
    {
      title: "Total Projects",
      value: totalRequirements.toString(),
      subtitle: "all stages",
      icon: FileText,
      color: "text-accent",
    },
    {
      title: "Team Members",
      value: uniqueAssignees.toString(),
      subtitle: "unique assignees",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "High Priority",
      value: highPriority.toString(),
      subtitle: "urgent items",
      icon: Clock,
      color: "text-destructive",
    },
    {
      title: "Post Launch",
      value: inProduction.toString(),
      subtitle: "completed",
      icon: CheckCircle2,
      color: "text-accent",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.title}
            className="transition-all hover:shadow-elevated hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className="mt-2 text-3xl font-bold">{stat.value}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={`rounded-full bg-muted p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
