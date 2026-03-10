import { useState } from "react";

export interface Card {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FlashCardProps {
  card: Card;
  onNext: () => void;
  current: number;
  total: number;
}

export function FlashCard({ card, onNext, current, total }: FlashCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

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
      <div className="text-xs text-[var(--color-muted)]">{card.category}</div>

      {/* Card */}
      <div className="min-h-64 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 flex flex-col justify-center">
        {!isRevealed ? (
          <div className="text-center space-y-4">
            <div className="text-lg font-semibold text-[var(--color-text)] leading-relaxed">
              {card.question}
            </div>
            <button
              onClick={() => setIsRevealed(true)}
              className="inline-block py-2 px-4 bg-[var(--color-accent)] text-white text-sm rounded hover:bg-opacity-90 transition"
            >
              Показать ответ
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-sm text-[var(--color-muted)]">Ответ:</div>
            <div className="text-base text-[var(--color-text)] leading-relaxed">{card.answer}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onNext}
          className="flex-1 py-2 px-4 bg-[var(--color-accent2)] text-white text-sm font-semibold rounded hover:bg-opacity-90 transition"
        >
          Следующая →
        </button>
      </div>
    </div>
  );
}
