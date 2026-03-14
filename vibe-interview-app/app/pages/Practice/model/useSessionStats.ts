import { useMemo } from "react";
import { type Score } from "~/pages/Practice/ui/FlashCard";
import { type CardScore } from "./useCardDeck";

export interface SessionStats {
  scoreCount: Record<Score, number>;
  totalCards: number;
  pct: number;
  replayedCount: number;
  wrongRemaining: number;
}

export function useSessionStats(scores: CardScore[]): SessionStats {
  return useMemo(() => {
    const bestScores = new Map<string, Score>();
    for (const s of scores) {
      const prev = bestScores.get(s.cardId);
      if (prev === undefined || s.score > prev) {
        bestScores.set(s.cardId, s.score);
      }
    }

    const scoreCount = { 3: 0, 2: 0, 1: 0, 0: 0 } as Record<Score, number>;
    for (const s of bestScores.values()) scoreCount[s]++;

    const totalCards = bestScores.size;
    const weightedSum = scoreCount[3] * 3 + scoreCount[2] * 2 + scoreCount[1] * 1;
    const pct = totalCards > 0 ? Math.round((weightedSum / (totalCards * 3)) * 100) : 0;
    const replayedCount = new Set(scores.filter((s) => s.round > 1).map((s) => s.cardId)).size;
    const wrongRemaining = [...bestScores.entries()].filter(([, s]) => s <= 1).length;

    return { scoreCount, totalCards, pct, replayedCount, wrongRemaining };
  }, [scores]);
}
