import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Clock, CheckCircle2 } from "lucide-react";

const stats = [
  {
    title: "Active Projects",
    value: "24",
    change: "+12%",
    icon: TrendingUp,
    color: "text-accent",
  },
  {
    title: "Team Members",
    value: "18",
    change: "+3",
    icon: Users,
    color: "text-primary",
  },
  {
    title: "Avg. Completion",
    value: "14 days",
    change: "-2 days",
    icon: Clock,
    color: "text-secondary",
  },
  {
    title: "Completed",
    value: "127",
    change: "+18%",
    icon: CheckCircle2,
    color: "text-accent",
  },
];

export const StatsOverview = () => {
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
                    <span className={`font-medium ${stat.color}`}>
                      {stat.change}
                    </span>{" "}
                    vs last month
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
