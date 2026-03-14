import { useLanguage } from "~/contexts/LanguageContext";
import { Button } from "~/shared/ui/button";
import type { CardState } from "../types";

interface CardActionsProps {
  cardState: CardState;
  userAnswer: string;
  onCheck: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export function CardActions({ cardState, userAnswer, onCheck, onNext, onSkip }: CardActionsProps) {
  const { t } = useLanguage();

  if (cardState === "result") {
    return (
      <div className="space-y-2">
        <Button onClick={onNext} className="w-full">
          {t("flashCard.next")}
        </Button>
        <div className="text-[0.625rem] text-muted-foreground text-center">
          {t("flashCard.enterHint")}
        </div>
      </div>
    );
  }

  if (cardState === "error") {
    return (
      <div className="flex gap-2">
        <Button onClick={onCheck} className="flex-1">
          {t("flashCard.retryCheck")}
        </Button>
        <Button variant="outline" onClick={onSkip}>
          {t("flashCard.skip")}
        </Button>
      </div>
    );
  }

  if (cardState === "loading") {
    return (
      <Button disabled className="w-full" variant="ghost">
        {t("flashCard.aiChecking")}
      </Button>
    );
  }

  return (
    <Button
      onClick={onCheck}
      disabled={!userAnswer.trim()}
      className="w-full"
      variant={userAnswer.trim() ? "default" : "ghost"}
    >
      {t("flashCard.submit")}
    </Button>
  );
}
