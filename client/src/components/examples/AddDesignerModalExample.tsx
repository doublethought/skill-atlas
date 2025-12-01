import { useState } from "react";
import AddDesignerModal from "../AddDesignerModal";
import { Button } from "@/components/ui/button";
import type { Designer } from "../DesignerAvatar";

export default function AddDesignerModalExample() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (designer: Omit<Designer, "id">) => {
    console.log("Designer added:", designer);
  };

  return (
    <div className="p-6 bg-background">
      <Button onClick={() => setOpen(true)} data-testid="button-open-modal">
        Add Designer
      </Button>
      <AddDesignerModal open={open} onOpenChange={setOpen} onSubmit={handleSubmit} />
    </div>
  );
}
