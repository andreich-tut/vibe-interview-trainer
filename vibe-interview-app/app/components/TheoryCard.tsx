interface TheoryCardProps {
  id: string;
  index: number;
  title: string;
  content: string;
}

export function TheoryCard({ id, index, title, content }: TheoryCardProps) {
  return (
    <div id={id} className="scroll-mt-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
      <div className="bg-[var(--color-surface2)] border-b border-[var(--color-border)] px-8 py-5 flex items-baseline gap-4">
        <span className="text-sm text-[var(--color-muted)] font-mono shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="font-display text-xl font-bold text-[var(--color-accent2)]">
          {title}
        </h2>
      </div>
      <div
        className="px-8 py-8 text-[0.9375rem] text-[var(--color-text)] leading-[1.85] prose-dark"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
