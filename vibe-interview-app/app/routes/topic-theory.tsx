import type { Route } from "./+types/topic-theory";
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
  // Order matters: comments → strings → keywords → numbers
  // Use placeholder markers to avoid double-replacing
  return escaped
    .replace(/(\/\/[^\n]*)/g, '\x01cm\x01$1\x01/cm\x01')
    .replace(/((?:&quot;|&#039;|`)(?:(?!\x01cm\x01)(?:(?!(?:&quot;|&#039;|`)).|\\.))*)(?:&quot;|&#039;|`)/g, '\x01str\x01$&\x01/str\x01')
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
    // Escape HTML entities so JSX/HTML in code renders as text
    const escaped = rawCode
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

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
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">{topic.icon}</div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-accent)] mb-2">
            {topic.title} — Теория
          </h1>
        </div>

        {/* Theory sections */}
        {theory.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="font-display text-lg font-bold text-[var(--color-accent2)]">
              {section.title}
            </h2>
            <div
              className="text-sm text-[var(--color-text)] leading-relaxed prose-dark"
              dangerouslySetInnerHTML={{ __html: processContent(section.content) }}
            />
          </div>
        ))}

        {/* CTA */}
        <div className="mt-12 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-center space-y-3">
          <p className="text-sm text-[var(--color-muted)]">Теория понята? Переходи к практике!</p>
          <a
            href={`/${topic.id}/practice`}
            className="inline-block py-2 px-6 bg-[var(--color-accent2)] text-white text-sm font-semibold rounded hover:bg-opacity-90 transition"
          >
            Начать практику →
          </a>
        </div>
      </div>
    </Layout>
  );
}
