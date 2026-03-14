import { useState, useEffect } from "react";
import { type Score, type Card } from "~/components/practice/FlashCard";
import { useProgress } from "~/hooks/shared/useProgress";
import { hasApiKey } from "~/lib/llm";
import { useCardDeck, type CardScore } from "~/hooks/practice/useCardDeck";
import { useSessionStats } from "~/hooks/practice/useSessionStats";

type Phase = "setup" | "playing" | "finished";

export function usePracticeSession(topicId: string, cards: Card[]) {
  const { saveCardResult, incrementSessions } = useProgress();

  const [phase, setPhase] = useState<Phase>("setup");
  const [scores, setScores] = useState<CardScore[]>([]);
  const [apiKeyReady, setApiKeyReady] = useState(false);

  useEffect(() => {
    setApiKeyReady(hasApiKey());
  }, []);

  // useCardDeck shuffles cards internally
  const deck = useCardDeck(cards);
  const finishedStats = useSessionStats(scores);

  const handleStart = () => {
    if (deck.allCards.length === 0) return;
    deck.reset();
    setScores([]);
    setPhase("playing");
  };

  const handleScore = (score: Score) => {
    const card = deck.currentCard!;
    const newScore: CardScore = { cardId: card.id, score, round: deck.round };
    const newScores = [...scores, newScore];
    setScores(newScores);
    saveCardResult(topicId, card.id, score);

    const result = deck.advance(newScores, newScore);
    if (result.type === "done") {
      incrementSessions();
      setPhase("finished");
    }
  };

  const handleRestart = () => {
    deck.reset();
    setScores([]);
    setPhase("setup");
  };

  const handleRetryWrong = () => {
    const bestScores = new Map<string, Score>();
    for (const s of scores) {
      const prev = bestScores.get(s.cardId);
      if (prev === undefined || s.score > prev) bestScores.set(s.cardId, s.score);
    }
    const wrongIds = new Set([...bestScores.entries()].filter(([, s]) => s <= 1).map(([id]) => id));
    const wrongCards = deck.allCards.filter((c) => wrongIds.has(c.id));
    if (wrongCards.length === 0) return;

    setScores([]);
    deck.startRetry(wrongCards);
    setPhase("playing");
  };

  return {
    phase,
    currentCard: deck.currentCard,
    currentIndex: deck.currentIndex,
    deckLength: deck.currentDeck.length,
    round: deck.round,
    apiKeyReady,
    onApiKeyDone: () => setApiKeyReady(true),
    cardCount: deck.allCards.length,
    finishedStats,
    handleStart,
    handleScore,
    handleRestart,
    handleRetryWrong,
  };
}
