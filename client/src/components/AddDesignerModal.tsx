import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Designer, Level } from "./DesignerAvatar";

const LEVELS: Level[] = ["P30", "P40", "P50", "P60", "P70"];
const ARCHETYPES = ["Craft-y", "Systems-y", "Business-y"] as const;

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

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  level: z.enum(["P30", "P40", "P50", "P60", "P70"]),
  archetype: z.enum(["Craft-y", "Systems-y", "Business-y"]),
  maturityInRole: z.number().min(1).max(5),
  fitForRole: z.number().min(1).max(5),
  skills: z.record(z.string(), z.number().min(1).max(5)),
});

type FormValues = z.infer<typeof formSchema>;

interface AddDesignerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (designer: Omit<Designer, "id">) => void;
  skillCategories?: string[];
}

export default function AddDesignerModal({
  open,
  onOpenChange,
  onSubmit,
  skillCategories = SKILL_CATEGORIES,
}: AddDesignerModalProps) {
  const defaultSkills = skillCategories.reduce(
    (acc, cat) => {
      acc[cat] = 3;
      return acc;
    },
    {} as Record<string, number>
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      level: "P40",
      archetype: "Craft-y",
      maturityInRole: 3,
      fitForRole: 3,
      skills: defaultSkills,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      level: values.level,
      archetype: values.archetype,
      maturityInRole: values.maturityInRole,
      fitForRole: values.fitForRole,
      skills: values.skills,
    });
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-sans text-xl font-semibold">
            Add Designer
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full name"
                        {...field}
                        data-testid="input-designer-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="archetype"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Archetype</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-archetype">
                        <SelectValue placeholder="Select archetype" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ARCHETYPES.map((archetype) => (
                        <SelectItem key={archetype} value={archetype}>
                          {archetype}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h4 className="font-sans font-medium text-sm text-foreground">
                Role Assessment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="maturityInRole"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Maturity in Role</FormLabel>
                        <span className="font-mono text-sm text-muted-foreground">
                          {field.value}
                        </span>
                      </div>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(v) => field.onChange(v[0])}
                          data-testid="slider-maturity"
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground font-mono">
                        <span>New</span>
                        <span>Expert</span>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fitForRole"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Fit for Role</FormLabel>
                        <span className="font-mono text-sm text-muted-foreground">
                          {field.value}
                        </span>
                      </div>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(v) => field.onChange(v[0])}
                          data-testid="slider-fit"
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground font-mono">
                        <span>Poor fit</span>
                        <span>Great fit</span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-sans font-medium text-sm text-foreground">
                Skill Categories
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillCategories.map((category) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name={`skills.${category}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel className="text-sm">{category}</FormLabel>
                          <span className="font-mono text-sm text-muted-foreground">
                            {field.value}
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[field.value]}
                            onValueChange={(v) => field.onChange(v[0])}
                            data-testid={`slider-skill-${category.replace(/\s+/g, "-").toLowerCase()}`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-add-designer">
                Add Designer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
