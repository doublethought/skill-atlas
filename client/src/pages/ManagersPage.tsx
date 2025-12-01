import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Home, Bell, HelpCircle, Settings, User, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Manager } from "@shared/schema";

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

export default function ManagersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newManagerName, setNewManagerName] = useState("");
  const [deleteManagerId, setDeleteManagerId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: managers, isLoading } = useQuery<Manager[]>({
    queryKey: ["/api/managers"],
  });

  const createManagerMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/managers", { name });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/managers"] });
      setIsModalOpen(false);
      setNewManagerName("");
      toast({
        title: "Manager added",
        description: "The manager has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add manager. Please try again.",
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
        description: "The manager and their team have been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove manager. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddManager = () => {
    if (newManagerName.trim()) {
      createManagerMutation.mutate(newManagerName.trim());
    }
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-foreground">
              Info Pro Managers
            </span>
            <Button onClick={() => setIsModalOpen(true)} data-testid="button-add-manager">
              <Plus className="w-4 h-4 mr-2" />
              Add Manager
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : managers && managers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {managers.map((manager) => {
              const colorClass = getAvatarColorClass(manager.name);
              return (
                <Link key={manager.id} href={`/managers/${manager.id}`}>
                  <Card 
                    className="p-6 cursor-pointer hover:border-primary/50 transition-colors group"
                    data-testid={`card-manager-${manager.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className={`${colorClass.bg} ${colorClass.text} font-sans font-medium`}>
                          {getInitials(manager.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-sans font-medium text-foreground" data-testid={`text-manager-name-${manager.id}`}>
                          {manager.name}
                        </h3>
                        <p className="font-sans text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          View team
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        onClick={(e) => handleDeleteManager(e, manager.id)}
                        data-testid={`delete-manager-${manager.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-sans font-medium text-foreground mb-2">No managers yet</h3>
              <p className="font-sans text-sm text-muted-foreground mb-4">
                Add your first manager to get started with team skills mapping.
              </p>
              <Button onClick={() => setIsModalOpen(true)} data-testid="button-add-first-manager">
                <Plus className="w-4 h-4 mr-2" />
                Add Manager
              </Button>
            </div>
          </Card>
        )}
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Manager</DialogTitle>
            <DialogDescription>
              Add a new manager to track their team's skills.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="manager-name">Name</Label>
              <Input
                id="manager-name"
                placeholder="Enter manager name"
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddManager} 
                disabled={!newManagerName.trim() || createManagerMutation.isPending}
                data-testid="button-submit-manager"
              >
                {createManagerMutation.isPending ? "Adding..." : "Add Manager"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteManagerId} onOpenChange={(open) => !open && setDeleteManagerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Manager</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {managerToDelete?.name}? This will also remove all designers on their team. This action cannot be undone.
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
