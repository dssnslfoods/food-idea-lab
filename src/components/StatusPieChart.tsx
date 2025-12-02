import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Requirement {
  id: string;
  stage: string;
}

interface StatusPieChartProps {
  requirements: Requirement[];
  onStageSelect: (stage: string | null) => void;
  selectedStage: string | null;
}

const stageColors: Record<string, string> = {
  "Product Concept": "#0d9488", // teal
  "Screen Test": "#f97316",     // orange
  "Testing Validation": "#8b5cf6", // purple
  "First Batch": "#3b82f6",     // blue
  "Post Launch": "#22c55e",     // green
  "Project Close": "#6b7280",   // gray
};

const stageOrder = ["Product Concept", "Screen Test", "Testing Validation", "First Batch", "Post Launch", "Project Close"];

export const StatusPieChart = ({ requirements, onStageSelect, selectedStage }: StatusPieChartProps) => {
  const data = stageOrder.map(stage => ({
    name: stage,
    value: requirements.filter(req => req.stage === stage).length,
    color: stageColors[stage],
  })).filter(item => item.value > 0);

  const handleClick = (data: any) => {
    if (selectedStage === data.name) {
      onStageSelect(null);
    } else {
      onStageSelect(data.name);
    }
  };

  if (requirements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">No projects yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                onClick={handleClick}
                style={{ cursor: "pointer" }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    opacity={selectedStage && selectedStage !== entry.name ? 0.3 : 1}
                    stroke={selectedStage === entry.name ? "#000" : "none"}
                    strokeWidth={selectedStage === entry.name ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [`${value} projects`, name]}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend 
                layout="vertical" 
                align="right" 
                verticalAlign="middle"
                formatter={(value) => (
                  <span className={`text-sm ${selectedStage && selectedStage !== value ? "opacity-50" : ""}`}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
