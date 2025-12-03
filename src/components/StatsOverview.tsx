import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Clock } from "lucide-react";
import { MemberManagementDialog } from "./MemberManagementDialog";
interface Requirement {
  id: string;
  stage: string;
  assignee: string;
  priority: string;
}
interface StatsOverviewProps {
  requirements: Requirement[];
  onMembersChange?: () => void;
}
export const StatsOverview = ({
  requirements,
  onMembersChange
}: StatsOverviewProps) => {
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);

  // Calculate real stats
  const totalRequirements = requirements.length;
  const uniqueAssignees = new Set(requirements.map(r => r.assignee)).size;
  const highPriority = requirements.filter(r => r.priority === "high").length;
  const stats = [{
    title: "Total Projects",
    value: totalRequirements.toString(),
    subtitle: "all stages",
    icon: FileText,
    color: "text-accent",
    clickable: false
  }, {
    title: "Team Members",
    value: uniqueAssignees.toString(),
    subtitle: "click to manage",
    icon: Users,
    color: "text-primary",
    clickable: true
  }, {
    title: "High Priority",
    value: highPriority.toString(),
    subtitle: "urgent items",
    icon: Clock,
    color: "text-destructive",
    clickable: false
  }];
  return <>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => {
        const Icon = stat.icon;
        return <Card key={stat.title} className={`transition-all hover:shadow-elevated hover:-translate-y-1 ${stat.clickable ? "cursor-pointer ring-2 ring-transparent hover:ring-primary/50" : ""}`} style={{
          animationDelay: `${index * 0.1}s`
        }} onClick={stat.clickable ? () => setMemberDialogOpen(true) : undefined}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold">{stat.value}</h3>
                    <p className="mt-1 text-sm text-secondary">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`rounded-full bg-muted p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>

      <MemberManagementDialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen} onMembersChange={onMembersChange} />
    </>;
};