/* eslint-disable no-control-regex -- \x01 and \x02 placeholders prevent double-replacement in regex chain */
export function highlightCode(escaped: string): string {
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

export function processContent(html: string): string {
  return html.replace(/<pre>([\s\S]*?)<\/pre>/g, (_match, rawCode: string) => {
    const escaped = rawCode
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const highlighted = highlightCode(escaped);

    return `<div class="theory-code"><div class="theory-code-header"><span class="theory-code-dot" style="background:#ef4444"></span><span class="theory-code-dot" style="background:#eab308"></span><span class="theory-code-dot" style="background:#22c55e"></span></div><pre><code>${highlighted}</code></pre></div>`;
  });
}
