import type React from "react";
import { useLanguage } from "~/contexts/LanguageContext";
import { Button } from "~/components/ui/button";
import type { CardState } from "./types";

interface CardActionsProps {
  cardState: CardState;
  userAnswer: string;
  onCheck: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export function CardActions({ cardState, userAnswer, onCheck, onNext, onSkip }: CardActionsProps) {
  const { t } = useLanguage();

  const actions: Record<CardState, React.ReactElement> = {
    result: (
      <div className="space-y-2">
        <Button onClick={onNext} className="w-full">
          {t("flashCard.next")}
        </Button>
        <div className="text-[0.625rem] text-muted-foreground text-center">
          {t("flashCard.enterHint")}
        </div>
      </div>
    ),
    error: (
      <div className="flex gap-2">
        <Button onClick={onCheck} className="flex-1">
          {t("flashCard.retryCheck")}
        </Button>
        <Button variant="outline" onClick={onSkip}>
          {t("flashCard.skip")}
        </Button>
      </div>
    ),
    loading: (
      <Button disabled className="w-full" variant="ghost">
        {t("flashCard.aiChecking")}
      </Button>
    ),
    input: (
      <Button
        onClick={onCheck}
        disabled={!userAnswer.trim()}
        className="w-full"
        variant={userAnswer.trim() ? "default" : "ghost"}
      >
        {t("flashCard.submit")}
      </Button>
    ),
  };

  return actions[cardState];
}
