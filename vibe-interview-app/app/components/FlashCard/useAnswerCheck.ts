import { useState, useCallback } from "react";
import { checkAnswer, type LLMResult } from "~/lib/llm";
import type { Card, Score } from "../FlashCard";

export const SCORE_STYLES: Record<Score, { color: string; bg: string; border: string }> = {
  3: { color: "var(--color-green)", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.25)" },
  2: { color: "var(--color-accent2)", bg: "rgba(34,211,238,0.12)", border: "rgba(34,211,238,0.25)" },
  1: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
  0: { color: "var(--destructive)", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)" },
};

export function useAnswerCheck(
  card: Card,
  userAnswer: string,
  onScore: (score: Score) => void,
) {
  const [aiResult, setAiResult] = useState<LLMResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleCheck = useCallback(() => {
    if (!userAnswer.trim() || aiLoading) return;
    setAiLoading(true);
    setAiError(null);

    checkAnswer(card.question, card.answer, userAnswer.trim(), card.keyPoints)
      .then((result) => {
        setAiResult(result);
        setAiLoading(false);
      })
      .catch((err) => {
        setAiError(err instanceof Error ? err.message : "Unknown error");
        setAiLoading(false);
      });
  }, [userAnswer, aiLoading, card.question, card.answer, card.keyPoints]);

  const handleNext = useCallback(() => {
    if (aiResult) onScore(aiResult.score);
  }, [aiResult, onScore]);

  const handleSkip = useCallback(() => {
    onScore(0);
  }, [onScore]);

  const style = aiResult ? SCORE_STYLES[aiResult.score] : null;

  return { aiResult, aiLoading, aiError, handleCheck, handleNext, handleSkip, style };
}
