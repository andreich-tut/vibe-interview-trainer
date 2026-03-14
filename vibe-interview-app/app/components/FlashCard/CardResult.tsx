import { StarRating } from "~/components/StarRating";
import type { LLMResult } from "~/lib/llm";
import type { Card } from "../FlashCard";
import { useLanguage } from "~/contexts/LanguageContext";

interface CardResultProps {
  userAnswer: string;
  card: Card;
  aiResult: LLMResult | null;
  aiLoading: boolean;
  aiError: string | null;
  style: { color: string; bg: string; border: string } | null;
}

export function CardResult({
  userAnswer,
  card,
  aiResult,
  aiLoading,
  aiError,
  style,
}: CardResultProps) {
  const { t } = useLanguage();
  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Block 1 — User answer (gray border) */}
      {userAnswer.trim() && (
        <div className="px-4 py-3 bg-background border border-border rounded-lg">
          <div className="text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            {t("flashCard.yourAnswer")}
          </div>
          <div className="text-sm text-foreground whitespace-pre-line">
            {userAnswer}
          </div>
        </div>
      )}

      {/* Block 2 — Reference answer (green-tinted border) */}
      <div
        className="px-4 py-3 rounded-lg"
        style={{
          backgroundColor: "rgba(115,176,10,0.06)",
          border: "1px solid rgba(115,176,10,0.25)",
        }}
      >
        <div className="text-[0.625rem] font-bold uppercase tracking-wider text-[var(--color-green)] mb-1.5">
          {t("flashCard.correctAnswer")}
        </div>
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
          {card.answer}
        </div>
        {/* Key points checklist */}
        {aiResult &&
          ((aiResult.matchedPoints.length > 0) || (aiResult.missedPoints.length > 0)) && (
          <div className="mt-3 pt-3 border-t border-[rgba(115,176,10,0.15)]">
            <div className="text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              {t("flashCard.keyPoints")}
            </div>
            <ul className="space-y-1 text-xs">
              {aiResult.matchedPoints.map((point, i) => (
                <li key={`m-${i}`} className="flex items-start gap-1.5">
                  <span className="text-[var(--color-green)] font-bold shrink-0">{"\u2713"}</span>
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

      {/* Block 3 — Score (score-colored border) */}
      {aiLoading && (
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          {t("flashCard.aiChecking")}
        </div>
      )}
      {aiResult && style && (
        <div
          className="px-4 py-3 rounded-lg"
          style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <StarRating score={aiResult.score} size="md" />
          </div>
          <div className="text-xs text-foreground opacity-80 leading-relaxed">
            {aiResult.feedback}
          </div>
        </div>
      )}
      {aiError && (
        <div className="text-xs text-destructive">
          {t("flashCard.checkError")}{aiError === "RATE_LIMITED" ? t("flashCard.rateLimited") : aiError === "NO_API_KEY" ? t("flashCard.noApiKey") : ""}
        </div>
      )}
    </div>
  );
}
