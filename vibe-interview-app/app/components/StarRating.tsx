import type { Score } from "~/components/FlashCard";

interface StarRatingProps {
  score: Score;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP: Record<NonNullable<StarRatingProps["size"]>, number> = {
  sm: 14,
  md: 18,
  lg: 24,
};

const COLOR_MAP: Record<Score, string> = {
  3: "var(--color-green)",
  2: "var(--color-accent2)",
  1: "var(--color-warning)",
  0: "var(--muted-foreground)",
};

const TOTAL_STARS = 3;

export function StarRating({ score, size = "md" }: StarRatingProps) {
  const px = SIZE_MAP[size];
  const color = COLOR_MAP[score];

  return (
    <span
      className="inline-flex gap-px"
      style={{ fontSize: `${px}px`, lineHeight: 1, color }}
      aria-label={`${score} из ${TOTAL_STARS}`}
    >
      {Array.from({ length: TOTAL_STARS }, (_, i) => (
        <span key={i}>{i < score ? "\u2605" : "\u2606"}</span>
      ))}
    </span>
  );
}
