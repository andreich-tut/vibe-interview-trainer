import { useContext } from 'react';
import { LanguageContext } from './languageContext';
import type { LanguageContextValue } from './languageContext';

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (ctx === null) {
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return ctx;
}
