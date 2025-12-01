import { useMemo } from "react";
import DesignerAvatar, { type Designer, type Level } from "./DesignerAvatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScaleSliderProps {
  title: string;
  designers: Designer[];
  valueKey: "maturityInRole" | "fitForRole";
  leftLabel: string;
  rightLabel: string;
  leftColor?: string;
  rightColor?: string;
  levelFilter: Level | "all";
  onLevelFilterChange: (level: Level | "all") => void;
}

const LEVELS: Level[] = ["P30", "P40", "P50", "P60", "P70"];

export default function ScaleSlider({
  title,
  designers,
  valueKey,
  leftLabel,
  rightLabel,
  leftColor = "bg-green-500",
  rightColor = "bg-red-500",
  levelFilter,
  onLevelFilterChange,
}: ScaleSliderProps) {
  const filteredDesigners = useMemo(() => {
    if (levelFilter === "all") return designers;
    return designers.filter((d) => d.level === levelFilter);
  }, [designers, levelFilter]);

  const groupedByScore = useMemo(() => {
    const groups: Record<number, Designer[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    filteredDesigners.forEach((d) => {
      const score = d[valueKey];
      if (score >= 1 && score <= 5) {
        groups[score].push(d);
      }
    });
    return groups;
  }, [filteredDesigners, valueKey]);

  return (
    <div className="space-y-4" data-testid={`scale-slider-${valueKey}`}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-sans font-semibold text-lg text-foreground">{title}</h3>
        <Select
          value={levelFilter}
          onValueChange={(value) => onLevelFilterChange(value as Level | "all")}
        >
          <SelectTrigger
            className="w-32"
            data-testid={`filter-level-${valueKey}`}
          >
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative pt-8 pb-6">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-muted rounded-full" />

        <div className="relative flex justify-between">
          {[1, 2, 3, 4, 5].map((score) => (
            <div
              key={score}
              className="flex flex-col items-center"
              style={{ width: "20%" }}
            >
              <div className="flex flex-col items-center gap-1 min-h-[60px]">
                {groupedByScore[score].map((designer, idx) => (
                  <div
                    key={designer.id}
                    style={{
                      transform: `translateX(${(idx - (groupedByScore[score].length - 1) / 2) * 12}px)`,
                    }}
                  >
                    <DesignerAvatar designer={designer} size="md" />
                  </div>
                ))}
              </div>
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30 mt-2" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-sm ${leftColor}`} />
          <span>{leftLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{rightLabel}</span>
          <div className={`w-3 h-3 rounded-sm ${rightColor}`} />
        </div>
      </div>
    </div>
  );
}
