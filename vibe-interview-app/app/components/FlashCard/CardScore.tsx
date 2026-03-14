import { StarRating } from "~/components/StarRating";
import type { LLMResult } from "~/lib/llm";
import { useLanguage } from "~/contexts/LanguageContext";
import type { Score } from "../FlashCard";

const SCORE_BOX_CLASS: Record<Score, string> = {
  3: "bg-green-subtle border-green-subtle",
  2: "bg-accent2-subtle border-accent2-subtle",
  1: "bg-warning-subtle border-warning-subtle",
  0: "bg-destructive-subtle border-destructive-subtle",
};

export function CardScore({
  aiLoading,
  aiResult,
  aiError,
}: {
  aiLoading: boolean;
  aiResult: LLMResult | null;
  aiError: string | null;
}) {
  const { t } = useLanguage();
  return (
    <>
      {aiLoading && (
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          {t("flashCard.aiChecking")}
        </div>
      )}
      {aiResult && (
        <div
          className={`px-4 py-3 rounded-lg ${SCORE_BOX_CLASS[aiResult.score]}`}
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
          {t("flashCard.checkError")}
          {aiError === "RATE_LIMITED"
            ? t("flashCard.rateLimited")
            : aiError === "NO_API_KEY"
            ? t("flashCard.noApiKey")
            : ""}
        </div>
      )}
    </>
  );
}
