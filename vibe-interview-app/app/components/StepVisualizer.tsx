import { Badge } from "~/components/ui/badge";

interface Step {
  tag: "sync" | "micro" | "macro";
  label: string;
  desc: string;
}

interface StepVisualizerProps {
  steps: Step[];
}

const tagVariant = {
  sync: "default",
  micro: "secondary",
  macro: "macro",
} as const;

const tagLabel: Record<string, string> = {
  sync: "Sync",
  micro: "Microtask",
  macro: "Macrotask",
};

export function StepVisualizer({ steps }: StepVisualizerProps) {
  return (
    <div className="space-y-1">
      {steps.map((step, i) => (
        <div
          key={i}
          className="flex items-center gap-3 text-xs py-1 border-b border-border last:border-b-0"
        >
          <span className="text-muted-foreground min-w-6">{i + 1}</span>
          <Badge variant={tagVariant[step.tag]} className="min-w-20 justify-center">
            {tagLabel[step.tag]}
          </Badge>
          <span className="text-foreground opacity-70">{step.desc}</span>
        </div>
      ))}
    </div>
  );
}
