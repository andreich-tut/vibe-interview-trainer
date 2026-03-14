import { Link } from "react-router";
import { FlashCard, type Card, type Score } from "~/components/FlashCard";
import { useLanguage } from "~/contexts/useLanguage";
import type { TopicsFile } from "~/lib/contentLoader";

const MAX_REPLAY_ROUNDS = 2;

interface PracticePlayingProps {
  topic: TopicsFile["topics"][number];
  currentCard: Card;
  currentIndex: number;
  deckLength: number;
  round: number;
  onScore: (score: Score) => void;
}

export function PracticePlaying({ topic, currentCard, currentIndex, deckLength, round, onScore }: PracticePlayingProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        {t("layout.goBack")}
      </Link>
      <div className="text-center mb-4">
        <div className="text-4xl mb-3">{topic.icon}</div>
        <h1 className="font-display text-2xl font-bold text-primary">
          {topic.title} {t("practice.pageTitleSuffix")}
        </h1>
        {round > 1 && (
          <div className="inline-block mt-2 text-[0.625rem] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-[rgba(245,158,11,0.15)] text-[#f59e0b]">
            {t("practice.replayRound")} {round - 1}/{MAX_REPLAY_ROUNDS}
          </div>
        )}
      </div>

      <FlashCard
        key={currentCard.id}
        card={currentCard}
        onScore={onScore}
        current={currentIndex}
        total={deckLength}
      />

      <div className="text-center">
        <Link
          to={`/${topic.id}/theory`}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {t("practice.backToTheory")}
        </Link>
      </div>
    </div>
  );
}
