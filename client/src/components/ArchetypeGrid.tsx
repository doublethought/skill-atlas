import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DesignerAvatar, { type Designer } from "./DesignerAvatar";
import { Badge } from "@/components/ui/badge";

interface ArchetypeGridProps {
  designers: Designer[];
  onDeleteDesigner?: (id: string) => void;
}

const ARCHETYPES = ["Craft", "Systems", "Strategy"] as const;

const ARCHETYPE_COLORS: Record<string, string> = {
  "Craft": "bg-violet-600",
  "Systems": "bg-sky-600",
  "Strategy": "bg-teal-600",
};

export default function ArchetypeGrid({ designers, onDeleteDesigner }: ArchetypeGridProps) {
  const groupedByArchetype = ARCHETYPES.reduce(
    (acc, archetype) => {
      acc[archetype] = designers.filter((d) => d.archetype === archetype);
      return acc;
    },
    {} as Record<string, Designer[]>
  );

  return (
    <div className="space-y-4" data-testid="archetype-grid">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {ARCHETYPES.map((archetype) => (
          <div key={archetype} className="rounded-lg border bg-secondary/40 p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">
                {archetype}
              </span>
              <Badge variant="secondary" className="ml-auto rounded-full font-mono text-xs">
                {groupedByArchetype[archetype].length}
              </Badge>
            </div>
            <div className="space-y-2">
              {groupedByArchetype[archetype].length === 0 ? (
                <p className="rounded-lg border border-dashed bg-card/60 p-4 text-sm text-muted-foreground">No designers</p>
              ) : (
                groupedByArchetype[archetype].map((designer) => (
                  <div
                    key={designer.id}
                    className="group flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    data-testid={`archetype-card-${designer.id}`}
                  >
                    <DesignerAvatar
                      designer={designer}
                      size="md"
                      showTooltip={false}
                      color={ARCHETYPE_COLORS[archetype]}
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {designer.name}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {designer.level}
                      </span>
                    </div>
                    {onDeleteDesigner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 text-muted-foreground transition-opacity hover:text-destructive group-hover:opacity-100"
                        onClick={() => onDeleteDesigner(designer.id)}
                        data-testid={`archetype-delete-${designer.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
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
