import { Link } from "react-router";
import { StarRating } from "~/components/shared/ui/StarRating";
import { useLanguage } from "~/contexts/LanguageContext";
import type { Score } from "~/components/practice/FlashCard";
import type { TopicsFile } from "~/lib/contentLoader";

interface FinishedStats {
  scoreCount: Record<Score, number>;
  totalCards: number;
  pct: number;
  replayedCount: number;
  wrongRemaining: number;
}

interface PracticeFinishedProps {
  topic: TopicsFile["topics"][number];
  stats: FinishedStats;
  onRetryWrong: () => void;
  onRestart: () => void;
}

export function PracticeFinished({ topic, stats, onRetryWrong, onRestart }: PracticeFinishedProps) {
  const { t } = useLanguage();
  const { scoreCount, totalCards, pct, replayedCount, wrongRemaining } = stats;

  return (
    <div className="space-y-8 pt-12 max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        {t("layout.goBack")}
      </Link>
      <div className="text-center space-y-8">
        <div className="text-6xl mb-4">
          {pct === 100 ? "🏆" : pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚"}
        </div>
        <h2 className="font-display text-2xl font-bold text-(--color-accent2)">
          {pct === 100
            ? t("practice.results.perfect")
            : pct >= 80
              ? t("practice.results.excellent")
              : pct >= 50
                ? t("practice.results.good")
                : t("practice.results.needsWork")}
        </h2>
        <p className="text-sm text-foreground">
          {topic.title} · {totalCards}
        </p>

        <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col items-center">
            <StarRating score={3} size="sm" />
            <div className="text-xl font-bold text-(--color-green) mt-1">{scoreCount[3]}</div>
            <div className="text-[0.5rem] text-muted-foreground uppercase tracking-wider mt-1">
              {t("practice.score.exact")}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col items-center">
            <StarRating score={2} size="sm" />
            <div className="text-xl font-bold text-(--color-accent2) mt-1">{scoreCount[2]}</div>
            <div className="text-[0.5rem] text-muted-foreground uppercase tracking-wider mt-1">
              {t("practice.score.close")}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col items-center">
            <StarRating score={1} size="sm" />
            <div className="text-xl font-bold text-[#f59e0b] mt-1">{scoreCount[1]}</div>
            <div className="text-[0.5rem] text-muted-foreground uppercase tracking-wider mt-1">
              {t("practice.score.hard")}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col items-center">
            <StarRating score={0} size="sm" />
            <div className="text-xl font-bold text-destructive mt-1">{scoreCount[0]}</div>
            <div className="text-[0.5rem] text-muted-foreground uppercase tracking-wider mt-1">
              {t("practice.score.unknown")}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col items-center">
            <div className="text-xl font-bold text-primary">{pct}%</div>
            <div className="text-[0.5rem] text-muted-foreground uppercase tracking-wider mt-1">
              {t("practice.score.total")}
            </div>
          </div>
        </div>

        {replayedCount > 0 && (
          <p className="text-xs text-muted-foreground">
            {t("practice.replayed")} {replayedCount}
          </p>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          {wrongRemaining > 0 && (
            <button
              onClick={onRetryWrong}
              className="py-2 px-6 bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-[rgba(245,158,11,0.25)] rounded font-semibold hover:bg-[rgba(245,158,11,0.25)] transition text-sm"
            >
              {t("practice.repeatErrors")} ({wrongRemaining})
            </button>
          )}
          <button
            onClick={onRestart}
            className="py-2 px-6 bg-primary text-white rounded font-semibold hover:bg-[#6a56f0] transition text-sm"
          >
            {t("practice.restart")}
          </button>
          <Link
            to={`/${topic.id}/theory`}
            className="py-2 px-6 bg-card border border-border text-foreground rounded font-semibold hover:border-primary transition text-sm"
          >
            {t("practice.goToTheory")}
          </Link>
          <Link
            to="/"
            className="py-2 px-6 bg-card border border-border text-foreground rounded font-semibold hover:border-primary transition text-sm"
          >
            {t("practice.goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
