interface Step {
  tag: "sync" | "micro" | "macro";
  label: string;
  desc: string;
}

interface StepVisualizerProps {
  steps: Step[];
}

export function StepVisualizer({ steps }: StepVisualizerProps) {
  const tagClass: Record<string, string> = {
    sync: "bg-[rgba(79,195,247,0.15)] text-[#4fc3f7]",
    micro: "bg-[rgba(167,139,250,0.15)] text-[#a78bfa]",
    macro: "bg-[rgba(251,146,60,0.15)] text-[#fb923c]",
  };

  const tagLabel: Record<string, string> = {
    sync: "Sync",
    micro: "Microtask",
    macro: "Macrotask",
  };

  return (
    <div className="space-y-1">
      {steps.map((step, i) => (
        <div
          key={i}
          className="flex items-center gap-3 text-xs py-1 border-b border-[var(--color-border)] last:border-b-0"
        >
          <span className="text-[var(--color-muted)] min-w-6">{i + 1}</span>
          <span
            className={`px-2 py-1 rounded text-xs font-bold min-w-20 text-center ${tagClass[step.tag]}`}
          >
            {tagLabel[step.tag]}
          </span>
          <span className="text-[var(--color-text)] opacity-70">{step.desc}</span>
        </div>
      ))}
    </div>
  );
}
