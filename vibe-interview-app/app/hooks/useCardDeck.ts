import { useState } from "react";
import { type Score, type Card } from "~/components/FlashCard";

const MAX_ROUND = 3;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface CardScore {
  cardId: string;
  score: Score;
  round: number;
}

export type DeckAdvanceResult =
  | { type: "next"; nextIndex: number }
  | { type: "replay"; queue: Card[]; nextRound: number }
  | { type: "done" };

export function useCardDeck(cards: Card[]) {
  const [allCards] = useState(() => shuffle(cards));
  const [round, setRound] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [replayQueue, setReplayQueue] = useState<Card[]>([]);

  const currentDeck = round === 1 ? allCards : replayQueue;
  const currentCard = currentDeck[currentIndex] as Card | undefined;

  /** Call after a card is scored. Returns what happened so the caller can react. */
  function advance(scores: CardScore[], newScore: CardScore): DeckAdvanceResult {
    const allScores = [...scores, newScore];
    const nextIndex = currentIndex + 1;

    if (nextIndex < currentDeck.length) {
      setCurrentIndex(nextIndex);
      return { type: "next", nextIndex };
    }

    // End of deck — compute wrong cards for this round
    const wrongCardIds = new Set(
      allScores.filter((s) => s.score <= 1 && s.round === round).map((s) => s.cardId),
    );
    const wrongCards = (round === 1 ? allCards : replayQueue).filter((c) =>
      wrongCardIds.has(c.id),
    );

    if (wrongCards.length > 0 && round < MAX_ROUND) {
      const nextRound = round + 1;
      const queue = shuffle(wrongCards);
      setReplayQueue(queue);
      setRound(nextRound);
      setCurrentIndex(0);
      return { type: "replay", queue, nextRound };
    }

    return { type: "done" };
  }

  function reset() {
    setRound(1);
    setCurrentIndex(0);
    setReplayQueue([]);
  }

  /** Start a retry session with a specific set of wrong cards (round 2). */
  function startRetry(wrongCards: Card[]) {
    const queue = shuffle(wrongCards);
    setReplayQueue(queue);
    setRound(2);
    setCurrentIndex(0);
  }

  return { allCards, currentCard, currentIndex, currentDeck, round, advance, reset, startRetry };
}
