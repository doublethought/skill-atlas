import { useState, useCallback, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SkillsRadarChart from "@/components/SkillsRadarChart";
import ScaleSlider from "@/components/ScaleSlider";
import ArchetypeGrid from "@/components/ArchetypeGrid";
import AddDesignerModal from "@/components/AddDesignerModal";
import ManagerAvatar from "@/components/ManagerAvatar";
import { AppHeader } from "@/components/BrandHeader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isReadOnlyDemo } from "@/lib/demoMode";
import type { Designer, Manager } from "@shared/schema";

type Level = "Associate Designer" | "Midweight Designer" | "Senior Designer" | "Lead Designer" | "Staff Designer";

const SKILL_CATEGORIES = [
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

export default function Dashboard() {
  const { managerId } = useParams<{ managerId: string }>();
  const { toast } = useToast();

  const [selectedDesignerIds, setSelectedDesignerIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maturityLevelFilter, setMaturityLevelFilter] = useState<Level | "all">("all");
  const [fitLevelFilter, setFitLevelFilter] = useState<Level | "all">("all");
  const [deleteDesignerId, setDeleteDesignerId] = useState<string | null>(null);

  const { data: manager, isLoading: isLoadingManager } = useQuery<Manager>({
    queryKey: ["/api/managers", managerId],
    enabled: !!managerId,
  });

  const { data: designers = [], isLoading: isLoadingDesigners } = useQuery<Designer[]>({
    queryKey: ["/api/managers", managerId, "designers"],
    enabled: !!managerId,
  });

  useEffect(() => {
    if (designers.length > 0) {
      setSelectedDesignerIds(new Set(designers.map((d) => d.id)));
    }
  }, [designers]);

  const addDesignerMutation = useMutation({
    mutationFn: async (newDesigner: Omit<Designer, "id" | "managerId">) => {
      const response = await apiRequest("POST", `/api/managers/${managerId}/designers`, newDesigner);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/managers", managerId, "designers"] });
      setIsModalOpen(false);
      toast({
        title: "Designer added",
        description: "The team map has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Could not add designer",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteDesignerMutation = useMutation({
    mutationFn: async (designerId: string) => {
      await apiRequest("DELETE", `/api/designers/${designerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/managers", managerId, "designers"] });
      setDeleteDesignerId(null);
      toast({
        title: "Designer removed",
        description: "The team map has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Could not remove designer",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

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

  const handleAddDesigner = useCallback((newDesigner: Omit<Designer, "id" | "managerId">) => {
    addDesignerMutation.mutate(newDesigner);
  }, [addDesignerMutation]);

  const handleDeleteDesigner = useCallback((designerId: string) => {
    setDeleteDesignerId(designerId);
  }, []);

  const confirmDeleteDesigner = useCallback(() => {
    if (deleteDesignerId) {
      deleteDesignerMutation.mutate(deleteDesignerId);
    }
  }, [deleteDesignerId, deleteDesignerMutation]);

  const designerToDelete = designers.find((d) => d.id === deleteDesignerId);
  const isLoading = isLoadingManager || isLoadingDesigners;

  if (isLoading) {
    return (
      <div className="app-surface min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="mt-6 h-96 w-full rounded-md" />
        </main>
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="app-surface flex min-h-screen items-center justify-center px-5">
        <div className="panel max-w-md p-8 text-center">
          <h1 className="text-xl font-semibold">Manager not found</h1>
          <Link href="/">
            <Button className="mt-5" variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Back to managers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-surface min-h-screen">
      <AppHeader
        action={
          isReadOnlyDemo ? (
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Read-only demo
            </Badge>
          ) : (
            <Button onClick={() => setIsModalOpen(true)} data-testid="button-add-designer">
              <Plus className="h-4 w-4" />
              Add designer
            </Button>
          )
        }
      />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <header className="mb-6 rounded-xl border bg-card/92 p-5 shadow-sm backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <ManagerAvatar value={manager.avatarColor} name={manager.name} size="lg" />
              <div>
                <p className="soft-label mb-1">Manager</p>
                <h1 className="text-3xl font-semibold tracking-normal" data-testid="text-manager-name">
                  {manager.name}
                </h1>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-sm">
              {designers.length} {designers.length === 1 ? "designer" : "designers"}
            </Badge>
          </div>
        </header>

        {designers.length === 0 ? (
          <section className="section-shell">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="soft-label mb-1">No designers yet</p>
                <h2 className="text-xl font-semibold">Start the map</h2>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Add a designer to begin comparing skills, maturity, fit, and archetype balance.
                </p>
              </div>
              {!isReadOnlyDemo && (
                <Button onClick={() => setIsModalOpen(true)} data-testid="button-add-first-designer">
                  <Plus className="h-4 w-4" />
                  Add designer
                </Button>
              )}
            </div>
          </section>
        ) : (
          <div className="space-y-6">
            <section className="section-shell">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="soft-label mb-1">Radar</p>
                  <h2 className="text-xl font-semibold">Competency atlas</h2>
                  <p className="text-sm text-muted-foreground">Compare selected designers across product design skills.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleAll}
                  data-testid="button-toggle-all"
                >
                  {selectedDesignerIds.size === designers.length ? "Hide all" : "Show all"}
                </Button>
              </div>
              <SkillsRadarChart
                designers={designers}
                selectedDesignerIds={selectedDesignerIds}
                onToggleDesigner={handleToggleDesigner}
                onDeleteDesigner={isReadOnlyDemo ? undefined : handleDeleteDesigner}
                skillCategories={SKILL_CATEGORIES}
              />
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="section-shell">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="soft-label mb-1">Progression</p>
                    <h2 className="text-xl font-semibold">Role maturity</h2>
                    <p className="text-sm text-muted-foreground">Readiness and progression signal.</p>
                  </div>
                  <Select
                    value={maturityLevelFilter}
                    onValueChange={(value) => setMaturityLevelFilter(value as Level | "all")}
                  >
                    <SelectTrigger className="w-52 [&>span]:block [&>span]:w-full [&>span]:text-left" data-testid="filter-level-maturityInRole">
                      <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      {(["Associate Designer", "Midweight Designer", "Senior Designer", "Lead Designer", "Staff Designer"] as const).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ScaleSlider
                  title=""
                  designers={designers}
                  valueKey="maturityInRole"
                  leftLabel="New in role"
                  rightLabel="Near promotion"
                  leftColor="bg-sky-500"
                  rightColor="bg-teal-500"
                  levelFilter={maturityLevelFilter}
                  onLevelFilterChange={setMaturityLevelFilter}
                />
              </section>

              <section className="section-shell">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="soft-label mb-1">Alignment</p>
                    <h2 className="text-xl font-semibold">Role fit</h2>
                    <p className="text-sm text-muted-foreground">Alignment with current expectations.</p>
                  </div>
                  <Select
                    value={fitLevelFilter}
                    onValueChange={(value) => setFitLevelFilter(value as Level | "all")}
                  >
                    <SelectTrigger className="w-52 [&>span]:block [&>span]:w-full [&>span]:text-left" data-testid="filter-level-fitForRole">
                      <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      {(["Associate Designer", "Midweight Designer", "Senior Designer", "Lead Designer", "Staff Designer"] as const).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ScaleSlider
                  title=""
                  designers={designers}
                  valueKey="fitForRole"
                  leftLabel="Strong fit"
                  rightLabel="Needs attention"
                  leftColor="bg-emerald-500"
                  rightColor="bg-orange-500"
                  levelFilter={fitLevelFilter}
                  onLevelFilterChange={setFitLevelFilter}
                />
              </section>
            </div>

            <section className="section-shell">
              <div className="mb-6">
                <p className="soft-label mb-1">Balance</p>
                <h2 className="text-xl font-semibold">Archetypes</h2>
                <p className="text-sm text-muted-foreground">Balance craft, systems, and business orientation.</p>
              </div>
              <ArchetypeGrid designers={designers} onDeleteDesigner={isReadOnlyDemo ? undefined : handleDeleteDesigner} />
            </section>
          </div>
        )}
      </main>

      <AddDesignerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddDesigner}
        skillCategories={SKILL_CATEGORIES}
      />

      <AlertDialog open={!!deleteDesignerId} onOpenChange={(open) => !open && setDeleteDesignerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove designer</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {designerToDelete?.name} from this manager view.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteDesigner}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
