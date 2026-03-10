import { Layout } from "~/components/Layout";
import { TopicCard } from "~/components/TopicCard";
import { topics } from "~/data/topics";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "Подготовка к собеседованию" },
    { name: "description", content: "Интерактивный тренер для подготовки к собеседованиям" },
  ];
}

export default function Home() {
  return (
    <Layout>
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl font-black mb-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent2)] bg-clip-text text-transparent">
          Подготовка к собеседованию
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Выбери тему и начни подготовку. Теория + практика по каждой теме.
        </p>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            id={topic.id}
            icon={topic.icon}
            title={topic.title}
            description={topic.description}
          />
        ))}
      </div>

      {/* Event Loop Trainer */}
      <div className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface2)] border border-[var(--color-accent)] border-opacity-30 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">🔄</div>
        <h3 className="font-display font-bold text-lg mb-2">Event Loop Тренажёр</h3>
        <p className="text-xs text-[var(--color-muted)] mb-4">
          Интерактивный тренажёр для отработки Event Loop в JavaScript.
        </p>
        <Link
          to="/event-loop"
          className="inline-block py-2 px-6 bg-[var(--color-accent2)] text-white rounded text-sm font-semibold hover:bg-cyan-500 transition"
        >
          Начать тренировку →
        </Link>
      </div>
    </Layout>
  );
}
