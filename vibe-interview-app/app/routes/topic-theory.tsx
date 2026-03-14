
import type { Route } from "./+types/topic-theory";
import { Layout } from "~/components/layout/Layout";
import { TheoryCard } from "~/components/theory/TheoryCard";
import { useLanguage } from "~/contexts/LanguageContext";
import { TheoryTocMobile, TheoryTocDesktop } from "~/components/theory/TheoryToc";
import { TheoryPageHeader } from "~/components/theory/TheoryPageHeader";
import { TheoryPracticeCta } from "~/components/theory/TheoryPracticeCta";
import { useTheoryContent } from "~/hooks/theory/useTheoryContent";
import { useTocOutsideClick } from "~/hooks/theory/useTocOutsideClick";
import { useActiveSection } from "~/hooks/theory/useActiveSection";

export function meta() {
  return [
    { title: `Теория` },
    { name: "description", content: "Изучайте теорию" },
  ];
}

export default function TopicTheory({ params }: Route.ComponentProps) {
  const { t } = useLanguage();
  const { topic, theory, processedSections, loading, error } = useTheoryContent(params.topicId);
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
