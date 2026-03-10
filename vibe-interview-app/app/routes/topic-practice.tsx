import type { Route } from "./+types/topic-practice";
import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Layout } from "~/components/Layout";
import { FlashCard, type Card } from "~/components/FlashCard";
import { javascriptCards } from "~/data/cards/javascript";
import { reactCards } from "~/data/cards/react";
import { nextjsCards } from "~/data/cards/nextjs";
import { nodejsCards } from "~/data/cards/nodejs";
import { cssCards } from "~/data/cards/css";
import { cicdCards } from "~/data/cards/cicd";
import { testingCards } from "~/data/cards/testing";
import { topics } from "~/data/topics";

const cardsMap: Record<string, Card[]> = {
  javascript: javascriptCards,
  react: reactCards,
  nextjs: nextjsCards,
  nodejs: nodejsCards,
  css: cssCards,
  cicd: cicdCards,
  testing: testingCards,
};

export function meta({ params }: Route.MetaArgs) {
  const topic = topics.find((t) => t.id === params.topicId);
  return [
    { title: `${topic?.title || "Практика"} — Практика` },
    { name: "description", content: topic?.description },
  ];
}

export default function TopicPractice({ params }: Route.ComponentProps) {
  const topic = topics.find((t) => t.id === params.topicId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [knewCount, setKnewCount] = useState(0);

  const cards = useMemo(() => {
    const shuffled = [...(cardsMap[params.topicId] ?? [])];
    for (let i = shuffled.length - 1; i > 0; i--) {
      // eslint-disable-next-line react-hooks/purity
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [params.topicId]);

  if (!topic) {
    return (
      <Layout showBack>
        <p className="text-center text-[var(--color-red)]">Тема не найдена</p>
      </Layout>
    );
  }

  const isFinished = currentIndex >= cards.length;
  const currentCard = !isFinished ? cards[currentIndex] : null;
  const didntKnowCount = isFinished ? cards.length - knewCount : 0;
  const pct = isFinished
    ? Math.round((knewCount / cards.length) * 100)
    : 0;

  const handleNext = (knew: boolean) => {
    if (knew) setKnewCount((c) => c + 1);
    setCurrentIndex((i) => i + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setKnewCount(0);
  };

  return (
    <Layout showBack backTo="/">
      {!isFinished && currentCard ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">{topic.icon}</div>
            <h1 className="font-display text-2xl font-bold text-[var(--color-accent)]">
              {topic.title} — Практика
            </h1>
          </div>

          {/* Flash card */}
          <FlashCard
            card={currentCard}
            onNext={handleNext}
            current={currentIndex}
            total={cards.length}
          />

          {/* Back to theory link */}
          <div className="text-center">
            <Link
              to={`/${topic.id}/theory`}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              ← Вернуться к теории
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-8 pt-12">
          <div className="text-6xl mb-4">
            {pct === 100 ? "🏆" : pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚"}
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--color-accent2)]">
            {pct === 100
              ? "Идеально!"
              : pct >= 80
                ? "Отлично!"
                : pct >= 50
                  ? "Неплохо!"
                  : "Есть над чем поработать"}
          </h2>
          <p className="text-sm text-[var(--color-text)]">
            Тема: {topic.title} · {cards.length} карточек
          </p>

          {/* Score grid */}
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
              <div className="text-2xl font-bold text-[var(--color-green)]">
                {knewCount}
              </div>
              <div className="text-[0.625rem] text-[var(--color-muted)] uppercase tracking-wider mt-1">
                Знал
              </div>
            </div>
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
              <div className="text-2xl font-bold text-[var(--color-red)]">
                {didntKnowCount}
              </div>
              <div className="text-[0.625rem] text-[var(--color-muted)] uppercase tracking-wider mt-1">
                Не знал
              </div>
            </div>
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
              <div className="text-2xl font-bold text-[var(--color-accent2)]">
                {pct}%
              </div>
              <div className="text-[0.625rem] text-[var(--color-muted)] uppercase tracking-wider mt-1">
                Результат
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="py-2 px-6 bg-[var(--color-accent)] text-white rounded font-semibold hover:bg-[#6a56f0] transition"
            >
              Повторить
            </button>
            <Link
              to={`/${topic.id}/theory`}
              className="py-2 px-6 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded font-semibold hover:border-[var(--color-accent)] transition"
            >
              К теории
            </Link>
            <Link
              to="/"
              className="py-2 px-6 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded font-semibold hover:border-[var(--color-accent)] transition"
            >
              На главную
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
}
