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
  const { lang } = useLanguage();
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
        setError("Failed to load content. Please refresh the page.");
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
        <p className="text-center text-[var(--color-muted)]">Loading...</p>
      </Layout>
    );
  }

  if (error || !topic || !cardsData) {
    return (
      <Layout showBack>
        <p className="text-center text-red-500">{error || "Failed to load content"}</p>
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
            <h1 className="font-display text-2xl font-bold text-[var(--color-accent)]">
              {topic.title} — Практика
            </h1>
            <p className="text-xs text-[var(--color-muted)] mt-2">
              {allCards.length} карточек · AI проверка ответов
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            {/* API key */}
            <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
              <ApiKeyInput onDone={() => setApiKeyReady(true)} />
            </div>

            <button
              onClick={handleStart}
              disabled={!apiKeyReady}
              className="w-full py-3 px-6 rounded-lg font-semibold transition text-sm disabled:opacity-40 disabled:cursor-default"
              style={{
                backgroundColor: apiKeyReady ? "var(--color-accent)" : "#1a1a30",
                color: apiKeyReady ? "white" : "var(--color-muted)",
              }}
            >
              {apiKeyReady ? "Начать" : "Введите API ключ для начала"}
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
            <h1 className="font-display text-2xl font-bold text-[var(--color-accent)]">
              {topic.title} — Практика
            </h1>
            {round > 1 && (
              <div className="inline-block mt-2 text-[0.625rem] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-[rgba(245,158,11,0.15)] text-[#f59e0b]">
                Раунд повтора {round - 1}/{MAX_REPLAY_ROUNDS}
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
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              ← Вернуться к теории
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
            ? "Идеально!"
            : pct >= 80
              ? "Отлично!"
              : pct >= 50
                ? "Неплохо!"
                : "Есть над чем поработать"}
        </h2>
        <p className="text-sm text-[var(--color-text)]">
          Тема: {topic.title} · {totalCards} карточек
        </p>

        <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 flex flex-col items-center">
            <StarRating score={3} size="sm" />
            <div className="text-xl font-bold text-[var(--color-green)] mt-1">{scoreCount[3]}</div>
            <div className="text-[0.5rem] text-[var(--color-muted)] uppercase tracking-wider mt-1">Точно</div>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 flex flex-col items-center">
            <StarRating score={2} size="sm" />
            <div className="text-xl font-bold text-[var(--color-accent2)] mt-1">{scoreCount[2]}</div>
            <div className="text-[0.5rem] text-[var(--color-muted)] uppercase tracking-wider mt-1">Примерно</div>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 flex flex-col items-center">
            <StarRating score={1} size="sm" />
            <div className="text-xl font-bold text-[#f59e0b] mt-1">{scoreCount[1]}</div>
            <div className="text-[0.5rem] text-[var(--color-muted)] uppercase tracking-wider mt-1">С трудом</div>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 flex flex-col items-center">
            <StarRating score={0} size="sm" />
            <div className="text-xl font-bold text-[var(--color-red)] mt-1">{scoreCount[0]}</div>
            <div className="text-[0.5rem] text-[var(--color-muted)] uppercase tracking-wider mt-1">Не знал</div>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 flex flex-col items-center">
            <div className="text-xl font-bold text-[var(--color-accent)]">{pct}%</div>
            <div className="text-[0.5rem] text-[var(--color-muted)] uppercase tracking-wider mt-1">Итого</div>
          </div>
        </div>

        {replayedCount > 0 && (
          <p className="text-xs text-[var(--color-muted)]">
            Повторено карточек: {replayedCount}
          </p>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          {wrongRemaining > 0 && (
            <button
              onClick={handleRetryWrong}
              className="py-2 px-6 bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-[rgba(245,158,11,0.25)] rounded font-semibold hover:bg-[rgba(245,158,11,0.25)] transition text-sm"
            >
              Повторить ошибки ({wrongRemaining})
            </button>
          )}
          <button
            onClick={handleRestart}
            className="py-2 px-6 bg-[var(--color-accent)] text-white rounded font-semibold hover:bg-[#6a56f0] transition text-sm"
          >
            Заново
          </button>
          <Link
            to={`/${topic.id}/theory`}
            className="py-2 px-6 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded font-semibold hover:border-[var(--color-accent)] transition text-sm"
          >
            К теории
          </Link>
          <Link
            to="/"
            className="py-2 px-6 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded font-semibold hover:border-[var(--color-accent)] transition text-sm"
          >
            На главную
          </Link>
        </div>
      </div>
    </Layout>
  );
}
