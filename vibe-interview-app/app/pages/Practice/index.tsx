import { useParams } from "react-router";
import { Layout } from "~/shared/layout/Layout";
import { useLanguage } from "~/contexts/LanguageContext";
import { useTopicContent } from "./model/useTopicContent";
import { usePracticeSession } from "./model/usePracticeSession";
import { PracticeSetup } from "./ui/PracticeSetup";
import { PracticePlaying } from "./ui/PracticePlaying";
import { PracticeFinished } from "./ui/PracticeFinished";

export function meta() {
  return [
    { title: `Практика` },
    { name: "description", content: "Практикуйтесь с карточками" },
  ];
}

export default function PracticePage() {
  const { topicId } = useParams<{ topicId: string }>();
  const { t } = useLanguage();
  const { topic, cards, loading, error } = useTopicContent(topicId!);
  const session = usePracticeSession(topicId!, cards);

  if (loading) {
    return (
      <Layout>
        <p className="text-center text-muted-foreground">
          {t("common.loading")}
        </p>
      </Layout>
    );
  }

  if (error || !topic) {
    return (
      <Layout>
        <p className="text-center text-red-500">
          {error || t("common.failedToLoadContent")}
        </p>
      </Layout>
    );
  }

  if (session.phase === "setup") {
    return (
      <Layout wide>
        <PracticeSetup
          topic={topic}
          cardCount={session.cardCount}
          apiKeyReady={session.apiKeyReady}
          onApiKeyDone={session.onApiKeyDone}
          onStart={session.handleStart}
        />
      </Layout>
    );
  }

  if (session.phase === "playing") {
    return (
      <Layout wide>
        <PracticePlaying
          topic={topic}
          currentCard={session.currentCard!}
          currentIndex={session.currentIndex}
          deckLength={session.deckLength}
          round={session.round}
          onScore={session.handleScore}
        />
      </Layout>
    );
  }

  return (
    <Layout wide>
      <PracticeFinished
        topic={topic}
        stats={session.finishedStats}
        onRetryWrong={session.handleRetryWrong}
        onRestart={session.handleRestart}
      />
    </Layout>
  );
}
