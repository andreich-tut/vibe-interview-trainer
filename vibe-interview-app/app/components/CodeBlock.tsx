interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  // Simple syntax highlighting
  const highlighted = code
    .replace(/(['"`])([^'"`]*)\1/g, '<span class="str">$1$2$1</span>')
    .replace(
      /\b(console|Promise|setTimeout|function|async|await|return|const|let|new)\b/g,
      '<span class="kw">$1</span>'
    )
    .replace(/\b(log|then|resolve|reject|catch)\b(?=\()/g, '<span class="fn">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="num">$1</span>')
    .replace(/\/\/.*$/gm, '<span class="cm">$&</span>');

  return (
    <div className="bg-[#07070f] border border-border rounded-xl overflow-hidden">
      {/* Title bar */}
      <div className="bg-secondary px-4 py-2 border-b border-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-muted-foreground">script.js</span>
      </div>

      {/* Code */}
      <pre className="p-5 font-mono text-sm leading-relaxed overflow-x-auto">
        <code
          className="text-[#8888aa]"
          dangerouslySetInnerHTML={{
            __html: highlighted,
          }}
        />
      </pre>

      <style>{`
        .kw { color: #7c6aff; }
        .fn { color: #4fc3f7; }
        .num { color: #fb923c; }
        .str { color: #34d399; }
        .cm { color: #333355; font-style: italic; }
      `}</style>
    </div>
  );
}
