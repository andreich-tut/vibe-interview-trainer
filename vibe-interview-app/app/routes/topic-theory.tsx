import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/topic-theory";
import { Link } from "react-router";
import { Layout } from "~/components/Layout";
import { TheoryCard } from "~/components/TheoryCard";
import { loadContent, type TopicsFile, type TheoryFile } from "~/lib/contentLoader";
import { useLanguage } from "~/contexts/useLanguage";
import { TopicIcon } from "~/components/TopicIcon";
import { processContent } from "~/lib/codeHighlight";
import { TheoryTocMobile, TheoryTocDesktop } from "~/components/theory/TheoryToc";

export function meta() {
  return [
    { title: `Теория` },
    { name: "description", content: "Изучайте теорию" },
  ];
}

export default function TopicTheory({ params }: Route.ComponentProps) {
  const { lang, t } = useLanguage();
  const [topicsData, setTopicsData] = useState<TopicsFile | null>(null);
  const [theoryData, setTheoryData] = useState<TheoryFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      loadContent(lang, "topics"),
      loadContent(lang, "theory", params.topicId),
    ])
      .then(([topics, theory]) => {
        setTopicsData(topics);
        setTheoryData(theory);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load content:", err);
        setError(t("common.failedToLoad"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.topicId, lang]);

  // Close mobile TOC on outside click
  useEffect(() => {
    if (!tocOpen) return;
    const handler = (e: MouseEvent) => {
      if (tocRef.current && !tocRef.current.contains(e.target as Node)) {
        setTocOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [tocOpen]);

  // Observer for active section highlighting
  useEffect(() => {
    if (!theoryData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.id.replace("section-", ""));
            if (!Number.isNaN(idx)) setActiveSection(idx);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    theoryData.theory.forEach((_, idx) => {
      const el = document.getElementById(`section-${idx}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [theoryData]);

  const topic = topicsData?.topics.find((t) => t.id === params.topicId);
  const theory = theoryData?.theory || [];
  const processedSections = useMemo(
    () => (theoryData?.theory ?? []).map((section) => ({ ...section, content: processContent(section.content) })),
    [theoryData],
  );

  if (loading) {
    return (
      <Layout>
        <p className="text-center text-muted-foreground">
          {t("common.loading")}
        </p>
      </Layout>
    );
  }

  if (error || !topic || !theoryData) {
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
      {/* Mobile sticky nav bar */}
      <TheoryTocMobile
        sections={theory}
        activeSection={activeSection}
        open={tocOpen}
        onToggle={() => setTocOpen((o) => !o)}
        onClose={() => setTocOpen(false)}
        tocRef={tocRef}
      />

      <div className="pb-20">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <TopicIcon id={topic.id} className="w-7 h-7 text-(--color-accent2) shrink-0" />
          <h1 className="font-display text-xl font-bold text-primary leading-tight">
            {topic.title} {t("theory.pageTitleSuffix")}
          </h1>
        </div>

        {/* Two-column layout on desktop */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 lg:items-start">
          {/* Desktop sticky sidebar */}
          <TheoryTocDesktop
            sections={theory}
            activeSection={activeSection}
          />

          {/* Main content column */}
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

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border py-3 px-5 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {t("theory.readyToPractice")}
          </span>
          <Link
            to={`/${topic.id}/practice`}
            className="inline-block py-2 px-6 bg-(--color-accent2) text-white text-sm font-semibold rounded hover:bg-[#3ab0db] transition ml-auto"
          >
            {t("theory.startPractice")}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
