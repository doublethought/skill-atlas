import DesignerAvatar, { type Designer } from "../DesignerAvatar";

const mockDesigner: Designer = {
  id: "1",
  name: "Vincent Feeney",
  level: "Senior Designer",
  maturityInRole: 3,
  fitForRole: 4,
  archetype: "Craft",
  skills: {
    "Visual & UI Craft": 4,
    "UX & Interaction Design": 3,
    "Research & Discovery": 4,
  },
};

export default function DesignerAvatarExample() {
  return (
    <div className="flex items-center gap-4 p-4">
      <DesignerAvatar designer={mockDesigner} size="sm" />
      <DesignerAvatar designer={mockDesigner} size="md" />
      <DesignerAvatar designer={mockDesigner} size="lg" />
    </div>
  );
}
