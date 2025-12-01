import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Designer } from "./DesignerAvatar";
import { Checkbox } from "@/components/ui/checkbox";

interface SkillsRadarChartProps {
  designers: Designer[];
  selectedDesignerIds: Set<string>;
  onToggleDesigner: (id: string) => void;
  skillCategories: string[];
}

const CHART_COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(271, 81%, 56%)",
  "hsl(173, 58%, 39%)",
  "hsl(43, 96%, 56%)",
  "hsl(27, 87%, 67%)",
  "hsl(340, 75%, 55%)",
  "hsl(200, 80%, 50%)",
  "hsl(150, 60%, 45%)",
];

export default function SkillsRadarChart({
  designers,
  selectedDesignerIds,
  onToggleDesigner,
  skillCategories,
}: SkillsRadarChartProps) {
  const chartData = useMemo(() => {
    return skillCategories.map((category) => {
      const dataPoint: Record<string, string | number> = { category };
      designers.forEach((designer) => {
        if (selectedDesignerIds.has(designer.id)) {
          dataPoint[designer.id] = designer.skills[category] || 0;
        }
      });
      return dataPoint;
    });
  }, [designers, selectedDesignerIds, skillCategories]);

  const selectedDesigners = designers.filter((d) => selectedDesignerIds.has(d.id));

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-h-[400px] lg:min-h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="category"
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
              }}
              className="uppercase tracking-wider"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 5]}
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
              }}
              tickCount={6}
            />
            {selectedDesigners.map((designer, index) => (
              <Radar
                key={designer.id}
                name={designer.name}
                dataKey={designer.id}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
            {selectedDesigners.length > 0 && (
              <Legend
                wrapperStyle={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                }}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="lg:w-64 border-l border-border pl-6">
        <h3 className="font-sans font-semibold text-sm text-foreground mb-4 uppercase tracking-wide">
          Team Members
        </h3>
        <div className="space-y-3">
          {designers.map((designer, index) => (
            <label
              key={designer.id}
              className="flex items-center gap-3 cursor-pointer hover-elevate rounded-md p-2 -ml-2"
              data-testid={`toggle-designer-${designer.id}`}
            >
              <Checkbox
                checked={selectedDesignerIds.has(designer.id)}
                onCheckedChange={() => onToggleDesigner(designer.id)}
                style={{
                  borderColor: CHART_COLORS[index % CHART_COLORS.length],
                  backgroundColor: selectedDesignerIds.has(designer.id)
                    ? CHART_COLORS[index % CHART_COLORS.length]
                    : "transparent",
                }}
              />
              <div className="flex flex-col">
                <span className="font-sans text-sm text-foreground">{designer.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {designer.level}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
