import { useLanguage } from "~/contexts/LanguageContext";
import { setLanguageCookie } from "~/lib/cookies";
import type { Language } from "~/lib/i18n";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

export function LanguageSwitcher() {
  const { lang } = useLanguage();

  const handleChange = (newLang: string) => {
    if (!newLang) return;
    setLanguageCookie(newLang as Language);
    window.location.reload();
  };

  return (
    <ToggleGroup
      type="single"
      value={lang}
      onValueChange={handleChange}
      className="bg-secondary rounded-full p-0.5"
    >
      <ToggleGroupItem
        value="ru"
        size="sm"
        className="rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=off]:text-muted-foreground"
      >
        RU
      </ToggleGroupItem>
      <ToggleGroupItem
        value="en"
        size="sm"
        className="rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=off]:text-muted-foreground"
      >
        EN
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
