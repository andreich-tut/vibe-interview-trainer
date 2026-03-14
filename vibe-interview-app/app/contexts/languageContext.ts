import { createContext } from 'react';
import type { Language } from '~/lib/i18n';

export type TranslationDict = Record<string, unknown>;
export type TranslationMap = Record<string, Record<string, unknown>>;

export interface LanguageContextValue {
  lang: Language;
  t: (key: string, namespace?: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
