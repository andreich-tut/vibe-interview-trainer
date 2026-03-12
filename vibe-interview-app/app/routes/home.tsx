import { Layout } from "~/components/Layout";
import { TopicCard } from "~/components/TopicCard";
import { useProgress } from "~/hooks/useProgress";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { loadContent, type TopicsFile } from "~/lib/contentLoader";
import { useLanguage } from "~/contexts/LanguageContext";

export function meta() {
  return [
    { title: "Подготовка к собеседованию" },
    { name: "description", content: "Интерактивный тренер для подготовки к собеседованиям" },
  ];
}

export default function Home() {
  const { getTopicProgress } = useProgress();
  const { lang, t } = useLanguage();
  const [topicsData, setTopicsData] = useState<TopicsFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent(lang, "topics")
      .then((data) => {
        setTopicsData(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load topics:", err);
        setError(t("common.failedToLoad"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <Layout wide>
        <div className="text-center py-12">
          <p className="text-[var(--color-muted)]">{t("common.loading")}</p>
        </div>
      </Layout>
    );
  }

  if (error || !topicsData) {
    return (
      <Layout wide>
        <div className="text-center py-12">
          <p className="text-red-500">{error || t("common.failedToLoadContent")}</p>
        </div>
      </Layout>
    );
  }

  const topics = topicsData.topics;

  return (
    <Layout wide>
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl font-black mb-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent2)] bg-clip-text text-transparent">
          {t("home.pageTitle")}
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          {t("home.subtitle")}
        </p>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {topics.map((topic) => {
          const progress = getTopicProgress(topic.id);
          return (
            <TopicCard
              key={topic.id}
              id={topic.id}
              icon={topic.icon}
              title={topic.title}
              description={topic.description}
              progress={progress.total > 0 ? { mastered: progress.mastered, total: progress.total } : undefined}
            />
          );
        })}
      </div>

      {/* Event Loop Trainer */}
      <div className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface2)] border border-[var(--color-accent)] border-opacity-30 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">🔄</div>
        <h3 className="font-display font-bold text-lg mb-2">{t("home.eventLoopTitle")}</h3>
        <p className="text-xs text-[var(--color-muted)] mb-4">
          {t("home.eventLoopDesc")}
        </p>
        <Link
          to="/event-loop"
          className="inline-block py-2 px-6 bg-[var(--color-accent2)] text-white rounded text-sm font-semibold hover:bg-cyan-500 transition"
        >
          {t("home.eventLoopCta")}
        </Link>
      </div>
    </Layout>
  );
}
