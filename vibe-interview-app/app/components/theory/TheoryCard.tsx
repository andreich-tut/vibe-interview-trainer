import { memo } from "react";
import { Card, CardHeader, CardContent } from "~/components/shared/ui/card";

interface TheoryCardProps {
  id: string;
  index: number;
  title: string;
  content: string;
}

export const TheoryCard = memo(function TheoryCard({ id, index, title, content }: TheoryCardProps) {
  return (
    <Card id={id} className="scroll-mt-20 rounded-xl overflow-hidden">
      <CardHeader className="bg-secondary border-b border-border px-4 py-3 md:px-8 md:py-5 flex-row items-baseline gap-3 space-y-0">
        <span className="text-sm text-muted-foreground font-mono shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="font-display text-xl font-bold text-(--color-accent2)">
          {title}
        </h2>
      </CardHeader>
      <CardContent
        className="px-4 py-4 md:px-8 md:py-8 text-[0.875rem] md:text-[0.9375rem] text-foreground leading-[1.65] md:leading-[1.85] prose-dark"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Card>
  );
});
