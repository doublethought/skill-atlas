import DesignerAvatar, { type Designer } from "./DesignerAvatar";
import { Badge } from "@/components/ui/badge";

interface ArchetypeGridProps {
  designers: Designer[];
}

const ARCHETYPES = ["Craft-y", "Systems-y", "Business-y"] as const;

const ARCHETYPE_COLORS: Record<string, string> = {
  "Craft-y": "bg-purple-500",
  "Systems-y": "bg-blue-500",
  "Business-y": "bg-teal-500",
};

export default function ArchetypeGrid({ designers }: ArchetypeGridProps) {
  const groupedByArchetype = ARCHETYPES.reduce(
    (acc, archetype) => {
      acc[archetype] = designers.filter((d) => d.archetype === archetype);
      return acc;
    },
    {} as Record<string, Designer[]>
  );

  return (
    <div className="space-y-6" data-testid="archetype-grid">
      <h3 className="font-sans font-semibold text-lg text-foreground">Archetypes</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARCHETYPES.map((archetype) => (
          <div key={archetype} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {archetype.toUpperCase()}
              </span>
              <Badge variant="secondary" className="font-mono text-xs">
                {groupedByArchetype[archetype].length}
              </Badge>
            </div>
            <div className="space-y-2">
              {groupedByArchetype[archetype].length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No designers</p>
              ) : (
                groupedByArchetype[archetype].map((designer) => (
                  <div
                    key={designer.id}
                    className="flex items-center gap-3 p-3 rounded-md border border-border bg-card hover-elevate"
                    data-testid={`archetype-card-${designer.id}`}
                  >
                    <DesignerAvatar
                      designer={designer}
                      size="md"
                      showTooltip={false}
                      color={ARCHETYPE_COLORS[archetype]}
                    />
                    <div className="flex flex-col">
                      <span className="font-sans text-sm font-medium text-foreground">
                        {designer.name}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {designer.level}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
