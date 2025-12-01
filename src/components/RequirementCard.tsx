import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, ArrowRight } from "lucide-react";

interface RequirementCardProps {
  title: string;
  description: string;
  stage: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  dueDate: string;
}

export const RequirementCard = ({ 
  title, 
  description, 
  stage, 
  priority, 
  assignee, 
  dueDate 
}: RequirementCardProps) => {
  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-secondary text-secondary-foreground",
    low: "bg-accent text-accent-foreground",
  };

  return (
    <Card className="group transition-all hover:shadow-elevated hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0">
            {stage}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Badge className={priorityColors[priority]}>
            {priority.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{assignee}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{dueDate}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto group-hover:text-primary"
          >
            View Details
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
