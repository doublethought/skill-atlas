import { useState, useCallback } from "react";
import { Plus, Home, Bell, HelpCircle, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkillsRadarChart from "@/components/SkillsRadarChart";
import ScaleSlider from "@/components/ScaleSlider";
import ArchetypeGrid from "@/components/ArchetypeGrid";
import AddDesignerModal from "@/components/AddDesignerModal";
import type { Designer, Level } from "@/components/DesignerAvatar";

const SKILL_CATEGORIES = [
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

// todo: remove mock functionality - replace with API data
const INITIAL_DESIGNERS: Designer[] = [
  {
    id: "1",
    name: "Vincent Feeney",
    level: "P50",
    maturityInRole: 2,
    fitForRole: 2,
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
    name: "Zach Chen",
    level: "P40",
    maturityInRole: 4,
    fitForRole: 4,
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
  {
    id: "3",
    name: "Jessica Smith",
    level: "P50",
    maturityInRole: 3,
    fitForRole: 3,
    archetype: "Systems-y",
    skills: {
      "Product & Tech Knowledge": 4,
      "Visual Design": 3,
      "Interaction Design": 4,
      "Systems and Architecture": 5,
      "Comms & Influence": 4,
      "Analytical Thinking": 5,
      "Design Research": 3,
      "Embraces Change": 3,
      "Develops Self and Others": 4,
      "Manages to Results": 4,
    },
  },
  {
    id: "4",
    name: "Amanda Chu",
    level: "P40",
    maturityInRole: 3,
    fitForRole: 4,
    archetype: "Systems-y",
    skills: {
      "Product & Tech Knowledge": 3,
      "Visual Design": 4,
      "Interaction Design": 4,
      "Systems and Architecture": 4,
      "Comms & Influence": 3,
      "Analytical Thinking": 3,
      "Design Research": 4,
      "Embraces Change": 4,
      "Develops Self and Others": 3,
      "Manages to Results": 3,
    },
  },
  {
    id: "5",
    name: "Max O'Hara",
    level: "P50",
    maturityInRole: 5,
    fitForRole: 5,
    archetype: "Business-y",
    skills: {
      "Product & Tech Knowledge": 5,
      "Visual Design": 3,
      "Interaction Design": 3,
      "Systems and Architecture": 4,
      "Comms & Influence": 5,
      "Analytical Thinking": 4,
      "Design Research": 4,
      "Embraces Change": 5,
      "Develops Self and Others": 5,
      "Manages to Results": 5,
    },
  },
  {
    id: "6",
    name: "Jenni Lee",
    level: "P40",
    maturityInRole: 2,
    fitForRole: 3,
    archetype: "Business-y",
    skills: {
      "Product & Tech Knowledge": 3,
      "Visual Design": 3,
      "Interaction Design": 3,
      "Systems and Architecture": 3,
      "Comms & Influence": 4,
      "Analytical Thinking": 3,
      "Design Research": 3,
      "Embraces Change": 4,
      "Develops Self and Others": 3,
      "Manages to Results": 4,
    },
  },
  {
    id: "7",
    name: "Jon Snow",
    level: "P40",
    maturityInRole: 1,
    fitForRole: 2,
    archetype: "Craft-y",
    skills: {
      "Product & Tech Knowledge": 2,
      "Visual Design": 4,
      "Interaction Design": 3,
      "Systems and Architecture": 2,
      "Comms & Influence": 2,
      "Analytical Thinking": 3,
      "Design Research": 3,
      "Embraces Change": 3,
      "Develops Self and Others": 2,
      "Manages to Results": 2,
    },
  },
];

export default function Dashboard() {
  // todo: remove mock functionality - replace with API state
  const [designers, setDesigners] = useState<Designer[]>(INITIAL_DESIGNERS);
  const [selectedDesignerIds, setSelectedDesignerIds] = useState<Set<string>>(
    new Set(INITIAL_DESIGNERS.map((d) => d.id))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maturityLevelFilter, setMaturityLevelFilter] = useState<Level | "all">("all");
  const [fitLevelFilter, setFitLevelFilter] = useState<Level | "all">("all");

  const handleToggleDesigner = useCallback((id: string) => {
    setSelectedDesignerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    if (selectedDesignerIds.size === designers.length) {
      setSelectedDesignerIds(new Set());
    } else {
      setSelectedDesignerIds(new Set(designers.map((d) => d.id)));
    }
  }, [designers, selectedDesignerIds]);

  const handleAddDesigner = useCallback((newDesigner: Omit<Designer, "id">) => {
    const id = crypto.randomUUID();
    const designer: Designer = { ...newDesigner, id };
    setDesigners((prev) => [...prev, designer]);
    setSelectedDesignerIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="h-12 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-foreground" />
            <span className="font-sans font-medium text-sm text-foreground">
              Team Shape
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="font-sans text-sm text-muted-foreground hover:text-foreground">
              Rovo Chat
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <header className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-sans font-semibold text-2xl text-foreground">
                Skills Map
              </h1>
              <p className="font-sans text-sm text-muted-foreground mt-1">
                Team skill assessment dashboard
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} data-testid="button-add-designer">
              <Plus className="w-4 h-4 mr-2" />
              Add Designer
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="font-sans font-semibold text-lg text-foreground">
              Team Skills Overview
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleAll}
              data-testid="button-toggle-all"
            >
              {selectedDesignerIds.size === designers.length
                ? "Hide All"
                : "Show All"}
            </Button>
          </div>
          <div className="border border-border rounded-md bg-card p-6">
            <SkillsRadarChart
              designers={designers}
              selectedDesignerIds={selectedDesignerIds}
              onToggleDesigner={handleToggleDesigner}
              skillCategories={SKILL_CATEGORIES}
            />
          </div>
        </section>

        <section className="border border-border rounded-md bg-card p-6">
          <ScaleSlider
            title="Role maturity"
            designers={designers}
            valueKey="maturityInRole"
            leftLabel="New in role"
            rightLabel="Near promotion"
            leftColor="bg-blue-500"
            rightColor="bg-blue-500"
            levelFilter={maturityLevelFilter}
            onLevelFilterChange={setMaturityLevelFilter}
          />
        </section>

        <section className="border border-border rounded-md bg-card p-6">
          <ScaleSlider
            title="Role fit"
            designers={designers}
            valueKey="fitForRole"
            leftLabel="Great fit"
            rightLabel="Not a fit"
            leftColor="bg-green-500"
            rightColor="bg-red-500"
            levelFilter={fitLevelFilter}
            onLevelFilterChange={setFitLevelFilter}
          />
        </section>

        <section className="border border-border rounded-md bg-card p-6">
          <ArchetypeGrid designers={designers} />
        </section>
      </main>

      <AddDesignerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddDesigner}
        skillCategories={SKILL_CATEGORIES}
      />
    </div>
  );
}
