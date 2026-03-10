import type { Route } from "./+types/topic-practice";
import { useState, useMemo } from "react";
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

  const currentCard = cards[currentIndex];
  const isFinished = currentIndex >= cards.length;

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
  };

  return (
    <Layout showBack backTo="/">
      {!isFinished ? (
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
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display text-2xl font-bold text-[var(--color-accent2)]">
            Поздравляем!
          </h2>
          <p className="text-[var(--color-text)]">
            Ты прошёл все {cards.length} карточек по теме {topic.title}.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="py-2 px-6 bg-[var(--color-accent)] text-white rounded font-semibold hover:bg-opacity-90 transition"
            >
              Повторить
            </button>
            <a
              href="/"
              className="py-2 px-6 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded font-semibold hover:border-[var(--color-accent)] transition"
            >
              На главную
            </a>
          </div>
        </div>
      )}
    </Layout>
  );
}
