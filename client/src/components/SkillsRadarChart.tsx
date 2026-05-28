import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Level = "Associate Designer" | "Midweight Designer" | "Senior Designer" | "Lead Designer" | "Staff Designer";

interface Designer {
  id: string;
  name: string;
  level: Level;
  maturityInRole: number;
  fitForRole: number;
  archetype: "Craft" | "Systems" | "Strategy";
  skills: Record<string, number>;
}

interface SkillsRadarChartProps {
  designers: Designer[];
  selectedDesignerIds: Set<string>;
  onToggleDesigner: (id: string) => void;
  onDeleteDesigner?: (id: string) => void;
  skillCategories: string[];
}

const CHART_COLORS = [
  "hsl(174, 66%, 40%)",
  "hsl(256, 67%, 58%)",
  "hsl(16, 84%, 58%)",
  "hsl(199, 86%, 48%)",
  "hsl(43, 92%, 52%)",
  "hsl(340, 70%, 54%)",
  "hsl(145, 58%, 42%)",
  "hsl(25, 72%, 51%)",
];

const SKILL_ABBREVIATIONS: Record<string, string> = {
  "Product Thinking": "PRODUCT",
  "Visual & UI Craft": "UI CRAFT",
  "UX & Interaction Design": "UX",
  "Design Systems": "SYSTEMS",
  "Storytelling & Influence": "STORY",
  "Data-Informed Decisions": "DATA",
  "Research & Discovery": "RESEARCH",
  "Prototyping & Experimentation": "PROTO",
  "AI-Augmented Design": "AI",
  "Leadership & Collaboration": "LEAD",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function SkillsRadarChart({
  designers,
  selectedDesignerIds,
  onToggleDesigner,
  onDeleteDesigner,
  skillCategories,
}: SkillsRadarChartProps) {
  // Create a stable color map based on designer's position in the full list
  const designerColorMap = useMemo(() => {
    const colorMap = new Map<string, string>();
    designers.forEach((designer, index) => {
      colorMap.set(designer.id, CHART_COLORS[index % CHART_COLORS.length]);
    });
    return colorMap;
  }, [designers]);

  const chartData = useMemo(() => {
    return skillCategories.map((category) => {
      const dataPoint: Record<string, string | number> = { 
        category,
        shortCategory: SKILL_ABBREVIATIONS[category] || category.slice(0, 8).toUpperCase(),
      };
      designers.forEach((designer) => {
        dataPoint[designer.id] = designer.skills[category] || 0;
      });
      return dataPoint;
    });
  }, [designers, skillCategories]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="h-[420px] flex-1 rounded-lg border bg-[linear-gradient(135deg,hsl(var(--background))_0%,hsl(var(--secondary))_48%,hsl(var(--accent))_100%)] p-3 shadow-inner lg:h-[520px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" radialLines={false} />
            <PolarAngleAxis
              dataKey="shortCategory"
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
              }}
              tickLine={false}
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
              axisLine={false}
            />
            {designers.map((designer) => {
              const color = designerColorMap.get(designer.id) || CHART_COLORS[0];
              const isSelected = selectedDesignerIds.has(designer.id);

              return (
                <Radar
                  key={designer.id}
                  name={designer.name}
                  dataKey={designer.id}
                  stroke={color}
                  fill={color}
                  fillOpacity={isSelected ? 0.16 : 0}
                  strokeOpacity={isSelected ? 1 : 0}
                  strokeWidth={isSelected ? 2.5 : 0}
                  isAnimationActive={false}
                />
              );
            })}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-lg border bg-card/90 p-4 shadow-sm lg:w-80">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Designers
        </h3>
        <div className="space-y-2">
          {designers.map((designer) => {
            const isSelected = selectedDesignerIds.has(designer.id);
            const color = designerColorMap.get(designer.id) || CHART_COLORS[0];
            
            return (
              <div
                key={designer.id}
                className={`group flex w-full items-center gap-3 rounded-md p-3 transition-all duration-200 ${
                  isSelected 
                    ? "bg-accent shadow-sm ring-1 ring-primary/15" 
                    : "opacity-50 hover:opacity-75"
                }`}
              >
                <button
                  onClick={() => onToggleDesigner(designer.id)}
                  className="flex flex-1 cursor-pointer items-center gap-3"
                  data-testid={`toggle-designer-${designer.id}`}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-white text-xs font-semibold text-white shadow-sm transition-transform duration-200 dark:border-gray-800"
                        style={{ 
                          backgroundColor: color,
                          transform: isSelected ? "scale(1)" : "scale(0.9)",
                        }}
                      >
                        {getInitials(designer.name)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="font-sans">{designer.name}</span>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className={`font-sans text-sm leading-tight transition-colors duration-200 ${
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {designer.name}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {designer.level}
                    </span>
                  </div>
                  <div 
                    className="ml-auto h-3 w-3 rounded-full border-2 transition-all duration-200"
                    style={{ 
                      borderColor: color,
                      backgroundColor: isSelected ? color : "transparent",
                    }}
                  />
                </button>
                {onDeleteDesigner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 text-muted-foreground transition-opacity hover:text-destructive group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDesigner(designer.id);
                    }}
                    data-testid={`delete-designer-${designer.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
