import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "~/contexts/LanguageContext";
import { loadContent, type TopicsFile, type TheoryFile } from "~/lib/contentLoader";
import { processContent } from "~/lib/codeHighlight";

interface TheoryContent {
  topic: TopicsFile["topics"][number] | undefined;
  theory: TheoryFile["theory"];
  processedSections: Array<{ title: string; content: string }>;
  loading: boolean;
  error: string | null;
}

interface FetchState {
  topicsData: TopicsFile | null;
  theoryData: TheoryFile | null;
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: FetchState = { topicsData: null, theoryData: null, loading: true, error: null };

export function useTheoryContent(topicId: string): TheoryContent {
  const { lang, t } = useLanguage();
  const [state, setState] = useState<FetchState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    Promise
      .all([
        loadContent(lang, "topics"), 
        loadContent(lang, "theory", topicId)
      ])
      .then(([topicsData, theoryData]) => {
        if (!cancelled) setState({ topicsData, theoryData, loading: false, error: null });
      })
      .catch((err) => {
        console.error("Failed to load content:", err);
        if (!cancelled) setState({ topicsData: null, theoryData: null, loading: false, error: t("common.failedToLoad") });
      });
      
    return () => {
      cancelled = true;
      setState(INITIAL_STATE);
    };
  }, [topicId, lang, t]);

  const processedSections = useMemo(
    () => (state.theoryData?.theory ?? []).map((section) => ({ ...section, content: processContent(section.content) })),
    [state.theoryData],
  );

  return {
    topic: state.topicsData?.topics.find((topic) => topic.id === topicId),
    theory: state.theoryData?.theory ?? [],
    processedSections,
    loading: state.loading,
    error: state.error,
  };
}
