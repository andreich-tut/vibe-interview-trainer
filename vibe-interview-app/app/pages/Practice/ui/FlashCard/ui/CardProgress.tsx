import { Badge } from "~/shared/ui/badge";

interface CardProgressProps {
  current: number;
  total: number;
  category: string;
}

export function CardProgress({ current, total, category }: CardProgressProps) {
  return (
    <>
      <div className="text-xs text-muted-foreground">
        Карточка {current + 1} из {total}
      </div>

      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-[var(--color-accent2)] transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      <Badge variant="outline" className="text-[0.625rem] tracking-wide uppercase">
        {category}
      </Badge>
    </>
  );
}
