import { Link } from "react-router";
import { ApiKeyInput } from "~/components/ApiKeyInput";
import { useLanguage } from "~/contexts/useLanguage";
import type { TopicsFile } from "~/lib/contentLoader";

interface PracticeSetupProps {
  topic: TopicsFile["topics"][number];
  cardCount: number;
  apiKeyReady: boolean;
  onApiKeyDone: () => void;
  onStart: () => void;
}

export function PracticeSetup({ topic, cardCount, apiKeyReady, onApiKeyDone, onStart }: PracticeSetupProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        {t("layout.goBack")}
      </Link>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">{topic.icon}</div>
        <h1 className="font-display text-2xl font-bold text-primary">
          {topic.title} {t("practice.pageTitleSuffix")}
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          {cardCount} {t("practice.cardCounterLabel")}
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <ApiKeyInput onDone={onApiKeyDone} />
        </div>

        <button
          onClick={onStart}
          disabled={!apiKeyReady}
          className="w-full py-3 px-6 rounded-lg font-semibold transition text-sm disabled:opacity-40 disabled:cursor-default"
          style={{
            backgroundColor: apiKeyReady ? "var(--primary)" : "#1a1a30",
            color: apiKeyReady ? "white" : "var(--muted-foreground)",
          }}
        >
          {apiKeyReady ? t("practice.start") : t("practice.enterApiKey")}
        </button>
      </div>
    </div>
  );
}
