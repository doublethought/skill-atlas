import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { Designer } from "./DesignerAvatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

const SKILL_ABBREVIATIONS: Record<string, string> = {
  "Product & Tech Knowledge": "PROD/TECH",
  "Visual Design": "VISUAL",
  "Interaction Design": "IXD",
  "Systems and Architecture": "SYSTEMS",
  "Comms & Influence": "COMMS",
  "Analytical Thinking": "ANALYSIS",
  "Design Research": "RESEARCH",
  "Embraces Change": "CHANGE",
  "Develops Self and Others": "DEVELOPS",
  "Manages to Results": "RESULTS",
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
  skillCategories,
}: SkillsRadarChartProps) {
  const chartData = useMemo(() => {
    return skillCategories.map((category) => {
      const dataPoint: Record<string, string | number> = { 
        category,
        shortCategory: SKILL_ABBREVIATIONS[category] || category.slice(0, 8).toUpperCase(),
      };
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
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="shortCategory"
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
              }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 5]}
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
              tickCount={6}
              axisLine={false}
            />
            {selectedDesigners.map((designer, index) => (
              <Radar
                key={designer.id}
                name={designer.name}
                dataKey={designer.id}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                fillOpacity={0.12}
                strokeWidth={2}
                animationDuration={400}
                animationEasing="ease-out"
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="lg:w-72 border-l border-border pl-8">
        <h3 className="font-sans font-semibold text-sm text-foreground mb-6 uppercase tracking-wide">
          Team Members
        </h3>
        <div className="space-y-2">
          {designers.map((designer, index) => {
            const isSelected = selectedDesignerIds.has(designer.id);
            const color = CHART_COLORS[index % CHART_COLORS.length];
            
            return (
              <button
                key={designer.id}
                onClick={() => onToggleDesigner(designer.id)}
                className={`w-full flex items-center gap-3 cursor-pointer rounded-md p-3 -ml-3 transition-all duration-200 ${
                  isSelected 
                    ? "bg-accent/50" 
                    : "opacity-50 hover:opacity-75"
                }`}
                data-testid={`toggle-designer-${designer.id}`}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-mono font-medium border-2 border-white dark:border-gray-800 shadow-sm transition-transform duration-200"
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
                  className="ml-auto w-3 h-3 rounded-full border-2 transition-all duration-200"
                  style={{ 
                    borderColor: color,
                    backgroundColor: isSelected ? color : "transparent",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
