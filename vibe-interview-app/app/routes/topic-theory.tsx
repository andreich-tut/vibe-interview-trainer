import { useEffect, useState } from "react";
import type { Route } from "./+types/topic-theory";
import { Link } from "react-router";
import { Layout } from "~/components/Layout";
import { TheoryCard } from "~/components/TheoryCard";
import { loadContent, type TopicsFile, type TheoryFile } from "~/lib/contentLoader";
import { useLanguage } from "~/contexts/LanguageContext";

interface TheorySection {
  title: string;
  content: string;
}

/* eslint-disable no-control-regex -- \x01 placeholders prevent double-replacement in regex chain */
function highlightCode(escaped: string): string {
  return escaped
    .replace(/(\/\/[^\n]*)/g, '\x01cm\x01$1\x01/cm\x01')
    .replace(/((['"`])(?:(?!\2)[^\n\\]|\\.)*\2)/g, '\x01str\x01$1\x01/str\x01')
    .replace(
      /\b(const|let|var|function|async|await|return|new|import|export|from|default|class|extends|if|else|for|while|do|try|catch|finally|throw|typeof|instanceof|of|in|true|false|null|undefined|void|this|super|static|get|set|type|interface|enum)\b/g,
      '\x01kw\x01$1\x01/kw\x01'
    )
    .replace(/\b(console|Promise|setTimeout|setInterval|clearInterval|fetch|JSON|Object|Array|Map|Set|Math|Date|Error|React|useState|useEffect|useRef|useMemo|useCallback)\b/g,
      '\x01bi\x01$1\x01/bi\x01'
    )
    .replace(/(?<![a-zA-Z_$&;])\b(\d+)\b/g, '\x01num\x01$1\x01/num\x01')
    .replace(/\x01cm\x01([\s\S]*?)\x01\/cm\x01/g, '<span class="hl-cm">$1</span>')
    .replace(/\x01str\x01([\s\S]*?)\x01\/str\x01/g, '<span class="hl-str">$1</span>')
    .replace(/\x01kw\x01([\s\S]*?)\x01\/kw\x01/g, '<span class="hl-kw">$1</span>')
    .replace(/\x01bi\x01([\s\S]*?)\x01\/bi\x01/g, '<span class="hl-builtin">$1</span>')
    .replace(/\x01num\x01([\s\S]*?)\x01\/num\x01/g, '<span class="hl-num">$1</span>');
}
/* eslint-enable no-control-regex */

function processContent(html: string): string {
  return html.replace(/<pre>([\s\S]*?)<\/pre>/g, (_match, rawCode: string) => {
    // Only escape chars that break HTML structure; ' and " are safe in element content
    const escaped = rawCode
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const highlighted = highlightCode(escaped);

    return `<div class="theory-code"><div class="theory-code-header"><span class="theory-code-dot" style="background:#ef4444"></span><span class="theory-code-dot" style="background:#eab308"></span><span class="theory-code-dot" style="background:#22c55e"></span></div><pre><code>${highlighted}</code></pre></div>`;
  });
}

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Теория` },
    { name: "description", content: "Изучайте теорию" },
  ];
}

function TocLink({
  idx,
  title,
  active,
}: {
  idx: number;
  title: string;
  active: boolean;
}) {
  return (
    <li>
      <a
        href={`#section-${idx}`}
        className={`text-[0.8125rem] leading-snug transition-colors flex items-baseline gap-2.5 py-0.5 ${
          active
            ? "text-[var(--color-accent2)] font-semibold"
            : "text-primary hover:text-[var(--color-accent2)]"
        }`}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-muted-foreground text-xs">
          {String(idx + 1).padStart(2, "0")}
        </span>
        {title}
      </a>
    </li>
  );
}

export default function TopicTheory({ params }: Route.ComponentProps) {
  const { lang, t } = useLanguage();
  const [topicsData, setTopicsData] = useState<TopicsFile | null>(null);
  const [theoryData, setTheoryData] = useState<TheoryFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  // Load topics and theory
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

  if (loading) {
    return (
      <Layout showBack>
        <p className="text-center text-muted-foreground">{t("common.loading")}</p>
      </Layout>
    );
  }

  if (error || !topic || !theoryData) {
    return (
      <Layout showBack>
        <p className="text-center text-red-500">{error || t("common.failedToLoadContent")}</p>
      </Layout>
    );
  }

  const tocItems = theory.map((section, idx) => (
    <TocLink key={idx} idx={idx} title={section.title} active={activeSection === idx} />
  ));

  return (
    <Layout wide showBack backTo="/">
      <div className="pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">{topic.icon}</div>
          <h1 className="font-display text-2xl font-bold text-primary mb-2">
            {topic.title} {t("theory.pageTitleSuffix")}
          </h1>
        </div>

        {/* Two-column layout on desktop */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 lg:items-start">
          {/* Sticky sidebar TOC — desktop only */}
          {theory.length > 2 && (
            <aside className="hidden lg:block lg:sticky lg:top-8 lg:self-start">
              <nav className="bg-card border border-border rounded-xl p-6">
                <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                  {t("theory.sidebarTitle")}
                </div>
                <ol className="space-y-2 list-none p-0 m-0">
                  {tocItems}
                </ol>
              </nav>
            </aside>
          )}

          {/* Main content column */}
          <div className="min-w-0 space-y-6">
            {/* Mobile TOC — collapsible */}
            {theory.length > 2 && (
              <details className="lg:hidden bg-card border border-border rounded-xl">
                <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-primary">
                  {t("theory.sidebarTitle")} ({theory.length})
                </summary>
                <ol className="space-y-1.5 list-none p-0 m-0 px-5 pb-4">
                  {tocItems}
                </ol>
              </details>
            )}

            {/* Theory section cards */}
            {theory.map((section, idx) => (
              <TheoryCard
                key={idx}
                id={`section-${idx}`}
                index={idx}
                title={section.title}
                content={processContent(section.content)}
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
            className="inline-block py-2 px-6 bg-[var(--color-accent2)] text-white text-sm font-semibold rounded hover:bg-[#3ab0db] transition ml-auto"
          >
            {t("theory.startPractice")}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
