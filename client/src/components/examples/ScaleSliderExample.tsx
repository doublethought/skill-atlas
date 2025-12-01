import { useState } from "react";
import ScaleSlider from "../ScaleSlider";
import type { Designer, Level } from "../DesignerAvatar";

const mockDesigners: Designer[] = [
  {
    id: "1",
    name: "Vincent Feeney",
    level: "P50",
    maturityInRole: 2,
    fitForRole: 2,
    archetype: "Craft-y",
    skills: {},
  },
  {
    id: "2",
    name: "Zach Chen",
    level: "P40",
    maturityInRole: 4,
    fitForRole: 4,
    archetype: "Systems-y",
    skills: {},
  },
  {
    id: "3",
    name: "Sarah Miller",
    level: "P50",
    maturityInRole: 3,
    fitForRole: 3,
    archetype: "Business-y",
    skills: {},
  },
];

export default function ScaleSliderExample() {
  const [maturityFilter, setMaturityFilter] = useState<Level | "all">("all");
  const [fitFilter, setFitFilter] = useState<Level | "all">("all");

  return (
    <div className="p-6 space-y-8 bg-background">
      <ScaleSlider
        title="Role maturity"
        designers={mockDesigners}
        valueKey="maturityInRole"
        leftLabel="New in role"
        rightLabel="Near promotion"
        leftColor="bg-blue-500"
        rightColor="bg-blue-500"
        levelFilter={maturityFilter}
        onLevelFilterChange={setMaturityFilter}
      />
      <ScaleSlider
        title="Role fit"
        designers={mockDesigners}
        valueKey="fitForRole"
        leftLabel="Great fit"
        rightLabel="Not a fit"
        leftColor="bg-green-500"
        rightColor="bg-red-500"
        levelFilter={fitFilter}
        onLevelFilterChange={setFitFilter}
      />
    </div>
  );
}
