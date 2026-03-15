import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Layout } from "~/shared/layout/Layout";
import { TopicIcon } from "~/shared/ui/TopicIcon";
import { TopicCard } from "./ui/TopicCard";
import { AnimatedBackground } from "./ui/AnimatedBackground";
import { loadContent, type TopicsFile } from "~/lib/contentLoader";
import { useLanguage } from "~/contexts/LanguageContext";

export function meta() {
  return [
    { title: "Подготовка к собеседованию" },
    { name: "description", content: "Интерактивный тренер для подготовки к собеседованиям" },
  ];
}

export default function HomePage() {
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
      <>
        <AnimatedBackground />
        <Layout wide transparent>
          <div className="relative z-10 text-center py-12">
            <p className="text-muted-foreground">{t("common.loading")}</p>
          </div>
        </Layout>
      </>
    );
  }

  if (error || !topicsData) {
    return (
      <>
        <AnimatedBackground />
        <Layout wide transparent>
          <div className="relative z-10 text-center py-12">
            <p className="text-red-500">{error || t("common.failedToLoadContent")}</p>
          </div>
        </Layout>
      </>
    );
  }

  const topics = topicsData.topics;

  return (
    <>
      <AnimatedBackground />

      <Layout wide>
        {/* Hero */}
        <div className="relative z-10 text-center mb-12 pt-8">
          <h1 className="font-display text-3xl font-black mb-3 bg-linear-to-r from-primary to-(--color-accent2) bg-clip-text text-transparent">
            {t("home.pageTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("home.subtitle")}</p>
        </div>

        {/* Topic Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              id={topic.id}
              title={topic.title}
              description={topic.description}
            />
          ))}
        </div>

        {/* Event Loop Trainer */}
        <div className="relative z-10 bg-linear-to-br from-card/80 to-secondary/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6 text-center">
          <TopicIcon id="event-loop" className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg mb-2">
            {t("home.eventLoopTitle")}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {t("home.eventLoopDesc")}
          </p>
          <Link
            to="/event-loop"
            className="inline-block py-2 px-6 bg-(--color-accent2) text-white rounded text-sm font-semibold hover:bg-cyan-500 transition"
          >
            {t("home.eventLoopCta")}
          </Link>
        </div>
      </Layout>
    </>
  );
}
