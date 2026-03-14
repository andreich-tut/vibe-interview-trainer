import { useMemo } from "react";

interface CodeBlockProps {
  code: string;
  language?: 'js' | 'css';
}

function highlightCSS(code: string): string {
  // 1. Comments /* ... */ (multiline)
  let result = code.replace(
    /\/\*[\s\S]*?\*\//g,
    (match) => `<span class="cm">${match}</span>`
  );

  // 2. Strings in quotes
  result = result.replace(
    /(['"`])([^'"`]*)\1/g,
    '<span class="str">$1$2$1</span>'
  );

  // 3. At-rules (@media, @keyframes, @import, etc.)
  result = result.replace(
    /(@\w+)/g,
    '<span class="kw">$1</span>'
  );

  // 4. !important
  result = result.replace(
    /(!important)/g,
    '<span class="kw">$1</span>'
  );

  // 5. CSS property names before ':'
  result = result.replace(
    /(\s+)(color|font-size|font-weight|font-family|font-style|font-variant|line-height|letter-spacing|text-align|text-decoration|text-transform|text-indent|text-shadow|white-space|word-break|word-spacing|margin|margin-top|margin-right|margin-bottom|margin-left|padding|padding-top|padding-right|padding-bottom|padding-left|border|border-top|border-right|border-bottom|border-left|border-radius|border-color|border-width|border-style|background|background-color|background-image|background-size|background-position|background-repeat|display|position|top|right|bottom|left|width|height|max-width|min-width|max-height|min-height|flex|flex-direction|flex-wrap|flex-grow|flex-shrink|flex-basis|align-items|align-self|align-content|justify-content|justify-self|justify-items|gap|row-gap|column-gap|grid|grid-template|grid-template-columns|grid-template-rows|grid-column|grid-row|grid-area|overflow|overflow-x|overflow-y|opacity|visibility|z-index|cursor|pointer-events|transform|transition|animation|box-shadow|box-sizing|content|list-style|list-style-type|outline|resize|vertical-align|object-fit|object-position|float|clear|clip-path|filter|backdrop-filter|will-change|appearance)(\s*:)/g,
    '$1<span class="prop">$2</span>$3'
  );

  // 6. Numbers with optional units
  result = result.replace(
    /\b(\d+\.?\d*)(px|rem|em|%|vh|vw|deg|s|ms)\b/g,
    '<span class="num">$1$2</span>'
  );
  result = result.replace(/\b(\d+)\b/g, '<span class="num">$1</span>');

  // 7. Selectors: text before '{' on lines that don't start with whitespace
  result = result.replace(
    /^([^{}\n][^{}\n]*?)(\s*\{)/gm,
    (match, selector, brace) => {
      if (selector.includes('<span')) return match;
      return `<span class="sel">${selector}</span>${brace}`;
    }
  );

  return result;
}

function highlightJS(code: string): string {
  return code
    .replace(/(['"`])([^'"`]*)\1/g, '<span class="str">$1$2$1</span>')
    .replace(
      /\b(console|Promise|setTimeout|function|async|await|return|const|let|new)\b/g,
      '<span class="kw">$1</span>'
    )
    .replace(/\b(log|then|resolve|reject|catch)\b(?=\()/g, '<span class="fn">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="num">$1</span>')
    .replace(/\/\/.*$/gm, '<span class="cm">$&</span>');
}

const HIGHLIGHT_STYLES = `
  .kw { color: #7c6aff; }
  .fn { color: #4fc3f7; }
  .num { color: #fb923c; }
  .str { color: #34d399; }
  .cm { color: #333355; font-style: italic; }
  .sel { color: #f472b6; }
  .prop { color: #4fc3f7; }
`;

export function CodeBlock({ code, language = 'js' }: CodeBlockProps) {
  const highlighted = useMemo(
    () => language === 'css' ? highlightCSS(code) : highlightJS(code),
    [code, language],
  );
  const filename = language === 'css' ? 'style.css' : 'script.js';

  return (
    <div className="bg-[#07070f] border border-border rounded-xl overflow-hidden">
      {/* Title bar */}
      <div className="bg-secondary px-4 py-2 border-b border-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-muted-foreground">{filename}</span>
      </div>

      {/* Code */}
      <pre className="p-5 font-mono text-sm leading-relaxed overflow-x-auto">
        <code
          className="text-[#8888aa]"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>

      <style>{HIGHLIGHT_STYLES}</style>
    </div>
  );
}
