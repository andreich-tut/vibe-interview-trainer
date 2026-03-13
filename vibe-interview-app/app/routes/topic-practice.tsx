import type { Route } from "./+types/topic-practice";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { Layout } from "~/components/Layout";
import { FlashCard, type Card, type Score } from "~/components/FlashCard";
import { StarRating } from "~/components/StarRating";
import { ApiKeyInput } from "~/components/ApiKeyInput";
import { useProgress } from "~/hooks/useProgress";
import { hasApiKey } from "~/lib/llm";
import { loadContent, type CardsFile, type TopicsFile } from "~/lib/contentLoader";
import { useLanguage } from "~/contexts/LanguageContext";

type Phase = "setup" | "playing" | "finished";

interface CardScore {
  cardId: string;
  score: Score;
  round: number;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Практика` },
    { name: "description", content: "Практикуйтесь с карточками" },
  ];
}

const MAX_REPLAY_ROUNDS = 2;

export default function TopicPractice({ params }: Route.ComponentProps) {
  const { lang, t } = useLanguage();
  const { saveCardResult, incrementSessions } = useProgress();

  const [topicsData, setTopicsData] = useState<TopicsFile | null>(null);
  const [cardsData, setCardsData] = useState<CardsFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("setup");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<CardScore[]>([]);
  const [round, setRound] = useState(1);
  const [replayQueue, setReplayQueue] = useState<Card[]>([]);
  const [apiKeyReady, setApiKeyReady] = useState(hasApiKey);

  // Load topics and cards
  useEffect(() => {
    Promise.all([
      loadContent(lang, "topics"),
      loadContent(lang, "cards", params.topicId),
    ])
      .then(([topics, cards]) => {
        setTopicsData(topics);
        setCardsData(cards);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load content:", err);
        setError(t("common.failedToLoad"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.topicId, lang]);

  const topic = topicsData?.topics.find((t) => t.id === params.topicId);
  const allCards = useMemo(() => shuffle(cardsData?.cards ?? []), [cardsData?.cards]);

  const currentDeck = round === 1 ? allCards : replayQueue;

  if (loading) {
    return (
      <Layout showBack>
        <p className="text-center text-muted-foreground">{t("common.loading")}</p>
      </Layout>
    );
  }

  if (error || !topic || !cardsData) {
    return (
      <Layout showBack>
        <p className="text-center text-red-500">{error || t("common.failedToLoadContent")}</p>
      </Layout>
    );
  }

  const handleStart = () => {
    setPhase("playing");
    setCurrentIndex(0);
    setScores([]);
    setRound(1);
    setReplayQueue([]);
  };

  const handleScore = (score: Score) => {
    const card = currentDeck[currentIndex];
    const newScores = [...scores, { cardId: card.id, score, round }];
    setScores(newScores);
    saveCardResult(params.topicId, card.id, score);

    const nextIndex = currentIndex + 1;

    if (nextIndex < currentDeck.length) {
      setCurrentIndex(nextIndex);
    } else if (round === 1) {
      const wrongCardIds = new Set(
        newScores.filter((s) => s.score <= 1 && s.round === 1).map((s) => s.cardId),
      );
      const wrongCards = allCards.filter((c) => wrongCardIds.has(c.id));

      if (wrongCards.length > 0) {
        setReplayQueue(shuffle(wrongCards));
        setRound(2);
        setCurrentIndex(0);
      } else {
        incrementSessions();
        setPhase("finished");
      }
    } else if (round < MAX_REPLAY_ROUNDS + 1) {
      const wrongCardIds = new Set(
        newScores.filter((s) => s.score <= 1 && s.round === round).map((s) => s.cardId),
      );
      const stillWrong = replayQueue.filter((c) => wrongCardIds.has(c.id));

      if (stillWrong.length > 0 && round < MAX_REPLAY_ROUNDS + 1) {
        setReplayQueue(shuffle(stillWrong));
        setRound(round + 1);
        setCurrentIndex(0);
      } else {
        incrementSessions();
        setPhase("finished");
      }
    } else {
      incrementSessions();
      setPhase("finished");
    }
  };

  const handleRestart = () => {
    setPhase("setup");
    setCurrentIndex(0);
    setScores([]);
    setRound(1);
    setReplayQueue([]);
  };

  const handleRetryWrong = () => {
    const bestScores = new Map<string, Score>();
    for (const s of scores) {
      const prev = bestScores.get(s.cardId);
      if (prev === undefined || s.score > prev) {
        bestScores.set(s.cardId, s.score);
      }
    }
    const wrongCardIds = new Set(
      [...bestScores.entries()].filter(([, s]) => s <= 1).map(([id]) => id),
    );
    const wrongCards = allCards.filter((c) => wrongCardIds.has(c.id));

    if (wrongCards.length === 0) return;

    setScores([]);
    setRound(1);
    setCurrentIndex(0);
    setReplayQueue([]);
    setPhase("playing");
    setReplayQueue(shuffle(wrongCards));
    setRound(2);
  };

  // --- SETUP PHASE ---
  if (phase === "setup") {
    return (
      <Layout wide showBack backTo="/">
        <div className="space-y-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">{topic.icon}</div>
            <h1 className="font-display text-2xl font-bold text-primary">
              {topic.title} {t("practice.pageTitleSuffix")}
            </h1>
            <p className="text-xs text-muted-foreground mt-2">
              {allCards.length} {t("practice.cardCounterLabel")}
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            {/* API key */}
            <div className="p-4 bg-card border border-border rounded-lg">
              <ApiKeyInput onDone={() => setApiKeyReady(true)} />
            </div>

            <button
              onClick={handleStart}
              disabled={!apiKeyReady}
              className="w-full py-3 px-6 rounded-lg font-semibold transition text-sm disabled:opacity-40 disabled:cursor-default"
              style={{
                backgroundColor: apiKeyReady ? "var(--primary)" : "#1a1a30",
                color: apiKeyReady ? "white" : "var(--muted-foreground)",
              }}
            >
              {apiKeyReady ? t("practice.start") : t("practice.enterApiKey")}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // --- PLAYING PHASE ---
  if (phase === "playing") {
    const currentCard = currentDeck[currentIndex];
    if (!currentCard) {
      incrementSessions();
      setPhase("finished");
      return null;
    }

    return (
      <Layout wide showBack backTo="/">
        <div className="max-w-3xl mx-auto space-y-8">
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
            onScore={handleScore}
            current={currentIndex}
            total={currentDeck.length}
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
      </Layout>
    );
  }

  // --- FINISHED PHASE ---
  const bestScores = new Map<string, Score>();
  for (const s of scores) {
    const prev = bestScores.get(s.cardId);
    if (prev === undefined || s.round > (scores.find((x) => x.cardId === s.cardId && x.score === prev)?.round ?? 0)) {
      bestScores.set(s.cardId, s.score);
    }
  }

  const scoreCount = { 3: 0, 2: 0, 1: 0, 0: 0 };
  for (const s of bestScores.values()) scoreCount[s]++;

  const totalCards = bestScores.size;
  const weightedSum = scoreCount[3] * 3 + scoreCount[2] * 2 + scoreCount[1] * 1;
  const pct = totalCards > 0 ? Math.round((weightedSum / (totalCards * 3)) * 100) : 0;

  const replayedCardIds = new Set(scores.filter((s) => s.round > 1).map((s) => s.cardId));
  const replayedCount = replayedCardIds.size;

  const wrongRemaining = [...bestScores.entries()].filter(([, s]) => s <= 1).length;

  return (
    <Layout wide showBack backTo="/">
      <div className="text-center space-y-8 pt-12 max-w-3xl mx-auto">
        <div className="text-6xl mb-4">
          {pct === 100 ? "🏆" : pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚"}
        </div>
        <h2 className="font-display text-2xl font-bold text-[var(--color-accent2)]">
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
            <div className="text-xl font-bold text-[var(--color-green)] mt-1">{scoreCount[3]}</div>
            <div className="text-[0.5rem] text-muted-foreground uppercase tracking-wider mt-1">{t("practice.score.exact")}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col items-center">
            <StarRating score={2} size="sm" />
            <div className="text-xl font-bold text-[var(--color-accent2)] mt-1">{scoreCount[2]}</div>
            <div className="text-[0.5rem] text-muted-foreground uppercase tracking-wider mt-1">{t("practice.score.close")}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col items-center">
            <StarRating score={1} size="sm" />
            <div className="text-xl font-bold text-[#f59e0b] mt-1">{scoreCount[1]}</div>
            <div className="text-[0.5rem] text-muted-foreground uppercase tracking-wider mt-1">{t("practice.score.hard")}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col items-center">
            <StarRating score={0} size="sm" />
            <div className="text-xl font-bold text-destructive mt-1">{scoreCount[0]}</div>
            <div className="text-[0.5rem] text-muted-foreground uppercase tracking-wider mt-1">{t("practice.score.unknown")}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col items-center">
            <div className="text-xl font-bold text-primary">{pct}%</div>
            <div className="text-[0.5rem] text-muted-foreground uppercase tracking-wider mt-1">{t("practice.score.total")}</div>
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
              onClick={handleRetryWrong}
              className="py-2 px-6 bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-[rgba(245,158,11,0.25)] rounded font-semibold hover:bg-[rgba(245,158,11,0.25)] transition text-sm"
            >
              {t("practice.repeatErrors")} ({wrongRemaining})
            </button>
          )}
          <button
            onClick={handleRestart}
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
    </Layout>
  );
}
