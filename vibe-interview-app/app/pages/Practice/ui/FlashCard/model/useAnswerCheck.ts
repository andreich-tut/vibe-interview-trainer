import { useState, useCallback } from "react";
import { checkAnswer, type LLMResult } from "~/lib/llm";
import type { Card, Score } from "../index";


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

  return { aiResult, aiLoading, aiError, handleCheck, handleNext, handleSkip };
}
