import { useMemo } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { Language } from '~/lib/i18n';
import { LanguageContext } from './languageContext';
import type { TranslationMap, LanguageContextValue } from './languageContext';

export type { TranslationDict, TranslationMap, LanguageContextValue } from './languageContext';

export interface LanguageProviderProps {
  lang: Language;
  translations?: TranslationMap;
  children: ReactNode;
}

function resolveDotNotation(dict: Record<string, unknown>, key: string): string {
  const segments = key.split('.');
  let current: unknown = dict;
  for (const segment of segments) {
    if (current === null || typeof current !== 'object') return key;
    current = (current as Record<string, unknown>)[segment];
    if (current === undefined) return key;
  }
  return typeof current === 'string' ? current : key;
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
        return resolveDotNotation(dict, key);
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
