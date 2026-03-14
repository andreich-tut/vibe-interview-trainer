import { Link } from "react-router";
import { StarRating } from "~/shared/ui/StarRating";
import { useLanguage } from "~/contexts/LanguageContext";
import type { Score } from "~/pages/Practice/ui/FlashCard";
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
        <div className="flex justify-center mb-4">
          {pct === 100 ? (
            // Trophy
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          ) : pct >= 80 ? (
            // Star / celebration
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </svg>
          ) : pct >= 50 ? (
            // Thumbs up
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
              <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
            </svg>
          ) : (
            // Book
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          )}
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
