import { useState } from "react";
import SkillsRadarChart from "../SkillsRadarChart";
import type { Designer } from "../DesignerAvatar";

const skillCategories = [
  "Product Thinking",
  "Visual & UI Craft",
  "UX & Interaction Design",
  "Design Systems",
  "Storytelling & Influence",
  "Data-Informed Decisions",
  "Research & Discovery",
  "Prototyping & Experimentation",
  "AI-Augmented Design",
  "Leadership & Collaboration",
];

const mockDesigners: Designer[] = [
  {
    id: "1",
    name: "Vincent Feeney",
    level: "Senior Designer",
    maturityInRole: 3,
    fitForRole: 4,
    archetype: "Craft",
    skills: {
      "Product Thinking": 4,
      "Visual & UI Craft": 5,
      "UX & Interaction Design": 4,
      "Design Systems": 3,
      "Storytelling & Influence": 4,
      "Data-Informed Decisions": 3,
      "Research & Discovery": 4,
      "Prototyping & Experimentation": 4,
      "AI-Augmented Design": 3,
      "Leadership & Collaboration": 4,
    },
  },
  {
    id: "2",
    name: "Jessica Smith",
    level: "Senior Designer",
    maturityInRole: 4,
    fitForRole: 3,
    archetype: "Systems",
    skills: {
      "Product Thinking": 3,
      "Visual & UI Craft": 3,
      "UX & Interaction Design": 5,
      "Design Systems": 5,
      "Storytelling & Influence": 3,
      "Data-Informed Decisions": 4,
      "Research & Discovery": 3,
      "Prototyping & Experimentation": 4,
      "AI-Augmented Design": 4,
      "Leadership & Collaboration": 3,
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
