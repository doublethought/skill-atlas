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

const LEVELS: Level[] = ["Associate Designer", "Midweight Designer", "Senior Designer", "Lead Designer", "Staff Designer"];

function ScaleAvatar({ designer }: { designer: Designer }) {
  return (
    <div className="group relative flex justify-center">
      <DesignerAvatar designer={designer} size="md" showTooltip={false} />
      <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 min-w-max -translate-x-1/2 rounded-md border bg-popover px-3 py-2 text-center text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        <p className="whitespace-nowrap text-sm font-medium leading-tight">{designer.name}</p>
        <p className="mt-1 whitespace-nowrap font-mono text-xs text-muted-foreground">{designer.level}</p>
      </div>
    </div>
  );
}

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
    <div className="space-y-5" data-testid={`scale-slider-${valueKey}`}>
      {title && (
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-sans font-semibold text-sm text-foreground">{title}</h3>
          <Select
            value={levelFilter}
            onValueChange={(value) => onLevelFilterChange(value as Level | "all")}
          >
            <SelectTrigger
              className="w-52 [&>span]:block [&>span]:w-full [&>span]:text-left"
              data-testid={`filter-level-${valueKey}`}
            >
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
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
        <div className="mb-3 flex justify-between rounded-lg border bg-secondary/60 px-3 py-4 shadow-inner">
          {[1, 2, 3, 4, 5].map((score) => (
            <div
              key={score}
              className="flex flex-col items-center"
              style={{ width: "20%" }}
            >
              <div className="flex min-h-[56px] flex-wrap items-end justify-center gap-1">
                {groupedByScore[score].map((designer) => (
                  <div
                    key={designer.id}
                    className="transition-all duration-300 ease-out"
                  >
                    <ScaleAvatar designer={designer} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="relative flex h-7 items-center">
          <div className="absolute left-[10%] right-[10%] h-2 rounded-full bg-gradient-to-r from-teal-500/80 via-sky-400/80 to-orange-400/80 shadow-sm" />
          {[1, 2, 3, 4, 5].map((score) => (
            <div
              key={score}
              className="absolute flex flex-col items-center"
              style={{ left: `${(score - 1) * 20 + 10}%`, transform: "translateX(-50%)" }}
            >
              <div className="h-4 w-[3px] rounded-full bg-background shadow-sm" />
              <span className="mt-1 font-mono text-xs text-muted-foreground">{score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2 text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${leftColor}`} />
          <span>{leftLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{rightLabel}</span>
          <div className={`h-3 w-3 rounded-full ${rightColor}`} />
        </div>
      </div>
    </div>
  );
}
