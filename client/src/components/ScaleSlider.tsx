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
      {title && (
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-sans font-semibold text-sm text-foreground">{title}</h3>
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
      )}

      <div className="relative">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <div
              key={score}
              className="flex flex-col items-center"
              style={{ width: "20%" }}
            >
              <div className="flex flex-wrap justify-center gap-1 min-h-[48px] items-end">
                {groupedByScore[score].map((designer) => (
                  <div
                    key={designer.id}
                    className="transition-all duration-300 ease-out"
                  >
                    <DesignerAvatar designer={designer} size="md" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="relative h-6 flex items-center">
          <div className="absolute left-[10%] right-[10%] h-[3px] bg-muted rounded-full" />
          {[1, 2, 3, 4, 5].map((score) => (
            <div
              key={score}
              className="absolute flex flex-col items-center"
              style={{ left: `${(score - 1) * 20 + 10}%`, transform: "translateX(-50%)" }}
            >
              <div className="w-[3px] h-4 bg-muted-foreground/40 rounded-full" />
              <span className="font-mono text-xs text-muted-foreground mt-1">{score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs font-sans uppercase tracking-wider text-muted-foreground pt-2">
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
