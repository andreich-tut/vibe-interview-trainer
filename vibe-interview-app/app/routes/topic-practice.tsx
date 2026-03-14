import type { Route } from "./+types/topic-practice";
import { Layout } from "~/components/Layout";
import { useLanguage } from "~/contexts/useLanguage";
import { useTopicContent } from "~/hooks/shared/useTopicContent";
import { usePracticeSession } from "~/hooks/practice/usePracticeSession";
import { PracticeSetup } from "~/components/practice/PracticeSetup";
import { PracticePlaying } from "~/components/practice/PracticePlaying";
import { PracticeFinished } from "~/components/practice/PracticeFinished";

export function meta() {
  return [
    { title: `Практика` },
    { name: "description", content: "Практикуйтесь с карточками" },
  ];
}

export default function TopicPractice({ params }: Route.ComponentProps) {
  const { t } = useLanguage();
  const { topic, cards, loading, error } = useTopicContent(params.topicId);
  const session = usePracticeSession(params.topicId, cards);

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
