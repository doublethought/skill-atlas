import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import type { Designer, Level } from "./DesignerAvatar";

const LEVELS: Level[] = ["Associate Designer", "Midweight Designer", "Senior Designer", "Lead Designer", "Staff Designer"];
const ARCHETYPES = ["Craft", "Systems", "Strategy"] as const;

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

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  level: z.enum(["Associate Designer", "Midweight Designer", "Senior Designer", "Lead Designer", "Staff Designer"]),
  archetype: z.enum(["Craft", "Systems", "Strategy"]),
  maturityInRole: z.number().min(1).max(5),
  fitForRole: z.number().min(1).max(5),
  skills: z.record(z.string(), z.number().min(1).max(5)),
});

type FormValues = z.infer<typeof formSchema>;

function ScorePicker({
  value,
  onChange,
  testId,
}: {
  value: number;
  onChange: (value: number) => void;
  testId?: string;
}) {
  return (
    <div className="flex gap-1.5" data-testid={testId}>
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          className={`h-7 w-7 shrink-0 rounded-md border text-sm font-semibold transition-all ${
            value === score
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "bg-background text-muted-foreground hover:border-primary/45 hover:text-foreground"
          }`}
          onClick={() => onChange(score)}
        >
          {score}
        </button>
      ))}
    </div>
  );
}

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
      level: "Midweight Designer",
      archetype: "Craft",
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
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add designer
          </DialogTitle>
          <DialogDescription>
            Add the essentials now. Scores can be refined later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <p className="soft-label mb-4">Profile</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <div className="mt-4">
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
              </div>
            </div>

            <div className="rounded-lg border bg-secondary/35 p-4">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="soft-label mb-1">Role signals</p>
                  <p className="text-sm text-muted-foreground">Quick 1-5 read on current role context.</p>
                </div>
                <span className="hidden font-mono text-xs text-muted-foreground sm:block">1 low · 5 high</span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="maturityInRole"
                  render={({ field }) => (
                    <FormItem className="rounded-md bg-card/75 p-3">
                      <FormLabel>Maturity in role</FormLabel>
                      <FormControl>
                        <ScorePicker
                          value={field.value}
                          onChange={field.onChange}
                          testId="score-maturity"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fitForRole"
                  render={({ field }) => (
                    <FormItem className="rounded-md bg-card/75 p-3">
                      <FormLabel>Fit for role</FormLabel>
                      <FormControl>
                        <ScorePicker
                          value={field.value}
                          onChange={field.onChange}
                          testId="score-fit"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="soft-label mb-1">Skill areas</p>
                  <h4 className="text-base font-semibold text-foreground">
                    Product design competencies
                  </h4>
                </div>
                <span className="hidden font-mono text-xs text-muted-foreground sm:block">1-5</span>
              </div>
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                {skillCategories.map((category) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name={`skills.${category}`}
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-md border bg-background/70 px-3 py-2">
                        <FormLabel className="truncate whitespace-nowrap text-sm leading-none">{category}</FormLabel>
                        <FormControl>
                          <ScorePicker
                            value={field.value}
                            onChange={field.onChange}
                            testId={`score-skill-${category.replace(/\s+/g, "-").toLowerCase()}`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-add-designer">
                Add designer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
