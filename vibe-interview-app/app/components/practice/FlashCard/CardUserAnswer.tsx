import { useLanguage } from "~/contexts/LanguageContext";

export function CardUserAnswer({ answer }: { answer: string }) {
  const { t } = useLanguage();
  if (!answer.trim()) return null;
  return (
    <div className="px-4 py-3 bg-background border border-border rounded-lg">
      <div className="text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        {t("flashCard.yourAnswer")}
      </div>
      <div className="text-sm text-foreground whitespace-pre-line">
        {answer}
      </div>
    </div>
  );
}
