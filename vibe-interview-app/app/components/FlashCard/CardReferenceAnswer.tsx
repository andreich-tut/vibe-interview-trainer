import type { LLMResult } from "~/lib/llm";
import { useLanguage } from "~/contexts/LanguageContext";

export function CardReferenceAnswer({
  answer,
  aiResult,
}: {
  answer: string;
  aiResult: LLMResult | null;
}) {
  const { t } = useLanguage();
  const hasPoints =
    aiResult &&
    (aiResult.matchedPoints.length > 0 || aiResult.missedPoints.length > 0);
  return (
    <div className="px-4 py-3 rounded-lg bg-green-subtle border-green-subtle">
      <div className="text-[0.625rem] font-bold uppercase tracking-wider text-green mb-1.5">
        {t("flashCard.correctAnswer")}
      </div>
      <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
        {answer}
      </div>
      {hasPoints && (
        <div className="mt-3 pt-3 border-t-green-subtle">
          <div className="text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            {t("flashCard.keyPoints")}
          </div>
          <ul className="space-y-1 text-xs">
            {aiResult.matchedPoints.map((point, i) => (
              <li key={`m-${i}`} className="flex items-start gap-1.5">
                <span className="text-green font-bold shrink-0">{"\u2713"}</span>
                <span className="text-foreground">{point}</span>
              </li>
            ))}
            {aiResult.missedPoints.map((point, i) => (
              <li key={`x-${i}`} className="flex items-start gap-1.5">
                <span className="text-destructive font-bold shrink-0">{"\u2717"}</span>
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
