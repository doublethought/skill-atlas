import ArchetypeGrid from "../ArchetypeGrid";
import type { Designer } from "../DesignerAvatar";

const mockDesigners: Designer[] = [
  {
    id: "1",
    name: "Vincent Feeney",
    level: "P50",
    maturityInRole: 3,
    fitForRole: 4,
    archetype: "Craft-y",
    skills: {},
  },
  {
    id: "2",
    name: "Jon Snow",
    level: "P40",
    maturityInRole: 2,
    fitForRole: 3,
    archetype: "Craft-y",
    skills: {},
  },
  {
    id: "3",
    name: "Jessica Smith",
    level: "P50",
    maturityInRole: 4,
    fitForRole: 3,
    archetype: "Systems-y",
    skills: {},
  },
  {
    id: "4",
    name: "Amanda Chu",
    level: "P40",
    maturityInRole: 3,
    fitForRole: 4,
    archetype: "Systems-y",
    skills: {},
  },
  {
    id: "5",
    name: "Max O'Hara",
    level: "P50",
    maturityInRole: 5,
    fitForRole: 5,
    archetype: "Business-y",
    skills: {},
  },
  {
    id: "6",
    name: "Jenni Lee",
    level: "P40",
    maturityInRole: 3,
    fitForRole: 4,
    archetype: "Business-y",
    skills: {},
  },
];

export default function ArchetypeGridExample() {
  return (
    <div className="p-6 bg-background">
      <ArchetypeGrid designers={mockDesigners} />
    </div>
  );
}
