import { useState, useEffect, useCallback } from "react";

export interface Card {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FlashCardProps {
  card: Card;
  onNext: (knew: boolean) => void;
  current: number;
  total: number;
}

export function FlashCard({ card, onNext, current, total }: FlashCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Reset reveal state when card changes
  useEffect(() => {
    setIsRevealed(false);
  }, [card.id]);

  const handleKnew = useCallback(() => onNext(true), [onNext]);
  const handleDidntKnow = useCallback(() => onNext(false), [onNext]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (!isRevealed && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setIsRevealed(true);
      } else if (isRevealed) {
        if (e.key === "ArrowRight" || e.key === "1") {
          e.preventDefault();
          handleKnew();
        } else if (e.key === "ArrowLeft" || e.key === "2") {
          e.preventDefault();
          handleDidntKnow();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRevealed, handleKnew, handleDidntKnow]);

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
      <div className="min-h-72 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 flex flex-col justify-center">
        {!isRevealed ? (
          <div className="text-center space-y-4">
            <div className="text-lg font-semibold text-[var(--color-text)] leading-relaxed">
              {card.question}
            </div>
            <button
              onClick={() => setIsRevealed(true)}
              aria-expanded={isRevealed}
              className="inline-block py-2 px-4 bg-[var(--color-accent)] text-white text-sm rounded hover:bg-[#6a56f0] transition"
            >
              Показать ответ
            </button>
            <div className="text-[0.625rem] text-[var(--color-muted)]">
              Space — показать
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-sm text-[var(--color-muted)]">Ответ:</div>
            <div className="text-base text-[var(--color-text)] leading-relaxed whitespace-pre-line">
              {card.answer}
            </div>
          </div>
        )}
      </div>

      {/* Self-assessment / Navigation */}
      {isRevealed ? (
        <div className="space-y-2">
          <div className="flex gap-3">
            <button
              onClick={handleKnew}
              className="flex-1 py-2.5 px-4 bg-[rgba(52,211,153,0.12)] text-[var(--color-green)] text-sm font-semibold rounded border border-[rgba(52,211,153,0.25)] hover:bg-[rgba(52,211,153,0.22)] transition"
            >
              Знал ✓
            </button>
            <button
              onClick={handleDidntKnow}
              className="flex-1 py-2.5 px-4 bg-[rgba(248,113,113,0.12)] text-[var(--color-red)] text-sm font-semibold rounded border border-[rgba(248,113,113,0.25)] hover:bg-[rgba(248,113,113,0.22)] transition"
            >
              Не знал ✗
            </button>
          </div>
          <div className="text-[0.625rem] text-[var(--color-muted)] text-center">
            ← не знал · знал →
          </div>
        </div>
      ) : (
        <button
          disabled
          className="w-full py-2.5 px-4 bg-[#1a1a30] text-[var(--color-muted)] text-sm font-semibold rounded cursor-default"
        >
          Сначала покажи ответ
        </button>
      )}
    </div>
  );
}
