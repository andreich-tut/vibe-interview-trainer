import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/topic-theory";
import { Link } from "react-router";
import { Layout } from "~/components/Layout";
import { TheoryCard } from "~/components/TheoryCard";
import { loadContent, type TopicsFile, type TheoryFile } from "~/lib/contentLoader";
import { useLanguage } from "~/contexts/useLanguage";
import { TopicIcon } from "~/components/TopicIcon";

/* eslint-disable no-control-regex -- \x01 and \x02 placeholders prevent double-replacement in regex chain */
function highlightCode(escaped: string): string {
  return escaped
    // CSS block comments /* ... */
    .replace(/(\/\*[\s\S]*?\*\/)/g, '\x01cm\x01$1\x01/cm\x01')
    // JS single-line comments
    .replace(/(\/\/[^\n]*)/g, '\x01cm\x01$1\x01/cm\x01')
    // Strings
    .replace(/((['"`])(?:(?!\2)[^\n\\]|\\.)*\2)/g, '\x01str\x01$1\x01/str\x01')
    // CSS at-rules
    .replace(/(@(?:media|keyframes|container|import|layer|supports|font-face)\b)/g, '\x02at\x02$1\x02/at\x02')
    // CSS hex colors
    .replace(/#([0-9a-fA-F]{3,8})(?=[^a-zA-Z]|$)/g, '\x02hex\x02#$1\x02/hex\x02')
    // CSS pseudo-classes/elements
    .replace(/(::?(?:root|hover|focus|active|first-child|last-child|nth-child|not|before|after|placeholder))/g, '\x02sel\x02$1\x02/sel\x02')
    // CSS property names (word before colon, but not :: pseudo-elements)
    .replace(/\b(animation|appearance|backdrop-filter|background(?:-color|-image)?|border(?:-radius|-style|-color|-width|-top|-bottom|-left|-right)?|bottom|box-shadow|box-sizing|clip-path|color|column-gap|container-type|content|cursor|display|filter|flex(?:-direction|-wrap|-shrink|-grow|-basis)?|font(?:-size|-family|-weight|-style)?|gap|grid(?:-template-columns|-template-rows|-template-areas|-area|-column|-row)?|height|justify-content|left|letter-spacing|line-height|margin(?:-top|-bottom|-left|-right)?|max-height|max-width|min-height|min-width|object-fit|opacity|order|outline|overflow|padding(?:-top|-bottom|-left|-right)?|pointer-events|position|resize|right|row-gap|scroll-behavior|text-align|text-decoration|text-transform|top|transform|transition|user-select|vertical-align|visibility|white-space|width|word-break|z-index|align-items|align-self|flex|grid)(?=\s*:(?!:))/g,
      '\x02prop\x02$1\x02/prop\x02')
    // CSS values (after colon — captured as "colon + spaces + value")
    .replace(/:\s*(flex|grid|block|inline-block|inline|none|auto|center|space-between|space-around|space-evenly|flex-start|flex-end|stretch|wrap|nowrap|row-reverse|column-reverse|row|column|relative|absolute|fixed|sticky|static|solid|dashed|dotted|bold|normal|italic|underline|hidden|visible|scroll|both|forwards|backwards|ease-in-out|ease-in|ease-out|ease|linear|infinite|alternate|border-box|content-box|inline-size|pointer|uppercase|lowercase|capitalize|transparent|inherit|initial|unset|revert)\b/g,
      (m, val) => m.replace(val, `\x02val\x02${val}\x02/val\x02`))
    // CSS numbers with units
    .replace(/\b(\d+(?:\.\d+)?)(px|em|rem|vh|vw|%|fr|deg|ms(?!\w)|s(?!\w))/g, '\x02unit\x02$1$2\x02/unit\x02')
    // JS keywords
    .replace(/\b(const|let|var|function|async|await|return|new|import|export|from|default|class|extends|if|else|for|while|do|try|catch|finally|throw|typeof|instanceof|of|in|true|false|null|undefined|void|this|super|static|get|set|type|interface|enum)\b/g,
      '\x01kw\x01$1\x01/kw\x01')
    // JS builtins
    .replace(/\b(console|Promise|setTimeout|setInterval|clearInterval|fetch|JSON|Object|Array|Map|Set|Math|Date|Error|React|useState|useEffect|useRef|useMemo|useCallback)\b/g,
      '\x01bi\x01$1\x01/bi\x01')
    // Plain numbers
    .replace(/(?<![a-zA-Z_$&;#])\b(\d+)\b/g, '\x01num\x01$1\x01/num\x01')
    // Flush \x01
    .replace(/\x01cm\x01([\s\S]*?)\x01\/cm\x01/g, '<span class="hl-cm">$1</span>')
    .replace(/\x01str\x01([\s\S]*?)\x01\/str\x01/g, '<span class="hl-str">$1</span>')
    .replace(/\x01kw\x01([\s\S]*?)\x01\/kw\x01/g, '<span class="hl-kw">$1</span>')
    .replace(/\x01bi\x01([\s\S]*?)\x01\/bi\x01/g, '<span class="hl-builtin">$1</span>')
    .replace(/\x01num\x01([\s\S]*?)\x01\/num\x01/g, '<span class="hl-num">$1</span>')
    // Flush \x02
    .replace(/\x02at\x02([\s\S]*?)\x02\/at\x02/g, '<span class="hl-kw">$1</span>')
    .replace(/\x02hex\x02([\s\S]*?)\x02\/hex\x02/g, '<span class="hl-str">$1</span>')
    .replace(/\x02sel\x02([\s\S]*?)\x02\/sel\x02/g, '<span class="hl-builtin">$1</span>')
    .replace(/\x02prop\x02([\s\S]*?)\x02\/prop\x02/g, '<span class="hl-builtin">$1</span>')
    .replace(/\x02val\x02([\s\S]*?)\x02\/val\x02/g, '<span class="hl-kw">$1</span>')
    .replace(/\x02unit\x02([\s\S]*?)\x02\/unit\x02/g, '<span class="hl-num">$1</span>');
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
  const [tocOpen, setTocOpen] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

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
      {/* Mobile sticky nav bar — back link + TOC dropdown */}
      <div ref={tocRef} className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border -mx-6 px-6 mb-6">
        <div className="flex items-center justify-between py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("layout.goBack")}
          </Link>
          {theory.length > 2 && (
            <button
              onClick={() => setTocOpen((o) => !o)}
              className="text-xs font-semibold text-primary cursor-pointer"
            >
              {t("theory.sidebarTitle")} {tocOpen ? "↑" : "↓"}
            </button>
          )}
        </div>
        {tocOpen && theory.length > 2 && (
          <ol className="space-y-1.5 list-none p-0 m-0 pb-3" onClick={() => setTocOpen(false)}>
            {tocItems}
          </ol>
        )}
      </div>

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
          {/* Sticky sidebar TOC — desktop only */}
          {theory.length > 2 && (
            <aside className="hidden lg:flex lg:flex-col lg:gap-3 lg:sticky lg:top-8 lg:self-start">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("layout.goBack")}
              </Link>
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
