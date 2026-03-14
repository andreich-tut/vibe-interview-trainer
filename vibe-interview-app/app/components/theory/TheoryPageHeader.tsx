import { TopicIcon } from "~/components/TopicIcon";
import { useLanguage } from "~/contexts/useLanguage";
import type { TopicsFile } from "~/lib/contentLoader";

interface TheoryPageHeaderProps {
  topic: TopicsFile["topics"][number];
}

export function TheoryPageHeader({ topic }: TheoryPageHeaderProps) {
  const { t } = useLanguage();
  return (
    <div className="mb-6 flex items-center gap-3">
      <TopicIcon id={topic.id} className="w-7 h-7 text-(--color-accent2) shrink-0" />
      <h1 className="font-display text-xl font-bold text-primary leading-tight">
        {topic.title} {t("theory.pageTitleSuffix")}
      </h1>
    </div>
  );
}
