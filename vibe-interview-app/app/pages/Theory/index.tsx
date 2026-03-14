import { useParams } from "react-router";
import { Layout } from "~/shared/layout/Layout";
import { TheoryCard } from "./ui/TheoryCard";
import { useLanguage } from "~/contexts/LanguageContext";
import { TheoryTocMobile, TheoryTocDesktop } from "./ui/TheoryToc";
import { TheoryPageHeader } from "./ui/TheoryPageHeader";
import { TheoryPracticeCta } from "./ui/TheoryPracticeCta";
import { useTheoryContent } from "./model/useTheoryContent";
import { useTocOutsideClick } from "./model/useTocOutsideClick";
import { useActiveSection } from "./model/useActiveSection";

export function meta() {
  return [
    { title: `Теория` },
    { name: "description", content: "Изучайте теорию" },
  ];
}

export default function TheoryPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const { t } = useLanguage();
  const { topic, theory, processedSections, loading, error } = useTheoryContent(topicId!);
  const { open: tocOpen, toggle: toggleToc, close: closeToc, ref: tocRef } = useTocOutsideClick();
  const activeSection = useActiveSection(theory.length);

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

  return (
    <Layout wide>
      <TheoryTocMobile
        sections={theory}
        activeSection={activeSection}
        open={tocOpen}
        onToggle={toggleToc}
        onClose={closeToc}
        tocRef={tocRef}
      />

      <div className="pb-20">
        <TheoryPageHeader topic={topic} />

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 lg:items-start">
          <TheoryTocDesktop sections={theory} activeSection={activeSection} />

          <div className="min-w-0 space-y-6">
            {processedSections.map((section, idx) => (
              <TheoryCard
                key={idx}
                id={`section-${idx}`}
                index={idx}
                title={section.title}
                content={section.content}
              />
            ))}
          </div>
        </div>
      </div>

      <TheoryPracticeCta topicId={topic.id} />
    </Layout>
  );
}
