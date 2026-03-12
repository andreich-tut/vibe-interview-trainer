import { useLanguage } from "~/contexts/LanguageContext";
import { setLanguageCookie } from "~/lib/cookies";
import type { Language } from "~/lib/i18n";

interface SegmentProps {
  value: Language;
  current: Language;
  onSelect: (lang: Language) => void;
}

function LangSegment({ value, current, onSelect }: SegmentProps) {
  const isActive = value === current;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      onClick={() => onSelect(value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(value);
        }
      }}
      className={[
        "px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
        isActive
          ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
      ].join(" ")}
    >
      {value.toUpperCase()}
    </button>
  );
}

export function LanguageSwitcher() {
  const { lang } = useLanguage();

  const handleChange = (newLang: Language) => {
    setLanguageCookie(newLang);
    // Reload the page to apply language changes
    window.location.reload();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Select language"
      className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-full p-1"
    >
      <LangSegment value="ru" current={lang} onSelect={handleChange} />
      <LangSegment value="en" current={lang} onSelect={handleChange} />
    </div>
  );
}
