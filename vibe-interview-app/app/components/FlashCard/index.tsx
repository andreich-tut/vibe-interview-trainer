import { useSpeechRecognition } from "~/hooks/useSpeechRecognition";
import { useSpeechAnswer } from "./useSpeechAnswer";
import { useAnswerCheck } from "./useAnswerCheck";
import { useFlashCardKeyboard } from "./useFlashCardKeyboard";
import { CardProgress } from "./CardProgress";
import { CardAnswerInput } from "./CardAnswerInput";
import { CardUserAnswer } from "./CardUserAnswer";
import { CardReferenceAnswer } from "./CardReferenceAnswer";
import { CardScore } from "./CardScore";
import { CardActions } from "./CardActions";
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

  function deriveCardState(): CardState {
    if (aiResult) return "result";
    if (aiLoading) return "loading";
    if (aiError) return "error";
    return "input";
  }
  const cardState = deriveCardState();

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
