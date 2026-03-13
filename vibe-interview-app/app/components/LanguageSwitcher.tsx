import { useLanguage } from "~/contexts/LanguageContext";
import { setLanguageCookie } from "~/lib/cookies";
import type { Language } from "~/lib/i18n";

export function LanguageSwitcher() {
  const { lang } = useLanguage();

  const handleChange = (newLang: Language) => {
    if (newLang === lang) return;
    setLanguageCookie(newLang);
    window.location.reload();
  };

  return (
    <div className="flex items-center bg-secondary rounded-full p-0.5">
      {(["ru", "en"] as Language[]).map((l) => (
        <button
          key={l}
          onClick={() => handleChange(l)}
          className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
            lang === l
              ? "bg-card text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
