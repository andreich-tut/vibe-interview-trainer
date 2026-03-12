export type Language = 'ru' | 'en';

export const SUPPORTED_LANGUAGES: Language[] = ['ru', 'en'];

export const DEFAULT_LANGUAGE: Language = 'ru';

export const LANG_COOKIE = 'lang';

export function isValidLanguage(lang: string): lang is Language {
  return (SUPPORTED_LANGUAGES as string[]).includes(lang);
}
