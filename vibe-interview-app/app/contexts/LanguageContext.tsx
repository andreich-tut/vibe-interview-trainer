import { createContext, useContext, useMemo } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { Language } from '~/lib/i18n';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Flat dictionary of translation key → string value for a single namespace. */
export type TranslationDict = Record<string, string>;

/**
 * Multi-namespace translation map.
 * Keys are namespace names (e.g. "ui", "theory"); values are flat dicts.
 */
export type TranslationMap = Record<string, TranslationDict>;

export interface LanguageContextValue {
  /** Active language tag. */
  lang: Language;
  /**
   * Translate a key within an optional namespace.
   * Falls back to the key itself when no match is found.
   *
   * @param key       - Dot-notation key (e.g. "nav.home")
   * @param namespace - Namespace name (default: "ui")
   */
  t: (key: string, namespace?: string) => string;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface LanguageProviderProps {
  /** The active language for this render. */
  lang: Language;
  /**
   * Pre-loaded translation dictionaries keyed by namespace.
   * The "ui" namespace is expected at minimum.
   */
  translations?: TranslationMap;
  children: ReactNode;
}

export function LanguageProvider({
  lang,
  translations = {},
  children,
}: LanguageProviderProps): ReactElement {
  const t = useMemo<LanguageContextValue['t']>(
    () =>
      (key: string, namespace = 'ui'): string => {
        const dict = translations[namespace];
        if (!dict) return key;
        return dict[key] ?? key;
      },
    [translations],
  );

  const value = useMemo<LanguageContextValue>(() => ({ lang, t }), [lang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns the current language context.
 * Must be called inside a `<LanguageProvider>` tree.
 */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (ctx === null) {
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return ctx;
}

export { LanguageContext };
