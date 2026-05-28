import ArchetypeGrid from "../ArchetypeGrid";
import type { Designer } from "../DesignerAvatar";

const mockDesigners: Designer[] = [
  {
    id: "1",
    name: "Vincent Feeney",
    level: "Senior Designer",
    maturityInRole: 3,
    fitForRole: 4,
    archetype: "Craft",
    skills: {},
  },
  {
    id: "2",
    name: "Jon Snow",
    level: "Midweight Designer",
    maturityInRole: 2,
    fitForRole: 3,
    archetype: "Craft",
    skills: {},
  },
  {
    id: "3",
    name: "Jessica Smith",
    level: "Senior Designer",
    maturityInRole: 4,
    fitForRole: 3,
    archetype: "Systems",
    skills: {},
  },
  {
    id: "4",
    name: "Amanda Chu",
    level: "Midweight Designer",
    maturityInRole: 3,
    fitForRole: 4,
    archetype: "Systems",
    skills: {},
  },
  {
    id: "5",
    name: "Max O'Hara",
    level: "Senior Designer",
    maturityInRole: 5,
    fitForRole: 5,
    archetype: "Strategy",
    skills: {},
  },
  {
    id: "6",
    name: "Jenni Lee",
    level: "Midweight Designer",
    maturityInRole: 3,
    fitForRole: 4,
    archetype: "Strategy",
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
