import type { Route } from "./+types/topic-theory";
import { Link } from "react-router";
import { Layout } from "~/components/Layout";
import { javascriptTheory } from "~/data/theory/javascript";
import { reactTheory } from "~/data/theory/react";
import { nextjsTheory } from "~/data/theory/nextjs";
import { nodejsTheory } from "~/data/theory/nodejs";
import { cssTheory } from "~/data/theory/css";
import { cicdTheory } from "~/data/theory/cicd";
import { testingTheory } from "~/data/theory/testing";
import { topics } from "~/data/topics";

interface TheorySection {
  title: string;
  content: string;
}

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

const theoryMap: Record<string, TheorySection[]> = {
  javascript: javascriptTheory,
  react: reactTheory,
  nextjs: nextjsTheory,
  nodejs: nodejsTheory,
  css: cssTheory,
  cicd: cicdTheory,
  testing: testingTheory,
};

export function meta({ params }: Route.MetaArgs) {
  const topic = topics.find((t) => t.id === params.topicId);
  return [
    { title: `${topic?.title || "Теория"} — Теория` },
    { name: "description", content: topic?.description },
  ];
}

export default function TopicTheory({ params }: Route.ComponentProps) {
  const topic = topics.find((t) => t.id === params.topicId);
  const theory = theoryMap[params.topicId] || [];

  if (!topic) {
    return (
      <Layout showBack>
        <p className="text-center text-[var(--color-red)]">Тема не найдена</p>
      </Layout>
    );
  }

  return (
    <Layout showBack backTo="/">
      <div className="space-y-8 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">{topic.icon}</div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-accent)] mb-2">
            {topic.title} — Теория
          </h1>
        </div>

        {/* Table of contents */}
        {theory.length > 2 && (
          <nav className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
            <div className="text-[0.625rem] font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">
              Содержание
            </div>
            <ol className="space-y-1.5 list-none p-0 m-0">
              {theory.map((section, idx) => (
                <li key={idx}>
                  <a
                    href={`#section-${idx}`}
                    className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent2)] transition-colors flex items-baseline gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span className="text-[var(--color-muted)] text-xs">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Theory sections */}
        {theory.map((section, idx) => (
          <div key={idx} id={`section-${idx}`} className="scroll-mt-6">
            {idx > 0 && (
              <div className="border-t border-[var(--color-border)] mb-8" />
            )}
            <h2 className="font-display text-xl font-bold text-[var(--color-accent2)] mb-4 flex items-baseline gap-3">
              <span className="text-sm text-[var(--color-muted)] font-mono">
                {String(idx + 1).padStart(2, "0")}
              </span>
              {section.title}
            </h2>
            <div
              className="text-sm text-[var(--color-text)] leading-relaxed prose-dark"
              dangerouslySetInnerHTML={{ __html: processContent(section.content) }}
            />
          </div>
        ))}
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg)]/95 backdrop-blur-sm border-t border-[var(--color-border)] py-3 px-5 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <span className="text-xs text-[var(--color-muted)] hidden sm:block">
            Готов к практике?
          </span>
          <Link
            to={`/${topic.id}/practice`}
            className="inline-block py-2 px-6 bg-[var(--color-accent2)] text-white text-sm font-semibold rounded hover:bg-[#3ab0db] transition ml-auto"
          >
            Начать практику →
          </Link>
        </div>
      </div>
    </Layout>
  );
}
