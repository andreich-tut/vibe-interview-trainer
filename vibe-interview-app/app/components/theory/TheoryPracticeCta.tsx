import { Link } from "react-router";
import { useLanguage } from "~/contexts/LanguageContext";

interface TheoryPracticeCtaProps {
  topicId: string;
}

export function TheoryPracticeCta({ topicId }: TheoryPracticeCtaProps) {
  const { t } = useLanguage();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border py-3 px-5 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <span className="text-xs text-muted-foreground hidden sm:block">
          {t("theory.readyToPractice")}
        </span>
        <Link
          to={`/${topicId}/practice`}
          className="inline-block py-2 px-6 bg-(--color-accent2) text-white text-sm font-semibold rounded hover:bg-[#3ab0db] transition ml-auto"
        >
          {t("theory.startPractice")}
        </Link>
      </div>
    </div>
  );
}
