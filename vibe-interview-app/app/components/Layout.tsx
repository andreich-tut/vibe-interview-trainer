import type { ReactNode } from "react";
import { Link } from "react-router";
import { useTheme } from "~/hooks/useTheme";
import type { ThemeMode } from "~/hooks/useTheme";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "~/contexts/LanguageContext";

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MonitorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

function ThemeIcon({ theme }: { theme: ThemeMode }) {
  switch (theme) {
    case "light":
      return <SunIcon />;
    case "dark":
      return <MoonIcon />;
    case "system":
      return <MonitorIcon />;
  }
}

interface LayoutProps {
  children: ReactNode;
  showBack?: boolean;
  backTo?: string;
  wide?: boolean;
}

export function Layout({ children, showBack = false, backTo = "/", wide = false }: LayoutProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] p-7 flex items-center gap-5">
        <Link
          to="/"
          className="font-display text-base font-black text-[var(--color-accent)] tracking-tight"
        >
          interview<span className="text-[var(--color-accent2)]">trainer</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <LanguageSwitcher />
          <label className="flex items-center gap-1.5 text-[var(--color-muted)]">
            <ThemeIcon theme={theme} />
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeMode)}
              className="appearance-none bg-transparent border border-[var(--color-border)] rounded px-2 py-0.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] cursor-pointer transition focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="dark">{t("layout.themeDark")}</option>
              <option value="light">{t("layout.themeLight")}</option>
              <option value="system">{t("layout.themeSystem")}</option>
            </select>
          </label>
          {showBack && (
            <Link
              to={backTo}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
            >
              {t("layout.goBack")}
            </Link>
          )}
        </div>
      </header>

      {/* Main */}
      <main className={`${wide ? 'max-w-screen-2xl' : 'max-w-4xl'} mx-auto px-6 py-8 lg:px-10`}>{children}</main>
    </div>
  );
}
