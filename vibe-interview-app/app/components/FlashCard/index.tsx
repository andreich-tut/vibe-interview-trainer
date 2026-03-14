import { useLanguage } from "~/contexts/LanguageContext";
import { useSpeechRecognition } from "~/hooks/useSpeechRecognition";
import { useSpeechAnswer } from "./useSpeechAnswer";
import { useAnswerCheck } from "./useAnswerCheck";
import { useFlashCardKeyboard } from "./useFlashCardKeyboard";
import { CardProgress } from "./CardProgress";
import { CardAnswerInput } from "./CardAnswerInput";
import { CardResult } from "./CardResult";
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
  const { t } = useLanguage();
  const scoreLabels: Record<Score, string> = {
    3: t("flashCard.exact"),
    2: t("flashCard.close"),
    1: t("flashCard.hard"),
    0: t("flashCard.unknown"),
  };

  const speech = useSpeechRecognition();
  const { userAnswer, setUserAnswer, toggleMic } = useSpeechAnswer(speech, card.id);
  const { aiResult, aiLoading, aiError, handleCheck, handleNext, handleSkip, style } =
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
          <CardResult
            userAnswer={userAnswer}
            card={card}
            aiResult={aiResult}
            aiLoading={aiLoading}
            aiError={aiError}
            style={style}
            scoreLabels={scoreLabels}
          />
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
