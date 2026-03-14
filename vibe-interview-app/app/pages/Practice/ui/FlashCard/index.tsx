import { useMemo } from "react";
import { useSpeechRecognition } from "./model/useSpeechRecognition";
import { useSpeechAnswer } from "./model/useSpeechAnswer";
import { useAnswerCheck } from "./model/useAnswerCheck";
import { useFlashCardKeyboard } from "./model/useFlashCardKeyboard";
import { CardProgress } from "./ui/CardProgress";
import { CardAnswerInput } from "./ui/CardAnswerInput";
import { CardUserAnswer } from "./ui/CardUserAnswer";
import { CardReferenceAnswer } from "./ui/CardReferenceAnswer";
import { CardScore } from "./ui/CardScore";
import { CardActions } from "./ui/CardActions";
import type { CardState } from "./types";

export interface Card {
  id: string;
  question: string;
  answer: string;
  category: string;
  keyPoints?: string[];
}

export type Score = 0 | 1 | 2 | 3;

interface FlashCardProps {
  card: Card;
  onScore: (score: Score) => void;
  current: number;
  total: number;
}

export function FlashCard({ card, onScore, current, total }: FlashCardProps) {
  const speech = useSpeechRecognition();
  const { userAnswer, setUserAnswer, toggleMic } = useSpeechAnswer(speech, card.id);
  const { aiResult, aiLoading, aiError, handleCheck, handleNext, handleSkip } =
    useAnswerCheck(card, userAnswer, onScore);
  useFlashCardKeyboard(aiResult, handleCheck, handleNext);

  const cardState = useMemo<CardState>(() => {
    if (aiResult) return "result";
    if (aiLoading) return "loading";
    if (aiError) return "error";
    return "input";
  }, [aiResult, aiLoading, aiError]);

  return (
    <div className="space-y-6">
      <CardProgress current={current} total={total} category={card.category} />

      <div className="min-h-72 bg-card border border-border rounded-lg p-6 flex flex-col">
        <div className="text-lg font-semibold text-foreground leading-relaxed text-center mb-4">
          {card.question}
        </div>

        {cardState === "input" ? (
          <CardAnswerInput
            userAnswer={userAnswer}
            onChange={setUserAnswer}
            onCheck={handleCheck}
            speech={speech}
            toggleMic={toggleMic}
          />
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <CardUserAnswer answer={userAnswer} />
            <CardReferenceAnswer answer={card.answer} aiResult={aiResult} />
            <CardScore aiLoading={aiLoading} aiResult={aiResult} aiError={aiError} />
          </div>
        )}
      </div>

      <CardActions
        cardState={cardState}
        userAnswer={userAnswer}
        onCheck={handleCheck}
        onNext={handleNext}
        onSkip={handleSkip}
      />
    </div>
  );
}
