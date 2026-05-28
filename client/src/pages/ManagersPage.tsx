import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, ImagePlus, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isReadOnlyDemo } from "@/lib/demoMode";
import type { Manager } from "@shared/schema";
import ManagerAvatar, { MANAGER_AVATARS } from "@/components/ManagerAvatar";
import { AppHeader } from "@/components/BrandHeader";

export default function ManagersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newManagerName, setNewManagerName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>(MANAGER_AVATARS[0].id);
  const [uploadedAvatarName, setUploadedAvatarName] = useState("");
  const [deleteManagerId, setDeleteManagerId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: managers, isLoading } = useQuery<Manager[]>({
    queryKey: ["/api/managers"],
  });

  const createManagerMutation = useMutation({
    mutationFn: async (manager: { name: string; avatarColor: string }) => {
      const response = await apiRequest("POST", "/api/managers", manager);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/managers"] });
      setIsModalOpen(false);
      setNewManagerName("");
      setSelectedAvatar(MANAGER_AVATARS[0].id);
      setUploadedAvatarName("");
      toast({
        title: "Manager created",
        description: "You can start adding designers now.",
      });
    },
    onError: () => {
      toast({
        title: "Could not create manager",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteManagerMutation = useMutation({
    mutationFn: async (managerId: string) => {
      await apiRequest("DELETE", `/api/managers/${managerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/managers"] });
      setDeleteManagerId(null);
      toast({
        title: "Manager removed",
        description: "The team data has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Could not remove manager",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddManager = () => {
    if (newManagerName.trim()) {
      createManagerMutation.mutate({
        name: newManagerName.trim(),
        avatarColor: selectedAvatar,
      });
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadedAvatarName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteManager = (e: React.MouseEvent, managerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteManagerId(managerId);
  };

  const confirmDeleteManager = () => {
    if (deleteManagerId) {
      deleteManagerMutation.mutate(deleteManagerId);
    }
  };

  const managerToDelete = managers?.find((m) => m.id === deleteManagerId);

  return (
    <div className="app-surface min-h-screen">
      <AppHeader
        action={
          isReadOnlyDemo ? (
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Read-only demo
            </Badge>
          ) : (
            <Button onClick={() => setIsModalOpen(true)} data-testid="button-add-manager">
              <Plus className="h-4 w-4" />
              New manager
            </Button>
          )
        }
      />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <section className="mb-8 rounded-xl border bg-card/90 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="soft-label mb-3">Product design team mapping</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Skill Atlas
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Map product design skills, AI fluency, role readiness, and team balance.
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:min-w-80">
              <div className="rounded-lg border bg-secondary/45 p-4">
                <p className="text-2xl font-semibold">{managers?.length ?? 0}</p>
                <p className="text-sm text-muted-foreground">Managers</p>
              </div>
              <div className="rounded-lg border bg-secondary/45 p-4">
                <p className="text-2xl font-semibold">10</p>
                <p className="text-sm text-muted-foreground">Skill areas</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="soft-label mb-1">Directory</p>
            <h2 className="text-2xl font-semibold">Managers</h2>
            <p className="text-sm text-muted-foreground">Choose a manager to view their team map.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : managers && managers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {managers.map((manager) => (
              <Link key={manager.id} href={`/managers/${manager.id}`}>
                <Card
                  className="group cursor-pointer overflow-hidden p-6 transition-all hover:-translate-y-1 hover:border-primary/35 hover:shadow-md"
                  data-testid={`card-manager-${manager.id}`}
                >
                  <div className="flex items-start gap-4">
                    <ManagerAvatar value={manager.avatarColor} name={manager.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-semibold" data-testid={`text-manager-name-${manager.id}`}>
                        {manager.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        View map
                      </p>
                    </div>
                    {!isReadOnlyDemo && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => handleDeleteManager(e, manager.id)}
                        data-testid={`delete-manager-${manager.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="mt-8 flex items-center justify-between border-t pt-4 text-sm">
                    <span className="text-muted-foreground">Open manager</span>
                    <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="bg-foreground p-8 text-background sm:p-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Users className="h-7 w-7" />
                </div>
                <h2 className="mt-8 text-3xl font-semibold tracking-normal">Start with one manager.</h2>
                <p className="mt-3 text-sm leading-6 text-background/70">
                  Create a manager view, then add designers and compare their skill map.
                </p>
              </div>
              <div className="p-8 sm:p-10">
                <div className="grid gap-3">
                  {["Add a manager", "Add designers", "Compare the skill atlas"].map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-md border bg-card p-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                {!isReadOnlyDemo && (
                  <Button className="mt-6 w-full sm:w-auto" onClick={() => setIsModalOpen(true)} data-testid="button-add-first-manager">
                    <Plus className="h-4 w-4" />
                    Create manager
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create manager</DialogTitle>
            <DialogDescription>
              Use a manager name or team lead label.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="manager-name">Manager name</Label>
              <Input
                id="manager-name"
                placeholder="Alex Morgan"
                value={newManagerName}
                onChange={(e) => setNewManagerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddManager();
                  }
                }}
                data-testid="input-manager-name"
              />
            </div>
            <div className="space-y-3">
              <Label>Avatar</Label>
              <div className="flex flex-wrap gap-3">
                {MANAGER_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    className={`rounded-xl border p-1 transition-all ${
                      selectedAvatar === avatar.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "hover:border-primary/40"
                    }`}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    aria-label={`Use ${avatar.name} avatar`}
                  >
                    <ManagerAvatar value={avatar.id} name={newManagerName || avatar.name} size="sm" />
                  </button>
                ))}
                {selectedAvatar.startsWith("data:image/") && (
                  <div className="rounded-xl border border-primary p-1 ring-2 ring-primary/20">
                    <ManagerAvatar value={selectedAvatar} name={newManagerName || "Uploaded avatar"} size="sm" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="flex max-w-sm cursor-pointer items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:border-primary/45">
                  <span className="flex min-w-0 items-center gap-2">
                    <ImagePlus className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">
                      {uploadedAvatarName || "Upload image"}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    Optional
                  </span>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="sr-only"
                  />
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pick an included Open Peeps avatar or upload an image.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddManager}
                disabled={!newManagerName.trim() || createManagerMutation.isPending}
                data-testid="button-submit-manager"
              >
                {createManagerMutation.isPending ? "Creating..." : "Create manager"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteManagerId} onOpenChange={(open) => !open && setDeleteManagerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove manager</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {managerToDelete?.name} and all designers in that manager view.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteManager}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-manager"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
