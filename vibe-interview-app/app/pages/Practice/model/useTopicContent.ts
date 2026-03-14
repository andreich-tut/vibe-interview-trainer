import { useState, useEffect } from "react";
import { useLanguage } from "~/contexts/LanguageContext";
import { loadContent, type CardsFile, type TopicsFile } from "~/lib/contentLoader";

interface TopicContent {
  topic: TopicsFile["topics"][number] | undefined;
  cards: CardsFile["cards"];
  loading: boolean;
  error: string | null;
}

export function useTopicContent(topicId: string): TopicContent {
  const { lang, t } = useLanguage();

  const [topicsData, setTopicsData] = useState<TopicsFile | null>(null);
  const [cardsData, setCardsData] = useState<CardsFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadContent(lang, "topics"), loadContent(lang, "cards", topicId)])
      .then(([topics, cards]) => {
        setTopicsData(topics);
        setCardsData(cards);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load content:", err);
        setError(t("common.failedToLoad"));
      })
      .finally(() => setLoading(false));
  }, [topicId, lang]);

  return {
    topic: topicsData?.topics.find((t) => t.id === topicId),
    cards: cardsData?.cards ?? [],
    loading,
    error,
  };
}
