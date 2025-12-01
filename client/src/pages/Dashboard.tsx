import { useState, useCallback, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Home, Bell, HelpCircle, Settings, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Designer, Manager } from "@shared/schema";

type Level = "P30" | "P40" | "P50" | "P60" | "P70";

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  { bg: "bg-amber-100", text: "text-amber-800" },
  { bg: "bg-blue-100", text: "text-blue-800" },
  { bg: "bg-green-100", text: "text-green-800" },
  { bg: "bg-purple-100", text: "text-purple-800" },
  { bg: "bg-pink-100", text: "text-pink-800" },
  { bg: "bg-teal-100", text: "text-teal-800" },
];

function getAvatarColorClass(name: string) {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
}

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
        description: "The designer has been added to the team.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add designer. Please try again.",
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
        description: "The designer has been removed from the team.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove designer. Please try again.",
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
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
          <div className="h-12 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-foreground" />
              <span className="font-sans font-medium text-sm text-foreground">Team Shape</span>
            </div>
          </div>
        </nav>
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-6 pt-4 pb-4">
            <Skeleton className="h-4 w-48 mb-4" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>
          </div>
        </div>
        <main className="max-w-7xl mx-auto px-6 py-6">
          <Skeleton className="h-96 w-full rounded-lg" />
        </main>
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-sans font-semibold text-xl text-foreground mb-2">Manager not found</h1>
          <Link href="/">
            <Button variant="outline">Back to Managers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const colorClass = getAvatarColorClass(manager.name);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
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

      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/">
              <span className="hover:text-primary cursor-pointer transition-colors" data-testid="link-info-pro-managers">
                Info Pro Managers
              </span>
            </Link>
            <span>/</span>
            <span className="text-foreground">{manager.name}</span>
          </div>
          
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" />
                <AvatarFallback className={`${colorClass.bg} ${colorClass.text} font-sans font-medium`}>
                  {getInitials(manager.name)}
                </AvatarFallback>
              </Avatar>
              <h1 className="font-sans font-semibold text-2xl text-foreground" data-testid="text-manager-name">
                {manager.name}
              </h1>
            </div>
            <Button onClick={() => setIsModalOpen(true)} data-testid="button-add-designer">
              <Plus className="w-4 h-4 mr-2" />
              Add Designer
            </Button>
          </div>

          <div className="flex items-center gap-6 -mb-px">
            <button className="font-sans text-sm text-primary font-medium pb-3 border-b-2 border-primary transition-colors">
              Team shape
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {designers.length === 0 ? (
          <section className="border border-card-border rounded-lg bg-card p-12">
            <div className="text-center">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-sans font-medium text-foreground mb-2">No designers yet</h3>
              <p className="font-sans text-sm text-muted-foreground mb-4">
                Add your first designer to start mapping team skills.
              </p>
              <Button onClick={() => setIsModalOpen(true)} data-testid="button-add-first-designer">
                <Plus className="w-4 h-4 mr-2" />
                Add Designer
              </Button>
            </div>
          </section>
        ) : (
          <>
            <section className="border border-card-border rounded-lg bg-card p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <h2 className="font-sans font-semibold text-base text-foreground">
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
              <SkillsRadarChart
                designers={designers}
                selectedDesignerIds={selectedDesignerIds}
                onToggleDesigner={handleToggleDesigner}
                onDeleteDesigner={handleDeleteDesigner}
                skillCategories={SKILL_CATEGORIES}
              />
            </section>

            <section className="border border-card-border rounded-lg bg-card p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="font-sans font-semibold text-base text-foreground">
                  Role Maturity
                </h2>
                <Select
                  value={maturityLevelFilter}
                  onValueChange={(value) => setMaturityLevelFilter(value as Level | "all")}
                >
                  <SelectTrigger className="w-32" data-testid="filter-level-maturityInRole">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {(["P30", "P40", "P50", "P60", "P70"] as const).map((level) => (
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
                leftColor="bg-blue-500"
                rightColor="bg-blue-500"
                levelFilter={maturityLevelFilter}
                onLevelFilterChange={setMaturityLevelFilter}
              />
            </section>

            <section className="border border-card-border rounded-lg bg-card p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="font-sans font-semibold text-base text-foreground">
                  Role Fit
                </h2>
                <Select
                  value={fitLevelFilter}
                  onValueChange={(value) => setFitLevelFilter(value as Level | "all")}
                >
                  <SelectTrigger className="w-32" data-testid="filter-level-fitForRole">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {(["P30", "P40", "P50", "P60", "P70"] as const).map((level) => (
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
                leftLabel="Great fit"
                rightLabel="Not a fit"
                leftColor="bg-green-500"
                rightColor="bg-red-500"
                levelFilter={fitLevelFilter}
                onLevelFilterChange={setFitLevelFilter}
              />
            </section>

            <section className="border border-card-border rounded-lg bg-card p-6">
              <h2 className="font-sans font-semibold text-base text-foreground mb-6">
                Archetypes
              </h2>
              <ArchetypeGrid designers={designers} onDeleteDesigner={handleDeleteDesigner} />
            </section>
          </>
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
            <AlertDialogTitle>Remove Designer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {designerToDelete?.name} from the team? This action cannot be undone.
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
