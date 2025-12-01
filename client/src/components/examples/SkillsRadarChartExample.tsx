import { useState } from "react";
import SkillsRadarChart from "../SkillsRadarChart";
import type { Designer } from "../DesignerAvatar";

const skillCategories = [
  "Product & Tech Knowledge",
  "Visual Design",
  "Interaction Design",
  "Systems and Architecture",
  "Comms & Influence",
  "Analytical Thinking",
  "Design Research",
  "Embraces Change",
  "Develops Self and Others",
  "Manages to Results",
];

const mockDesigners: Designer[] = [
  {
    id: "1",
    name: "Vincent Feeney",
    level: "P50",
    maturityInRole: 3,
    fitForRole: 4,
    archetype: "Craft-y",
    skills: {
      "Product & Tech Knowledge": 4,
      "Visual Design": 5,
      "Interaction Design": 4,
      "Systems and Architecture": 3,
      "Comms & Influence": 4,
      "Analytical Thinking": 3,
      "Design Research": 4,
      "Embraces Change": 4,
      "Develops Self and Others": 3,
      "Manages to Results": 4,
    },
  },
  {
    id: "2",
    name: "Jessica Smith",
    level: "P50",
    maturityInRole: 4,
    fitForRole: 3,
    archetype: "Systems-y",
    skills: {
      "Product & Tech Knowledge": 3,
      "Visual Design": 3,
      "Interaction Design": 5,
      "Systems and Architecture": 5,
      "Comms & Influence": 3,
      "Analytical Thinking": 4,
      "Design Research": 3,
      "Embraces Change": 4,
      "Develops Self and Others": 4,
      "Manages to Results": 3,
    },
  },
];

export default function SkillsRadarChartExample() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(mockDesigners.map((d) => d.id))
  );

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="p-6 bg-background">
      <SkillsRadarChart
        designers={mockDesigners}
        selectedDesignerIds={selectedIds}
        onToggleDesigner={handleToggle}
        skillCategories={skillCategories}
      />
    </div>
  );
}
