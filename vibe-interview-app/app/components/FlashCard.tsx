import { useState, useEffect, useCallback, useRef } from "react";
import { checkAnswer, type LLMResult } from "~/lib/llm";
import { useSpeechRecognition } from "~/hooks/useSpeechRecognition";

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

const SCORE_STYLES: Record<Score, { label: string; color: string; bg: string; border: string }> = {
  3: { label: "Точно знал", color: "var(--color-green)", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.25)" },
  2: { label: "Примерно", color: "var(--color-accent2)", bg: "rgba(34,211,238,0.12)", border: "rgba(34,211,238,0.25)" },
  1: { label: "С трудом", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
  0: { label: "Не знал", color: "var(--color-red)", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)" },
};

export function FlashCard({ card, onScore, current, total }: FlashCardProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [aiResult, setAiResult] = useState<LLMResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const speech = useSpeechRecognition();
  // Text typed before mic was started — preserved as a prefix
  const typedBeforeMicRef = useRef("");

  // Compose displayed answer: typed prefix + speech transcript + interim
  useEffect(() => {
    if (!speech.isListening && !speech.transcript) return;
    const prefix = typedBeforeMicRef.current;
    const sep = prefix && !prefix.endsWith(" ") && !prefix.endsWith("\n") ? " " : "";
    const voicePart = speech.transcript + (speech.interimText ? ` ${speech.interimText}` : "");
    setUserAnswer(voicePart ? `${prefix}${sep}${voicePart}` : prefix);
  }, [speech.transcript, speech.interimText, speech.isListening]);

  // When mic stops, commit the full text so user can continue typing
  useEffect(() => {
    if (!speech.isListening && speech.transcript) {
      const prefix = typedBeforeMicRef.current;
      const sep = prefix && !prefix.endsWith(" ") && !prefix.endsWith("\n") ? " " : "";
      setUserAnswer(`${prefix}${sep}${speech.transcript}`);
    }
  }, [speech.isListening, speech.transcript]);

  // Reset speech state when card changes
  useEffect(() => {
    speech.reset();
    typedBeforeMicRef.current = "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id]);

  const toggleMic = useCallback(() => {
    if (speech.isListening) {
      speech.stop();
    } else {
      typedBeforeMicRef.current = userAnswer;
      speech.reset();
      speech.start();
    }
  }, [speech, userAnswer]);

  // Focus textarea on mount and after AI result clears (retry)
  useEffect(() => {
    if (!aiResult && !aiLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [aiResult, aiLoading]);

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

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLTextAreaElement) {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          handleCheck();
        }
        return;
      }
      if (e.target instanceof HTMLInputElement) return;

      if (aiResult && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        handleNext();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [aiResult, handleCheck, handleNext]);

  const style = aiResult ? SCORE_STYLES[aiResult.score] : null;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="text-xs text-[var(--color-muted)]">
        Карточка {current + 1} из {total}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent2)] transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* Category badge */}
      <div className="inline-block text-[0.625rem] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-[rgba(124,106,255,0.15)] text-[var(--color-accent)]">
        {card.category}
      </div>

      {/* Card */}
      <div className="min-h-72 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 flex flex-col">
        {/* Question */}
        <div className="text-lg font-semibold text-[var(--color-text)] leading-relaxed text-center mb-4">
          {card.question}
        </div>

        {!aiResult && !aiLoading && !aiError ? (
          /* Input phase */
          <div className="flex flex-col flex-1 space-y-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={speech.isListening ? "Говорите..." : "Напиши или надиктуй ответ..."}
                rows={4}
                className="w-full px-4 py-3 pr-12 bg-[var(--color-bg)] border rounded-lg text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none resize-y transition-colors"
                style={{
                  borderColor: speech.isListening ? "var(--color-red)" : "var(--color-border)",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleCheck();
                  }
                }}
              />
              {speech.isSupported && (
                <button
                  type="button"
                  onClick={toggleMic}
                  title={speech.isListening ? "Остановить запись" : "Голосовой ввод"}
                  className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                  style={{
                    backgroundColor: speech.isListening ? "rgba(248,113,113,0.2)" : "transparent",
                    color: speech.isListening ? "var(--color-red)" : "var(--color-muted)",
                  }}
                >
                  {speech.isListening ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                  )}
                </button>
              )}
            </div>
            {speech.error && (
              <div className="text-xs text-[var(--color-red)]">{speech.error}</div>
            )}
            {speech.isListening && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-red)]">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-red)] animate-pulse" />
                Запись...
              </div>
            )}
            <div className="text-[0.625rem] text-[var(--color-muted)] text-center">
              Ctrl+Enter — проверить
            </div>
          </div>
        ) : (
          /* Result phase */
          <div className="space-y-4 animate-in fade-in">
            {/* User answer */}
            {userAnswer.trim() && (
              <div>
                <div className="text-[0.625rem] font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
                  Твой ответ
                </div>
                <div className="px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] whitespace-pre-line">
                  {userAnswer}
                </div>
              </div>
            )}

            {/* Reference answer */}
            <div>
              <div className="text-[0.625rem] font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
                Правильный ответ
              </div>
              <div className="text-base text-[var(--color-text)] leading-relaxed whitespace-pre-line">
                {card.answer}
              </div>
            </div>

            {/* AI score */}
            {aiLoading && (
              <div className="text-xs text-[var(--color-muted)] flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                Проверяю...
              </div>
            )}
            {aiResult && style && (
              <div
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: style.bg, color: style.color, border: `1px solid ${style.border}` }}
              >
                <span>{aiResult.score}/3 — {style.label}</span>
                <span className="font-normal opacity-80">{aiResult.feedback}</span>
              </div>
            )}
            {aiError && (
              <div className="text-xs text-[var(--color-red)]">
                Ошибка проверки{aiError === "RATE_LIMITED" ? " (лимит запросов)" : aiError === "NO_API_KEY" ? " (нет API ключа)" : ""}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      {aiResult ? (
        <div className="space-y-2">
          <button
            onClick={handleNext}
            className="w-full py-2.5 px-4 bg-[var(--color-accent)] text-white text-sm font-semibold rounded hover:bg-[#6a56f0] transition"
          >
            Далее
          </button>
          <div className="text-[0.625rem] text-[var(--color-muted)] text-center">
            Enter — далее
          </div>
        </div>
      ) : aiError ? (
        <div className="flex gap-2">
          <button
            onClick={handleCheck}
            className="flex-1 py-2.5 px-4 bg-[var(--color-accent)] text-white text-sm font-semibold rounded hover:bg-[#6a56f0] transition"
          >
            Повторить проверку
          </button>
          <button
            onClick={handleSkip}
            className="py-2.5 px-4 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] text-sm font-semibold rounded hover:border-[var(--color-accent)] transition"
          >
            Пропустить
          </button>
        </div>
      ) : (
        <button
          onClick={handleCheck}
          disabled={!userAnswer.trim() || aiLoading}
          className="w-full py-2.5 px-4 text-sm font-semibold rounded transition disabled:opacity-40 disabled:cursor-default"
          style={{
            backgroundColor: userAnswer.trim() ? "var(--color-accent)" : "#1a1a30",
            color: userAnswer.trim() ? "white" : "var(--color-muted)",
          }}
        >
          {aiLoading ? "Проверяю..." : "Проверить"}
        </button>
      )}
    </div>
  );
}
